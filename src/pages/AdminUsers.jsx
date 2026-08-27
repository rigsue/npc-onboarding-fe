import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeaderActions from '../components/AdminHeaderActions';
import AdminFooter from '../components/AdminFooter';
import { useToast } from '../context/ToastContext';
import '../components/AdminLayout.css';
import './AdminUsers.css';

const DEPARTMENTS = ['Finance', 'IT', 'Sales', 'Marketing', 'HR'];
const ROLES = ['Local User', 'Admin'];

const INITIAL_USERS = [
  { id: 1, name: 'Miguel Santos', email: 'miguel.santos@netrust.com.ph', contact: '+63 917 634 8212', role: 'Local User', department: 'IT', status: 'active' },
  { id: 2, name: 'Andrea Villanueva', email: 'andrea.villanueva@netrust.com.ph', contact: '+63 917 634 8213', role: 'Local User', department: 'Sales', status: 'pending' },
  { id: 3, name: 'Maria Lopez', email: 'maria.lopez@netrust.com.ph', contact: '+63 917 634 8214', role: 'Admin', department: 'IT', status: 'active' },
  { id: 4, name: 'Renz Aquino', email: 'renz.aquino@netrust.com.ph', contact: '+63 917 634 8215', role: 'Local User', department: 'Finance', status: 'active' },
  { id: 5, name: 'Katrina Bautista', email: 'katrina.bautista@netrust.com.ph', contact: '+63 917 634 8216', role: 'Admin', department: 'Marketing', status: 'inactive' },
  { id: 6, name: 'Paolo Ramirez', email: 'paolo.ramirez@netrust.com.ph', contact: '+63 917 634 8217', role: 'Local User', department: 'Finance', status: 'pending' },
  { id: 7, name: 'Cristine Del Rosario', email: 'cristine.delrosario@netrust.com.ph', contact: '+63 917 634 8218', role: 'Local User', department: 'Finance', status: 'active' },
  { id: 8, name: 'Joshua Mercado', email: 'joshua.mercado@netrust.com.ph', contact: '+63 917 634 8219', role: 'Local User', department: 'IT', status: 'active' },
];

function StatusBadge({ status }) {
  const labels = { active: 'ACTIVE', pending: 'PENDING INVITE', inactive: 'INACTIVE' };
  return <span className={`users-status-badge status-${status}`}>{labels[status]}</span>;
}

function EditUserModal({ initial, onClose, onSave }) {
  const [name, setName] = useState(initial.name);
  const [email, setEmail] = useState(initial.email);
  const [contact, setContact] = useState(initial.contact);
  const [role, setRole] = useState(initial.role);
  const [department, setDepartment] = useState(initial.department);
  const [status, setStatus] = useState(initial.status);

  const handleSave = () => {
    if (!name.trim() || !email.trim()) return;
    onSave({ name: name.trim(), email: email.trim(), contact: contact.trim(), role, department, status });
  };

  return (
    <div className="materials-modal-overlay" onClick={onClose}>
      <div className="materials-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="materials-modal-head">
          <h2>EDIT ACCOUNT</h2>
          <button type="button" className="materials-modal-close" aria-label="Close" onClick={onClose}>&times;</button>
        </div>

        <div className="materials-modal-body">
          <label className="materials-field">
            <span className="materials-field-label">Full name</span>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
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
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </label>
            <label className="materials-field">
              <span className="materials-field-label">Department</span>
              <select value={department} onChange={(e) => setDepartment(e.target.value)}>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
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
          <span className="materials-file-count">Role and department changes take effect immediately.</span>
          <div className="materials-modal-footer-btns">
            <button type="button" className="materials-cancel-btn" onClick={onClose}>Cancel</button>
            <button type="button" className="materials-primary-btn" onClick={handleSave} disabled={!name.trim() || !email.trim()}>Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsers() {
  const { showToast } = useToast();
  const [users, setUsers] = useState(INITIAL_USERS);
  const [editingUser, setEditingUser] = useState(null);
  const [addOpen, setAddOpen] = useState(false);

  // Add-account form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [accessMode, setAccessMode] = useState('invite'); // 'invite' | 'password'
  const [password, setPassword] = useState('');

  const canSubmit = name.trim() && email.trim() && contact.trim() && (accessMode === 'invite' || password.trim());

  const resetForm = () => {
    setName('');
    setEmail('');
    setContact('');
    setAccessMode('invite');
    setPassword('');
  };

  const closeAdd = () => {
    resetForm();
    setAddOpen(false);
  };

  const handleSend = () => {
    if (!canSubmit) return;
    const nextId = Math.max(0, ...users.map((u) => u.id)) + 1;
    setUsers((prev) => [
      {
        id: nextId,
        name: name.trim(),
        email: email.trim(),
        contact: contact.trim(),
        role: 'Local User',
        department: DEPARTMENTS[0],
        status: accessMode === 'invite' ? 'pending' : 'active',
      },
      ...prev,
    ]);
    showToast(accessMode === 'invite' ? 'Invite sent' : 'Account created');
    closeAdd();
  };

  const handleDelete = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    showToast('Account deleted');
  };

  const handleSaveEdit = (data) => {
    setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? { ...u, ...data } : u)));
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
            <p>Create and manage Local User and Admin User accounts for your organization.</p>
          </div>
          <div className="admin-header-actions">
            <AdminHeaderActions />
          </div>
        </header>

        <div className="users-body">
          <div className="announce-toolbar">
            <span className="announce-date-pill">{users.length} total accounts</span>
            <button type="button" className="announce-new-btn" onClick={() => setAddOpen(true)}>+ Add User</button>
          </div>

          <section className="users-table-card">
            <table className="users-simple-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Contact number</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.contact}</td>
                    <td><StatusBadge status={u.status} /></td>
                    <td>
                      <div className="announce-card-actions users-row-actions">
                        <button type="button" aria-label="Edit" onClick={() => setEditingUser(u)}>
                          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>
                        </button>
                        <button type="button" aria-label="Delete" onClick={() => handleDelete(u.id)}>
                          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="admin-table-empty">No accounts yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </div>

        <AdminFooter />
      </div>

      {addOpen && (
        <div className="materials-modal-overlay" onClick={closeAdd}>
          <div className="materials-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="materials-modal-head">
              <h2>ADD USER</h2>
              <button type="button" className="materials-modal-close" aria-label="Close" onClick={closeAdd}>&times;</button>
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
                <span className="materials-field-label">Full name<span className="users-req">*</span></span>
                <input type="text" placeholder="e.g Maria Santos" value={name} onChange={(e) => setName(e.target.value)} />
              </label>

              <label className="materials-field">
                <span className="materials-field-label">Email<span className="users-req">*</span></span>
                <input type="email" placeholder="mariasantos@netrust.com.ph" value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>

              <label className="materials-field">
                <span className="materials-field-label">Contact number<span className="users-req">*</span></span>
                <input type="text" placeholder="+63 912 4567 896" value={contact} onChange={(e) => setContact(e.target.value)} />
              </label>

              <div className="materials-field">
                <span className="materials-field-label">Account Access</span>
                <div className="users-access-toggle">
                  <button type="button" className={accessMode === 'invite' ? 'active' : ''} onClick={() => setAccessMode('invite')}>Email Invite</button>
                  <button type="button" className={accessMode === 'password' ? 'active' : ''} onClick={() => setAccessMode('password')}>Set password now</button>
                </div>
              </div>

              {accessMode === 'invite' ? (
                <p className="users-add-note">We'll email a link to the address above so they can set their own password and access their account.</p>
              ) : (
                <label className="materials-field">
                  <span className="materials-field-label">Temporary password<span className="users-req">*</span></span>
                  <input type="password" placeholder="Set a temporary password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
              )}
            </div>

            <div className="materials-modal-footer">
              <span className="materials-file-count"></span>
              <div className="materials-modal-footer-btns">
                <button type="button" className="materials-cancel-btn" onClick={closeAdd}>Cancel</button>
                <button type="button" className="materials-primary-btn" onClick={handleSend} disabled={!canSubmit}>
                  {accessMode === 'invite' ? 'Send Invite' : 'Create Account'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingUser && (
        <EditUserModal initial={editingUser} onClose={() => setEditingUser(null)} onSave={handleSaveEdit} />
      )}
    </div>
  );
}
