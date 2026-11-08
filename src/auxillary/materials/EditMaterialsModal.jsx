import React, { useEffect, useState } from "react";

export default function EditMaterialsModal({
    initial, modules = [], onClose, onSave, onDelete,
}) {
    const [learnModId, setLearnModId] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [displayOrder, setDisplayOrder] = useState(1);
    const [minDurationMinutes, setMinDurationMinutes] = useState(5);
    const [maxDurationMinutes, setMaxDurationMinutes] = useState("");
    const [materialType, setMaterialType] = useState("document");
    const [file, setFile] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (!initial) return;

        setLearnModId(String(initial.learn_mod_id ?? ""));
        setTitle(initial.title ?? "");
        setDescription(initial.description ?? "");
        setDisplayOrder(initial.display_order ?? 1);
        setMinDurationMinutes(initial.min_duration_minutes ?? 5);
        setMaxDurationMinutes(initial.max_duration_minutes ?? "");
        setMaterialType(initial.material_type ?? "document");
        setFile(null);
    }, [initial]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("learnModId", learnModId);
        formData.append("title", title.trim());
        formData.append("description", description.trim());
        formData.append("displayOrder", displayOrder);
        formData.append("minDurationMinutes", minDurationMinutes);
        formData.append("maxDurationMinutes", maxDurationMinutes);
        formData.append("materialType", materialType);

        if (file) {
            formData.append("files", file);
        }

        try {
            setSaving(true);
            await onSave(initial.learn_mat_id, formData);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Deactivate this learning material?")) return;

        try {
            setDeleting(true);
            await onDelete(initial.learn_mat_id);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="materials-modal-overlay" onClick={onClose}>
            <div className="materials-modal-box" onClick={(e) => e.stopPropagation()}>
                <div className="materials-modal-head">
                    <h2>Edit Learning Material</h2>
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
                        <span className="materials-field-label">
                            Learning Module
                        </span>
                        <select
                            value={learnModId}
                            onChange={(e) => setLearnModId(e.target.value)}
                            required
                        >
                            <option value="">Select Module</option>
                            {modules.map((module) => (
                                <option
                                    key={module.learn_mod_id}
                                    value={module.learn_mod_id}
                                >
                                    {module.title}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="materials-field">
                        <span className="materials-field-label">Material Title</span> 
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter Material Title"
                            required
                        />
                    </label>

                    <label className="materials-field">
                        <span className="materials-field-label">Description</span>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Please enter material description"
                        />
                    </label>
                    <div className="materials-field-row">
                        <label>
                            <span className="materials-field-label">Display Order</span>
                            <input
                                type="number"
                                min="1"
                                value={displayOrder}
                                onChange={(e) => setDisplayOrder(e.target.value)}
                                required
                            />
                        </label>

                    <label>
                            <span className="materials-field-label">Material Type</span>
                            <select
                                value={materialType}
                                onChange={(e) => setMaterialType(e.target.value)}
                                required
                            >
                                <option value="document">Document</option>
                                <option value="video">Video</option>
                                <option value="audio">Audio</option>
                                <option value="image">Image</option>
                            </select>
                        </label>
                    </div>

                    <div className="materials-field-row">

                        <label>
                            <span className="materials-field-label">Minimum Duration (minutes)</span>
                            <input
                                type="number"
                                min="1"
                                value={minDurationMinutes}
                                onChange={(e) =>
                                    setMinDurationMinutes(e.target.value)
                                }
                                required
                            />
                        </label>

                        <label>
                            <span className="materials-field-label">Maximum Duration (minutes)</span>
                            <input
                                type="number"
                                min="1"
                                value={maxDurationMinutes}
                                onChange={(e) =>
                                    setMaxDurationMinutes(e.target.value)
                                }
                                placeholder="Optional"
                            />
                    </label>   

                    </div>

                    <label>
                        <span className="materials-field-label">Current File</span>
                        <p className="materials-field-label">
                            {initial.original_file_name || "No file information"}
                        </p>
                    </label>
                    <label className="materials-field">
                        <span className="materials-field-label">Replace File (optional)</span>
                        <input
                            type="file"
                            onChange={(e) =>
                                setFile(e.target.files?.[0] ?? null)
                            }
                        />
                    </label>
                    <div className="modal-actions">
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={saving || deleting}
                        >
                            {deleting ? "Deactivating..." : "Deactivate"}
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving || deleting}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
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
