import React from "react";
import { Link } from "react-router-dom";
import {
  formatNumber,
  formatRelativeTime,
  formatTags,
} from "../../utils/helpers.js";
import "./QuestionCard.css";

const QuestionCard = ({ question }) => {
  const {
    id,
    title,
    body,
    votes,
    answers,
    views,
    tags,
    user,
    createdAt,
    isAnswered,
  } = question;

  const formattedTags = formatTags(tags);

  return (
    <div className="question-card">
      <div className="question-stats">
        <div className="stat">
          <div className="stat-number">{formatNumber(votes || 0)}</div>
          <div className="stat-label">votes</div>
        </div>
        <div className={`stat ${isAnswered ? "answered" : ""}`}>
          <div className="stat-number">{formatNumber(answers || 0)}</div>
          <div className="stat-label">answers</div>
        </div>
        <div className="stat">
          <div className="stat-number">{formatNumber(views || 0)}</div>
          <div className="stat-label">views</div>
        </div>
      </div>

      <div className="question-content">
        <h3 className="question-title">
          <Link
            to={`/questions/${id}`}
            className="question-link"
            state={{ question }}
          >
            {title}
          </Link>
        </h3>

        {body && (
          <div
            className="question-body"
            dangerouslySetInnerHTML={{ __html: body }}
          ></div>
        )}

        <div className="question-footer">
          <div className="question-tags">
            {formattedTags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
          </div>

          <div className="question-meta">
            <span className="question-author">{user?.name || "Anonymous"}</span>
            <span className="question-time">
              asked {formatRelativeTime(createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
