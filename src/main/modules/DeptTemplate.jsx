import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Navbar from "../../auxillary/Navbar";
import Footer from "../../auxillary/Footer";

import UserExamModal from "../../auxillary/assessment/UsersExamModal";

import { getModules } from "../../services/moduleService";
import { getMaterials, getMaterialUrl } from "../../services/materialService";
import { getExam } from "../../services/examService";
import {
    createExamAttempt, closeExamAttempt
} from "../../services/examAttemptService";
import PDFViewer from "../../auxillary/pdfViewer/PDFViewer";

import "../../layout.css";
import "./onboarding.css";

import '../../auxillary/AdminLayout.css';
import '../adminPanel/AdminMaterials.css';
import '../adminPanel/AdminModules.css';
import "../../auxillary/assessment/userExamModal.css";

// Backend API base URL
const apiBase = (
    import.meta.env.VITE_NPC_ONBOARDING_PLATFORM ?? ""
).replace(/\/+$/, "");

// Normalize department names for comparison
const normalizeDepartment = (name = "") =>
    name.toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]/g, "");

export default function DepartmentTemplate({ departmentName }) {

    const token = useSelector((state) => state.auth.token);

    const [selectedExam, setSelectedExam] = useState(null);
    const [assessmentStatus, setAssessmentStatus] = useState("closed");

    const [modules, setModules] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [exams, setExams] = useState([]);

    const [selectedModule, setSelectedModule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedAttempt, setSelectedAttempt] = useState(null);
    const [selectedMaterial, setSelectedMaterial] = useState(null);

const handleStartAssessment = async (exam) => {
    try {
        setAssessmentStatus("starting");

        const response = await createExamAttempt(
            token,
            exam.exam_id
        );

        setSelectedAttempt(response.data);
        setSelectedExam(exam);
        setAssessmentStatus("in_progress");

    } catch (error) {
        console.error("Failed to start assessment:", error);
        alert(error.message);
        setAssessmentStatus("closed");
    }
};


const handleCloseAssessment = async () => {

    if (!selectedAttempt?.exam_attempt_id) {
        console.error("No active assessment attempt found.")
        return;
    }

    const confirmed = window.confirm(
        "Are you sure you want to close this assessment?\n\n" +
        "Your current attempt will be recorded as FAILED " +
        "and will count toward your allowed attempts."
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await closeExamAttempt(
            token,
            selectedAttempt.exam_attempt_id
        );
        alert(response.message || "Assessment closed successrully");

        setSelectedExam(null);
        setSelectedAttempt(null);
        setAssessmentStatus("closed");

    } catch (error) {
        console.error("Failed to close assessment:", error);
        alert(error.message);

        // keep exam open if backend fails to load
        setAssessmentStatus("in_progress");
    }
};

    // Load department modules, materials, and assessments
    useEffect(() => {

        let isMounted = true;

        const loadDepartmentModules = async () => {

            if (!token) {
                setError("Please log in to view onboarding modules.");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setError("");

                const [
                    moduleResponse,
                    materialResponse,
                    examResponse,
                ] = await Promise.all([
                    getModules(token),
                    getMaterials(token),
                    getExam(token),
                ]);

                const allModules = moduleResponse?.data ?? [];
                const allMaterials = materialResponse?.data ?? [];
                const allExams = examResponse?.data ?? [];

                // Filter active modules belonging to this department
                const departmentModules = allModules
                    .filter((module) =>
                        module.is_active === true &&
                        normalizeDepartment(module.department_name) ===
                        normalizeDepartment(departmentName)
                    )
                    .sort((a, b) =>
                        a.display_order - b.display_order
                    );

                // Collect the IDs of this department's modules
                const departmentModuleIds = new Set(
                    departmentModules.map((module) =>
                        String(module.learn_mod_id)
                    )
                );

                // Filter active materials belonging to these modules
                const departmentMaterials = allMaterials.filter(
                    (material) =>
                        material.is_active === true &&
                        departmentModuleIds.has(
                            String(material.learn_mod_id)
                        )
                );

                // Filter active assessments belonging to these modules
                const departmentExams = allExams.filter(
                    (exam) =>
                        exam.is_active === true &&
                        departmentModuleIds.has(
                            String(exam.learn_mod_id)
                        )
                );

                if (isMounted) {

                    setModules(departmentModules);
                    setMaterials(departmentMaterials);
                    setExams(departmentExams);

                    // Automatically select the first available module
                    setSelectedModule(
                        departmentModules.length > 0
                            ? String(departmentModules[0].learn_mod_id)
                            : null
                    );
                    console.log(
                        `${departmentName} modules:`,
                        departmentModules
                    );
                    console.log(
                        `${departmentName} materials:`,
                        departmentMaterials
                    );
                    console.log(
                        `${departmentName} assessments:`,
                        departmentExams
                    );
                }
            } catch (err) {
                console.error(
                    `Failed to load ${departmentName} onboarding:`,
                    err
                );
                if (isMounted) {
                    setError(
                        err.message ||
                        `Unable to load ${departmentName} modules.`
                    );
                }
            } finally {

                if (isMounted) {
                    setLoading(false);
                }
            }
        };
        loadDepartmentModules();
        return () => {
            isMounted = false;
        };
    }, [token, departmentName]);

    // Find the currently selected module
    const currentModule = modules.find(
        (module) =>
            String(module.learn_mod_id) === String(selectedModule)
    );

    // Get materials belonging to the selected module
    const currentMaterials = materials.filter(
        (material) =>
            String(material.learn_mod_id) === String(selectedModule)
    );

    // Get assessments belonging to the selected module
    const currentExams = exams.filter(
        (exam) =>
            String(exam.learn_mod_id) === String(selectedModule)
    );

    return (
        <div className="page">
            <Navbar active="onboarding" />
            <div className="body-wrap">

                {/* LEFT PANEL */}
                <aside className="sidebar">

                    <div className="sidebar-banner">
                        <h2>{departmentName}</h2>
                    </div>

                    <div className="sidebar-scroll">
                        <div className="sidebar-list">
                            {loading ? (
                                <p>Loading modules...</p>
                            ) : error ? (
                                <p>{error}</p>
                            ) : modules.length === 0 ? (
                                <p className="announce-tabs">
                                    No active modules available for this department.
                                </p>
                            ) : (
                                modules.map((module) => (
                                    <button
                                        key={module.learn_mod_id}
                                        type="button"
                                        disabled={assessmentStatus !== "in_progress"}
                                        className={`module-card ${
                                            String(selectedModule) ===
                                            String(module.learn_mod_id)
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            setSelectedModule(
                                                String(module.learn_mod_id)
                                            )
                                        }
                                    >
                                        <div className="icon-row">📄</div>
                                        <p className="title">{module.title}</p>
                                        <span className="view-link">View Module ›</span>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </aside>

                {/* MAIN CONTENT */}
                <main className="main-content">
                    <h1>{departmentName} Department</h1>
                    {loading ? (
                        <p>Loading onboarding content...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : !currentModule ? (
                        <p>No module selected or available.</p>
                    ) : (
                        <>
                            {/* MODULE MATERIALS */}
                            <div className="slide-row">
                                <div className="slide-stack">
                                    <div className="slide-card">
                                        <div className="slide-body">

                                            <h2>
                                                {currentModule.title}
                                            </h2>

                                            <div className="slide-buttons">
                                                {currentMaterials.length > 0 ? (
                                                    currentMaterials.map((material) => (
                                                        <div
                                                            key={material.learn_mat_id}
                                                            className="item"
                                                        >
                                                            <span>{material.title}</span>
                                                            {material.content_url && (
/*                                                                 <a
                                                                    href={getMaterialUrl(material)}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    onClick={(e) => {
                                                                        console.log(
                                                                            "Opening material:",
                                                                            material.title
                                                                        );
                                                                        console.log(
                                                                            "Actual clicked URL:",
                                                                            e.currentTarget.href
                                                                        );
                                                                    }}
                                                                >
                                                                    Open Material
                                                                </a> */
                                                                <button type="button"
                                                                    onClick={() => setSelectedMaterial(material)}
                                                                >
                                                                    Open Material
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p>
                                                        No active learning materials
                                                        available for this module.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="slide-footer">

                                            <span>in Netrust Philippines Corporation</span>
                                            <span>https://www.netrust.com.ph</span>
                                            <span>✉ inquiry@netrust.com.ph</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ASSESSMENTS */}
                            <section className="assessment-section">
                                <h2>Module Assessment</h2>
                                {currentExams.length > 0 ? (
                                    currentExams.map((exam) => (

                                        <div
                                          key={exam.exam_id}
                                          className="assessment-item"
                                        >
                                          <h3>{exam.title}</h3>
                                          <p>Passing Score: {exam.passing_score}%</p>
                                          <p>Attempts Allowed: {exam.attempt_limit}</p>
                                          <p>Duration: {exam.duration_minutes} minutes</p>
                                          <button
                                              type="button"
                                              className="materials-card"
                                              onClick={() => handleStartAssessment(exam)}
                                              disabled={assessmentStatus !== "closed"}
                                          >
                                              {assessmentStatus === "starting"
                                                  ? "Starting..."
                                                  : "Start Assessment"}
                                          </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="assessment-item">
                                      <span style={{ color: 'darkblue' }}>
                                        No active assessments available for this module.
                                      </span>
                                    </p>
                                )}
                            </section>

                            {/* MODULE COUNTER */}
                            <div className="page-counter">
                                {modules.findIndex(
                                    (module) =>
                                        String(module.learn_mod_id) ===
                                        String(selectedModule)
                                ) + 1}
                                /{modules.length}
                            </div>
                        </>
                    )}
                </main>
            </div>
            <Footer />

            {selectedExam && selectedAttempt && (
              <UserExamModal
                exam={selectedExam}
                attempt={selectedAttempt}
                token={token}
                onClose={handleCloseAssessment}
                onSubmit={(submission) => {
                    console.log("Received from UserExamModal:", submission);
                }}
              />
            )}

            {selectedMaterial && (
                <PDFViewer token={token}
                    material={selectedMaterial}
                    onClose={() => setSelectedMaterial(null)}
                />
            )}
        </div>
    );
}
