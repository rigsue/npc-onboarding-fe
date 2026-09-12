import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { useToast } from '../context/ToastContext';
import AdminHeaderActions from "../components/AdminHeaderActions";
import AdminFooter from "../components/AdminFooter";
import { getUsers, registerUser } from "../services/userService";
import { getDepartments } from "../services/departmentService";
import { getRoles } from "../services/roleService";
import "../components/AdminLayout.css";
import "./AdminUsers.css";
import { useSelector } from "react-redux";

// const ROLES = ["Local User", "Admin"];

/* const StatusBadge = ({ status }) => {
  return (
    <span>
      {status ? "Active" : "Inactive"}
    </span>
    );
}
 */
function EditUserModal({ initial, onClose, onSave }) {
/*   const [name, setName] = useState(
    `${initial.first_name || "no FN"} ${initial.last_name || "no LN"}`.trim()
  ); */
  const [first_name, setFirstName] = useState(initial.first_name || "no mail");
  const [last_name, setLastName] = useState(initial.last_name || "no mail");
  const [email, setEmail] = useState(initial.email || "no mail");
  const [contact, setContact] = useState(initial.contact || "no CN");
  const [role_name, setRole] = useState(initial.role || "Local User");
  const [department_name, setDepartment] = useState(initial.department || "no dept");
  const [status, setStatus] = useState(initial.status || "no data");

  const handleSave = () => {
    if (!first_name.trim() || !last_name.trim() || !email.trim()) return;

    onSave({ 
      user_id: initial.user_id,
      first_name: first_name.trim(), 
      last_name: last_name.trim(), 
      email: email.trim(), 
      contact: contact.trim(), 
      role_name: role_name.trim(), 
      department_name: department_name.trim(), 
      // status: status.trim() ,
    });
  };

  return (
    <div className="materials-modal-overlay" onClick={onClose}>
      <div 
        className="materials-modal-box" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="materials-modal-head">
          <h2>EDIT ACCOUNT</h2>
          <button 
            type="button" 
            className="materials-modal-close" 
            aria-label="Close" 
            onClick={onClose}
          >
            &times;
          </button>
        </div>
          {/* this is for the overlay forms  */}
        <div className="materials-modal-body">
          <label className="materials-field">
            <span className="materials-field-label">First Name</span>
            <input type="text" value={first_name} onChange={(e) => setFirstName(e.target.value)} />
          </label>
                    
          <label className="materials-field">
            <span className="materials-field-label">First Name</span>
            <input type="text" value={last_name} onChange={(e) => setLastName(e.target.value)} />
          </label>

          <label className="materials-field">
            <span className="materials-field-label">Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>

          <label className="materials-field">
            <span className="materials-field-label">Contact number</span>
            <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} />
          </label>

          <div className="materials-field-row">
            <label className="materials-field">
              <span className="materials-field-label">Role</span>
              <select value={role_name} onChange={(e) => setRole(e.target.value)}>
              </select>
            </label>
            <label className="materials-field">
              <span className="materials-field-label">Department</span>
              <select value={department_name} onChange={(e) => setDepartment(e.target.value)}>
              </select>
            </label>
          </div>

          <label className="materials-field">
            <span className="materials-field-label">Status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="active">Active</option>
              <option value="pending">Pending Invite</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
        </div>

        <div className="materials-modal-footer">
          <span className="materials-file-count">
            Role and department changes take effect immediately.
          </span>

          <div className="materials-modal-footer-btns">
            <button 
              type="button" 
              className="materials-cancel-btn" 
              onClick={onClose}>
              Cancel
            </button>
            <button 
              type="button" 
              className="materials-primary-btn" 
              onClick={handleSave} 
              disabled={!first_name.trim() || !last_name.trim() || !email.trim()}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuperAdminDashboard() {
  const token = useSelector((state) => state.auth.token);

  const { showToast } = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingUser, setEditingUser] = useState(null);
  const [addOpen, setAddOpen] = useState(false);

  // Add-account form state
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const [role, setRole] = useState("");
  const [roles, setRoles] = useState([]);
  const [accessMode, setAccessMode] = useState('invite'); // 'invite' | 'password'
  const [password, setPassword] = useState("");

  useEffect(() => {
    async function fetchUsers() {

      // console.log("Redux token:", token);

      if (!token) {
        // console.log("Not auth token avail");
        setLoading(false);
        return;
      }

      try {
        // console.log("calling getUsers()...");

        const data = await getUsers(token);

        // console.log("Data received from userServices:", data);

        setUsers(data.data);
      } catch (err) {
        
        // console.error("Error fetching users:", error);

        setError("Unable to load user accounts.");

        showToast?.(error.message, "showToast error here");
        // setUsers([]);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [token]);

  useEffect(() => {
    async function fetchDepartments() {
      if (!token) {
        return;
      }
      try {
        console.log("calling getDepartments?...");

        const data = await getDepartments(token);

        console.log("Departments received:", data);

        setDepartments(data.data);

      } catch (err) {
        console.error("Error fetching departments:", err)
        setError("Unable to load user accounts.");

        showToast?.(err.message, "showToast error here");
      } 
    };
    fetchDepartments();
  }, [token]);

  useEffect(() => {
    async function fetchRoles() {
      if (!token) {
        return;
      }
      try {
        console.log("calling getRoles?...");

        const data = await getRoles(token);

        console.log("Roles received:", data);

        setRoles(data.data);

      } catch (err) {
        console.error("Error fetching roles:", err)
        setError("Unable to load user roles.");

        showToast?.(err.message, "showToast error here");
      } 
    };
    fetchRoles();
  }, [token]);

  const canSubmit =
   first_name.trim() && 
   last_name.trim() && 
   email.trim() && 
   contact.trim() && 
   role && 
   department && 
   (accessMode === 'invite' || password.trim());

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setContact("");
    setRole("");
    setDepartment("");
    setAccessMode("invite");
    setPassword("");
  };

  const closeAdd = () => {
    resetForm();
    setAddOpen(false);
  };

  const handleSend = async () => {
    if (!canSubmit) {
      console.log("Form unable to submit")
      return;
    }
    const userData = {
      firstName: first_name.trim(),
      lastName: last_name.trim(),
      email: email.trim(),
      contactNumber: contact.trim(),
      roleId: Number(role),
      departmentId: Number(department),
      password: password.trim(),
    };

    console.log("Data sending to backend");
    console.log(userData);
    console.log("JWT token:", token);

try {
  const response = await registerUser(token, userData);
  console.log("backend response:", response);
  showToast("Account created");

    const updatedUsers = await getUsers(token);
    setUsers(updatedUsers.data);

    closeAdd(); 

    } catch(err) {
      console.error("error creating user:", err);
      showToast?.(err.message, "showToast error here");
    }
  };

  const handleDelete = (userId) => {
    setUsers((prev) => 
      prev.filter((u) => u.user_id !== userId)
    );
    showToast('Account deleted');
  };
    
  const handleSaveEdit = (data) => {
    setUsers((prev) => 
      prev.map((u) => 
        u.user_id === data.user_id 
          ? { 
            ...u, 
            email: data.email,
            contact: data.contact,
            role: data.role,
            department: data.department,
            status: data.status,
            } 
          : u
        )
      );

    showToast('Account updated');
    setEditingUser(null);
  };

  return (
    <div className="admin-shell">
      <AdminSidebar active="users" />

      <div className="admin-main">
        <header className="announce-banner">
          <div>
            <h1>User Accounts</h1>
            <p>
              Create and manage Local User and Admin User 
              accounts for your organization.
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
            >+ 
              Add User
            </button>
          </div>

          <section className="users-table-card">
            <table className="users-simple-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Contact number</th>
                  <th>Roles</th>
                  <th>Status</th>
                  <th>Department</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="admin-table-emppty"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="admin-table-empty"
                    >
                      {error}
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="admin-table-empty"
                    >
                      No datasss
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.user_id}>
                      <td>{u.first_name} {u.last_name}</td>
                      <td>{u.email}</td>
                      <td>{u.contact_number}</td>
                      <td>{u.role_name}</td>
                      <td>{u.is_active ? "Active" : "Inactive"}</td>
                      <td>{u.department_name}</td>
                      <td>
                        <div className="announce-card-actions users-row-actions">
                          <button 
                            type="button" 
                            aria-label="Edit" 
                            onClick={() => setEditingUser(u)}
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
                            aria-label="Delete" 
                            onClick={() => handleDelete(u.user_id)}
                          >
                            <svg 
                              viewBox="0 0 24 24" 
                              width="15" 
                              height="15" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="1.8"
                            >
                              <path d="M3 6h18" />
                              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
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
      
        {/* Forms for add users */}
      {addOpen && (
        <div className="materials-modal-overlay" 
          onClick={closeAdd}
        >
          <div 
            className="materials-modal-box" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="materials-modal-head">
              <h2>ADD USER</h2>
              <button 
                type="button" 
                className="materials-modal-close" 
                aria-label="Close" 
                onClick={closeAdd}
              >
                &times;
              </button>
            </div>

            <div className="materials-modal-body">
              <div className="users-add-header">
                <div className="users-add-icon">
                  <span className="users-add-dot dot-a"></span>
                  <span className="users-add-dot dot-b"></span>
                  <span className="users-add-plus">+</span>
                </div>
                <p>Add a new local account to the system</p>
              </div>

              <label className="materials-field">
                <span className="materials-field-label">
                  First Name
                  <span className="users-req">*</span>
                </span>

                <input 
                  type="text" 
                  placeholder="e.g Maria Santos" 
                  value={first_name} 
                  onChange={(e) => setFirstName(e.target.value)} 
                />
              </label>
              <label className="materials-field">
                <span className="materials-field-label">
                  Last Name
                  <span className="users-req">*</span>
                </span>

                <input 
                  type="text" 
                  placeholder="e.g Maria Santos" 
                  value={last_name} 
                  onChange={(e) => setLastName(e.target.value)} 
                />
              </label>

              <label className="materials-field">
                <span className="materials-field-label">
                  Email
                  <span className="users-req">*</span>
                </span>
                <input 
                  type="email" 
                  placeholder="mariasantos@netrust.com.ph" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </label>

              <label className="materials-field">
                <span className="materials-field-label">
                  Contact number
                  <span className="users-req">*</span>
                </span>
                <input 
                  type="text" 
                  placeholder="+63 912 4567 896" 
                  value={contact} 
                  onChange={(e) => setContact(e.target.value)} 
                />
              </label>
              {/* Role */}
              <label className="materials-field">
                <span className="materials-field-label">
                  Role Name
                  <span className="users-req">*</span>
                </span>
                <select value={role} 
                  onChange={(e) => setRole(e.target.value)} 
                >
                <option value="">Select Role</option>

                {roles.map((rol) => (
                  <option 
                    key={rol.role_id}
                    value={rol.role_id}
                  >
                    {rol.role_name}
                  </option>
                ))}
                </select>
              </label>
                {/* department */}
              <label className="materials-field">
                <span className="materials-field-label">
                  Department
                  <span className="users-req">*</span>
                </span>
                <select value={department} 
                onChange={(e) => setDepartment(e.target.value)}
                >
                  <option value="">Select Department</option>

                  {departments.map((dept) => (
                    <option
                      key={dept.department_id}
                      value={dept.department_id}
                    >
                      {dept.department_name}
                    </option>
                  ))}
                </select>
              </label>


                <div className="materials-field">
                <span className="materials-field-label">Account Access</span>
                <div className="users-access-toggle">
                
{/*  uncomment this once sending email is enabled
                  <button 
                    type="button" 
                    className={
                      accessMode === "invite" ? "active" : ""
                      } 
                    onClick={() => setAccessMode("invite")}>
                      Email Invite
                  </button> */}
                  <button 
                    type="button" 
                    className={
                      accessMode === "password" ? "active" : ""
                      } onClick={() => setAccessMode("password")}
                  >
                        Set password now
                  </button>
                </div>
              </div>

              {accessMode === "invite" ? (
                <p className="users-add-note">
                  We'll email a link to the address above so they can set their 
                  own password and access their account.
                </p>
              ) : (
                <label className="materials-field">
                  <span className="materials-field-label">
                    Temporary password
                    <span className="users-req">*</span>
                  </span>
                  <input 
                    type="password" 
                    placeholder="Set a temporary password" 
                    value={password} onChange={(e) => setPassword(e.target.value)} 
                  />
                </label>
              )}
            </div>

            <div className="materials-modal-footer">
              <span className="materials-file-count"></span>
              <div className="materials-modal-footer-btns">
                <button 
                  type="button" 
                  className="materials-cancel-btn" 
                  onClick={closeAdd}
                >
                  Cancel
                </button>

                <button
                  type="button" 
                  className="materials-primary-btn" 
                  onClick={handleSend} disabled={!canSubmit}
                >
                  {accessMode === "invite" ? "Send Invite" : "Create Account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingUser && (
        <EditUserModal 
          initial={editingUser} 
          onClose={() => setEditingUser(null)} 
          onSave={handleSaveEdit} 
        />
      )}
    </div>
  );
}
