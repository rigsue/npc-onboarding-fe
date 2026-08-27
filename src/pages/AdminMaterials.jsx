import React, { useState, useMemo, useRef } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeaderActions from '../components/AdminHeaderActions';
import AdminFooter from '../components/AdminFooter';
import { useToast } from '../context/ToastContext';
import { useAdminIdentity } from '../context/AdminIdentityContext';
import '../components/AdminLayout.css';
import './AdminMaterials.css';

const FOLDERS = ['Human Resources', 'IT', 'Finance', 'Marketing', 'Sales', 'General'];
const PASSING_SCORES = ['60%', '70%', '80%', '90%', '100%'];
const QUESTION_TYPES = ['Multiple Choice', 'True or False', 'Short Answer'];

const STATUS_LABELS = {
  published: 'PUBLISHED',
  scheduled: 'SCHEDULED',
  draft: 'DRAFT',
};

const INITIAL_MATERIALS = [
  {
    id: 1,
    category: 'General',
    status: 'published',
    title: 'HR MODULE',
    description: 'A centralized HR module designed to manage employee profiles, onboarding requirements, and company records efficiently.',
    date: 'July 30, 2026',
  },
  {
    id: 2,
    category: 'General',
    status: 'published',
    title: 'IT Assessment',
    description: "Assess the employee's understanding of company policies, workplace expectations, code of conduct, and HR guidelines.",
    date: 'July 30, 2026',
  },
  {
    id: 3,
    category: 'General',
    status: 'scheduled',
    title: 'Finance MODULE',
    description: 'Handle payroll setup, salary information, benefits enrollment, expense approvals, and financial onboarding requirements for new employees.',
    date: 'July 30, 2026',
  },
  {
    id: 4,
    category: 'General',
    status: 'published',
    title: 'Onboarding Assessment',
    description: "Test the employee's understanding of the onboarding process, company policies, department procedures, and essential workplace information.",
    date: 'July 30, 2026',
  },
  {
    id: 5,
    category: 'IT',
    status: 'published',
    title: 'IT ASSESSMENT',
    description: "Evaluate the employee's technical knowledge, cybersecurity awareness, and understanding of company IT policies and systems.",
    date: 'July 30, 2026',
  },
];

function ThumbIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  );
}

function todayLabel() {
  return new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
}

/* ---------- Upload Materials modal ---------- */

function UploadMaterialsModal({ onClose, onUpload, folderOptions }) {
  const [files, setFiles] = useState([]);
  const [folder, setFolder] = useState(folderOptions[0]);
  const [when, setWhen] = useState('now');
  const [note, setNote] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const addFiles = (fileList) => {
    setFiles((prev) => [...prev, ...Array.from(fileList)]);
  };

  const handleSubmit = () => {
    if (files.length === 0) return;
    const status = when === 'now' ? 'published' : when === 'schedule' ? 'scheduled' : 'draft';
    onUpload({ files, folder, status, note: note.trim() });
  };

  return (
    <div className="materials-modal-overlay" onClick={onClose}>
      <div className="materials-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="materials-modal-head">
          <h2>UPLOAD MATERIALS</h2>
          <button type="button" className="materials-modal-close" aria-label="Close" onClick={onClose}>&times;</button>
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
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" strokeWidth="2"><path d="M12 16V4" /><path d="M6 10l6-6 6 6" /><path d="M4 20h16" /></svg>
            </div>
            <p><strong>Click to Browse</strong> or Drag file here</p>
            <span>PDF, DOCS, PPTX, XLSX, or images up to 100mb each</span>
            <input
              ref={inputRef}
              type="file"
              multiple
              hidden
              onChange={(e) => { if (e.target.files) addFiles(e.target.files); }}
            />
          </div>

          <label className="materials-field">
            <span className="materials-field-label">Folder</span>
            <select value={folder} onChange={(e) => setFolder(e.target.value)}>
              {folderOptions.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </label>

          <div className="materials-field-row">
            <div className="materials-field">
              <span className="materials-field-label">When</span>
              <div className="materials-when-group">
                <button type="button" className={when === 'now' ? 'active' : ''} onClick={() => setWhen('now')}>Publish now</button>
                <button type="button" className={when === 'schedule' ? 'active' : ''} onClick={() => setWhen('schedule')}>Schedule</button>
                <button type="button" className={when === 'draft' ? 'active' : ''} onClick={() => setWhen('draft')}>Save Draft</button>
              </div>
            </div>

            <label className="materials-field">
              <span className="materials-field-label">Note</span>
              <input type="text" placeholder="e.g Updated 2026" value={note} onChange={(e) => setNote(e.target.value)} />
            </label>
          </div>
        </div>

        <div className="materials-modal-footer">
          <span className="materials-file-count">{files.length} file{files.length === 1 ? '' : 's'} selected</span>
          <div className="materials-modal-footer-btns">
            <button type="button" className="materials-cancel-btn" onClick={onClose}>Cancel</button>
            <button type="button" className="materials-primary-btn" onClick={handleSubmit} disabled={files.length === 0}>Upload Materials</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Create Assessment modal ---------- */

function newChoice() {
  return { id: Math.random().toString(36).slice(2), text: '' };
}

function newQuestion() {
  const c1 = newChoice();
  const c2 = newChoice();
  return { id: Math.random().toString(36).slice(2), type: 'Multiple Choice', text: '', choices: [c1, c2], correctId: c1.id, shortAnswer: '' };
}

function CreateAssessmentModal({ onClose, onSave, folderOptions }) {
  const [title, setTitle] = useState('');
  const [linkedModule, setLinkedModule] = useState(folderOptions[0]);
  const [passingScore, setPassingScore] = useState('');
  const [questions, setQuestions] = useState([newQuestion()]);

  const updateQuestion = (id, patch) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  };

  const setQuestionType = (id, type) => {
    setQuestions((prev) => prev.map((q) => {
      if (q.id !== id) return q;
      if (type === 'True or False') {
        const t = { id: 'true', text: 'True' };
        const f = { id: 'false', text: 'False' };
        return { ...q, type, choices: [t, f], correctId: t.id };
      }
      if (type === 'Multiple Choice' && q.choices.length < 2) {
        const c1 = newChoice();
        const c2 = newChoice();
        return { ...q, type, choices: [c1, c2], correctId: c1.id };
      }
      return { ...q, type };
    }));
  };

  const addChoice = (qId) => {
    setQuestions((prev) => prev.map((q) => (q.id === qId ? { ...q, choices: [...q.choices, newChoice()] } : q)));
  };

  const removeChoice = (qId, choiceId) => {
    setQuestions((prev) => prev.map((q) => {
      if (q.id !== qId) return q;
      const choices = q.choices.filter((c) => c.id !== choiceId);
      const correctId = q.correctId === choiceId ? (choices[0] ? choices[0].id : null) : q.correctId;
      return { ...q, choices, correctId };
    }));
  };

  const updateChoiceText = (qId, choiceId, text) => {
    setQuestions((prev) => prev.map((q) => (
      q.id === qId ? { ...q, choices: q.choices.map((c) => (c.id === choiceId ? { ...c, text } : c)) } : q
    )));
  };

  const addQuestion = () => setQuestions((prev) => [...prev, newQuestion()]);

  const handleSave = () => {
    if (!title.trim() || questions.length === 0) return;
    onSave({ title: title.trim(), linkedModule, passingScore, questions });
  };

  return (
    <div className="materials-modal-overlay" onClick={onClose}>
      <div className="materials-modal-box assessment-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="materials-modal-head">
          <h2>CREATE ASSESSMENT</h2>
          <p>add questions, pick an answer type, and set the correct answer</p>
          <button type="button" className="materials-modal-close" aria-label="Close" onClick={onClose}>&times;</button>
        </div>

        <div className="materials-modal-body assessment-modal-scroll">
          <label className="materials-field">
            <span className="materials-field-label">Title</span>
            <input type="text" placeholder="Add title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>

          <div className="materials-field-row">
            <label className="materials-field">
              <span className="materials-field-label">Linked Module</span>
              <select value={linkedModule} onChange={(e) => setLinkedModule(e.target.value)}>
                {folderOptions.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </label>
            <label className="materials-field">
              <span className="materials-field-label">Passing Score</span>
              <select value={passingScore} onChange={(e) => setPassingScore(e.target.value)}>
                <option value="">e.g 70%</option>
                {PASSING_SCORES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
          </div>

          <div className="assessment-questions-head">Questions</div>

          {questions.map((q, index) => (
            <div className="assessment-question-block" key={q.id}>
              <div className="assessment-question-top">
                <span className="assessment-question-label">QUESTION {index + 1}</span>
                <select value={q.type} onChange={(e) => setQuestionType(q.id, e.target.value)}>
                  {QUESTION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <input
                type="text"
                className="assessment-question-input"
                placeholder="Type the question"
                value={q.text}
                onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
              />

              <span className="assessment-type-pill">{q.type.toUpperCase()}</span>

              {q.type === 'Short Answer' ? (
                <input
                  type="text"
                  className="assessment-shortanswer-input"
                  placeholder="Correct answer"
                  value={q.shortAnswer}
                  onChange={(e) => updateQuestion(q.id, { shortAnswer: e.target.value })}
                />
              ) : (
                <>
                  {q.choices.map((c) => (
                    <div className="assessment-choice-row" key={c.id}>
                      <input
                        type="radio"
                        name={`correct-${q.id}`}
                        checked={q.correctId === c.id}
                        onChange={() => updateQuestion(q.id, { correctId: c.id })}
                      />
                      <input
                        type="text"
                        placeholder="Answer choice"
                        value={c.text}
                        readOnly={q.type === 'True or False'}
                        onChange={(e) => updateChoiceText(q.id, c.id, e.target.value)}
                      />
                      {q.type === 'Multiple Choice' && (
                        <button type="button" aria-label="Remove choice" onClick={() => removeChoice(q.id, c.id)}>×</button>
                      )}
                    </div>
                  ))}
                  {q.type === 'Multiple Choice' && (
                    <button type="button" className="assessment-add-choice" onClick={() => addChoice(q.id)}>+ Add choice</button>
                  )}
                </>
              )}
            </div>
          ))}

          <button type="button" className="assessment-add-question" onClick={addQuestion}>+ Add questions</button>
        </div>

        <div className="materials-modal-footer">
          <span className="materials-file-count">{questions.length} Question{questions.length === 1 ? '' : 's'} added</span>
          <div className="materials-modal-footer-btns">
            <button type="button" className="materials-cancel-btn" onClick={onClose}>Cancel</button>
            <button type="button" className="materials-primary-btn" onClick={handleSave} disabled={!title.trim()}>Save Assessment</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Main page ---------- */

export default function AdminMaterials() {
  const { showToast } = useToast();
  const admin = useAdminIdentity();
  const [materials, setMaterials] = useState(INITIAL_MATERIALS);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [newMenuOpen, setNewMenuOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [assessmentOpen, setAssessmentOpen] = useState(false);

  const folderOptions = admin.isSuperAdmin ? FOLDERS : ['General', admin.departmentKey];

  const scoped = useMemo(
    () => (admin.isSuperAdmin ? materials : materials.filter((m) => m.category === 'General' || m.category === admin.departmentKey)),
    [materials, admin.isSuperAdmin, admin.departmentKey]
  );

  const counts = useMemo(() => ({
    all: scoped.length,
    published: scoped.filter((m) => m.status === 'published').length,
    scheduled: scoped.filter((m) => m.status === 'scheduled').length,
    draft: scoped.filter((m) => m.status === 'draft').length,
  }), [scoped]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return scoped.filter((m) => {
      const matchesFilter = filter === 'all' || m.status === filter;
      const matchesSearch = !q || m.title.toLowerCase().includes(q) || m.category.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [scoped, filter, search]);

  const handleDelete = (id) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
    showToast('Material deleted');
  };

  const addMaterial = (entry) => {
    const nextId = Math.max(0, ...materials.map((m) => m.id)) + 1;
    setMaterials((prev) => [{ id: nextId, date: todayLabel(), ...entry }, ...prev]);
  };

  const handleUpload = ({ files, folder, status, note }) => {
    const title = files.length === 1 ? files[0].name : `${files.length} files uploaded`;
    addMaterial({
      category: folder,
      status,
      title,
      description: note || `Uploaded to ${folder}.`,
    });
    setUploadOpen(false);
    showToast(status === 'published' ? 'Material uploaded' : status === 'scheduled' ? 'Upload scheduled' : 'Draft saved');
  };

  const handleSaveAssessment = ({ title, linkedModule, passingScore, questions }) => {
    addMaterial({
      category: linkedModule,
      status: 'published',
      title,
      description: `Assessment — ${questions.length} question${questions.length === 1 ? '' : 's'}${passingScore ? `, passing score ${passingScore}` : ''}.`,
    });
    setAssessmentOpen(false);
    showToast('Assessment created');
  };

  const today = new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="admin-shell">
      <AdminSidebar active="materials" />

      <div className="admin-main">
        <header className="announce-banner">
          <div>
            <h1>Department Materials</h1>
            <p>Browse important documents, standard operating procedures (SOPs), manuals, and resources provided by your department.</p>
          </div>
          <div className="admin-header-actions">
            <AdminHeaderActions />
          </div>
        </header>

        <div className="announce-body">
          <div className="announce-toolbar">
            <span className="announce-date-pill">{today}</span>

            <div className="materials-new-dropdown">
              <button type="button" className="announce-new-btn" onClick={() => setNewMenuOpen((v) => !v)}>
                + New Materials
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
              </button>
              {newMenuOpen && (
                <div className="materials-new-menu">
                  <button type="button" onClick={() => { setNewMenuOpen(false); setUploadOpen(true); }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 16V4" /><path d="M6 10l6-6 6 6" /><path d="M4 20h16" /></svg>
                    Upload Material
                  </button>
                  <button type="button" onClick={() => { setNewMenuOpen(false); setAssessmentOpen(true); }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
                    Create Assessment
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="announce-controls">
            <div className="announce-tabs">
              <button type="button" className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All {counts.all}</button>
              <button type="button" className={filter === 'published' ? 'active' : ''} onClick={() => setFilter('published')}>Published {counts.published}</button>
              <button type="button" className={filter === 'scheduled' ? 'active' : ''} onClick={() => setFilter('scheduled')}>Scheduled {counts.scheduled}</button>
              <button type="button" className={filter === 'draft' ? 'active' : ''} onClick={() => setFilter('draft')}>Draft {counts.draft}</button>
            </div>

            <div className="announce-search">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" /></svg>
              <input
                type="text"
                placeholder="Search department, roles etc"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="materials-grid">
            {visible.map((m) => (
              <article className="materials-card" key={m.id}>
                <div className="announce-card-head">
                  <span className="announce-category-pill">{m.category}</span>
                  <span className={`announce-status-pill status-${m.status}`}>{STATUS_LABELS[m.status]}</span>
                </div>

                <div className="materials-thumb"><ThumbIcon /></div>

                <h3>{m.title}</h3>
                <p>{m.description}</p>

                <div className="announce-card-foot">
                  <span>{m.date}</span>
                  <div className="announce-card-actions">
                    <button type="button" aria-label="Edit" onClick={() => showToast('Editing isn\u2019t wired up yet')}>
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>
                    </button>
                    <button type="button" aria-label="Delete" onClick={() => handleDelete(m.id)}>
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></svg>
                    </button>
                  </div>
                </div>
              </article>
            ))}
            {visible.length === 0 && (
              <p className="announce-empty">No materials match your filters.</p>
            )}
          </div>
        </div>

        <AdminFooter />
      </div>

      {uploadOpen && (
        <UploadMaterialsModal onClose={() => setUploadOpen(false)} onUpload={handleUpload} folderOptions={folderOptions} />
      )}
      {assessmentOpen && (
        <CreateAssessmentModal onClose={() => setAssessmentOpen(false)} onSave={handleSaveAssessment} folderOptions={folderOptions} />
      )}
    </div>
  );
}
