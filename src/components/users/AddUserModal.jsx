import React, { useEffect, useState } from "react";

export default function AddUserModal({
  roles,
  departments,
  onClose,
  onSubmit,
}) {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contact_number, setContactNumber] = useState("");
  const [employee_number, setEmployeeNumber] = useState("");
  const [position, setPosition] = useState("");
  const [role_id, setRoleId] = useState("");
  const [department_id, setDepartmentId] = useState("");
  const [access_mode, setAccessMode] = useState("invite");
  const [password, setPassword] = useState("");

  useEffect(() => {return () => {resetForm();};
  }, []);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setContactNumber("");
    setEmployeeNumber("");
    setPosition("");
    setRoleId("");
    setDepartmentId("");
    setAccessMode("invite");
    setPassword("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const canSubmit =
    first_name.trim() &&
    last_name.trim() &&
    email.trim() &&
    contact_number.trim() &&
    employee_number.trim() &&
    position.trim() &&
    role_id &&
    department_id &&
    (access_mode === "invite" || password.trim());

  const handleSubmit = () => {
    if (!canSubmit) return;

    onSubmit({
      firstName: first_name.trim(),
      lastName: last_name.trim(),
      email: email.trim(),
      contactNumber: contact_number.trim(),
      employeeNumber: employee_number.trim(),
      position: position.trim(),
      roleId: Number(role_id),
      departmentId: Number(department_id),
      password: password.trim(),
    });

    resetForm();
  };
  return (
    <div
      className="materials-modal-overlay"
      onClick={handleClose}
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
            onClick={handleClose}
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

            <p>
              Add a new local account to the system
            </p>
          </div>

          <label className="materials-field">
            <span className="materials-field-label">
              First Name
              <span className="users-req">*</span>
            </span>

            <input
              type="text"
              placeholder="e.g Maria"
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
              placeholder="e.g Santos"
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
              Contact Number
              <span className="users-req">*</span>
            </span>

            <input
              type="text"
              placeholder="+63 912 4567 896"
              value={contact_number}
              onChange={(e) => setContactNumber(e.target.value)}
            />
          </label>

          <label className="materials-field">
            <span className="materials-field-label">
              Employee Number
              <span className="users-req">*</span>
            </span>

            <input
              type="text"
              placeholder="N0187"
              value={employee_number}
              onChange={(e) => setEmployeeNumber(e.target.value)}
            />
          </label>

          <label className="materials-field">
            <span className="materials-field-label">
              Position
              <span className="users-req">*</span>
            </span>

            <input
              type="text"
              placeholder="Service Engineer"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </label>

          <label className="materials-field">
            <span className="materials-field-label">
              Role Name
              <span className="users-req">*</span>
            </span>

            <select
              value={role_id}
              onChange={(e) => setRoleId(e.target.value)}
            >
              <option value="">Select Role</option>

              {roles.map((role) => (
                <option
                  key={role.role_id}
                  value={role.role_id}
                >
                  {role.role_name}
                </option>
              ))}
            </select>
          </label>

          <label className="materials-field">
            <span className="materials-field-label">
              Department
              <span className="users-req">*</span>
            </span>

            <select
              value={department_id}
              onChange={(e) => setDepartmentId(e.target.value)}
            >
              <option value="">Select Department</option>

              {departments.map((department) => (
                <option
                  key={department.department_id}
                  value={department.department_id}
                >
                  {department.department_name}
                </option>
              ))}
            </select>
          </label>

          <div className="materials-field">

            <span className="materials-field-label">
              Account Access
            </span>

            <div className="users-access-toggle">

              <button
                type="button"
                className={ access_mode === "password" ? "active" : "" }
                onClick={() => setAccessMode("password")}
              >
                Set password now
              </button>

            </div>
          </div>

          {access_mode === "invite" ? (
            <p className="users-add-note">
              We'll email a link to the address above so
              they can set their own password and access
              their account.
            </p>
          ) : (
            <label className="materials-field">

              <span className="materials-field-label">
                Temporary Password
                <span className="users-req">*</span>
              </span>

              <input
                type="password"
                placeholder="Set a temporary password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              onClick={handleClose}
            >
              Cancel
            </button>

            <button
              type="button"
              className="materials-primary-btn"
              onClick={handleSubmit}
              disabled={!canSubmit}
            >
              {access_mode === "invite"
                ? "Send Invite"
                : "Create Account"}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}