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
  // const [role_name, setRoleName] = useState("");
  const [role_id, setRoleId] = useState("");
  const [department_id, setDepartmentId] = useState("");
  // const [department_name, setDepartmentName] = useState("");
  const [employee_number, setEmployeeNumber] = useState("");
  const [position, setPosition] = useState("");

  useEffect(() => {
    if (!initial) return;

    setFirstName(initial.first_name ?? "");
    setLastName(initial.last_name ?? "");
    setEmail(initial.email ?? "");
    setContactNumber(initial.contact_number ?? "");
    setRoleId(initial.role_id ? String(initial.role_id) : "");
    // setRoleName(initial.role_name ?? "");
    setDepartmentId(
      initial.department_id ? String(initial.department_id) : ""
    );
    // setDepartmentName(initial.department_name ?? "");
    setEmployeeNumber(initial.employee_number ?? "");
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
      className="add_edit-modal-overlay"
      onClick={onClose}
    >
      <div
        className="add_edit-modal-box"
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
                {/* <option value="">Select Role</option> */}
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
                {/* <option value="">Select Department</option> */}

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

          <div className="materials-file-count">
            All changes take effect immediately haha.
          </div>

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