import React, { useEffect, useRef, useState } from "react";

 export default function AddMaterialsModal({ 
    onClose, onUpload, modules = []
}) {
  const [files, setFiles] = useState([]);
  const [linkedModule, setLinkedModule] = useState(
    modules[0]?.learn_mod_id ? String(modules[0].learn_mod_id) : "");
  const [when, setWhen] = useState("now");

  const [note, setNote] = useState("");
  const [title, setTitle] = useState("");
  const [materialType, setMaterialType] = useState("document");
  const [displayOrder, setDisplayOrder] = useState("");
  const [minDurationMinutes, setMinDurationMinutes] = useState(5);
  const [maxDurationMinutes, setMaxDurationMinutes] = useState(30);

  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const addFiles = (fileList) => {
    setFiles((prev) => [...prev, ...Array.from(fileList)]);
  };

  const handleSubmit = () => {
    if (files.length === 0) {
      alert("Please select atlease 1 file");
      return;
    }

    if (!linkedModule) {
      alert("Please select learning module");
      return;
    }
      
  const maxSize = 100 * 1024 * 1024;

  const oversizedFile = files.find(
    (file) => file.size > maxSize);

  if (oversizedFile) {
    alert(`${oversizedFile.name} exceeds the 100 MB limit.`);
    return;
  }

  if (!title.trim()) {
    alert("Please enter a material title.");
    return;
  }

  const minDuration = Number(minDurationMinutes);
  const maxDuration = Number(maxDurationMinutes);

  if(
    !Number.isSafeInteger(minDuration) ||
    !Number.isSafeInteger(maxDuration) ||
    minDuration < 1 || maxDuration < minDuration
    ) {
      alert("Please enter valid minimum and maximum duration.");
      return;
    }
    if (displayOrder !== "" && (
      !Number.isSafeInteger(Number(displayOrder)) ||
      Number(displayOrder) < 1
    )
  ) {
    alert("Display order must be a positive integer");
    return;
  }

  const status = when === 'now' ? 'published' : when === 'schedule' ? 'scheduled' : 'draft';

  console.log(" = = Upload Module = = ");
  console.log("Selected files:", files);
  console.log("Selected module ID:", linkedModule);
  console.log("status", status);
  console.log("Note", note.trim());

  files.forEach((file, index) => {
    console.log(`File ${index + 1}:`, {
      name: file.name,
      type: file.type, 
      size: file.size,
    });
  });
  onUpload({
    files,
    linkedModule,
    status,
    note: note.trim(),
    title: title.trim(),
    materialType,
    displayOrder:
        displayOrder === "" ? null : Number(displayOrder),
    minDurationMinutes: minDuration,
    maxDurationMinutes: maxDuration
  });
};


useEffect(() => {
  if (
    modules.length > 0 && !modules.some(
      module => String(module.learn_mod_id) === linkedModule
      )
    ) {setLinkedModule(String(modules[0].learn_mod_id));
  }
}, [modules, linkedModule]);

  return (
    <div className="materials-modal-overlay" onClick={onClose}>
      <div className="materials-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="materials-modal-head">
          <h2>UPLOAD MATERIALS</h2>
          <button type="button" className="materials-modal-close" aria-label="Close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="materials-modal-body">
          <div
            className={`materials-dropzone${dragOver ? ' dragover' : ''}`}
            onClick={() => inputRef.current && inputRef.current.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              if (e.dataTransfer.files && e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
            }}
          >
            <div className="materials-dropzone-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" strokeWidth="2">
                <path d="M12 16V4" />
                <path d="M6 10l6-6 6 6" />
                <path d="M4 20h16" /></svg>
            </div>
            <p><strong>Click to Browse</strong> or Drag file here</p>
            <span>PDF, DOCS, PPTX, XLSX, or images up to 100mb each</span>
            <input
              ref={inputRef}
              type="file"
              multiple
              hidden
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg,.webp"
              onChange={(e) => { 
                if (e.target.files) {addFiles(e.target.files); 
                e.target.value = "";}
              }}
            />
          </div>

          <label className="materials-field">
            <span className="materials-field-label">Learning Module</span>
            <select type="text" value={linkedModule}
             onChange={(e) => setLinkedModule(e.target.value)} required>
              <option value="">Select Module</option>
                {modules.map((module) => <option 
                  key={module.learn_mod_id} 
                  value={module.learn_mod_id}>
                    {module.title} ({module.department_name})
              </option>)}
            </select>
          </label>

          {/* Material title */}
          <label className="materials-field">
            <span className="materials-field-label">
              Material Title
            </span>
            <input type="text" 
              maxLength={100}
              placeholder="e.g. IT Onboarding Guide"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>

            {/* Description */}
          <label className="materials-field">
            <span className="materials-field-label">
              Description
            </span>
            <textarea maxLength={500}
              placeholder="Please describe you learnin materials"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </label>

          {/* Material Type / Display Order */}
          <div className="material-field-row">
            <label className="material-field">
              <span className="materials-field-label">
                Material Type
              </span>
              <select value={materialType} 
                onChange={(e) => setMaterialType(e.target.value)}
              >
                <option value="document">Document</option>
                <option value="presentation">Presentation</option>
                <option value="image">Image</option>
              </select>
            </label>

            <label className="material-field">
              <span className="materials-field-label">
                Display Order
              </span>
              <input type="number" min="1" step="1" placeholder="auto" value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
              />
            </label>
          </div>

                  {/* Duration */}
          <div className="material-field-row">
            <label className="material-field">
              <span className="materials-field-label">
                Minimum Duration (minutes)
              </span>
              <input type="number"min="1" step="1" value={minDurationMinutes}
                onChange={(e) => setMinDurationMinutes(e.target.value)}
                />
            </label>

            <label className="material-field">
              <span className="materials-field-label">
                Maximum Duration (minutes)
              </span>
              <input type="number"min="1" step="1" value={maxDurationMinutes}
                onChange={(e) => setMaxDurationMinutes(e.target.value)}
                />
            </label>
          </div>

          <div className="materials-field-row">
            <div className="materials-field">
              <span className="materials-field-label">When</span>
              <div className="materials-when-group">
                <button type="button" className={when === 'now' ? 'active' : ''} 
                  onClick={() => setWhen('now')}>Publish now</button>
                <button type="button" className={when === 'schedule' ? 'active' : ''} 
                  onClick={() => setWhen('schedule')}>Schedule</button>
                <button type="button" className={when === 'draft' ? 'active' : ''} 
                  onClick={() => setWhen('draft')}>Save Draft</button>
              </div>
            </div>

{/*             <label className="materials-field">
              <span className="materials-field-label">Note</span>
              <input type="text" placeholder="e.g Updated 2026" value={note} 
                onChange={(e) => setNote(e.target.value)} />
            </label> */}
          </div>
        </div>

        <div className="materials-modal-footer">
          <span className="materials-file-count">{files.length} 
            file{files.length === 1 ? '' : 's'} selected
          </span>
          <div className="materials-modal-footer-btns">
            <button type="button" className="materials-cancel-btn" 
              onClick={onClose}>Cancel</button>
            <button type="button" className="materials-primary-btn" 
              onClick={handleSubmit} disabled={files.length === 0}>Upload Materials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
