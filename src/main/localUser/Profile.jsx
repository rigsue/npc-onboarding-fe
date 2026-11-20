
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Navbar from '../../auxillary/Navbar';
import Footer from '../../auxillary/Footer';
import ProfilePhoto from '../../auxillary/ProfilePhoto';

import { getModules } from '../../services/moduleService';
import { getMaterials } from '../../services/materialService';
import { getExam } from '../../services/examService';

import { getMyUserProgress } from '../../services/userProgressService';
import { getMyMaterialProgress } from '../../services/userMatProgressService';
import { getExamAttemptsByUserProgress } from '../../services/examAttemptService';

import '../../layout.css';
import './Profile.css';

export default function Profile() {

  const [loading, setLoading] = useState(true);
  
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const [progressError, setProgressError] = useState("");

  const [progress, setProgress] = useState({
    modules: {
        completed: 0,
        total: 0,
        percentage: 0,
    },
    materials: {
        completed: 0,
        total: 0,
        percentage: 0,
    },
    assessments: {
        completed: 0,
        total: 0,
        percentage: 0,
    },
});


const calculatePercentage = (completed, total) => {
    if (!total) return 0;

    return Number(((completed / total) * 100).toFixed(2));
};


  const firstName = user?.firstName ?? "";
  const lastName = user?.lastName ?? "";

  const fullName = [firstName, lastName].filter(Boolean).join(" ") || "User";

  const role = user?.roleName ?? (typeof user?.role === "string" ? user.role : "")
    ?? "No role assigned";

  const email = user?.email ?? "No email available";

  const phone = user?.contactNumber ?? "No contact Number available";
  
  useEffect(() => {
    async function loadAccount() {
      if (!user || !user?.userId) {
        return;
      }
      try {
        setLoading(true);
        // const result = await getUserById(token, user.userId);
        // const accountData = result?.data ?? result;
      } catch (error) {
        console.error("Failed to load account", error);
      } finally {
        setLoading(false);
      }
    } loadAccount();
  }, [user, user?.userId]);
    // const current

    
useEffect(() => {
    let isMounted = true;

    async function loadProgress() {
        if (!token || !user?.userId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setProgressError("");

            // 1. Retrieve the required onboarding records
            const [
                moduleResponse,
                materialResponse,
                examResponse,
                userProgressResponse,
                materialProgressResponse,
            ] = await Promise.all([
                getModules(token),
                getMaterials(token),
                getExam(token),
                getMyUserProgress(token),
                getMyMaterialProgress(token),
            ]);

            // 2. Extract the actual data from API responses
            const modules = moduleResponse?.data ?? [];
            const materials = materialResponse?.data ?? [];
            const exams = examResponse?.data ?? [];

            const userProgress = userProgressResponse?.data ?? [];
            const materialProgress = materialProgressResponse?.data ?? [];

            // 3. Only active modules are required
            const activeModules = modules.filter(
                module => module.is_active === true
            );

            const activeModuleIds = new Set(
                activeModules.map(module => String(module.learn_mod_id))
            );

            // 4. Only active materials under active modules
            const activeMaterials = materials.filter(
                material =>
                    material.is_active === true &&
                    activeModuleIds.has(String(material.learn_mod_id))
            );

            // 5. Only active assessments under active modules
            const activeExams = exams.filter(
                exam =>
                    exam.is_active === true &&
                    activeModuleIds.has(String(exam.learn_mod_id))
            );

            // 6. Calculate completed modules
            const completedModules = activeModules.filter(module => {
                const record = userProgress.find(
                    item =>
                        String(item.learn_mod_id) ===
                        String(module.learn_mod_id)
                );

                return record?.status?.toLowerCase() === "completed";
            }).length;

            // 7. Calculate completed learning materials
            const completedMaterials = activeMaterials.filter(material => {
                const record = materialProgress.find(
                    item =>
                        String(item.learn_mat_id) ===
                        String(material.learn_mat_id)
                );

                return record?.status?.toLowerCase() === "completed";
            }).length;

            // 8. Retrieve assessment attempts for each user progress record
            const attemptResponses = await Promise.all(
                userProgress.map(record =>
                    getExamAttemptsByUserProgress(
                        token,
                        record.user_progress_id
                    )
                )
            );

            // 9. Collect unique assessments that the employee passed
            const passedExamIds = new Set();

            attemptResponses.forEach(response => {
                const attempts = response?.data ?? [];

                attempts.forEach(attempt => {
                    if (attempt.is_passed === true) {
                        passedExamIds.add(String(attempt.exam_id));
                    }
                });
            });

            // 10. Count passed active assessments
            const completedAssessments = activeExams.filter(exam =>
                passedExamIds.has(String(exam.exam_id))
            ).length;

            // 11. Update the Profile progress states
            if (isMounted) {
                setProgress({
                    modules: {
                        completed: completedModules,
                        total: activeModules.length,
                        percentage: calculatePercentage(
                            completedModules,
                            activeModules.length
                        ),
                    },

                    materials: {
                        completed: completedMaterials,
                        total: activeMaterials.length,
                        percentage: calculatePercentage(
                            completedMaterials,
                            activeMaterials.length
                        ),
                    },

                    assessments: {
                        completed: completedAssessments,
                        total: activeExams.length,
                        percentage: calculatePercentage(
                            completedAssessments,
                            activeExams.length
                        ),
                    },
                });
            }

        } catch (error) {
            console.error("Failed to load onboarding progress:", error);

            if (isMounted) {
                setProgressError(
                    error.message || "Unable to retrieve onboarding progress."
                );
            }

        } finally {
            if (isMounted) {
                setLoading(false);
            }
        }
    }

    loadProgress();

    return () => {
        isMounted = false;
    };

}, [token, user?.userId]);

  return (
    <div className="page-shell">
      <Navbar active="profile" />

      <main>
        <section className="profile-panel">

          <div className="profile-head">
            <ProfilePhoto />

            <div className="profile-details">
              <h1 className="profile-name">{fullName}</h1>
              <p className="profile-role">{role}</p>
              <p className="profile-contact">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 6l10 7 10-7" /></svg>
                {email}
              </p>
              <p className="profile-contact">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L8.1 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.9 2.2z" /></svg>
                {phone}
              </p>
            </div>

            <Link className="manage-btn" to="/manageaccount">Manage your account</Link>
          </div>

          <div className="about-block">
            <h2>About</h2>
            <p>committed to ensuring secure, efficient, and uninterrupted IT operations while providing quality technical support to employees and company systems.</p>
          </div>

          <div className="progress-grid">


<div className="progress-card">
    <h3>Onboarding Progress</h3>

    {loading ? (
        <p>Loading onboarding progress...</p>
    ) : progressError ? (
        <p className="error-message">{progressError}</p>
    ) : (
        <>
            {/* Learning Modules */}
            <div className="progress-item">
                <p className="progress-label">
                    Learning Modules - {progress.modules.completed}/
                    {progress.modules.total}
                </p>

                <div className="progress-row">
                    <div className="progress-bar">
                        {Array.from(
                            { length: progress.modules.total },
                            (_, index) => (
                                <span
                                    key={index}
                                    className={`seg ${
                                        index < progress.modules.completed
                                            ? "filled"
                                            : ""
                                    }`}
                                />
                            )
                        )}
                    </div>

                    <span className="progress-pct">
                        {progress.modules.percentage}%
                    </span>
                </div>
            </div>

            {/* Learning Materials */}
            <div className="progress-item">
                <p className="progress-label">
                    Learning Materials - {progress.materials.completed}/
                    {progress.materials.total}
                </p>

                <div className="progress-row">
                    <div className="progress-bar">
                        {Array.from(
                            { length: progress.materials.total },
                            (_, index) => (
                                <span
                                    key={index}
                                    className={`seg ${
                                        index < progress.materials.completed
                                            ? "filled"
                                            : ""
                                    }`}
                                />
                            )
                        )}
                    </div>

                    <span className="progress-pct">
                        {progress.materials.percentage}%
                    </span>
                </div>
            </div>

            {/* Assessments */}
            <div className="progress-item">
                <p className="progress-label">
                    Assessment/Quiz - {progress.assessments.completed}/
                    {progress.assessments.total}
                </p>

                <div className="progress-row">
                    <div className="progress-bar">
                        {Array.from(
                            { length: progress.assessments.total },
                            (_, index) => (
                                <span
                                    key={index}
                                    className={`seg ${
                                        index < progress.assessments.completed
                                            ? "filled"
                                            : ""
                                    }`}
                                />
                            )
                        )}
                    </div>

                    <span className="progress-pct">
                        {progress.assessments.percentage}%
                    </span>
                </div>
            </div>
        </>
    )}
</div>


            <div className="equipment-card">
              <h3>Assigned Equipments</h3>
              <label className="equip-row"><input type="checkbox" defaultChecked /><span className="equip-box"></span>Company Laptop</label>
              <label className="equip-row"><input type="checkbox" defaultChecked /><span className="equip-box"></span>External Monitor</label>
              <label className="equip-row"><input type="checkbox" defaultChecked /><span className="equip-box"></span>Keyboard and Mouse</label>
              <label className="equip-row"><input type="checkbox" /><span className="equip-box"></span>Headset</label>
              <label className="equip-row"><input type="checkbox" /><span className="equip-box"></span>Company ID</label>
            </div>

          </div>

          <div className="cert-panel">
            <h3>Certifications</h3>

            <Link className="cert-row" to="/certifications">
              <h4>Onboarding Completion</h4>
              <p>Awarded for successfully completing the company's onboarding program and meeting all onboarding requirements.</p>
            </Link>

            <Link className="cert-row" to="/certifications">
              <h4>Onboarding Completion</h4>
              <p>Awarded for successfully completing the company's onboarding program and meeting all onboarding requirements.</p>
            </Link>

            <Link className="cert-row" to="/certifications">
              <h4>Onboarding Completion</h4>
              <p>Awarded for successfully completing the company's onboarding program and meeting all onboarding requirements.</p>
            </Link>
          </div>

        </section>
      </main>

      <Footer />
    </div>
  );
}
