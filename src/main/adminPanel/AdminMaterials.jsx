import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useToast } from '../../context/ToastContext';

import AdminHeaderActions from '../../auxillary/AdminHeaderActions';
import AdminFooter from '../../auxillary/AdminFooter';

import CreateAssessmentModal from '../../auxillary/assessment/AddAssessmentModal';
import AddMaterialsModal from '../../auxillary/materials/AddMaterialsModal';

import EditMaterialsModal from '../../auxillary/materials/EditMaterialsModal';

import { getDepartments } from '../../services/departmentService';

import { 
  getMaterials, uploadMaterials, updateMaterial, updateMaterialStatus, getMaterialsByDept 
} from '../../services/materialService';

import { createExam } from "../../services/examService";

import { getModules } from '../../services/moduleService';

import '../../auxillary/AdminLayout.css';
import './AdminMaterials.css';
import './AdminModules.css';

const STATUS_LABELS = {
  published: "Published",
  unpublished: "Unpublished"
};

const GENERAL_FOLDER = 'General';

function todayLabel() {
  return new Date().toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

function ThumbIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="32"
      height="32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path d="M6 2h8l5 5v15H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" />
      <path d="M14 2v6h5M8 13h8M8 17h8" />
    </svg>
  );
}

/* ---------- Main page ---------- */

export default function AdminMaterials() {

  const { showToast } = useToast();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const roleName = (
    user?.roleName ??
    user?.role_name ??
    user?.role ??
    ""
  ).trim();

  const departmentName = (
    user?.departmentName ??
    user?.department_name ??
    ""
  ).trim();

  const normalizeRole = roleName.toLowerCase();

  const isSuperAdmin = normalizeRole === "super admin";
  const isAdmin = normalizeRole === "admin";
  const isLocalAccount = normalizeRole === "local account";
  const [departments, setDepartments] = useState([])

  const [modules, setModules] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [materialsIsLoading, setMaterialsIsLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [newMenuOpen, setNewMenuOpen] = useState(false);

  const [addMaterialOpen, setAddMaterialOpen] = useState(false);
  const [assessmentOpen, setAssessmentOpen] = useState(false);

  const [editMaterialOpen, setEditMaterialOpen] = useState(false);
  const [editAssessmentOpen, setEditAssessmentOpen] = useState(false);

  const [selectedMaterial, setSelectedMaterial] = useState(null);


  // get departments
  useEffect(() => {
    if (!isSuperAdmin) return;
  const fetchDepartments = async() => {
    try {
      const data = await getDepartments(token);

      setDepartments(data.data || []);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
      showToast("Failed to load departments");
      }
    };
    if (token) {
      fetchDepartments();
    }
  }, [token, isSuperAdmin]);

// get modules
  useEffect(() => {
      if (!token) return;

      let cancelled = false;
      const fetchModules = async () => {
          try {
              const response = await getModules(token);

              console.log("1. Modules API response:", response);

              const rows = Array.isArray(response)
                  ? response
                  : Array.isArray(response.data)
                      ? response.data
                      : [];

              console.log("2. Modules received by frontend:", rows);
              console.log("3. First module ID:", rows[0]?.learn_mod_id);

              if (!cancelled) {
                  setModules(
                      rows.filter((module) => module.is_active === true)
                  );
              }
          } catch (error) {
              console.error("Failed to fetch learning modules:", error);

              if (!cancelled) {
                  showToast("Failed to load learning modules");
              }
          }
      };
      fetchModules();

      return () => {
          cancelled = true;
      };
  }, [token]);

  // get Materials 
  useEffect(() => {
    let cancelled = false;

    const fetchMaterials = async () => {
      setMaterialsIsLoading(true);

      try {
        let response;

        if (user?.roleName === "Super admin") {
          response = await getMaterials(token);

        } else if (user?.roleName === "Admin") {
          response =await getMaterialsByDept(token);

        } else {
          setMaterials([]);
          return;
        }
        console.log("Learning materials API response", response);

        const rows = Array.isArray(response.data)
            ? response.data
            : [];
        
        if (!cancelled) {
          setMaterials(rows.map(normalizeMaterial));
        }
          console.log("ADMIN USER:", user);
          console.log("ADMIN DEPARTMENT:", departmentName);
          console.log("ADMIN MODULES:", modules);
          console.log("FIRST MATERIAL:", rows[0]);
      } catch (error) {
        console.error("Failed to fetch learning materials", error);

        if (!cancelled) {
          showToast("Failed to load learning materials");
        }
      } finally {
        if (!cancelled) {
          setMaterialsIsLoading(false);
        }
      }
    };
    if (token && user) {
      fetchMaterials();
    }
    return () => {
      cancelled = true;
    };
  }, [token, user]);

  // check avail modules
  const availableModules = useMemo(() => {
      if (isSuperAdmin || isAdmin) {
          return modules;
      }
/* 
      if (isAdmin) {
          return modules.filter(
              (module) => module.department_id === departmentName
          );
      }
 */
      return [];
  }, [modules, isSuperAdmin, isAdmin]);

  const today = new Date().toLocaleDateString(undefined, { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();

    return materials.filter((material) => {
     
      if (
        filter !== "all" && material.status !== filter
      ) {
        return false;
      }

      if (!query) return true;

      return [
        material.title, material.description, material.category,
      ].some((value) =>
        String(value ?? '').toLowerCase().includes(query)
      );
    });
  }, [materials, filter, search]
  );

  function normalizeMaterial(material) {
    return {
      ...material,
      id: material.learn_mat_id,
      category: material.module_title,
      status: material.is_active ? "published" : "unpublished",
      date: material.created_at
        ? new Date(material.created_at).toLocaleDateString()
        : ""
    };
  }

  const fetchMaterialsData = async () => {
    let response;

    if (isSuperAdmin) {
      response = await getMaterials(token);
    } else if (isAdmin) {
      response = await getMaterialsByDept(token);
    } else {
      return [];
    }
    const rows = Array.isArray(response.data) ? response.data : [];

    return rows.map(normalizeMaterial);
  };
  
  const handleUpdateMaterial = async (learnMatId, FormData) => {
    try {
      const response = await updateMaterial(token, learnMatId, FormData);

      showToast(
        response.message || "Material updated successfully", "success"
      );
      const refreshed = await fetchMaterialsData(token);

      setMaterials(refreshed);
      setEditMaterialOpen(false);
      setSelectedMaterial(null);
    } catch (error) {
      showToast(error.message || "Failed to update material", "error");
      throw error;
    }
  };
  
  const handleToggleMatStat = async (material) => {
      try {
        const newStat = !material.is_active;

        const response = await updateMaterialStatus(
          token, newStat, material.learn_mat_id
        );
          
          showToast(
              response.message || 
              (newStat
                ? "Material reactivated successfully"
                : "Material deacticated successfully"
              ), "success"
          );

          const refreshed = await fetchMaterialsData();
          
          setMaterials(refreshed);

      } catch (error) {
        console.error ("Failed to update material status", error);
          showToast(error.message || "Failed to deactivate material", "error");
      }
  };


  const handleEditMaterial = (material) => {
      setSelectedMaterial(material);
      setEditMaterialOpen(true);
  };

  const handleUpload = async ({ 
    files, linkedModule, status, note, title, materialType, displayOrder, minDurationMinutes, maxDurationMinutes 
  }) => {
    try {
      if (status !== "published") {
        showToast("Scheduled uploads and drafts not yet supported");
        return;
      }
    // const title = files.length === 1 ? files[0].name.replace(/\.[^.]+$/, "") : "Learning Materials";
    await uploadMaterials(token, {
      files, linkedModule, note, title, materialType, displayOrder, minDurationMinutes, maxDurationMinutes
    });
    const response = await getMaterials(token);

    const rows = Array.isArray(response.data) ? response.data : [];

    setMaterials(rows.map(normalizeMaterial));

    setAddMaterialOpen(false);

    showToast("Learni materials upload success");

    } catch (error) {
      console.error("material upload failed", error);
    showToast(error.message || "Failed to upload learn materials");
    };
  };

  // Save assessment
  const handleAddMaterial = async (assessmentData) => {
    try {
      const response = await createExam(token, assessmentData);
      showToast(
        response.message || "Assessment created successfully",
        "success"
      );
      setAssessmentOpen(false);

    } catch (error) {
      showToast(
        error.message || "Failed to create assessment",
        "error"
      );
      throw error;
    }
  };


  return (
    <div className="admin-shell">
      <div className="admin-main">
        <header className="announce-banner">
          <div>
            <h1>Department Materials</h1>
            <p>Manage Learning materials.
            </p>
          </div>
          <div className="admin-header-actions">
            <AdminHeaderActions />
          </div>
        </header>

        <div className="announce-body">
          <div className="admin-sidebar-page">
            <div className="admin-modules-heading">
              <div>
                <span className="date-btn-like">{today}</span>
              </div>

              <div className="add-menu-dropdown">
                <button type="button" 
                  className="date-btn-like" 
                  onClick={() => setNewMenuOpen((v) => !v)}>
                  + New Materials
                  <svg viewBox="0 0 16 18" 
                    width="20" height="16" fill="none" 
                    stroke="currentColor" strokeWidth="3">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {newMenuOpen && (
                  <div className="add-new-menu">

                    <button type="button" 
                      onClick={() => { 
                        setNewMenuOpen(false); 
                        setAddMaterialOpen(true); 
                      }}
                    >
                      <svg
                          viewBox="0 0 24 24"
                          width="18"
                          height="18"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                      >
                          <path d="M12 6.5C9.8 4.9 6.5 4.5 3.5 5v13c3-.5 6.3-.1 8.5 1.5" />
                          <path d="M12 6.5c2.2-1.6 5.5-2 8.5-1.5v13c-3-.5-6.3-.1-8.5 1.5" />
                          <path d="M12 6.5v13" />
                          <path d="M6.5 8.5c1.4-.1 2.8.2 4 .7" />
                          <path d="M6.5 11.5c1.4-.1 2.8.2 4 .7" />
                          <path d="M17.5 8.5c-1.4-.1-2.8.2-4 .7" />
                          <path d="M17.5 11.5c-1.4-.1-2.8.2-4 .7" />
                      </svg>
                      Create Learning Material
                    </button>

                    <button type="button" onClick={() => { 
                      setNewMenuOpen(false); 
                      setAssessmentOpen(true); 
                      }}
                    >
                      <svg viewBox="0 0 24 24" 
                        width="16" height="16" 
                        fill="none" stroke="currentColor" 
                        strokeWidth="1.8">
                          <path d="M9 11l3 3L22 4" />
                          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                      </svg>
                      Create Assessment
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="announce-controls">
              <div className="announce-search">
                <svg viewBox="0 0 24 24" 
                  width="15" height="15" 
                  fill="none" stroke="currentColor" 
                  strokeWidth="2">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Search department, roles etc"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="materials-grid">
              {visible.map((material) => (
                <article className={`materials-card ${
                  !material.is_active ? "materials-card-inactive" : ""
                }`} key={material.learn_mat_id}>
                  <div className="announce-card-head">
                    <span className="announce-category-pill">{material.category}</span>
                    <span className={`announce-status-pill status-${material.status}`}>
                      {STATUS_LABELS[material.status]}
                    </span>
                  </div>

                  <div className="materials-thumb"><ThumbIcon /></div>

                  <h3>{material.title}</h3>
                  <p>{material.description}</p>

                  <div className="announce-card-foot">
                    <span>{material.date}</span>
                    <div className="announce-card-actions">
                      <button type="button" aria-label="Edit" 
                      onClick={() => handleEditMaterial(material)}>
                      <svg viewBox="0 0 24 24" 
                        width="15" height="15" 
                        fill="none" stroke="currentColor" 
                        strokeWidth="1.8">
                          <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
                      </svg>
                      </button>
                      <button type="button" 
                      className={
                        material.is_active ? "status-toggle active" : "status-toggle inactive"
                      }
                      aria-label={
                        material.is_active ? "Deactivate" : "Activate"
                      } 
                      title={
                        material.is_active ? "Deactivate material" : "Activate material"
                      }
                      onClick={() => handleToggleMatStat(material)}
                      >
                              <svg
                                viewBox="0 0 24 24"
                                width="15"
                                height="15"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M12 2v10" />
                                <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                              </svg>_        
                        {material.is_active ? " Deactivate" : "Reactivate"}

                      </button>
                    </div>
                  </div>
                </article>
              ))}
              {visible.length === 0 && (
                <p className="announce-empty">No materials match your filters.</p>
              )}
            </div>
          </div>
        </div>
        <AdminFooter />

      </div>

      {addMaterialOpen && (
        <AddMaterialsModal 
          onClose={() => setAddMaterialOpen(false)} 
          onUpload={handleUpload} 
          modules={availableModules} 
        />
      )}

      {assessmentOpen && (
        <CreateAssessmentModal 
        onClose={() => setAssessmentOpen(false)} 
        onSave={handleAddMaterial} 
        modules={availableModules} />
      )}

      {editMaterialOpen && selectedMaterial && (
          <EditMaterialsModal
              initial={selectedMaterial}
              modules={availableModules}
              onClose={() => {
                setEditMaterialOpen(false);
                setSelectedMaterial(null);
              }}
              onSave={handleUpdateMaterial}
          />
      )}

    </div>
  );
}