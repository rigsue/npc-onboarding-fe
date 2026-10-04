import React, { useEffect, useState } from "react";

export default function EditUserModal({
  initial,
  roles,
  departments,
  onClose,
  onSave,
}) {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contact_number, setContactNumber] = useState("");
  const [role_id, setRoleId] = useState("");
  const [department_id, setDepartmentId] = useState("");
  const [employee_number, setEmployeeNumber] = useState("");
  const [position, setPosition] = useState("");

  useEffect(() => {
    if (!initial) return;

    setFirstName(initial.firstName ?? "");
    setLastName(initial.lastName ?? "");
    setEmail(initial.email ?? "");
    setContactNumber(initial.contactNumber ?? "");
    setRoleId(initial.roleId ? String(initial.roleId) : "");
    setDepartmentId(
      initial.departmentId ? String(initial.departmentId) : ""
    );
    setEmployeeNumber(initial.employeeNumber ?? "");
    setPosition(initial.position ?? "");
  }, [initial]);

  const handleSave = () => {
    if (!first_name.trim() || !last_name.trim() || !email.trim()) {
      return;
    }

    onSave({
      userId: initial.user_id,
      firstName: first_name.trim(),
      lastName: last_name.trim(),
      email: email.trim(),
      contactNumber: contact_number.trim(),
      roleId: Number(role_id),
      departmentId: Number(department_id),
      employeeNumber: employee_number.trim(),
      position: position.trim(),
    });
  };

  return (
    <div
      className="materials-modal-overlay"
      onClick={onClose}
    >
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

        <div className="materials-modal-body">

          <label className="materials-field">
            <span className="materials-field-label">
              First Name
            </span>

            <input
              type="text"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </label>

          <label className="materials-field">
            <span className="materials-field-label">
              Last Name
            </span>

            <input
              type="text"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>

          <label className="materials-field">
            <span className="materials-field-label">
              Email
            </span>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="materials-field">
            <span className="materials-field-label">
              Contact Number
            </span>

            <input
              type="text"
              value={contact_number}
              onChange={(e) => setContactNumber(e.target.value)}
            />
          </label>

          <div className="materials-field-row">

            <label className="materials-field">
              <span className="materials-field-label">
                Role
              </span>

              <select
                value={role_id}
                onChange={(e) => setRoleId(e.target.value)}
              >
                <option value="">Select Role</option>

                {roles.map((role) => (
                  <option
                    key={role.role_id}
                    value={String(role.role_id)}
                  >
                    {role.role_name}
                  </option>
                ))}
              </select>
            </label>

            <label className="materials-field">
              <span className="materials-field-label">
                Department
              </span>

              <select
                value={department_id}
                onChange={(e) => setDepartmentId(e.target.value)}
              >
                <option value="">Select Department</option>

                {departments.map((department) => (
                  <option
                    key={department.department_id}
                    value={String(department.department_id)}
                  >
                    {department.department_name}
                  </option>
                ))}
              </select>
            </label>

          </div>

          <label className="materials-field">
            <span className="materials-field-label">
              Employee Number
            </span>

            <input
              type="text"
              value={employee_number}
              onChange={(e) => setEmployeeNumber(e.target.value)}
            />
          </label>

          <label className="materials-field">
            <span className="materials-field-label">
              Position
            </span>

            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
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
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="button"
              className="materials-primary-btn"
              onClick={handleSave}
              disabled={
                !first_name.trim() ||
                !last_name.trim() ||
                !email.trim()
              }
            >
              Save Changes
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}