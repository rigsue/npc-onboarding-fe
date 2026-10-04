import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// import AdminSidebar from "../components/AdminSidebar";
import AdminHeaderActions from "../components/AdminHeaderActions";
import AdminFooter from "../components/AdminFooter";

import AddUserModal from "../components/users/AddUserModal";
import EditUserModal from "../components/users/EditUserModal";

import { useToast } from "../context/ToastContext";

import {
  getUsers,
  registerUser,
  updateUser,
  deactivateUser,
  activateUser,
} from "../services/userService";

import { getDepartments } from "../services/departmentService";
import { getRoles } from "../services/roleService";

import "../components/AdminLayout.css";
import "./SuperAdminDB.css";

export default function SuperAdminDashboard() {
  const token = useSelector((state) => state.auth.token);
  const currentUser = useSelector((state) => state.auth.user);

  const { showToast } = useToast();

  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [addOpen, setAddOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // GET USERS
  const fetchUsers = async () => {
    if (!token) return;

    try {
      setLoading(true);

      const response = await getUsers(token);

      setUsers(response.data ?? []);
      setError(null);

    } catch (err) {
      console.error("Error fetching users:", err);

      setError("Unable to load user accounts.");

      showToast?.(
        err.message,
        "showToast error here"
      );
    } finally {
      setLoading(false);
    }
  };

  // GET DEPARTMENTS
  const fetchDepartments = async () => {
    if (!token) return;

    try {
      const response = await getDepartments(token);

      setDepartments(response.data ?? []);

    } catch (err) {
      console.error( "Error fetching departments:", err);

      showToast?.( err.message, "showToast error here" );
    }
  };

  // GET ROLES
  const fetchRoles = async () => {
    if (!token) return;

    try {
      const response = await getRoles(token);

      setRoles(response.data ?? []);

    } catch (err) {
      console.error(
        "Error fetching roles:",
        err
      );
      showToast?.(err.message, "showToast error here");
    }
  };

  // INITIAL DATA LOAD
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetchUsers();
    fetchDepartments();
    fetchRoles();
  }, [token]);

  // CREATE USER
  const handleCreateUser = async (userData) => {
    try {
      const response = await registerUser(
        token, userData
      );
      console.log("Create user response:", response);

      showToast("Account created");

      await fetchUsers();

      setAddOpen(false);

    } catch (err) {
      console.error( "Error creating user:", err);

      showToast?.(err.message, "showToast error here");
    }
  };

  // UPDATE USER
  const handleSaveEdit = async (userData) => {
    try {
      const response = await updateUser(
        token, userData.userId,
        {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          contactNumber: userData.contactNumber,
          employeeNumber: userData.employeeNumber,
          position: userData.position,
          roleId: userData.roleId,
          departmentId: userData.departmentId,
          updatedBy: currentUser?.userId,
        }
      );
      console.log("Update user response:", response);

      showToast("Account updated successfully");

      await fetchUsers();

      setEditingUser(null);

    } catch (err) {
      console.error("Error updating user:", err);

      showToast?.(err.message, "showToast error here");
    }
  };

  // ACTIVATE / DEACTIVATE USER
  const handleToggleStatus = async (
    userId, isActive
  ) => {
    try {
      if (isActive) {

        await deactivateUser(
          token, userId
        );
        showToast("User deactivated successfully");

      } else {
        await activateUser(
          token, userId
        );
        showToast("User activated successfully");
      }
      await fetchUsers();

    } catch (err) {
      console.error("Error changing user status:", err);

      showToast?.( err.message, "showToast error here");
    }
  };

  // RENDER
  return (
    <div className="admin-shell">
      {/* <AdminSidebar active="users" /> */}
      <div className="admin-main">
        <header className="announce-banner">
          <div>
            <h1>User Accounts</h1>
            <p>
              Create and manage Local User and
              Admin User accounts for your
              organization.
            </p>
          </div>

          <div className="admin-header-actions">
            <AdminHeaderActions />
          </div>

        </header>
        <div className="users-body">
          <div className="announce-toolbar">
            <span className="announce-date-pill">
              {users.length} total accounts
            </span>
            <button
              type="button"
              className="announce-new-btn"
              onClick={() => setAddOpen(true)}
            >
              + Add User
            </button>
          </div>

          <section className="users-table-card">
            <table className="users-simple-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Employee Number</th>
                  <th>Contact Number</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Position</th>
                  <th>Department</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>

                {loading ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="admin-table-empty"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="admin-table-empty"
                    >
                      {error}
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="admin-table-empty"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.user_id}>

                      <td>{user.first_name}{" "}{user.last_name}</td>

                      <td>{user.email}</td>

                      <td>{user.employee_number}</td>

                      <td>{user.contact_number}</td>

                      <td>{user.role_name}</td>

                      <td>{user.is_active ? "Active" : "Inactive"}</td>

                      <td>{user.position}</td>

                      <td>{user.department_name}</td>

                      <td>
                        <div className="announce-card-actions users-row-actions">
                          <button
                            type="button"
                            aria-label="Edit"
                            onClick={() => setEditingUser(user)}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              width="15"
                              height="15"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                            >
                              <path d="M12 20h9" />
                              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
                            </svg>
                          </button>

                          <button
                            type="button"
                            className={
                              user.is_active
                                ? "status-toggle active" : "status-toggle inactive"
                            }
                            aria-label={
                              user.is_active ? "Deactivate" : "Activate"
                            }
                            title={
                              user.is_active ? "Deactivate user" : "Activate user"
                            }
                            onClick={() =>
                              handleToggleStatus(
                                user.user_id, user.is_active
                              )
                            }
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
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
        </div>
        <AdminFooter />
      </div>

      {/* ADD USER */}
      {addOpen && (
        <AddUserModal
          roles={roles}
          departments={departments}
          onClose={() => setAddOpen(false)}
          onSubmit={handleCreateUser}
        />
      )}

      {/* EDIT USER */}
      {editingUser && (
        <EditUserModal
          initial={editingUser}
          roles={roles}
          departments={departments}
          onClose={() => setEditingUser(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}