import React, { useEffect, useState } from "react";

import { getQuestionsByExam } from "../../services/questionService";
import { getChoicesByQuestion } from "../../services/choiceService";

export default function UserExamModal({
    exam, token, onClose, onSubmit,
}) {
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Load questions and choices when the modal opens
    useEffect(() => {
        let isMounted = true;

        const loadQuestions = async () => {
            try {
                setLoading(true);
                setError("");
                console.group("User Assessment");
                console.log("Selected exam:", exam);
                const questionResponse = await getQuestionsByExam(
                    token, exam.exam_id
                );
                const questionList = questionResponse.data || [];
                console.log("Questions:", questionList);

                if (questionList.length === 0) {
                    throw new Error(
                        "No questions available for this assessment."
                    );
                }
                const questionsWithChoices = await Promise.all(
                    questionList.map(async (question) => {
                        const choiceResponse = await getChoicesByQuestion(
                            token,
                            question.question_id
                        );
                        console.log(
                            `Choices for question ${question.question_id}:`,
                            choiceResponse.data
                        );
                        return {
                            ...question,
                            choices: choiceResponse.data || [],
                        };
                    })
                );
                console.log(
                    "Complete assessment data:", questionsWithChoices
                );
                console.groupEnd();
                if (isMounted) {
                    setQuestions(questionsWithChoices);
                }
            } catch (err) {
                console.error("Assessment loading error:", err);
                if (isMounted) {
                    setError(err.message);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };
        loadQuestions();

        return () => {
            isMounted = false;
        };
    }, [exam, token]);

    // Store selected answer
    const handleAnswerChange = (questionId, choiceId) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: choiceId,
        }));
    };

    // Submit answers to parent component
    const handleSubmit = (e) => {
        e.preventDefault();

        const unanswered = questions.filter(
            (question) => !selectedAnswers[question.question_id]
        );
        if (unanswered.length > 0) {
            setError(
                `Please answer all questions. ${unanswered.length} unanswered.`
            );
            return;
        }
        const submission = {
            examId: exam.exam_id,
            answers: Object.entries(selectedAnswers).map(
                ([questionId, choiceId]) => ({
                    questionId: Number(questionId),
                    choiceId: Number(choiceId),
                })
            ),
        };
        console.log("Assessment submission:", submission);

        onSubmit(submission);
    };

    return (
        <div className="user-exam-overlay">
            <div className="user-exam-modal">
                <div className="user-exam-header">
                    <div>
                        <h2>{exam.title}</h2>
                        <p>Passing Score: {exam.passing_score}%</p>

                        <p>Duration: {exam.duration_minutes} minutes</p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close assessment"
                    >
                        &times;
                    </button>
                </div>

                <div className="user-exam-content">
                    {loading ? (
                        <p>Loading assessment questions...</p>
                    ) : error ? (
                        <p className="exam-error">{error}</p>
                    ) : (
                        <form onSubmit={handleSubmit}>

                            {questions.map((question, index) => (
                                <div
                                    key={question.question_id}
                                    className="user-exam-question"
                                >
                                    <h3>{index + 1}. {question.question}</h3>
                                    <p>Points: {question.points}</p>

                                    <div className="user-exam-choices">
                                        {question.choices.map((choice) => (
                                            <label
                                                key={choice.choice_id}
                                                className="user-exam-choice"
                                            >
                                                <input
                                                    type="radio"
                                                    name={`question-${question.question_id}`}
                                                    value={choice.choice_id}
                                                    checked={
                                                        String(
                                                            selectedAnswers[
                                                                question.question_id
                                                            ] ?? ""
                                                        ) ===
                                                        String(choice.choice_id)
                                                    }
                                                    onChange={() =>
                                                        handleAnswerChange(
                                                            question.question_id,
                                                            choice.choice_id
                                                        )
                                                    }
                                                />
                                                <span>
                                                    {choice.choice_text ?? choice.choiceText}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {error && (
                                <p className="exam-error">{error}</p>
                            )}
                            <div className="user-exam-actions">
                                <button type="submit">Submit Assessment</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
