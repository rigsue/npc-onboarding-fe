import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useToast } from "../../context/ToastContext";

import AdminHeaderActions from '../../auxillary/AdminHeaderActions';
import AdminFooter from '../../auxillary/AdminFooter';

import CreateAssessmentModal from '../../auxillary/assessment/AddAssessmentModal';
import EditAssessmentModal from '../../auxillary/assessment/EditAssessmentModal';

import { 
    getExam, createExam, updateExam, updateExamStatus 
} from "../../services/examService";

import { 
    createQuestion, getQuestionsByExam, updateQuestion, updateQuestionStatus
 } from "../../services/questionService";

import { 
    createChoice, getChoicesByQuestion, updateChoice, updateChoiceStatus
 } from "../../services/choiceService";

import { getModules } from "../../services/moduleService";
import { getMaterials } from "../../services/materialService";

import "../../auxillary/assessment/userExamModal.css";
import '../../auxillary/AdminLayout.css';


export default function AdminAssessments() {
    const today = new Date().toLocaleDateString(
        undefined,
        {weekday: "long", year: "numeric", month: "long", day: "numeric"}
    )
    const { user, token } = useSelector(state => state.auth);
    const { showToast } = useToast();

    const [exams, setExams] = useState([]);
    const [modules, setModules] = useState([]);
    const [materials, setMaterials] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showCreate, setShowCreate] = useState(false);
    const [selectedExam, setSelectedExam] = useState(null);

    const [search, setSearch] = useState("");
    const [moduleFilter, setModuleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    const isSuperAdmin = user?.roleName?.toLowerCase() === "super admin";
    const isAdmin = user?.roleName.toLowerCase() === "admin";
    // const accessAssessment = isSuperAdmin || isAdmin;

    const departmentId = user?.departmentId;
    const departmentName = user?.departmentName;

    const availableModules = useMemo(() => {
        if (isSuperAdmin) return modules;

        return modules.filter(module => {
            if (
                departmentId != null &&
                module.department_id != null
            ) {
                return String(module.department_id) === String(departmentId);
            }
            if (
                departmentName && module.department_name
            ) {
                return module.department_name.toLowerCase() === 
                    departmentName.toLowerCase();
            }
            return false;
        });
    }, [modules, isSuperAdmin, departmentId, departmentName]);

    const availableModuleIds = useMemo(() => new Set(
        availableModules.map(module => String(module.learn_mod_id))
    ), [availableModules]);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const [examResponse, moduleResponse, materialResponse] = 
                await Promise.all([
                    getExam(token), getModules(token), getMaterials(token),
                ]);
            const examList = examResponse.data || [];
            const moduleList = moduleResponse.data || [];
            const materialList = materialResponse.data || [];

            setExams(examList);
            setModules(moduleList);
            setMaterials(materialList);
        } catch (err) {
            setError(err.message || "Failed to load assessments");
        } finally { setLoading(false); }
    }, [token]);

    useEffect(() => { if (token) loadData();
    }, [token, loadData]);

    const visibleExams = useMemo(() => {
        return exams.filter(exam =>
            availableModuleIds.has(String(exam.learn_mod_id))
        );
    }, [exams, availableModuleIds]);

    const filteredExams = useMemo(() => {
        return visibleExams.filter(exam => {
            const module = modules.find(
                m => String(m.learn_mod_id) ===
                    String(exam.learn_mod_id)
            );
            const matchesSearch = 
                exam.title?.toLowerCase().includes(search.toLowerCase()) ||
                module?.title?.toLowerCase().includes(search.toLowerCase());

            const matchesModule = 
                moduleFilter === "all" ||
                String(exam.learn_mod_id) === moduleFilter;

            const active = exam.is_active === true ||
                exam.is_active ===1;

            const matchesStatus = 
                statusFilter === "all" ||
                (statusFilter === "active" && active) ||
                (statusFilter === "inactive" && !active);

            return matchesSearch && matchesModule && matchesStatus;
        });
    }, [visibleExams, modules, search, moduleFilter, statusFilter]);

    const getModuleforExam = exam =>
        modules.find(m =>
            String(m.learn_mod_id) === String(exam.learn_mod_id)
        );

    const getAssignedMaterials = exam => {
        return materials.filter(material => 
            String(material.learn_mod_id) ===
            String(exam.learn_mod_id)
        );
    }

    const handleCreate = async examData => {
        const moduleAllowed = availableModuleIds.has(
            String(examData.learnModId)
        );
        if (!moduleAllowed) {
            throw new Error("You cannot create exam under another dept");
        }
    await createExam(token, examData);

    showToast("Assessment created successfully", "success");
    setShowCreate(false);
    await loadData();
    };

    const handleUpdate = async (
        examId, 
        assessmentData, 
        questionData, 
        deletedQuestionIds,
        deleteChoiceIds
    ) => {
        const originalExam = exams.find(
            exam => String(exam.exam_id) === String(examId)
        );
        if (!originalExam) {
            throw new Error("Assessment not found");
        }
        const targetModuleAllowed = availableModuleIds.has(
            String(assessmentData.learnModId)
        );
        if (!targetModuleAllowed) {
            throw new Error("You cannot move an exam to another dept");
        }

        const originalModule = module.find(
            module => 
                String(module.learn_mod_id) ===
                String(originalExam.learn_mod_id)
        );

        const targetModule = modules.find(
            module => 
                String(module.learn_mod_id) === 
                String(assessmentData.learnModId)
        );
        if (
            !isSuperAdmin && originalModule && targetModule &&
            String(originalModule.department_id) !==
                String(targetModule.department_id)
        ) {
            throw new Error("You cannot move exam to another dept -1");
        }

        await updateExam(token, examId, assessmentData);

        for (const choiceId of deleteChoiceIds) {
            await updateChoiceStatus(token, choiceId, false);
        }

        for (const questionId of deletedQuestionIds) {
            await updateQuestionStatus(token, questionId, false);
        }

        for (const [index, question] of questionData.entries()) {
            let questionId;

            const isNewQuestion = String(question.id).startsWith("new-");

            const questionPayload = {
                examId: Number(examId),
                question: question.question,
                questionType: question.questionType,
                points: question.points,
                displayOrder: question.displayOrder,
            };

            if (isNewQuestion) {
                const result = createQuestion(token, questionPayload);

                questionId = result.data?.question_id ??
                                result.question_id ??
                                result.data?.id;

                if (!questionId) {
                    throw new Error(`Could not retrieve ID for question ${index + 1}`);
                };
            } else {
                questionId = Number(question.id);

                await updateQuestion(token, questionId, questionPayload);
            }
            for (const choice of question.choices) {
                const choicePayload = {
                    questionId: Number(questionId),
                    choiceText: choice.choiceText,
                    isCorrect: choice.isCorrect,
                    displayOrder: choice.displayOrder,
                };
                if (String(choice.id).startsWith("new-")) {
                    await createChoice(token, choicePayload);
                } else {
                    await updateChoice(token, Number(choice.id), choicePayload);
                }
            }
        }
        showToast("Assessment update successfully", "success");

        setSelectedExam(null);
        await loadData();
    };
    const handleDeactivate = async examId => {
        await updateExamStatus(token, examId, false);
        showToast("Assessment deactivated successfully", "success");

        setSelectedExam(null);
        await loadData();
    };
    const totalActive = visibleExams.filter(
        exam => exam.is_active === true || exam.is_active === 1
    ).length;
    const totalInactive = visibleExams.length - totalActive;

/*  -   -   render  -   -   */
    return (
        <div className="admin-shell">
            <main className="admin-main">
                <header className="announce-banner">
                    <div>
                        <h1>Assessment Management</h1>
                        <p>
                            Manage examinations, questions,
                            choices, and assigned modules.
                        </p>
                    </div>
                    <div className="admin-header-actions">
                        <AdminHeaderActions />
                    </div>
                </header>

                <div className="announce-body">
                    <div className="admin-assessments-content">
                        <div className="assessment-page-heading">
                            <div>
                        <span className="announce-dated-pilled">{today}</span>

                            </div>
                            <button
                                type="button"
                                onClick={() => setShowCreate(true)}
                            >
                                + Create Assessment
                            </button>
                        </div>

                        <div className="assessment-summary-grid">
                            <div className="assessment-summary-card">
                                <span>Total Assessments</span>
                                <strong>{visibleExams.length}</strong>
                            </div>

                            <div className="assessment-summary-card">
                                <span>Active</span>
                                <strong>{totalActive}</strong>
                            </div>

                            <div className="assessment-summary-card">
                                <span>Inactive</span>
                                <strong>{totalInactive}</strong>
                            </div>
                        </div>

                        <div className="assessment-toolbar">
                            <input
                                type="search"
                                placeholder="Search assessments or modules..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                            <select value={moduleFilter} 
                                onChange={e => setModuleFilter(e.target.value)}
                            >
                                <option value="all">All Modules</option>
                                {availableModules.map(module => (
                                    <option value={module.learn_mod_id}
                                        key={module.learn_mod_id}
                                    >
                                        {module.title}
                                    </option>
                                ))}
                            </select>

                            <select value={statusFilter} 
                                onChange={e => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        {error && (
                            <p className="exam-error">{error}</p>
                        )}
                        {loading ? (
                            <p>Loading assessments...</p>
                        ) : filteredExams.length === 0 ? (
                            <div className="assessment-empty">
                                No assessments found
                            </div>
                        ) : (
                            <div className="assessment-table-wrapper">
                                <table className="assessment-table">
                                    <thead>
                                        <tr>
                                            <th>Assessment</th>
                                            <th>Department</th>
                                            <th>Learning Module</th>
                                            <th>Assigned Materials</th>
                                            <th>Passing Score</th>
                                            <th>Duration</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filteredExams.map((exam) => {
                                            const module = getModuleforExam(exam);
                                            const assignedMaterials =
                                                getAssignedMaterials(exam);
                                            return (
                                                <tr key={exam.exam_id}>
                                                    <td>
                                                        <strong>{exam.title}</strong>
                                                    </td>
                                                    <td>{module?.department_name || "_"}</td>
                                                    <td>{module?.title || "_"}</td>
                                                    <td>
                                                        {assignedMaterials.length ? (
                                                            <ul className="assessment-material-list">
                                                                {assignedMaterials.map(
                                                                    material => (
                                                                        <li key={
                                                                            material.learn_mat_id
                                                                            }>
                                                                            {material.title}
                                                                        </li>
                                                                    )
                                                                )}
                                                            </ul>
                                                        ) : (
                                                            "No materials assigned"
                                                        )}
                                                    </td>
                                                    <td>{exam.passing_score}%</td>
                                                    <td>{exam.duration_minutes}min/s</td>
                                                    <td>
                                                        <span className={exam.is_active
                                                            ? "assessment-status active"
                                                            : "assessment-status inactive"}
                                                        >
                                                            {exam.is_active ? "Active" : "Inactive"}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button type="button"
                                                            className="assessment-edit-btn"
                                                            onClick={() => setSelectedExam(exam)}
                                                        >
                                                            Edit
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <AdminFooter/>
                </div>

            </main>

            {showCreate && (
                <CreateAssessmentModal
                    modules={availableModules}
                    onClose={() => setShowCreate(false)}
                    onSave={handleCreate}
                />
            )}

            {selectedExam && (
                <EditAssessmentModal
                    initial={selectedExam}
                    token={token}
                    modules={availableModules}
                    onClose={() => setSelectedExam(null)}
                    onSave={handleUpdate}
                    onDelete={handleDeactivate}
                />
            )}
        </div>
    );
}