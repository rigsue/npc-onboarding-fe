import React, { useEffect, useState } from "react";

import { getQuestionsByExam } from "../../services/questionService";
import { getChoicesByQuestion, updateChoice } from "../../services/choiceService";

const QUESTION_TYPES = ["Multiple Choice", "True or False"];
const PASSING_SCORES = ["60", "70", "80", "90", "100"];

function newChoice() {
    return {
        id: `new-${Math.random}`, text:"",
    };
}

function newQuestion() {
    const c1 = newChoice();
    const c2 = newChoice();

    return {
        id: `new-${Math.random}`,
        type: "Multiple Choice",
        text: "",
        points: 1,
        choices: [c1, c2],
        correctId: c1.id,
    };
}

export default function EditAssessmentModal({
    initial, token, modules = [], onClose,  onSave, onDelete,
}) {
    const [learnModId, setLearnModId] = useState("");
    const [title, setTitle] = useState("");
    const [passingScore, setPassingScore] = useState(80);
    const [attemptLimit, setAttemptLimit] = useState("");
    const [durationMinutes, setDurationMinutes] = useState(30);

    const [questions, setQuestions] = useState([]);
    const [deletedQuestionIds, setDeletedQuestionIds] = useState([]);
    const [deleteChoiceIds, setDeletedChoiceIds] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;

        async function loadAssessment() {
            if (!initial.exam_id) return;

            try {
                setLoading(true);
                setError("");

                setLearnModId(String(initial.learn_mod_id ?? ""));
                setTitle(initial.title ?? "");
                setPassingScore(
                    String(initial.passing_score ?? 80)
                );
                setAttemptLimit(
                    initial.attempt_limit ?? ""
                );
                setDurationMinutes(
                    String(initial.duration_minutes ?? 30)
                );

                const questionResponse = await getQuestionsByExam(
                    token, initial.exam_id
                );

                const questionList = questionResponse.data || [];

                const completeQuestions = await Promise.all(
                    questionList.map(async question => {
                        const choiceResponse = await getChoicesByQuestion(
                            token, question.question_id
                        );

                        const choices = (choiceResponse.data || []).map(
                            choice => ({
                                id: choice.choice_id,
                                text: choice.choice_text ?? choice.choiceText ?? "",
                                isActive: choice.is_active,
                            })
                        );

                        const correctChoice = (
                            choiceResponse.data || []
                        ).find(choice => 
                            choice.is_correct === true ||
                            choice.is_correct === 1 ||
                            choice.isCorrect === true
                        );
                        return {
                            id: question.question_id,
                            type:
                                question.question_type ??
                                question.questionType ??
                                "Multiple Choice",
                            text: 
                                question.question ??
                                question.question_text ??
                                "",
                            points: question.points ?? 1, choices,
                            correctId: correctChoice?.choice_id ?? null,
                        };
                    })
                );
                if (mounted) {
                    setQuestions(
                        completeQuestions.length 
                        ? completeQuestions
                        : [newQuestion()]
                    );
                }
            } catch (err) {
                if (mounted) {
                    setError(err.message || "Failed to load assessment");
                }
            } finally {
                if (mounted) setLoading(false);
            }
        }
        loadAssessment();
        return () => {
            mounted = false;
        };
    }, [initial, token]);

    const updateQuestion = (id, patch) => {
        setQuestions(prev => 
            prev.map(q => q.id === id ? { ...q, ...patch } : q
            )
        );
    };

    const setQuestionType = (id, type) => {
        setQuestions(prev => 
            prev.map(q => {
                if (q.id !== id) return q;

                if (type === "True or False") {
                    const t = newChoice();
                    const f = newChoice();

                    t.text = "True";
                    f.text = "False";

                    return {
                        ...q, type, choices: [t, f], correctId: t.id
                    };
                }
                const c1 = newChoice();
                const c2 = newChoice();

                return {
                    ...q, type, choices: [c1, c2], correctId: c1.id
                };
            })
        );
    };

    const updateChoiceText = (questionId, choiceId, text) => {
        setQuestions(prev =>
            prev.map(q => 
                q.id === questionId
                    ? {
                        ...q,
                        choices: q.choices.map(c =>
                            c.id === choiceId
                                ? { ...c, text }
                                : c
                        ),
                    }
                    : q
                )
            );
        };
    
    const addChoice = questionId => {
        setQuestions(prev =>
            prev.map(q =>
                q.id === questionId
                    ? {
                        ...q, choices: [...q.choices, newChoice()],
                    }
                    : q
                )
            );
        };

    const removeChoice = (questionId, choiceId) => {
        setQuestions(prev =>
            prev.map(q => {
                if (q.id !== questionId) return q;
                if (q.choices.length <= 2) return q;

                const removed = q.choices.find(
                    c => c.id === choiceId
                );
                if (removed && !String(removed.id).startsWith("new-")) {
                    setDeletedChoiceIds(old => [
                        ...old, Number(removed.id),
                    ]);
                }
                const choices = q.choices.filter(
                    c => c.id !== choiceId
                );

                return {
                    ...q, 
                    choices, 
                    correctId:
                        q.correctId === choiceId
                            ? choices[0]?.id ?? null
                            : q.correctid
                };
            })
        );
    };

    const addQuestion = () => {
        setQuestions(prev => [...prev, newQuestion()]);
    };

    const removeQuestion = id => {
        if (prev => {
            const removed = prev.find(q => q.id === id);

            if (removed && !String(removed.id).startsWith("new-")) {
                setDeletedQuestionIds(old => [
                    ...old, Number(removed.id),
                ]);
            }
            return prev.filter(q => q.id !== id);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (saving) return;

        setError();

        if(!title.trim() || !learnModId) {
            setError("Assessment title and module are required");
            return;
        }
        if (
            !Number.isSafeInteger(Number(passingScore)) ||
            Number(passingScore) < 0 ||
            Number(passingScore) > 100
        ) {
            setError("Passing score must be between 0 and 100");
            return;
        }
        if (
            !Number.isSafeInteger(Number(durationMinutes)) ||
            Number(durationMinutes) <= 0
        ) {
            setError("Enter a valid duration");
            return;
        }
        if (
            attemptLimit !== " &&"
            (
                !Number.isSafeInteger(Number(attemptLimit)) ||
                Number(durationMinutes) <= 0
            )
        ) {
            setError("Attempt limit must be a positive integer");
            return;
        }
        if (questions.length === 0) {
            setError("At leas one question is required");
            return;
        }

        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];

            if (!q.text.trim()) {
                setError(`Enter question ${i + 1}`);
                return;
            }
            if (!QUESTION_TYPES.includes(q.type)) {
                setError(`Invalid question type in question ${i + 1}`);
                return;
            }
            if (q.choices.length < 2) {
                setError(`Question ${i + 1} needs at least two choices`);
                return;
            }
            if (q.choices.some(c => !c.text.trim())) {
                setError(`Complete all choices in question ${i + 1}`);
                return;
            }
            if (
                !q.correctId || !q.choices.some(c => c.id === q.correctId)
            ) {
                setError(`Select a correct answer for question ${i +1}`);
                return;
            }
        }
        const assessmentData = {
            learnModId: Number(learnModId),
            title: title.trim(),
            passingScore: Number(passingScore),
            attemptLimit:
                attemptLimit === "" ? null : Number(attemptLimit),
            durationMinutes: Number(durationMinutes),
        };
        const questionData = questions.map((q, index) => ({
            id: q.id,
            question: q.text.trim(),
            questionType: q.type,
            points: Number(q.points) || 1,
            displayOrder: index + 1,
            choices: q.choices.map((c, choiceIndex) => ({
                id: c.id,
                choiceText: c.text.trim(),
                isCorrect: c.id === q.correctId,
                displayOrder: choiceIndex + 1,
            })),
        }));
        try {
            setSaving(true);
            await onSave(
                initial.exam_id,
                assessmentData,
                questionData,
                deletedQuestionIds,
                deleteChoiceIds
            );
        } catch (err) {
            setError(err.message || "Failed to update assessment");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Deactivate this assessment?")) {
            return;
        }
        try {
            setDeleting(true);
            await onDelete(initial.exam_id);
        } catch (err) {
            setError(err.message || "Faled to deactivate assessment");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="user-exam-overlay"
            onClick={saving || deleting ? undefined : onClose}
        >
            <div className="user-exam-modal admin-assessment-modal"
                onClick={e => e.stopPropagation()}
            >
                <div className="user-exam-header">
                    <div>
                        <h2>Edit Assessment</h2>
                        <p>Update assessment details, questions and choices</p>
                    </div>
                    <button type="buton"
                        onClick={onClose}
                        disabled={saving || deleting}
                    >
                        &times;
                    </button>
                </div>

                <div className="user-exam-content">
                    {loading ? 
                    (
                        <p>Loading assessment...</p>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="assessment-details-grid">

                                <label className="materials-field">
                                    <span>Assessment Title</span>

                                    <input value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </label>

                                <label className="materials-field">
                                    <span>Learning Module</span>
                                    <select value={learnModId}
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
                                    <span>Passing Score</span>
                                    <select value={passingScore}
                                        onChange={(e) => setPassingScore(e.target.value)}
                                    >
                                        {PASSING_SCORES.map(score => (
                                            <option value={score}  key={score} >
                                                {score}%
                                            </option>
                                        ))}
                                    </select>   
                                </label>

                                <label className="materials-field">
                                    Attempt Limit
                                    <input
                                        type="number"
                                        min="1"
                                        value={attemptLimit}
                                        onChange={(e) => setAttemptLimit(e.target.value)}
                                        placeholder="Unlimited"
                                    />
                                </label>

                                <label className="materials-field">
                                    <span>Duration (minutes)</span>
                                    <input
                                        type="number"
                                        min="1"
                                        value={durationMinutes}
                                        onChange={(e) => setDurationMinutes(e.target.value)}
                                        required
                                    />
                                </label>

                            </div>
                            
                            <div className="assessment-questions-head">
                                Questions ({questions.length})
                            </div>

                            {questions.map((q, index) => (
                                <div key={q.id}
                                    className="assessment question-block">
                                    <div className="assessment-question-top">
                                        <span>Question {index + 1}</span>

                                        <select 
                                            value={q.type} 
                                            onChange={e => setQuestionType(
                                                q.id, e.target.value
                                            )}
                                        >
                                            {QUESTION_TYPES.map(type => (
                                                <option key={type} value={type}
                                                >{type}</option>
                                            ))}
                                        </select>

                                        <button type="button"
                                            className="assessment-delete-button"
                                            disabled={questions.length === 1}
                                            onClick={() => removeQuestion(q.id)}
                                        >
                                            Remove
                                        </button>
                                    </div>

                                    <input value={q.text} 
                                        className="assessment-question-input"
                                        placeholder="Type the question"
                                        onChange={e => updateQuestion(q.id, {
                                            text: e.target.value
                                        })}
                                    />
                                    <span className="assessment-type-pill">
                                        {q.type.toUpperCase()}
                                    </span>

                                    {q.choices.map(choice => (
                                        <div key={choice.id}
                                            className="assessment-choice-row"
                                        >
                                            <input type="radio" 
                                                name={`correct-${q.id}`}
                                                checked={q.correctId === choice.id}
                                                onChange={() => updateQuestion(q.id, {
                                                    correctId: choice.id
                                                })}
                                            />
                                            <input value={choice.text} 
                                                placeholder="Answer Choice"
                                                readOnly={q.type === "True or False"}
                                                onChange={e => updateChoiceText(
                                                    q.id, choice.id, e.target.value
                                                )}
                                            />
                                            {q.type === "Multiple Choice" && (
                                                <button type="button"
                                                    disabled={
                                                        q.choices.length <= 2
                                                    }
                                                    onClick={() =>
                                                        removeChoice(q.id, choice.id)
                                                    }
                                                >
                                                    &times;
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    {q.type === "Multiple Choice" && (
                                        <button type="button"
                                            className="assessment-add-question"
                                            onClick={() => addChoice(q.id)}
                                        >
                                            + Add Choice
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button type="button"
                                className="assessment-add-question"
                                onClick={addQuestion}
                            >
                                + Add Question
                            </button>
                            {error && (
                                <p className="exam-error">{error}</p>
                            )}
                            <div className="user-exam-actions assessment-footer">
                                <button type="button"
                                    className="assessment-deactivate-btn"
                                    onClick={handleDelete}
                                    disabled={saving || deleting}
                                >
                                    {deleting ? "Deactivating..." : "Deactivate"}
                                </button>

                                <span className="assessment-footer-spacer"/>

                                <button type="button"
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
                    )}
                </div>
            </div>
        </div>
    );
}
