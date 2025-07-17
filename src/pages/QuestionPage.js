import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header/Header.js";
import {
  getQuestionById,
  getAnswers,
  getQuestionWithAnswers,
  rerankAnswers,
} from "../services/api.js";
import {
  formatNumber,
  formatRelativeTime,
  formatTags,
  processStackOverflowHtml,
} from "../utils/helpers.js";
import "./QuestionPage.css";

const QuestionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [question, setQuestion] = useState(location.state?.question || null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadQuestionData = async (questionId) => {
    setLoading(true);
    setError(null);

    try {
      // Try to use the combined API endpoint first
      try {
        const { question: questionData, answers: answersData } =
          await getQuestionWithAnswers(questionId);

        if (questionData) {
          setQuestion(questionData);
          setAnswers(Array.isArray(answersData) ? answersData : []);
          return;
        }
      } catch (combinedError) {
        console.warn(
          "Combined API not available, falling back to separate calls:",
          combinedError
        );
      }

      // Fallback to separate API calls
      if (!question) {
        const questionData = await getQuestionById(questionId);
        setQuestion(questionData);
      }

      // Load answers separately
      try {
        const answersData = await getAnswers(questionId);
        setAnswers(Array.isArray(answersData) ? answersData : []);
      } catch (answersError) {
        console.warn("Could not load answers:", answersError);
        setAnswers([]);
      }
    } catch (err) {
      console.error("Error loading question:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccuracyFilter = async () => {
    console.log("Accuracy filter button clicked.");
    if (!question || !answers.length) {
      console.warn("No question or answers available for filtering.");
      return;
    }

    console.log("Answers before constructing request payload:", answers);

    try {
      const requestPayload = {
        question: question.title,
        preference: "accuracy",
        answers: answers.map((answer) => ({
          answer_id: answer.answer_id || answer.id,
          body: answer.body,
          content_license: answer.content_license,
          creation_date: answer.creation_date,
          is_accepted: answer.is_accepted || answer.isAccepted,
          last_activity_date: answer.last_activity_date,
          last_edit_date: answer.last_edit_date || answer.lastEditDate,
          owner:
            answer.owner ||
            (answer.user
              ? {
                  accept_rate: answer.user.accept_rate || null,
                  account_id: answer.user.account_id || null,
                  display_name: answer.user.name || "Anonymous",
                  link: answer.user.link || null,
                  profile_image: answer.user.profileImage || null,
                  reputation: answer.user.reputation || 0,
                  user_id: answer.user.userId || null,
                  user_type: "registered",
                }
              : null),
          question_id: answer.question_id || answer.questionId,
          score: answer.score || answer.votes,
        })),
      };

      console.log("Request payload:", requestPayload);
      console.log("Sending rerankAnswers API request.");
      const rerankedResponse = await rerankAnswers(requestPayload);

      console.log("API response received:", rerankedResponse);
      if (rerankedResponse && Array.isArray(rerankedResponse.answers)) {
        const mappedAnswers = rerankedResponse.answers.map((answer) => ({
          answer_id: answer.answer_id,
          id: answer.answer_id,
          body: answer.body,
          content_license: answer.content_license,
          creation_date: answer.creation_date,
          createdAt: answer.creation_date,
          is_accepted: answer.is_accepted,
          isAccepted: answer.is_accepted,
          last_activity_date: answer.last_activity_date,
          last_edit_date: answer.last_edit_date,
          lastEditDate: answer.last_edit_date,
          owner: answer.owner,
          user: answer.owner
            ? {
                name: answer.owner.display_name,
                reputation: answer.owner.reputation,
                profileImage: answer.owner.profile_image,
                userId: answer.owner.user_id,
              }
            : null,
          question_id: answer.question_id,
          questionId: answer.question_id,
          score: answer.score,
          votes: answer.score,
        }));

        console.log("Mapped answers:", mappedAnswers);
        setAnswers(mappedAnswers);
      } else {
        console.warn("Reranked response is invalid or empty.");
      }
    } catch (err) {
      console.error("Error applying accuracy filter:", err);
    }
  };

  useEffect(() => {
    if (id) {
      loadQuestionData(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const isValidDate = (date) => {
    return date && !isNaN(new Date(date).getTime());
  };

  if (loading) {
    return (
      <div className="question-page">
        <Header />
        <main className="question-main">
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading question...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="question-page">
        <Header />
        <main className="question-main">
          <div className="error">
            <h3>Question not found</h3>
            <p>
              The question you're looking for doesn't exist or has been removed.
            </p>
            <button onClick={() => navigate("/")} className="btn btn-primary">
              Go to Home
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="question-page">
        <Header />
        <main className="question-main">
          <div className="error">
            <h3>Question not found</h3>
            <p>The question you're looking for doesn't exist.</p>
          </div>
        </main>
      </div>
    );
  }

  const formattedTags = formatTags(question.tags);

  return (
    <div className="question-page">
      <Header />

      <main className="question-main">
        <div className="question-container">
          <div className="question-header">
            <h1 className="question-title">{question.title}</h1>
            <div className="question-meta">
              <span>
                Asked{" "}
                {isValidDate(question.createdAt)
                  ? formatRelativeTime(question.createdAt)
                  : "Unknown"}
              </span>
              <span>
                Modified{" "}
                {isValidDate(question.lastModified || question.createdAt)
                  ? formatRelativeTime(
                      question.lastModified || question.createdAt
                    )
                  : "Unknown"}
              </span>
              <span>Viewed {formatNumber(question.views || 0)} times</span>
            </div>
          </div>

          <div className="question-content">
            <div className="question-votes">
              <button className="vote-btn vote-up">▲</button>
              <div className="vote-count">
                {formatNumber(question.votes || 0)}
              </div>
              <button className="vote-btn vote-down">▼</button>
            </div>

            <div className="question-body">
              <div className="question-text">
                <div
                  dangerouslySetInnerHTML={{
                    __html: processStackOverflowHtml(question.body),
                  }}
                />
              </div>

              <div className="question-tags">
                {formattedTags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="question-meta-footer">
                <div className="question-author">
                  <div className="author-info">
                    <span className="author-action">
                      asked{" "}
                      {isValidDate(question.createdAt)
                        ? formatRelativeTime(question.createdAt)
                        : "Unknown"}
                    </span>
                    <div className="author-details">
                      <div className="author-avatar">
                        {(question.user?.name || "A").charAt(0).toUpperCase()}
                      </div>
                      <div className="author-text">
                        <span className="author-name">
                          {question.user?.name || "Anonymous"}
                        </span>
                        {question.user?.reputation && (
                          <span className="author-reputation">
                            {formatNumber(question.user.reputation)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="answers-section">
            <h3 className="answers-header">
              {answers.length} Answer{answers.length !== 1 ? "s" : ""}
            </h3>

            <button
              onClick={handleAccuracyFilter}
              className="btn btn-secondary accuracy-filter"
            >
              Filter by Accuracy
            </button>

            {answers.length === 0 ? (
              <div className="no-answers">
                <p>No answers yet. Be the first to answer!</p>
              </div>
            ) : (
              <div className="answers-list">
                {answers.map((answer, index) => (
                  <div key={answer.answer_id || index} className="answer">
                    <div className="answer-votes">
                      <button className="vote-btn vote-up">▲</button>
                      <div className="vote-count">
                        {formatNumber(answer.votes || 0)}
                      </div>
                      <button className="vote-btn vote-down">▼</button>
                      {answer.isAccepted && (
                        <div className="accepted-icon" title="Accepted answer">
                          ✓
                        </div>
                      )}
                    </div>

                    <div className="answer-body">
                      <div className="answer-text">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: processStackOverflowHtml(answer.body),
                          }}
                        />
                      </div>

                      <div className="answer-meta-footer">
                        <div className="answer-author">
                          <div className="author-info">
                            <span className="author-action">
                              answered{" "}
                              {isValidDate(answer.createdAt)
                                ? formatRelativeTime(answer.createdAt)
                                : "Unknown"}
                            </span>
                            <div className="author-details">
                              <div className="author-avatar">
                                {(
                                  answer.owner?.display_name ||
                                  answer.user?.name ||
                                  "A"
                                )
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>
                              <div className="author-text">
                                <span className="author-name">
                                  {answer.owner?.display_name ||
                                    answer.user?.name ||
                                    "Anonymous"}
                                </span>
                                {(answer.owner?.reputation ||
                                  answer.user?.reputation) && (
                                  <span className="author-reputation">
                                    {formatNumber(
                                      answer.owner?.reputation ||
                                        answer.user?.reputation
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuestionPage;
