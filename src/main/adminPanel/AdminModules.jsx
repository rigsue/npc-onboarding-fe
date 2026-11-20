import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useToast } from "../../context/ToastContext";

import AdminHeaderActions from "../../auxillary/AdminHeaderActions";
import AdminFooter from "../../auxillary/AdminFooter";

import AddModuleModal from "../../auxillary/modules/AddModuleModal";
import EditModuleModal from "../../auxillary/modules/EditModuleModal";
import AddMaterialsModal from '../../auxillary/materials/AddMaterialsModal';
import CreateAssessmentModal from '../../auxillary/assessment/AddAssessmentModal';

import { getDepartments } from "../../services/departmentService";
import {
  getModules, createModule, updateModule, updateModuleStatus,
} from "../../services/moduleService";
import { getMaterials, updateMaterial, uploadMaterials } from "../../services/materialService";

import "../../auxillary/AdminLayout.css";
import "./AdminModules.css";

function normalizeModule(module) {
    return {
      ...module,
      id: module.learn_mod_id,
      date: module.created_at
        ? new Date(module.created_at).toLocaleDateString()
        : ""
    };
  }
export default function AdminModules() {

    /*     *    CURRENT DATE     */
  const today = new Date().toLocaleDateString(
      undefined,
      {weekday: "long", year: "numeric", month: "long", day: "numeric"}
  );

  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const { showToast } = useToast();

  /*    *   USER ROLE AND DEPARTMENT    */
  const role = (
    user?.roleName ||
    user?.role_name ||
    user?.role ||
    ""
  ).toLowerCase();

  const departmentName =
    user?.departmentName ||
    user?.department_name ||
    "";

  const isSuperAdmin = role === "super admin";
  const isAdmin = role === "admin";

  /*    *   COMPONENT STATES    */
  const [modules, setModules] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [moduleLoading, setModuleLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [newMenuOpen, setNewMenuOpen] = useState(false);
  
  const [addMaterialOpen, setAddMaterialOpen] = useState(false);
  const [materials, setMaterials] = useState([]);

  const [addModuleOpen, setAddModuleOpen] = useState(false);
  const [editModuleOpen, setEditModuleOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);

  const [assessmentOpen, setAssessmentOpen] = useState(false);
  

  const fetchModules = async () => {
    try {
        const response = await getModules(token);
        setModules(response.data);
    } catch (error) {
        throw error;
    }
};
  /*    *   FETCH MODULES   */
  useEffect(() => {
    if (!token) {
      setModules([]);
      return;
    }
    let cancelled = false;

    const fetchModules = async () => {
      setModuleLoading(true);

      try {
        const response = await getModules(token);

        const moduleData = Array.isArray(response)
          ? response
          : response?.data || [];

        if (!cancelled) {
          setModules(moduleData.map(normalizeModule));
        }

        // setModules(moduleData);
      } catch (error) {
        console.error("Failed to fetch modules:", error);
        showToast(error.message || "Failed to load learning modules", "error");

        if (!cancelled) {
          showToast("failed to load learn mods")
        }
      } finally {
        if (!cancelled){
        setModuleLoading(false);
        }
      }
    };
    fetchModules();

    return () => { cancelled = true; };
  }, [token]);

  /*    *   FETCH DEPARTMENTS   */
  const fetchDepartments = async () => {
    if (!isSuperAdmin) return;

    try {
      const response = await getDepartments(token);

      const departmentData = Array.isArray(response)
        ? response
        : response?.data || [];

      setDepartments(departmentData);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
      showToast(error.message || "Failed to load departments", "error");
    }
  };

  /*    *   INITIAL DATA LOADING   */
  useEffect(() => {
    if (!token) return;

    fetchDepartments();
  }, [token]);

  /*    *   ROLE-BASED MODULE ACCESS   */
  const availableModules = useMemo(() => {
    if (isSuperAdmin) {
      return modules;
    }

    if (isAdmin) {
      return modules.filter(
        (module) =>
          String(module.department_name || "").toLowerCase() ===
          departmentName.toLowerCase()
      );
    }

    return [];
  }, [modules, isSuperAdmin, isAdmin, departmentName]);

  /*    *   MODULE COUNTS   */
  const totalModules = availableModules.length;

  const activeModules = availableModules.filter(
    (module) => module.is_active === true
  ).length;

  const inactiveModules = availableModules.filter(
    (module) => module.is_active === false
  ).length;

  /*    *   SEARCH AND FILTER   */
  const visibleModules = useMemo(() => {
    return availableModules.filter((module) => {
      const matchesSearch =
        module.title?.toLowerCase().includes(search.toLowerCase()) ||
        module.department_name?.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        (filter === "active" && module.is_active === true) ||
        (filter === "inactive" && module.is_active === false);

      return matchesSearch && matchesFilter;
    });
  }, [availableModules, search, filter]);

  /*    *   CREATE MODULE   */
  const handleCreateModule = async (moduleData) => {
    try {
      setSaving(true);

      await createModule(token, moduleData);

      showToast("Learning module created successfully", "success");

      setAddModuleOpen(false);
      await fetchModules();
    } catch (error) {
      console.error("Create module error:", error);
      showToast(error.message || "Failed to create module", "error");
    } finally {
      setSaving(false);
    }
  };

  /*    *   UPDATE MODULE   */
  const handleUpdateModule = async (learnModId, moduleData) => {
    try {
      setSaving(true);
      
      console.log("Learning Module ID:", learnModId);
      console.log("Module Data to be sent:", moduleData);

      await updateModule(token, learnModId, moduleData);

      showToast("Learning module updated successfully", "success");

      setEditModuleOpen(false);
      setSelectedModule(null);


      await fetchModules();

    } catch (error) {
      console.error("Update module error:", error);
      showToast(error.message || "Failed to update module", "error");
    } finally {
      setSaving(false);
    }
  };

  /*    *   SOFT DELETE MODULE   */
  const handleDeleteModule = async (learnModId) => {
    try {
      setSaving(true);

      await updateModuleStatus(token, learnModId, false);

      showToast("Learning module deactivated successfully", "success");

      setEditModuleOpen(false);
      setSelectedModule(null);

      await fetchModules();
    } catch (error) {
      console.error("Delete module error:", error);
      showToast(error.message || "Failed to deactivate module", "error");
    } finally {
      setSaving(false);
    }
  };

  /*    *   PEN EDIT MODAL   */
  const handleEditClick = (module) => {
    setSelectedModule(module);
    setEditModuleOpen(true);
  };

  /* * Add Material * */
const handleAddMaterial = async ({
  files, linkedModule, status,note, title, materialType, displayOrder, minDurationMinutes, maxDurationMinutes
}) => {
  try {
    if (linkedModule === 0) {
      showToast("Add module");
      return;
    }
    await uploadMaterials(token, {
      files, linkedModule, note, title, materialType, displayOrder, minDurationMinutes, maxDurationMinutes
    });
    const response = await getMaterials(token);
    const rows = Array.isArray(response.data) ? response.data : [];
    setAddMaterialOpen(false);
    showToast("Learn materials uploaded successfully")
  } catch (error) {
    console.error("Material add failed", error);
    showToast(error.message || "Failed to add learning materials");
  };
};

  /* * Save Assessment * */
  const handleSaveAssessment = async (assessmentData) => {
    try {
      const response = await createExam(token, assessmentData);
      showToast(
        response.message || "Assessment created successfully", "sucess"
      );
      setAssessmentOpen(false);
    } catch (error) {
      showToast(error.message || "Failed to create assessment");
      throw error;
    }
  }

  /*    *   ACCESS CONTROL   */
  if (!isSuperAdmin && !isAdmin) {
    return (
      <div className="admin-modules-access-denied">
        <h2>Access Denied</h2>
        <p>You are not authorized to manage learning modules.</p>
      </div>
    );
  }

  /*    *   RENDER   */
  return (
    <div className="admin-shell">
        <main className="admin-main">
            <header className="announce-banner">
                <div>
                    <h1>Learning Modules</h1>
                    <p>Manage learning modules</p>
                </div>
                <div className="admin-header-actions">
                    <AdminHeaderActions />
                </div>
            </header>

            <section className="announce-body">
              <div className="admin-sidebar-page">

                {/* PAGE HEADER */}
                <div className="admin-modules-heading">
                  <div>
                    <span className="date-btn-like">{today}</span>
                  </div>

                  <div className="add-menu-dropdown">
                    <button type="button"
                        className="date-btn-like"
                        onClick={() => setNewMenuOpen((v) => !v)}
                    >
                      + Create Course
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
                            setAddModuleOpen(true);
                          }}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            width="16"
                            height="16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M6 3h11a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
                            <path d="M8 3v18" />
                            <path d="M11 8h5" />
                            <path d="M11 12h5" />
                            <path d="M11 16h5" />
                          </svg>
                          Add a Module
                        </button>

                        <button type="button"
                          onClick={() => {
                            setNewMenuOpen(false);
                            setAddMaterialOpen(true)
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
                          Add Learning Material
                        </button>

                        <button
                          onClick={() => {
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

                {/* STATISTICS */}
                <div className="admin-modules-stats">

                    <div className="admin-module-stat-card">
                    <span>Total Modules</span>
                    <strong>{totalModules}</strong>
                    </div>

                    <div className="admin-module-stat-card">
                    <span>Active Modules</span>
                    <strong>{activeModules}</strong>
                    </div>

                    <div className="admin-module-stat-card">
                    <span>Inactive Modules</span>
                    <strong>{inactiveModules}</strong>
                    </div>

                </div>

                {/* FILTERS */}
                <div className="admin-modules-toolbar">

                    <input
                    type="text"
                    placeholder="Search modules or departments..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    />

                    <select
                    value={filter}
                    onChange={(event) => setFilter(event.target.value)}
                    >
                    <option value="all">All Modules</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    </select>

                </div>

                {/* MODULE TABLE */}
                <div className="admin-modules-table-wrapper">

                    {moduleLoading ? (
                    <div className="admin-modules-empty">
                        Loading learning modules...
                    </div>
                    ) : visibleModules.length === 0 ? (
                    <div className="admin-modules-empty">
                        No learning modules found.
                    </div>
                    ) : (

                    <table className="admin-modules-table">

                        <thead>
                        <tr>
                            <th>Module</th>
                            <th>Department</th>
                            <th>Display Order</th>
                            <th>Expected Duration</th>
                            <th>Time Limit</th>
                            <th>Date Created</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>

                        <tbody>

                        {visibleModules.map((module) => (
                          <tr key={module.learn_mod_id}>

                            <td>
                                <div className="admin-module-title">
                                <strong>{module.title}</strong>
                                <small>
                                    {module.description || "No description"}
                                </small>
                                </div>
                            </td>

                            <td>{module.department_name || "—"}</td>

                            <td>{module.display_order ?? 0}</td>

                            <td>
                                {module.expected_duration_minutes ?? 0} min
                            </td>

                            <td>
                                {module.time_limit_minutes
                                ? `${module.time_limit_minutes} min`
                                : "No limit"}
                            </td>
                            <td>{module.date}</td>
                            <td>
                                <span
                                className={`admin-module-status ${
                                    module.is_active
                                    ? "active"
                                    : "inactive"
                                }`}
                                >
                                {module.is_active ? "Active" : "Inactive"}
                                </span>
                            </td>

                            <td>
                              <button
                                type="button"
                                className="admin-module-edit-btn"
                                onClick={() => handleEditClick(module)}
                                >
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))}

                        </tbody>

                    </table>

                    )}

                </div>
              </div>
            </section>

            <AdminFooter />

        </main>

      {/* CREATE MODULE MODAL */}

      {addModuleOpen && (
        <AddModuleModal
          onClose={() => setAddModuleOpen(false)}
          onSave={handleCreateModule}
          departments={departments}
        />
      )}

      {/* EDIT MODULE MODAL */}

      {editModuleOpen && selectedModule && (
        <EditModuleModal
          initial={selectedModule}
          departments={departments}
          onClose={() => {
            setEditModuleOpen(false);
            setSelectedModule(null);
          }}
          onSave={handleUpdateModule}
          onDelete={handleDeleteModule}
        />
      )}

      {addMaterialOpen && (
        <AddMaterialsModal
          onClose={() => setAddMaterialOpen(false)}
          onSave={handleAddMaterial}
          modules={availableModules}
        />
      )}

      {assessmentOpen && (
        <CreateAssessmentModal 
        onClose={() => setAssessmentOpen(false)} 
        onSave={handleSaveAssessment} 
        modules={availableModules} />
      )}
    </div>
  );
}
