import React, { useEffect, useState } from "react";

const PASSING_SCORES = ['60%', '70%', '80%', '90%', '100%'];
const QUESTION_TYPES = ['Multiple Choice', 'True or False', 'Short Answer'];

function newChoice() {
  return { id: Math.random().toString(36).slice(2), text: '' };
}

function newQuestion() {
  const c1 = newChoice();
  const c2 = newChoice();
  return { id: Math.random().toString(36).slice(2), 
    type: "Multiple Choice", text: "", choices: [c1, c2], 
    correctId: c1.id, shortAnswer: '' };
}

export default function CreateAssessment({ onClose, onSave, modules = [] }) {
  const [title, setTitle] = useState("");
  const [linkedModule, setLinkedModule] = useState(
    modules[0]?.learn_mod_id ? String(modules[0].learn_mod_id) : ""
    );
  const [passingScore, setPassingScore] = useState("");
  const [questions, setQuestions] = useState([newQuestion()]);

  const updateQuestion = (id, patch) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  };

  const setQuestionType = (id, type) => {
    setQuestions((prev) => prev.map((q) => {
      if (q.id !== id) return q;
      if (type === "True or False") {
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
    setQuestions((prev) => prev.map(
      (q) => (q.id === qId ? { ...q, choices: [...q.choices, newChoice()] } : q)
    ));
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

  useEffect(() => {
    if (!linkedModule && modules.length > 0) {
        setLinkedModule(String(modules[0].learn_mod_id));
        
        console.log("Modules passed to modal:", modules);
        console.log("Selected module ID:", linkedModule);
    }
}, [modules, linkedModule]);

  return (
    <div className="materials-modal-overlay" onClick={onClose}>
      <div className="materials-modal-box assessment-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="materials-modal-head">
          <h2>CREATE ASSESSMENT</h2>
          <p>add questions, pick an answer type, and set the correct answer</p>
          <button type="button" className="materials-modal-close" aria-label="Close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="materials-modal-body assessment-modal-scroll">
          <label className="materials-field">
            <span className="materials-field-label">Title</span>
            <input type="text" placeholder="Add title" value={title}
              onChange={(e) => setTitle(e.target.value)} />
          </label>

          <div className="materials-field-row">
            <label className="materials-field">
              <span className="materials-field-label">Linked Module</span>
              <select value={linkedModule} onChange={(e) => setLinkedModule(e.target.value)}
              required>
                <option value="">Select a module</option>
                {modules.map((module) => (
                  <option key={module.learn_mod_id} value={String(module.learn_mod_id)}>
                    {module.title} ({module.department_name})
                  </option>
                ))}
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
            <button type="button" className="materials-primary-btn" 
              onClick={handleSave} disabled={!title.trim()}>
                Save Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
