import React, { useState } from "react";
// import "./DepartmentModal.css";

export default function AddDeptModal({ onClose, onSave }) {

    const [departmentName, setDepartmentName] = useState("");
    const [description, setDescription] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!departmentName.trim()) {
            setError("Department name is required");
            return;
        }
        try {
            setSaving(true);
            setError("");

            await onSave({
                departmentName: departmentName.trim(),
                description: description.trim() || null
            });
        } catch (error) {
            setError(error.message || "Failed to create department");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="department-modal-overlay">
            <div className="department-modal-box">
                <div className="department-modal-header">
                    <h2>Add Department</h2>

                    <button type="button"
                        className="department-modal-close"
                        onClick={onClose}
                        disabled={saving}
                    >
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="department-modal-body">

                        {error && (
                            <div className="department-error">
                                {error}
                            </div>
                        )}
                        <label className="department-field">
                            <span>Department Name *</span>
                            <input type="text" 
                                value={departmentName}
                                onChange={(e) => setDepartmentName(e.target.value)}
                                placeholder="Enter Department name"
                                maxLength={100}
                                required
                            />
                        </label>

                        <label className="department-field">
                            <span>Description</span>
                            <textarea value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter department description"
                                maxLength={250}
                                rows={4}
                            />
                        </label>
                    </div>
                    <div className="department-modal-footer">
                        <button type="button"
                            className="department-cancel-btn"
                            onClick={onClose}
                            disabled={saving}
                        >
                            Cancel
                        </button>

                        <button type="submit"
                            className="department-primary-btn"
                            disabled={saving}
                        >
                            {saving ? "Creating..." : "Create Department"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}