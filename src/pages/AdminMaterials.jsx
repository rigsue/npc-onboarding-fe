import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';

import AdminHeaderActions from '../components/AdminHeaderActions';
import AdminFooter from '../components/AdminFooter';

// import AdminSidebar from '../components/AdminSidebar';
import AddMaterialsModal from '../components/materials/addMaterials';

import CreateAssessment from '../components/materials/addAssessment';

import { useToast } from '../context/ToastContext';

import { getDepartments } from '../services/departmentService';
import { getModules } from '../services/moduleService';
import { getMaterials, uploadMaterials } from '../services/materialService';

import '../components/AdminLayout.css';
import './AdminMaterials.css';

const GENERAL_FOLDER = 'General';

const STATUS_LABELS = {
  published: 'Published', scheduled: 'Scheduled', draft: 'Draft',
};

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


function normalizeMaterial(material) {
    return {
        ...material,

        id: material.learn_mat_id,

        category: material.module_title,

        status: material.is_active
            ? "published"
            : "draft",

        date: material.created_at
            ? new Date(material.created_at).toLocaleDateString()
            : ""
    };
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
  const [addMaterials, setAddMaterials] = useState(false);
  const [assessmentOpen, setAssessmentOpen] = useState(false);

  useEffect(() => {
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
  }, [token]);


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
  

  const activeDepartments = useMemo(() => {
    return departments.filter(
      (department) => department.is_active === true
    );
  }, [departments]);

  
useEffect(() => 
  {
    if (!token) {
        setMaterials([]);
        return;
    }

    let cancelled = false;

    const fetchMaterials = async () => {
        setMaterialsIsLoading(true);

        try {
            const response = await getMaterials(token);

            console.log(
                "Learning materials API response:",
                response
            );

            const rows = Array.isArray(response.data)
                ? response.data
                : [];

            if (!cancelled) {
                setMaterials(rows.map(normalizeMaterial));
            }

        } catch (error) {
            console.error(
                "Failed to fetch learning materials:",
                error
            );

            if (!cancelled) {
                showToast("Failed to load learning materials");
            }

        } finally {
            if (!cancelled) {
                setMaterialsIsLoading(false);
            }
        }
    };

    fetchMaterials();

    return () => {
        cancelled = true;
    };
}, [token]);

  const folderOptions = useMemo(() => {
    const departmentNames = activeDepartments.map(
      (department) => department.department_name
    ).filter(Boolean);

    if (isSuperAdmin) {
      return [
        GENERAL_FOLDER, ...departmentNames.filter(
          (name) => name !== GENERAL_FOLDER
        )];
    }

    if (isAdmin) {
    return [
      GENERAL_FOLDER,
      ...(departmentName &&
      departmentNames.includes(departmentName)
      ? [departmentName] : [])
    ];
  }
  }, [
    activeDepartments,
    isSuperAdmin,
    isAdmin,
    departmentName,
  ]);


  const availableModules = useMemo(() => {
      if (isSuperAdmin) {
          return modules;
      }

      if (isAdmin) {
          return modules.filter(
              (module) => module.department_name === departmentName
          );
      }

      return [];
  }, [modules, isSuperAdmin, isAdmin, departmentName]);

  const handleDelete = (id) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
    showToast('Material deleted');
  };

  const addMaterial = (entry) => {
    setMaterials((prev) => {
      const nextId = Math.max(
        0,
        ...prev.map((material) => material.id)
      ) + 1;
      return [{
          id: nextId, date: todayLabel(), ...entry,
        }, ...prev,];
    });
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

    setAddMaterials(false);

    showToast("Learni materials upload success");

    } catch (error) {
      console.error("material upload failed", error);
    showToast(error.message || "Failed to upload learn materials");
    };
  };

const handleSaveAssessment = ({
  title, linkedModule, passingScore, questions,
}) => {
  addMaterial({
    category: linkedModule,
    status: 'published',
    title,
    description: `Assessment — ${questions.length} questions`,
  });
};

  const today = new Date().toLocaleDateString(undefined, { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  
const counts = useMemo(() => {
  const accessibleMaterials = materials.filter((material) => {
    if (isSuperAdmin) return true;

    return (
      material.category === GENERAL_FOLDER ||
      material.category === departmentName
    );
  });

  return {
    all: accessibleMaterials.length,
    published: accessibleMaterials.filter(
      (m) => m.status === 'published'
    ).length,
    scheduled: accessibleMaterials.filter(
      (m) => m.status === 'scheduled'
    ).length,
    draft: accessibleMaterials.filter(
      (m) => m.status === 'draft'
    ).length,
  };
}, [materials, isSuperAdmin, departmentName]);

const visible = useMemo(() => {
  const query = search.trim().toLowerCase();

  return materials.filter((material) => {
    // Restrict the visible categories for non-Super Admins.
    if (
      !isSuperAdmin &&
      material.category !== GENERAL_FOLDER &&
      material.category !== departmentName
    ) {
      return false;
    }

    if (
      filter !== 'all' &&
      material.status !== filter
    ) {
      return false;
    }

    if (!query) return true;

    return [
      material.title,
      material.description,
      material.category,
    ].some((value) =>
      String(value ?? '').toLowerCase().includes(query)
    );
  });
}, [
  materials,
  filter,
  search,
  isSuperAdmin,
  departmentName,
]);

  return (
    <div className="admin-shell">
      {/* <AdminSidebar active="materials" /> */}

      <div className="admin-main">
        <header className="announce-banner">
          <div>
            <h1>Department Materials</h1>
            <p>Browse important documents, standard operating procedures (SOPs), manuals, and resources provided by your department.</p>
          </div>
          <div className="admin-header-actions">
            <AdminHeaderActions />
          </div>
        </header>

        <div className="announce-body">
          <div className="announce-toolbar">
            <span className="announce-date-pill">{today}</span>

            <div className="materials-new-dropdown">
              <button type="button" className="announce-new-btn" onClick={() => setNewMenuOpen((v) => !v)}>
                + New Materials
                <svg viewBox="0 0 24 24" 
                  width="14" height="14" fill="none" 
                  stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {newMenuOpen && (
                <div className="materials-new-menu">
                  <button type="button" onClick={() => { 
                    setNewMenuOpen(false); setAddMaterials(true); 
                    }}>
                    <svg viewBox="0 0 24 24" 
                      width="16" height="16" 
                      fill="none" stroke="currentColor" 
                      strokeWidth="1.8">
                        <path d="M12 16V4" />
                        <path d="M6 10l6-6 6 6" />
                        <path d="M4 20h16" />
                    </svg>
                    Upload Material
                  </button>
                  <button type="button" onClick={() => { 
                    setNewMenuOpen(false); setAssessmentOpen(true); 
                    }}>
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
            <div className="announce-tabs">
              <button type="button" className={filter === 'all' ? 'active' : ''} 
                onClick={() => setFilter('all')}>All {counts.all}</button>
              <button type="button" className={filter === 'published' ? 'active' : ''} 
                onClick={() => setFilter('published')}>Published {counts.published}</button>
              <button type="button" className={filter === 'scheduled' ? 'active' : ''} 
                onClick={() => setFilter('scheduled')}>Scheduled {counts.scheduled}</button>
              <button type="button" className={filter === 'draft' ? 'active' : ''} 
                onClick={() => setFilter('draft')}>Draft {counts.draft}</button>
            </div>

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
            {visible.map((m) => (
              <article className="materials-card" key={m.id}>
                <div className="announce-card-head">
                  <span className="announce-category-pill">{m.category}</span>
                  <span className={`announce-status-pill status-${m.status}`}>
                    {STATUS_LABELS[m.status]}
                  </span>
                </div>

                <div className="materials-thumb"><ThumbIcon /></div>

                <h3>{m.title}</h3>
                <p>{m.description}</p>

                <div className="announce-card-foot">
                  <span>{m.date}</span>
                  <div className="announce-card-actions">
                    <button type="button" aria-label="Edit" 
                    onClick={() => showToast('Editing isn\u2019t wired up yet')}>
                    <svg viewBox="0 0 24 24" 
                      width="15" height="15" 
                      fill="none" stroke="currentColor" 
                      strokeWidth="1.8">
                        <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
                    </svg>
                    </button>
                    <button type="button" aria-label="Delete" 
                    onClick={() => handleDelete(m.id)}>
                      <svg viewBox="0 0 24 24" width="15" 
                        height="15" fill="none" 
                        stroke="currentColor" 
                        strokeWidth="1.8">
                          <path d="M3 6h18" />
                          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      </svg>
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

        <AdminFooter />
      </div>
{/* add material */}
      {addMaterials && (
        <AddMaterialsModal
          onClose={() => setAddMaterials(false)} 
          onUpload={handleUpload} 
          modules={availableModules} />
      )}

{/* edit material */}


      {assessmentOpen && (
        <CreateAssessment
        onClose={() => setAssessmentOpen(false)} 
        onSave={handleSaveAssessment} 
        modules={availableModules} />
      )}
    </div>
  );
}