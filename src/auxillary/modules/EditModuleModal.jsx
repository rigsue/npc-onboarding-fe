import React, { useEffect, useState } from "react";

export default function EditModuleModal({
    initial, departments = [], onClose, onSave, onDelete,
}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [displayOrder, setDisplayOrder] = useState(0);
    const [departmentId, setDepartmentId] = useState("");
    const [expectedDurationMinutes, setExpectedDurationMinutes] = useState(30);
    const [timeLimitMinutes, setTimeLimitMinutes] = useState("");
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (!initial) return;

        setTitle(initial.title ?? "");
        setDescription(initial.description ?? "");
        setDisplayOrder(initial.display_order ?? 0);
        setDepartmentId(initial.department_id ?? "");
        setExpectedDurationMinutes(initial.expexted_duration_minutes ?? 30);
        setTimeLimitMinutes(initial.time_limit_minutes ?? "");
    }, [initial]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const moduleData = {
            title: title.trim(),
            description: description.trim(),
            displayOrder: Number(displayOrder),
            departmentId: Number(departmentId),
            expectedDurationMinutes: Number(expectedDurationMinutes),
            timeLimitMinutes: timeLimitMinutes === "" ? null : Number(timeLimitMinutes),
        };
        try {
            setSaving(true);
            await onSave(initial.learn_mod_id, moduleData);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to deactivate this module?")) return;

        try {
            setDeleting(true);
            await onDelete(initial.learn_mod_id);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="materials-modal-overlay" onClick={onClose}>
            <div className="materials-modal-box" onClick={(e) => e.stopPropagation()}>
                <div className="materials-modal-head">
                    <h2>Edit Learning Module</h2>
                    <button type="button" 
                        className="materials-modal-close" 
                        aria-label="Close"
                        onClick={onClose}
                        >
                        &times;
                    </button>
                </div>

                <form className="materials-modal-body" onSubmit={handleSubmit}>
                    <label className="materials-field">
                        Module Title
                        <input type="text" 
                            maxLength={100}
                            placeholder="Service Delivery 1st Module"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            />
                    </label>

                    <label className="materials-field">
                        Description
                        <textarea type="text" name="" id="" />
                    </label>

                    <label className="materials-field">
                        Department
                        <select 
                            value={departmentId} 
                            onChange={(e) => setDepartmentId(e.target.value)}
                            required
                        >
                            <option value="">Select Department</option>
                            {departments.map((department) => (
                                <option value={department.department_id}
                                    key={department.department_id}
                                >
                                    {department.department_name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="materials-field">
                        Display Order
                        <input 
                            type="number" 
                            min="0" 
                            value={displayOrder}
                            onChange={(e) => setDisplayOrder(e.target.value)}
                            required
                        />
                    </label>

                    <label className="materials-field">
                        Expected Duration (minutes)
                        <input 
                            type="number" 
                            min="1" 
                            value={expectedDurationMinutes}
                            onChange={(e) => setExpectedDurationMinutes(e.target.value)}
                            required
                        />
                    </label>

                    <label className="materials-field">
                        Time Limit (minutes)
                        <input 
                            type="number" 
                            min="1" 
                            value={timeLimitMinutes}
                            onChange={(e) => setTimeLimitMinutes(e.target.value)}
                            placeholder="Optional" 
                        />
                    </label>

                    <div className="materials-modal-footer">
                        <button type="button" 
                            className="materials-cancel-btn"
                            disabled={saving || deleting}
                        >
                            {deleting ? "Deactivating..." : "Deactivate"}
                        </button>

                        <button type="button" 
                            onClick={onClose}
                            disabled={saving}
                            className="materials-cancel-btn"
                        >
                            Cancel
                        </button>

                        <button type="submit" 
                            className="materials-primary-btn"
                            disabled={saving || deleting}
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}