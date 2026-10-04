import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import AdminHeaderActions from "../components/AdminHeaderActions";
import AdminFooter from "../components/AdminFooter";

import { getAdminDashboardData }
from "../services/dashboardService";

import "../components/AdminLayout.css";
import "./AdminDashboard.css";

const PAGE_SIZE = 7;

/* * STATUS */
function StatusPill({ status }) {
    const normalizedStatus = String(status || "")
        .toLowerCase()
        .replaceAll("_", " ");

    let className = "status-pill";

    if (normalizedStatus === "completed") {
        className += " completed";
    } else if (
        normalizedStatus === "in progress" ||
        normalizedStatus === "in-progress"
    ) {
        className += " in-progress";
    } else if (normalizedStatus === "pending") {
        className += " pending";
    }
    return (
        <span className={className}>
            {normalizedStatus || "Unknown"}
        </span>
    );
}

function formatDate(value) {
    if (!value) {
        return "—";
    }
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }
    return date.toLocaleDateString();
}

function formatDuration(seconds) {
    if (!seconds || seconds <= 0) {
        return "0m";
    }
    const totalMinutes = Math.floor(seconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
}

function getProgressValue(value) {
    const number = Number(value);

    if (Number.isNaN(number)) {
        return 0;
    }
    return Math.min(100, Math.max(0, number));
}

export default function AdminDashboard() {
    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);

    const isSuperAdmin = user?.roleName === "Super admin";
    // const isAdmin = user?.roleName === "Admin";

    // const fullName =
    //     `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim();

    const [dashboardData, setDashboardData] = useState({
        users: [],
        modules: [],
        userProgress: [],
        exams: [],
        examAttempts: [],
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const [department, setDepartment] = useState(
        isSuperAdmin
            ? "All Departments"
            : user?.departmentName || ""
    );

    //  LOAD DASHBOARD DATA

    useEffect(() => {
        let cancelled = false;

        async function loadDashboard() {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setError("");

                const data = await getAdminDashboardData(token);

                if (!cancelled) {
                    setDashboardData(data);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err?.message ||
                        "Unable to load dashboard data."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadDashboard();

        return () => {
            cancelled = true;
        };
    }, [token]);
    /*
     * MODULE LOOKUP
     */
    const moduleMap = useMemo(() => {
        const map = new Map();

        dashboardData.modules.forEach((module) => {
            map.set(
                Number(module.learn_mod_id),
                module
            );
        });
        return map;
    }, [dashboardData.modules]);
    /*
     * USER LOOKUP
     */
    const userMap = useMemo(() => {
        const map = new Map();

        dashboardData.users.forEach((user) => {
            map.set(
                Number(user.user_id),
                user
            );
        });
        return map;
    }, [dashboardData.users]);
    /*
     * COMBINE USER + MODULE + PROGRESS
     */
    const onboardingQueue = useMemo(() => {
        return dashboardData.userProgress
            .map((progress) => {
                const user = userMap.get(
                    Number(progress.user_id)
                );
                const module = moduleMap.get(
                    Number(progress.learn_mod_id)
                );
                if (!user && !progress.first_name) {
                    return null;
                }
                const firstName =
                    user?.first_name ??
                    progress.first_name ??
                    "";
                const lastName =
                    user?.last_name ??
                    progress.last_name ??
                    "";
                const fullName =
                    `${firstName} ${lastName}`.trim();
                return {
                    userId: progress.user_id,
                    name:
                        fullName ||
                        progress.email ||
                        "Unknown User",
                    email:
                        user?.email ??
                        progress.email ??
                        "",
                    position:
                        user?.position ??
                        "—",
                    department:
                        user?.department_name ??
                        module?.department_name ??
                        "—",
                    departmentId:
                        user?.department_id ??
                        module?.department_id ??
                        null,
                    moduleId:
                        progress.learn_mod_id,
                    moduleTitle:
                        progress.module_title ??
                        module?.title ??
                        "—",
                    startDate:
                        progress.started_at,
                    endDate:
                        progress.completed_at,
                    progress:
                        getProgressValue(
                            progress.progress_percentage
                        ),
                    status:
                        progress.status ??
                        "pending",
                    totalTime:
                        progress.total_time_spent_seconds ?? 0,
                };
            })
            .filter(Boolean);
    }, [dashboardData.userProgress, userMap, moduleMap]);
    /*
     * DEPARTMENT FILTER
     */
    const departments = useMemo(() => {
        const values = new Set();

        dashboardData.modules.forEach((module) => {
            if (module.department_name) {
                values.add(module.department_name);
            }
        });
        dashboardData.users.forEach((user) => {
            if (user.department_name) {
                values.add(user.department_name);
            }
        });
        return Array.from(values).sort();
    }, [
        dashboardData.modules,
        dashboardData.users,
    ]);
    const scopedQueue = useMemo(() => {
        if (
            isSuperAdmin &&
            department === "All Departments"
        ) {
            return onboardingQueue;
        }
        return onboardingQueue.filter(
            (row) =>
                row.department === department
        );
    }, [
        onboardingQueue,
        department,
        isSuperAdmin,
    ]);
    /*
     * SEARCH
     */
    const filteredQueue = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return scopedQueue;
        }
        return scopedQueue.filter((row) => {
            return (
                row.name
                    .toLowerCase()
                    .includes(query) ||
                row.email
                    .toLowerCase()
                    .includes(query) ||
                row.position
                    .toLowerCase()
                    .includes(query) ||
                row.department
                    .toLowerCase()
                    .includes(query) ||
                row.moduleTitle
                    .toLowerCase()
                    .includes(query) ||
                row.status
                    .toLowerCase()
                    .includes(query)
            );
        });
    }, [scopedQueue, search]);
    /*
     * PAGINATION
     */
    const totalPages = Math.max(
        1, Math.ceil(
            filteredQueue.length / PAGE_SIZE
        )
    );
    const currentPage = Math.min(
        page, totalPages
    );
    const pageRows = filteredQueue.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );
    useEffect(() => {
        setPage(1);
    }, [search, department]);
    /*
     * SUMMARY
     */
    const summary = useMemo(() => {
        const completed =
            scopedQueue.filter(
                (row) =>
                    String(row.status).toLowerCase() ===
                    "completed"
            ).length;

        const inProgress =
            scopedQueue.filter(
                (row) =>
                    String(row.status).toLowerCase() ===
                    "in_progress" ||
                    String(row.status).toLowerCase() ===
                    "in progress"
            ).length;

        const pending =
            scopedQueue.filter(
                (row) =>
                    String(row.status).toLowerCase() ===
                    "pending"
            ).length;

        const averageProgress =
            scopedQueue.length > 0
                ? Math.round(
                      scopedQueue.reduce(
                          (total, row) =>
                              total + row.progress,
                          0
                      ) / scopedQueue.length
                  )
                : 0;
        return {
            total: scopedQueue.length,
            completed,
            inProgress,
            pending,
            averageProgress,
        };
    }, [scopedQueue]);
    /*
     * EMPLOYEE SPOTLIGHT
     */
    const employeeSpotlight = useMemo(() => {
        if (!scopedQueue.length) {
            return null;
        }
        return [...scopedQueue].sort(
            (a, b) =>
                b.progress - a.progress
        )[0];
    }, [scopedQueue]);
    /*
     * HEADER
     */
    const headerTitle = isSuperAdmin
        ? "Admin Dashboard"
        : `${user.departmentName || "Department"} Dashboard`;
    /*
     * RENDER
     */
    return (
    <div className="admin-shell">

            <main className="admin-main">
        <header className="announce-banner">
                    <div>
                        <h1>{headerTitle}</h1>
                        <p>
                            Monitor onboarding and learning progress.
                        </p>
                        {!isSuperAdmin && (
                            <span className="admin-mode-pill">
                                ADMIN MODE
                            </span>
                        )}

                    </div>

                    <div className="admin-header-right">
                        <div className="admin-search">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                            />
                        </div>
                    </div>
                    <div className="admin-header-actions">
                      <AdminHeaderActions />
                    </div>
                </header>

                {error && (
                    <div className="dashboard-error">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="dashboard-loading">
                        Loading dashboard...
                    </div>
                ) : (
                    <>
                        {/* SUMMARY CARDS */}

                        <section className="dashboard-summary-grid">
                            <div className="dashboard-summary-card">
                                <span>
                                    Learning Progress Records
                                </span>

                                <strong>{summary.total}</strong>
                            </div>

                            <div className="dashboard-summary-card">
                                <span>In Progress</span>

                                <strong>{summary.inProgress}</strong>
                            </div>

                            <div className="dashboard-summary-card">
                                <span>Completed</span>

                                <strong>{summary.completed}</strong>
                            </div>

                            <div className="dashboard-summary-card">
                                <span>Average Progress</span>

                                <strong>{summary.averageProgress}%</strong>
                            </div>
                        </section>

                        {/* ONBOARDING QUEUE */}

                        <section className="dashboard-card onboarding-queue">
                            <div className="dashboard-card-header">
                                <div>
                                    <h2>Onboarding Progress</h2>

                                    <p>
                                        Learning progress from assigned modules.
                                    </p>
                                </div>

                                {isSuperAdmin && (
                                    <select
                                        value={department}
                                        onChange={(event) =>
                                            setDepartment(
                                                event.target.value
                                            )
                                        }
                                    >
                                        <option value="All Departments">
                                            All Departments
                                        </option>

                                        {departments.map(
                                            (dept) => (
                                                <option
                                                    key={dept}
                                                    value={dept}
                                                >
                                                    {dept}
                                                </option>
                                            )
                                        )}
                                    </select>
                                )}
                            </div>

                            <div className="table-wrapper">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Position</th>
                                            <th>Department</th>
                                            <th>Module</th>
                                            <th>Start Date</th>
                                            <th>End Date</th>
                                            <th>Progress</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {pageRows.length ===
                                        0 ? (
                                            <tr>
                                                <td
                                                    colSpan="8"
                                                    className="empty-state"
                                                >
                                                    No learning progress found.
                                                </td>
                                            </tr>
                                        ) : (
                                            pageRows.map(
                                                (row) => (
                                                    <tr
                                                        key={`${row.userId}-${row.moduleId}`}
                                                    >
                                                        <td>
                                                            <strong>
                                                                {row.name}
                                                            </strong>

                                                            <small>
                                                                {row.email}
                                                            </small>
                                                        </td>

                                                        <td>
                                                            {row.position}
                                                        </td>

                                                        <td>
                                                            {row.department}
                                                        </td>

                                                        <td>
                                                            {row.moduleTitle}
                                                        </td>

                                                        <td>
                                                            {formatDate(row.startDate)}
                                                        </td>

                                                        <td>
                                                            {formatDate(row.endDate)}
                                                        </td>

                                                        <td>
                                                            <div className="progress-cell">
                                                                <div className="progress-bar">
                                                                    <div
                                                                        className="progress-bar-fill"
                                                                        style={{
                                                                            width: `${row.progress}%`,
                                                                        }}
                                                                    />
                                                                </div>

                                                                <span>
                                                                    {row.progress}%
                                                                </span>
                                                            </div>
                                                        </td>

                                                        <td>
                                                            <StatusPill
                                                                status={row.status}
                                                            />
                                                        </td>
                                                    </tr>
                                                )
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {filteredQueue.length >
                                PAGE_SIZE && (
                                <div className="pagination">
                                    <button
                                        type="button"
                                        disabled={currentPage === 1}
                                        onClick={() =>
                                            setPage((value) => value - 1)
                                        }
                                    >
                                        Previous
                                    </button>

                                    <span>
                                        Page{" "}
                                        {currentPage} of{" "}
                                        {totalPages}
                                    </span>

                                    <button
                                        type="button"
                                        disabled={
                                            currentPage === totalPages
                                        }
                                        onClick={() =>
                                            setPage((value) => value + 1)
                                        }
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </section>

                        {/* DEPARTMENT SUMMARY */}

                        <section className="dashboard-card">
                            <div className="dashboard-card-header">
                                <div>
                                    <h2>
                                        {department}{" "}
                                        Learning Summary
                                    </h2>

                                    <p>
                                        Summary based on existing
                                        user progress records.
                                    </p>
                                </div>
                            </div>

                            <div className="department-summary-grid">
                                <div>
                                    <span>Progress Records</span>

                                    <strong>{summary.total}</strong>
                                </div>

                                <div>
                                    <span>Pending</span>

                                    <strong>{summary.pending}</strong>
                                </div>

                                <div>
                                    <span>In Progress</span>

                                    <strong>{summary.inProgress}</strong>
                                </div>

                                <div>
                                    <span>Completed</span>

                                    <strong>{summary.completed}</strong>
                                </div>
                            </div>
                        </section>

                        {/* EMPLOYEE SPOTLIGHT */}

                        <section className="dashboard-card employee-spotlight">
                            <div className="dashboard-card-header">
                                <div>
                                    <h2>Employee Spotlight</h2>

                                    <p>
                                        Highest current learning progress.
                                    </p>
                                </div>
                            </div>

                            {!employeeSpotlight ? (
                                <p>
                                    No learning progress available.
                                </p>
                            ) : (
                                <div className="employee-spotlight-content">
                                    <div>
                                        <h3>
                                            {employeeSpotlight.name}
                                        </h3>

                                        <p>
                                            {employeeSpotlight.email}
                                        </p>

                                        <p>
                                            {employeeSpotlight.position}
                                        </p>
                                    </div>

                                    <div>
                                        <strong>
                                            {employeeSpotlight.progress} %
                                        </strong>

                                        <span>
                                            {employeeSpotlight.moduleTitle}
                                        </span>
                                    </div>

                                    <div>
                                        <span>Time Spent</span>

                                        <strong>
                                            {formatDuration(
                                                employeeSpotlight.totalTime
                                            )}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Status</span>

                                        <StatusPill
                                            status={
                                                employeeSpotlight.status
                                            }
                                        />
                                    </div>
                                </div>
                            )}
                        </section>
                    </>
                )}

                <AdminFooter />
            </main>
        </div>
    );
}
