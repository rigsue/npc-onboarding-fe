import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import AdminHeaderActions from "../components/AdminHeaderActions";
import AdminFooter from "../components/AdminFooter";

import { getAdminDashboardData } from "../services/dashboardService";

import "../components/AdminLayout.css";
import "./AdminDashboard.css";

const PAGE_SIZE = 7;

/* * STATUS */
function StatusPill({ status }) {
  const normalizedStatus = String(status || "").toLowerCase().replaceAll("_", "-");

  const labels = {
      upcoming: "UPCOMING",
      "in-progress": "IN PROGRESS",
      completed: "COMPLETED",
      overdue: "OVERDUE",
      pending: "PENDING",
  };

  return (
    <span
      className={`status-pill status-${normalizedStatus}`}
    >
      {labels[normalizedStatus] || normalizedStatus.toUpperCase() || "UNKNOWN"}
    </span>
  );
}

/*   * ICONS   */

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect
        x="2"
        y="4"
        width="20"
        height="16"
        rx="2"
      />
      <path d="M2 6l10 7 10-7" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L8.1 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.9 2.2z" />
    </svg>
  );
}

/*   *  HELPERS   */
function formatDate(value) {if (!value) {return "—";}

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {return "—";}

    return date.toLocaleDateString();
}

function formatDuration(seconds) {
    if (!seconds || seconds <= 0) {return "0m";}

    const totalMinutes = Math.floor(seconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {return `${hours}h ${minutes}m`;}

    return `${minutes}m`;
}

function getProgressValue(value) {
    const number = Number(value);

    if (Number.isNaN(number)) {return 0;}

    return Math.min(100, Math.max(0, number));
}

/*   *  DASHBOARD   */

export default function AdminDashboard() {
    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);

    const isSuperAdmin = user?.roleName === "Super admin";

    /*   *  DASHBOARD DATA   */

    const [dashboardData, setDashboardData] = useState({
        users: [],
        modules: [],
        userProgress: [],
        exams: [],
        examAttempts: [],
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

      /*   *   UI STATE   */

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const [department, setDepartment] = useState(
        isSuperAdmin ? "All Departments" : user?.departmentName || ""
    );

    const [deptOpen, setDeptOpen] = useState(false);

    /*    *  LOAD DASHBOARD DATA  */

    useEffect(() => {
        let cancelled = false;

        async function loadDashboard() {
            if (!token) {setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const data =
                    await getAdminDashboardData(token);

                if (!cancelled) {
                    setDashboardData(data);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err?.message || "Unable to load dashboard data."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadDashboard();

        return () => {cancelled = true;};
    }, [token]);

    /*   *  MODULE LOOKUP   */

    const moduleMap = useMemo(() => {
        const map = new Map();

        dashboardData.modules.forEach((module) => {
            map.set(
                Number(module.learn_mod_id), module
            );
        });

        return map;
    }, [dashboardData.modules]);

    /*   *   USER LOOKUP  */

    const userMap = useMemo(() => {
        const map = new Map();

        dashboardData.users.forEach((user) => {
            map.set(Number(user.user_id), user);
        });

        return map;
    }, [dashboardData.users]);

    /*     *   COMBINE USER + MODULE + PROGRESS  */
    const onboardingQueue = useMemo(() => {
      return dashboardData.userProgress
        .map((progress) => {
          const currentUser = userMap.get(Number(progress.user_id));

          const module = moduleMap.get(Number(progress.learn_mod_id));

          if (!currentUser && !progress.first_name) {
              return null;
          }

          const firstName = currentUser?.first_name ?? progress.first_name ?? "";

          const lastName = currentUser?.last_name ?? progress.last_name ?? "";

          const fullName = `${firstName} ${lastName}`.trim();

          return {userId: progress.user_id,

            name: fullName || progress.email || "Unknown User",

            email: currentUser?.email ?? progress.email ?? "",

            position: currentUser?.position ?? "—",

            department: currentUser?.department_name ?? module?.department_name ?? "—",

            departmentId: currentUser?.department_id ?? module?.department_id ?? null,

            moduleId: progress.learn_mod_id,

            moduleTitle: progress.module_title ?? module?.title ?? "—",

            startDate: progress.started_at,

            endDate: progress.completed_at,

            progress: getProgressValue(progress.progress_percentage),

            status: progress.status ?? "pending",

            totalTime: progress.total_time_spent_seconds ?? 0,
            };
          })
          .filter(Boolean);
    }, [
        dashboardData.userProgress, userMap, moduleMap,
    ]);

    /*  *  DEPARTMENTS   */

    const departments = useMemo(() => {
      const values = new Set();

      dashboardData.modules.forEach(
          (module) => {if (module.department_name) {
            values.add(module.department_name);
          }
        }
      );

      dashboardData.users.forEach((user) => {
        if (user.department_name) {
            values.add(user.department_name);
          }
      });

        return Array.from(values).sort();
    }, [
        dashboardData.modules, dashboardData.users,
    ]);

    /*    *   DEPARTMENT FILTER   */

    const scopedQueue = useMemo(() => {
        if (isSuperAdmin && department === "All Departments") {
            return onboardingQueue;
        }

        return onboardingQueue.filter((row) => row.department === department);
    }, [
        onboardingQueue, department, isSuperAdmin,
    ]);

    /*    *   SEARCH    */

    const filtered = useMemo(() => {
      const query = search.trim().toLowerCase();

      if (!query) {return scopedQueue;}

      return scopedQueue.filter((row) => {
          return [
              row.name,
              row.email,
              row.position,
              row.department,
              row.moduleTitle,
              row.status,
          ].some((field) => String(field || "").toLowerCase().includes(query)
          );
      });
    }, [search, scopedQueue]);

    /*    *   PAGINATION    */

    const totalPages = Math.max(1, Math.ceil( filtered.length / PAGE_SIZE));

    const safePage = Math.min(page, totalPages);

    const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

    const rangeStart = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;

    const rangeEnd = Math.min(safePage * PAGE_SIZE, filtered.length);

    /*    *   RESET PAGE    */

    useEffect(() => {
        setPage(1);
    }, [search, department]);

    /*    *   SUMMARY   */

    const summary = useMemo(() => {
      const completed =
        scopedQueue.filter((row) => String(row.status).toLowerCase() === "completed").length;

      const inProgress = scopedQueue.filter((row) => {
        const status = String(row.status).toLowerCase();

        return (
            status === "in_progress" || status === "in-progress" || status === "in progress"
        );
      }).length;

      const pending = scopedQueue.filter((row) =>
        String(row.status).toLowerCase() === "pending").length;

        const averageProgress =
            scopedQueue.length > 0 ? Math.round(scopedQueue.reduce(
                          (total, row) => total + row.progress, 0
                      ) / scopedQueue.length
                  ) : 0;
        return {
            total: scopedQueue.length,
            completed,
            inProgress,
            pending,
            averageProgress,
        };
    }, [scopedQueue]);

    /*    *    EMPLOYEE SPOTLIGHT  * *  Highest current progress   */
    const employeeSpotlight = useMemo(() => {
      if (!scopedQueue.length) {return null;}

      return [...scopedQueue].sort(
        (a, b) => b.progress - a.progress
      )[0];
    }, [scopedQueue]);

    /*     *    CURRENT DATE     */
    const today =
        new Date().toLocaleDateString(
            undefined,
            {weekday: "long", year: "numeric", month: "long", day: "numeric"}
        );

    /*     *    HEADER    */
    const headerTitle = isSuperAdmin
        ? "Admin Dashboard" : `${user?.departmentName || "Department"} Dashboard`;

    /*     *    IN-PROGRESS COUNT    */
    const stillInProgressCount =
      scopedQueue.filter((row) => {
        const status = String(row.status).toLowerCase();

        return (status !== "completed");
      }).length;

    /*     *     RENDER   */

    return (
      <div className="admin-shell">
        <main className="admin-main">

          {/* HEADER */}
          <header className="admin-header">
            <div>
              <div className="admin-header-title-row">

                <h1>{headerTitle}</h1>

                {!isSuperAdmin && (
                  <span className="admin-mode-pill">

                    <svg viewBox="0 0 24 24"
                      width="11"
                      height="11"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="4" y="10" width="16" height="10" rx="2"/>
                      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                    </svg>

                    ADMIN MODE
                  </span>
                )}

              </div>

              <p className="admin-date">{today}</p>
            </div>

            <div className="admin-header-actions">
              <div className="admin-search">
                <SearchIcon />

                  <input type="text"
                    placeholder="Search department, roles etc"
                    value={search}
                    onChange={(event) => {setSearch(event.target.value);
                        setPage(1);
                    }}
                  />
              </div>
              <AdminHeaderActions />
            </div>
          </header>

          {/* ERROR */}
          {error && (
              <div className="dashboard-error">{error}</div>
          )}

          {/* LOADING */}
          {loading ? (
              <div className="dashboard-loading">Loading dashboard...</div>
          ) : (
              <>
                {/* ALERT */}
                {stillInProgressCount >
                  0 && (
                  <div className="admin-alert">

                    <WarningIcon />
                    <span>
                      <strong>
                        {stillInProgressCount}{" "}
                        Employee
                        {stillInProgressCount === 1 ? "" : "s"}{" "}
                        Onboarding
                      </strong>{" "}
                      {stillInProgressCount === 1 ? "is" : "are"}{" "}
                      still in progress.
                    </span>
                    <a
                      href="#"
                      className="admin-alert-link"
                      onClick={(event) => event.preventDefault()}
                    >
                      Review now →
                    </a>

                  </div>
                )}

                {/* BODY */}
                <div className="admin-body">

                  {/* MAIN QUEUE */}
                  <section className="admin-queue">
                    <div className="admin-queue-head">
                        <div>
                            <h2>Onboarding queue
                            </h2>
                            <p>Learning progress from assigned modules.
                            </p>
                        </div>

                        <div className="admin-queue-search">
                          <SearchIcon />

                          <input
                            type="text"
                            placeholder="Search Onboarding Employees, Status, etc"
                            value={search}
                            onChange={(event) => {setSearch(event.target.value);
                              setPage(1);
                            }}
                          />
                        </div>
                    </div>

                    <div className="admin-table-wrap">

                      <table className="admin-table">

                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Position</th>
                            <th>Current Department</th>
                            <th>Module</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Module Progress</th>
                            <th>Status</th>
                          </tr>
                        </thead>

                        <tbody>

                          {pageRows.map(
                            (row) => (
                              <tr
                                key={`${row.userId}-${row.moduleId}`}
                              >
                                <td>
                                  <div className="admin-row-name">
                                    {row.name}
                                  </div>
                                </td>

                                <td>
                                  <strong className="admin-row-email">
                                  {row.email}
                                  </strong>
                                </td>

                                <td>{row.position}</td>

                                <td>{row.department}</td>

                                <td>{row.moduleTitle}</td>

                                <td>{formatDate(row.startDate)}</td>

                                <td>{formatDate(row.endDate)}</td>

                                <td>
                                  <div className="admin-progress">
                                    <div className="admin-progress-track">
                                      <div
                                          className="admin-progress-fill"
                                          style={{width:`${row.progress}%`}}
                                      />
                                    </div>

                                    <span>{row.progress}%</span>
                                  </div>
                                </td>

                                <td><StatusPill status={row.status}/></td>
                              </tr>
                            )
                        )}

                          {pageRows.length ===
                            0 && (
                              <tr>
                                <td colSpan={9}className="admin-table-empty">
                                    No employees match "{search}".
                                </td>
                              </tr>
                            )}
                        </tbody>
                      </table>
                    </div>

                    {/* PAGINATION */}
                    <div className="admin-pagination">
                      <span>
                        {filtered.length === 0 ? "No results"
                          : `Showing ${rangeStart}-${rangeEnd} of ${filtered.length} Users`}
                      </span>

                      <div className="admin-page-btns">
                        <button type="button" onClick={() =>
                            setPage((current) => Math.max(1, current - 1))
                          }
                          disabled={safePage === 1}
                          aria-label="Previous page"
                      >
                        
                        </button>
                        {Array.from(
                          {length: totalPages,},
                          (_, index) =>
                              index + 1).map(
                          (pageNumber) => (
                            <button
                              key={pageNumber}
                                  type="button"
                                  className={pageNumber === safePage
                                          ? "active" : ""
                                  }
                                  onClick={() => setPage(pageNumber)}
                              >
                                  {pageNumber}
                              </button>
                              )
                            )}

                            <button
                              type="button"
                              onClick={() =>
                                setPage(
                                  (current) => Math.min(totalPages, current + 1)
                                  )
                                }
                              disabled={safePage === totalPages}
                              aria-label="Next page"
                            >
                            </button>
                        </div>
                    </div>
                  </section>

                  {/* RIGHT SIDE */}
                  <aside className="admin-side">

                    {/* DEPARTMENT SUMMARY */}
                    <div className="admin-card">
                      <div className="admin-card-head">
                        <h3>
                          {department || "Department"}{" "}
                          Onboarding Summary
                        </h3>

                        {isSuperAdmin && (
                          <button
                            type="button"
                            className="admin-dept-toggle"
                            onClick={() => setDeptOpen((value) => !value)}
                            aria-haspopup="true"
                            aria-expanded={deptOpen}
                          >
                            <svg viewBox="0 0 24 24"
                              width="16"
                              height="16"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </button>
                          )}

                          {isSuperAdmin &&
                            deptOpen && (
                              <div className="admin-dept-menu">
                                <button
                                  type="button"
                                  className={department === "All Departments" ? "active" : ""}
                                        onClick={() => {
                                            setDepartment("All Departments");
                                            setDeptOpen(false);
                                        }}
                                    >
                                        All Departments
                                    </button>

                                    {departments.map(
                                      (dept) => (
                                        <button key={dept }
                                          type="button"
                                          className={dept === department ? "active" : ""}
                                            onClick={() => {
                                                setDepartment(dept);
                                                setDeptOpen(false);
                                            }}
                                        >
                                          {dept}{" "}
                                        </button>
                                        )
                                      )}
                                </div>
                              )}
                      </div>

                      <ul className="admin-summary-list">
                          <li>
                            <span>Progress Records</span>

                              <span className="admin-summary-count">
                                {summary.total}
                              </span>
                          </li>

                          <li>
                              <span>Pending</span>

                              <span className="admin-summary-count">
                                {summary.pending}
                              </span>
                          </li>

                          <li>
                              <span>In Progress</span>

                              <span className="admin-summary-count">
                                {summary.inProgress}
                              </span>
                          </li>

                      </ul>

                      <div className="admin-overdue">
                        <span>Completed</span>

                        <span className="admin-overdue-count">
                          {summary.completed}
                          </span>
                      </div>
                    </div>

                    {/* EMPLOYEE SPOTLIGHT */}
                    <div className="admin-spotlight-card">

                      {!employeeSpotlight ? (
                        <p>No learning progress available.</p>
                      ) : (
                        <>
                          <div className="admin-spotlight-head">
                            <div className="admin-spotlight-avatar">
                                <svg viewBox="0 0 24 24"
                                  width="26"
                                  height="26"
                                  fill="currentColor"
                                >
                                  <circle cx="12" cy="8" r="4"/>

                                  <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                                </svg>
                            </div>

                            <div>
                              <p className="admin-spotlight-name">
                                {employeeSpotlight.name}{" "}

                                <StatusPill status={employeeSpotlight.status} />
                              </p>

                              <p className="admin-spotlight-contact">
                                  <MailIcon />
                                  {employeeSpotlight.email}
                              </p>

                              <p className="admin-spotlight-contact">
                                  {employeeSpotlight.position}
                              </p>

                              <p className="admin-spotlight-contact">
                                  <PhoneIcon />
                                  {user?.contactNumber || "—"}
                              </p>
                            </div>
                          </div>

                          <div className="admin-progress-label-bar">Onboarding Progress</div>

                          {/* LEARNING MODULE PROGRESS */}
                          <div className="admin-onboard-stat">
                            <p className="admin-onboard-stat-label">Learning Modules</p>

                            <div className="admin-onboard-stat-row">
                              <div className="admin-onboard-segbar">

                                {[1, 1, 1, 0, 0, 0].map(
                                  (filled, index) => (
                                    <span key={index} className={`admin-seg${filled ? " filled" : ""}`} />
                                  )
                                )}

                              </div>

                              <span className="admin-onboard-pct">{employeeSpotlight.progress}%</span>
                            </div>
                          </div>

                          {/* ASSESSMENT */}
                          <div className="admin-onboard-stat">
                            <p className="admin-onboard-stat-label">Assessment / Quiz</p>

                            <div className="admin-onboard-stat-row">
                              <div className="admin-onboard-segbar">
                                {[1, 1, 0, 0, 0, 0].map(
                                  (filled, index) => (
                                    <span key={index}
                                      className={`admin-seg${filled ? " filled" : ""}`}
                                    />
                                  )
                                )}
                              </div>

                              <span className="admin-onboard-pct">
                                {dashboardData.examAttempts.length}{" "}attempts
                              </span>
                            </div>
                          </div>

                          {/* TIME SPENT */}
                          <p className="admin-certs">
                            Time Spent:{" "}
                            <span>{formatDuration(employeeSpotlight.totalTime)}</span>
                          </p>
                        </>
                      )}
                    </div>
                  </aside>
                </div>
              </>
          )}
          <AdminFooter />
        </main>
      </div>
    );
}
