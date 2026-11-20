import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import AdminHeaderActions from "../../auxillary/AdminHeaderActions";
import AdminFooter from "../../auxillary/AdminFooter";

import AddDeptModal from "../../auxillary/department/AddDepartmentModal";
import EditDeptModal from "../../auxillary/department/EditDepartmentModal";

import {
    getDepartments, getDeptUsers, createDept, updateDept, deactivateDept, activateDept
} from "../../services/departmentService";

import "./DeptDashboard.css";
import "../../auxillary/AdminLayout.css"

export default function DeptDashboard() {
    const today = new Date().toLocaleDateString(
        undefined, 
        {weekday: "long", year: "numeric", month: "long", day: "numeric"}
    )
    const { user, token } = useSelector((state) => state.auth);

    // Department states
    const [departments, setDepartments] = useState([]);
    const [selectDepartment, setSelectDepartment] = useState(null);

    // Department users
    const [departmentUsers, setDepartmentUsers] = useState([]);

    // Loading states
    const [loading, setLoading] = useState(true);
    const [usersLoading, setUsersLoading] = useState(false);
    const [processing, setProcessing] = useState(false);

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    // Feedback
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    
    const isSuperAdmin = user?.roleName === "Super admin";

    // fetch all departments
    const fetchDepartments = async (preferredId = null) => {
        try {
            setLoading(true);
            setError("");

            const response = await getDepartments(token);
            const departmentList = response.data || [];

            setDepartments(departmentList);

            // Preserve selected department when refreshed
            const nextDepartment = departmentList.find(
                dept => Number(dept.department_id) === Number(preferredId)
            ) ||
            departmentList.find(dept => dept.is_active) ||
            departmentList[0] ||
            null;
            
        setSelectDepartment(nextDepartment);
        } catch (error) {
            setError(error.message || "Failed to load departments")
        } finally {
            setLoading(false);
        }
    };

    // Fetch users under selected department
    const fetchDepartmentUsers = async (departmentId) => {
        if (!departmentId) { 
            setDepartmentUsers([]);
            return;
        }
        try {
            setUsersLoading(true);
            setError("");

            const response = await getDeptUsers(
                departmentId, token
            );
            setDepartmentUsers(response.data || []);

        } catch (error) {
            setDepartmentUsers([]);
            setError(error.message || "Failed to load department users");
        } finally {
            setUsersLoading(false);
        }
    };

    // Initial Department loading
    useEffect(() => {
        if (token && isSuperAdmin) {
            fetchDepartments();
        }
    }, [token, isSuperAdmin]);

    // Load users whenever selected department changes
    useEffect(() => {
        if (selectDepartment?.department_id) {
            fetchDepartmentUsers(selectDepartment.department_id);
        } else {
            setDepartmentUsers([]);
        }
    }, [selectDepartment?.department_id, token]);

    // Select department
    const handleSelectDepartment = (department) => {
        setSelectDepartment(department);
        setMessage("");
        setError("");
    };

    // Create Department
    const handelCreateDept = async (department) => {
        try {
            setProcessing(true);

            const response = await createDept(
                department, token
            );
            const newDepartment = response.data;
            await fetchDepartments(newDepartment.department_id);

            setShowAddModal(false);
            setMessage("Department created successfully");
        } catch (error) {
            throw error;
        } finally {
            setProcessing(false);
        }
    };

    // Update department
    const handleUpdateDept = async (department) => {
        try {
            setProcessing(true);
            await updateDept(
                selectDepartment.department_id, department, token
            );
            await fetchDepartments(selectDepartment.department_id);

            setShowEditModal(false);
            setMessage("Department update successfully");
        } catch (error) {
            throw error;
        } finally {
            setProcessing(false);
        }
    };

    // Deactivate department
    const handleDeactivateDept = async () => {
        if (!selectDepartment) return;

        const confirmed = window.confirm(
            `Are you sure you want to deactivate "${selectDepartment.department_name}"?`
        );
        if (!confirmed) return;
        try {
            setProcessing(true);
            setError("");

            await deactivateDept(
                selectDepartment.department_id, token
            );
            await fetchDepartments(
                selectDepartment.department_id
            );
            setMessage("Department deactivated successfully");
        } catch (error) {
            setError(error.message || "Failed to deactivate department");
        } finally {
            setProcessing(false);
        }
    }

    // Reactivate department
    const handleActivateDept = async () => {
        if (!selectDepartment) return;

        const confirmed = window.confirm(
            `Reactivate "${selectDepartment.department_name}"?`
        );
        if (!confirmed) return;
        try {
            setProcessing(true);
            setError("");

            await activateDept(
                selectDepartment.department_id, token
            );
            await fetchDepartments(
                selectDepartment.department_id  
            );
            setMessage("Department activated successfully");
        } catch (error) {
            setError(error.message || "Failed to reactivate department");
        } finally {
            setProcessing(false);
        }
    }

    // Access control
    if (!isSuperAdmin) {
        return (
            <div className="department-access-denied">
                <h2>Access Denied</h2>
                <p>Only super admi can manage departments</p>
            </div>
        );
    }

    // dashboard
    return (
        <div className="admin-shell">
            <main className="admin-main">
                <header className="announce-banner">
                    <div>
                        <h1>Department Management</h1>
                        <p>Manage department and their assigned employees</p>
                    </div>

                    <div className="admin-header-actions">
                        <AdminHeaderActions/>
                    </div>
                </header>

                <div className="announce-body">
                    <div className="admin-sidebar-page">
                    {/* Feedback */}
                        {message && (
                            <div className="department-success-message">
                                {message}
                            </div>
                        )}

                        {error && (
                            <div className="department-error-message">
                                {error}
                            </div>
                        )}

                        <div className="admin-modules-heading">
                            <div>
                                <span className="date-btn-like">{today}</span>
                            </div>

                            <button className="date-btn-like"
                                onClick={() => {
                                    setMessage("");
                                    setError("");
                                    setShowAddModal(true);
                                }}
                            >
                                + Add Department
                            </button>
                        </div>


                        {/* Summary */}
                        <div className="department-summary">
                            <div className="department-summary-card">
                                <span>Total Departments</span>
                                <h2>{departments.length}</h2>
                            </div>

                            <div className="department-summary-card">
                                <span>Active Departments</span>
                                <h2>
                                    {departments.filter(
                                        dept => dept.is_active  
                                    ).length}
                                </h2>
                            </div>

                            <div className="department-summary-card">
                                <span>Inactive Departments</span>
                                <h2>
                                    {departments.filter(
                                        dept => !dept.is_active  
                                    ).length}
                                </h2>
                            </div>
                        </div>

                        <div className="department-content">
                            <section className="department-list-panel">
                                <div className="department-panel-header">
                                    <h2>Departments</h2>
                                    <span>{departments.length}</span>
                                </div>
                                {loading ? (
                                    <p className="department-empty">
                                        Loading departments...
                                    </p>    
                                ) : departments.length === 0 ? (
                                    <p className="department-empty">
                                        No departments found
                                    </p>
                                ) : (
                                    <div className="department-list">
                                        {departments.map((department) => (
                                            <button type="button"
                                                key={department.department_id}
                                                className={`department-list-item ${
                                                    Number(selectDepartment?.department_id) ===
                                                    Number(department.department_id)
                                                        ? "selected" 
                                                        : ""
                                                }`}
                                                onClick={() => 
                                                    handleSelectDepartment(department)
                                                }
                                            >
                                                <div className="department-list-info">
                                                    <strong>
                                                        {department.department_name}
                                                    </strong>

                                                    <span>
                                                        {department.is_active
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </span>
                                                </div>

                                                <span className="department-arrow">
                                                    {/* &rsaquo; */}
                                                    &raquo;
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </section>

                            {/* Selected Department Details */}
                            <section className="department-details-panel">
                                {!selectDepartment ? (
                                    <div className="department-empty">
                                        <h3>Select a Department</h3>
                                        <p>Select a department to view its employees</p>
                                    </div>    
                                ) : (
                                    <>
                                        {/* Department information */}
                                        <div className="department-details-header">
                                            <div>
                                                <div className="department-title-row">
                                                    <h2>{selectDepartment.department_name}</h2>

                                                    <span className={
                                                        selectDepartment.is_active
                                                            ? "department-status active"
                                                            : "department-status inactive"
                                                    }>
                                                        {selectDepartment.is_active
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </span>
                                                </div>

                                                <p>
                                                    {selectDepartment.is_active ||
                                                        "No department description available"}
                                                </p>
                                            </div>

                                            <div className="department-actions">
                                                <button type="button"
                                                    className="department-edit-btn"
                                                    onClick={() => {
                                                        setMessage("");
                                                        setError("");
                                                        setShowEditModal(true);
                                                    }}
                                                    disabled={processing}
                                                >
                                                    Edit
                                                </button>

                                                {selectDepartment.is_active ? (
                                                    <button type="button"
                                                        className="department-deactivate-btn"
                                                        onClick={handleDeactivateDept}
                                                        disabled={processing}
                                                    >
                                                        {processing
                                                            ? "Processing..."
                                                            : "Deactivate"}
                                                    </button>
                                                ) : (
                                                    <button type="button"
                                                        className="department-activate-btn"
                                                        onClick={handleActivateDept}
                                                        disabled={processing}
                                                    >
                                                        {processing
                                                            ? "Processing..."
                                                            : "Reactivate"}
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* User count */}
                                        <div className="department-user-heading">
                                            <div>
                                                <h3>Department Employees</h3>
                                                <p>Users assigned</p>
                                            </div>

                                            <strong>{departmentUsers.length} Users</strong>
                                        </div>

                                        {/* Users table */}
                                        <div className="department-table-wrapper">
                                            {usersLoading ? (
                                                <p className="department-empty">
                                                    Loading employees...
                                                </p>
                                            ) : departmentUsers.length === 0 ? (
                                                <p className="department-empty">
                                                    No employees assigned to this department
                                                </p>
                                            ) : (
                                                <table className="department-users-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Employee no.</th>
                                                            <th>Name</th>
                                                            <th>Email</th>
                                                            <th>Position</th>
                                                            <th>Role</th>
                                                            <th>Status</th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        {departmentUsers.map((employee) =>(
                                                            <tr key={employee.user_id}>
                                                                <td>{employee.employee_number}</td>
                                                                <td>
                                                                    {employee.first_name}
                                                                    {employee.last_name}
                                                                </td>
                                                                <td>{employee.email}</td>
                                                                <td>{employee.position}</td>
                                                                <td>{employee.role_name}</td>
                                                                <td>
                                                                    <span className={
                                                                        employee.is_active
                                                                            ? "department-user-active"
                                                                            : "department-user_inactive"
                                                                    }>
                                                                        {employee.is_active
                                                                            ? "Active"
                                                                            : "Inactive"}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            )}
                                        </div>
                                    </>
                                )}
                            </section>
                        </div>
                    </div>
                </div>


                <AdminFooter/>
            </main>

            {/* Add department modal */}
            {showAddModal && (
                <AddDeptModal
                    onClose={() => setShowAddModal(false)}
                    onSave={handelCreateDept}
                />   
            )}

            {/* Edit department modal */}
            {showEditModal && selectDepartment && (
                <EditDeptModal
                    initial={selectDepartment}
                    onClose={() => setShowEditModal(false)}
                    onSave={handleUpdateDept}
                />
            )}
        </div>
    );
}