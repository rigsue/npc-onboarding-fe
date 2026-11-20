import React, { useState } from "react";

export default function AddModuleModal({
    onClose, onSave, departments = []
}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [displayOrder, setDisplayOrder] = useState(0);
    const [departmentId, setDepartmentId] = useState("");
    const [expectedDurationMinutes, setExpectedDurationMinutes] = useState(30);
    const [timeLimitMinutes, setTimeLimitMinutes] = useState("");
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            alert("Please enter a module title");
            return;
        }

        if (!departmentId) {
            alert("Please select a department");
            return;
        }
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
            await onSave(moduleData);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="materials-modal-overlay" onClick={onClose}>
            <div className="materials-modal-box" onClick={(e) => e.stopPropagation()}>
                <div className="materials-modal-head">
                    <h2>Create learning module</h2>
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
                        <span className="materials-field-label">Module Title</span>
                        <input 
                            type="text" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter module title"
                            required/>
                    </label>

                    <label className="materials-field">
                        <span className="materials-field-label">Description</span> 
                        <textarea value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter Module description"
                        />
                    </label>

                    <label className="materials-field">
                        <span className="materials-field-label">Department</span> 
                        <select type="text" 
                            value={departmentId} 
                            onChange={(e) => setDepartmentId(e.target.value)}
                            required>
                            <option value="">Select Department</option>
                            {departments.map((department) => 
                                <option key={department.department_id}
                                    value={department.department_id}>
                                        {department.department_name}
                                </option>
                            )}
                        </select>
                    </label>
                
                    <div className="materials-field-row">
                        <label className="materials-field">
                            <span className="materials-field-label">Display Order</span> 
                        <input type="number"
                            min="0"
                            value={displayOrder}
                            onChange={(e) => setDisplayOrder(e.target.value)}
                        />
                        </label>

                        <label className="materials-field">
                            Expected Duration (minutes)
                            <input type="number" 
                                min="1"
                                value={expectedDurationMinutes}
                                onChange={(e) => setExpectedDurationMinutes(e.target.value)}
                                required
                            />    
                        </label>
                    </div>

                    <div className="materials-field-label">
                        <label className="materials-field">
                            Time Limit (minutes)
                            <input type="number"
                                min="1"
                                value={timeLimitMinutes}
                                onChange={(e) => setTimeLimitMinutes(e.target.value)}
                                placeholder="Optional"
                            />
                        </label>                            
                    </div>

                    <div className="materials-modal-footer">
                        <button className="materials-cancel-btn" 
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                        >
                            Cancel
                        </button>

                        <button className="materials-primary-btn" 
                            type="submit" disabled={saving}>
                            {saving ? "Saving..." : "Create Module"}
                        </button>
                    </div>
                </form>
                

                         
            </div>

        </div>
    )
}