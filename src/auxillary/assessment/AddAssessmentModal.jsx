import React, { useEffect, useState } from "react";

const PASSING_SCORES = ['60%', '70%', '80%', '90%', '100%'];
const QUESTION_TYPES = ['Multiple Choice', 'True or False'];

function newChoice() {
  return {
    id: Math.random().toString(36).slice(2), text: ""
  };
}

function newQuestion() {
  const c1 = newChoice(); const c2 = newChoice();

  return { 
    id: Math.random(), 
    type: "Multiple Choice", 
    text: "", 
    choices: [c1, c2], 
    correctId: c1.id
  };
}

export default function CreateAssessmentModal({ 
  onClose, onSave, modules = [] 
}) {

  const [title, setTitle] = useState("");
  const [linkedModule, setLinkedModule] = useState(
    modules[0]?.learn_mod_id ? String(modules[0].learn_mod_id) : "");

  const [passingScore, setPassingScore] = useState("80%");
  const [durationMinutes, setDurationMinutes] = useState("30");
  const [attemptLimit, setAttemptLimit] = useState("");
  const [questions, setQuestions] = useState([newQuestion()]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!linkedModule && modules.length > 0) {
        setLinkedModule(String(modules[0].learn_mod_id));
    }
  }, [modules, linkedModule]);

  const updateQuestion = (id, patch) => {
    setQuestions(prev => prev.map(q => q.id === id  ? { ...q, ...patch } : q));
  };

  const setQuestionType = (id, type) => {
    setQuestions(prev => prev.map(q => {

      if (q.id !== id) return q;

      if (type === "True or False") {
        const t = { id: 'true', text: 'True' };
        const f = { id: 'false', text: 'False' };
        return { ...q, type, choices: [t, f], correctId: t.id };
      }

      if (type === "Multiple Choice") {
        const c1 = newChoice();
        const c2 = newChoice();
        return { ...q, type, choices: [c1, c2], correctId: c1.id };
      }
      return q;
    }));
  };

  const addChoice = qId => {
    setQuestions(prev => prev.map(
      q => q.id === qId ? { ...q, choices: [...q.choices, newChoice()] } : q
      ));
  };

  const removeChoice = (qId, choiceId) => {
    setQuestions(prev => prev.map(q => {
      if (q.id !== qId) return q;

      if (q.choices.length <= 2) return q;

      const choices = q.choices.filter(c => c.id !== choiceId);
      const correctId = q.correctId === choiceId 
        ? choices[0] ?.id ?? null 
        : q.correctId;

      return { ...q, choices, correctId };
    }));
  };

  const updateChoiceText = (qId, choiceId, text) => {
    setQuestions(prev => prev.map(q => q.id === qId 
      ? { ...q, choices: q.choices.map(c => c.id === choiceId 
          ? { ...c, text } 
          : c) } 
      : q 
      )
    );
  };
        
  const addQuestion = () => setQuestions(prev => [...prev, newQuestion()]);

  const removeQuestion = id => {
    if (questions.length <=1) return;
    setQuestions(prev => prev.filter(q => q.id !== id));
  }

  const handleSave = async () => { 
    if (saving) return;

    setError("");

    if (!title.trim()) {
      setError("Assessment title required");
      return;
    }
    if (!linkedModule) {
      setError("Please select module");
      return;
    }
      if (!passingScore) {
    setError("Please select passing score");
    return;
    }
      if (
        !Number.isSafeInteger(Number(durationMinutes)) ||
        Number(durationMinutes) <= 0
      ) {
      setError("Enter valid assessment duration");
      return;
    }
      if (
        attemptLimit !== "" &&
        (
          !Number.isSafeInteger(Number(attemptLimit)) ||
          Number(attemptLimit) <= 0
        )
      ) {
        setError("Attempt limit must be positive integer");
        return;
      }
      if (questions.length === 0) {
        setError("Add at least one question.");
        return;
      }
  
  // Validate & transform questions
  const formattedQuestions = [];

  for (let i = 0; 1 < questions.length; i++) {
    const q = questions[i];

    if (!q.text.trim()) {
      setError(`Please enter a question ${i +1}`);
      return;
    }
    if (
      !QUESTION_TYPES.includes(q.type) ||
      q.choices.length < 2
    ) {
      setError(`Invalid choices in question ${i + 1}`);
      return;
    }
    if (q.choices.some(c => !c.text.trim())) {
      setError(`Complete all choices in question ${i + 1}`);
      return;
    }
    if (!q.correctId || !q.choices.some(
      c => c.id === q.correctId
    )) {
      setError(`Select the correct answer for question ${i + 1}`);
      return;
    }
    formattedQuestions.push({
      question: q.text.trim(),
      questionType: q.type,
      points: 1,
      displayOrder: i + 1,
      choices: q.choices.map((c, index) => ({
        choiceText: c.text.trim(),
        isCorrect: c.id === q.correctId,
        displayOrder: index + 1
      }))
    });
  }

  //  Backend request for payload
  const examData = {
    learnModId: Number(linkedModule),
    title: title.trim(),
    passingScore: Number(passingScore.replace("%", "")),
    // passingScore: Number(passingScore),
    attemptLimit: attemptLimit === "" ? null: Number(attemptLimit),
    durationMinutes: Number(durationMinutes),
    questions: formattedQuestions,
  };
  try {
      setSaving(true);
      await onSave(examData);
  } catch (err) {
    setError(err.message || "Failed to create assessment - 2")
  } finally { setSaving(false); }
};

  return (
    <div className="materials-modal-overlay" onClick={saving ? undefined : onClose}>
      <div className="materials-modal-box assessment-modal-box" 
        onClick={e => e.stopPropagation()}>
        <div className="materials-modal-head">
          <h2>CREATE ASSESSMENT</h2>
          <p>add questions, pick an answer type, and set the correct answer</p>
          <button type="button" 
              className="materials-modal-close" 
              aria-label="Close" 
              onClick={onClose}
              disabled={saving}>
            &times;
          </button>
        </div>

        <div className="materials-modal-body assessment-modal-scroll">
          <label className="materials-field">
            <span className="materials-field-label">Assessment Title</span>
            <input type="text" placeholder="Add title" value={title}
              onChange={(e) => setTitle(e.target.value)} />
          </label>

          <div className="materials-field-row">
            <label className="materials-field">
              <span className="materials-field-label">Linked Module</span>
              <select value={linkedModule} 
                onChange={e => setLinkedModule(e.target.value)}
                required
              >
                <option value="">Select a module</option>
                {modules.map(module => (
                  <option key={module.learn_mod_id} 
                    value={module.learn_mod_id}>
                     {module.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="materials-field">
              <span className="materials-field-label">Passing Score</span>
              <select value={passingScore} 
                onChange={(e) => setPassingScore(e.target.value)}>
                {/* <option value="">e.g 70%</option> */}
                {PASSING_SCORES.map(s => (
                  <option key={s} value={String(s)}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="materials-field-row">
            <label className="materials-field">
              <span className="materials-field-label">
                Duration (minutes)
              </span>

              <input type="number" 
                min="1" value={durationMinutes} 
                onChange={e => setDurationMinutes(e.target.value)}/>
            </label>

            <label className="materials-field">
              <span className="materials-field-label">
                Attempt Limit
              <input type="number" 
                min="1" value={attemptLimit} 
                onChange={e => setAttemptLimit(e.target.value)}/>
              </span>
            </label>
          </div>

          <div className="assessment-questions-head">Questions</div>

          {questions.map((q, index) => (
            <div className="assessment-question-block" key={q.id}>
              <div className="assessment-question-top">
                <span className="assessment-question-label">
                  QUESTION {index + 1}
                </span>
                <select value={q.type} 
                  onChange={e => setQuestionType(q.id, e.target.value)}>
                  {QUESTION_TYPES.map(t => (
                    <option key={t} value={t}>
                      {t}
                    </option>))}
                </select>

                <button type="button"
                  className="assessment-delete-btn"
                  disabled={ saving || questions.length === 1 }
                  onClick={() => removeQuestion(q.id)}
                >
                  Remove
                </button>
              </div>

              <input
                type="text"
                className="assessment-question-input"
                placeholder="Type the question"
                value={q.text}
                onChange={(e) => updateQuestion(q.id, 
                  { text: e.target.value }
                )}
              />
              <span className="assessment-type-pill">
                {q.type.toUpperCase()}
              </span>
              {/* uncomment below once short answer is avail */}
{/*   
              {q.type === 'Short Answer' ? (
                <input
                  type="text"
                  className="assessment-shortanswer-input"
                  placeholder="Correct answer"
                  value={q.shortAnswer}
                  onChange={(e) => updateQuestion(
                    q.id, { shortAnswer: e.target.value }
                  )}
                />
              ) : (
                <> */}
                  {q.choices.map(c => (
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
                        <button type="button" 
                          aria-label="Remove choice" 
                          onClick={() => removeChoice(q.id, c.id)}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  {q.type === 'Multiple Choice' && (
                    <button type="button" 
                      className="assessment-add-choice" 
                      onClick={() => addChoice(q.id)}
                    >
                        + Add choice
                    </button>
                  )}
              {/* uncomment below once short answer is avail */}
                {/* </>
              )
            } */}
            </div>
          ))}
          <button
            type="button"
            className="assessment-add-question"
            onClick={addQuestion}
          >
            + Add Questions
          </button>

          {error && (
            <p className="materials-error-message">
              {error}
            </p>
          )}
        </div>

        <div className="materials-modal-footer">
          <span className="materials-file-count">
            {questions.length} Question
            {questions.length === 1 ? "" : "s"} added
          </span>

          <div className="materials-modal-footer-btns">
            <button type="button" 
              className="materials-cancel-btn" 
              onClick={onClose}
              disabled={saving}
              >
                Cancel
            </button>

            <button type="button" className="materials-primary-btn" 
              onClick={handleSave} disabled={saving || !title.trim()}>
                {saving ? "Saving" : "Save Assessment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}