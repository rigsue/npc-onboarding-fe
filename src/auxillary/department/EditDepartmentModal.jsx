import React, { useState, useEffect } from "react";
// import "./DepartmentModal.css";

export default function EditDeptModal({ initial, onClose, onSave }) {

    const [departmentName, setDepartmentName] = useState("");
    const [description, setDescription] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect (() => {
        if (initial) {
            setDepartmentName(initial.department_name || "");
            setDescription(initial.description || "");
        }
    }, [initial]);

    const handleSubmit = async(e) => {
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
                description: description.trime() || null
            });
        } catch (error) {
            setError(error.message ||"Failed to update Department");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="department-modal-overlay">
            <div className="department-modal-box">
                <div className="department-modal-header">
                    <h2>Edit Department</h2>

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
                                maxLength={100}
                                required
                            />
                        </label>

                        <label className="department-field">
                            <span>Description</span>

                            <textarea value={description}
                                onChange={(e) => setDescription(e.target.value)}
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
                            {saving ? "Saving..." : "Saving Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
