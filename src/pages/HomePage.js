import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header/Header.js";
import SearchBar from "../components/SearchBar/SearchBar.js";
import { useAuth } from "../App.js";
import { getRecentSearchQuestions } from "../services/api.js";
import { formatRelativeTime } from "../utils/helpers.js";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [recentQuestions, setRecentQuestions] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const [recentError, setRecentError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadRecentQuestions();
    }
  }, [isAuthenticated]);

  const loadRecentQuestions = async () => {
    setLoadingRecent(true);
    setRecentError(null);

    try {
      const response = await getRecentSearchQuestions();
      setRecentQuestions(response.questions || []);
    } catch (error) {
      console.error("Error loading recent questions:", error);
      setRecentError("Failed to load recent searches");
    } finally {
      setLoadingRecent(false);
    }
  };

  const handleSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="home-page">
      <Header />

      <main className="home-main">
        <div className="home-hero">
          <h1 className="home-title">
            Find the best answer to your technical question, help others answer
            theirs
          </h1>

          <div className="home-search">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search for answers to your coding questions..."
            />
          </div>

          <div className="home-features">
            <div className="feature">
              <h3>For developers, by developers</h3>
              <p>Stack Overflow is an open community for anyone that codes.</p>
            </div>
            <div className="feature">
              <h3>Get unstuck</h3>
              <p>Ask a question and get answers from expert developers.</p>
            </div>
            <div className="feature">
              <h3>Level up</h3>
              <p>
                Browse top questions and answers on your favorite technologies.
              </p>
            </div>
          </div>

          {isAuthenticated && (
            <div className="recent-searches">
              <h2>Your Recent Searches</h2>

              {loadingRecent ? (
                <div className="loading-recent">
                  <div className="loading-spinner"></div>
                  <p>Loading your recent searches...</p>
                </div>
              ) : recentError ? (
                <div className="error-recent">
                  <p>{recentError}</p>
                  <button
                    onClick={loadRecentQuestions}
                    className="btn btn-outline"
                  >
                    Try Again
                  </button>
                </div>
              ) : recentQuestions.length > 0 ? (
                <div className="recent-questions-list">
                  {recentQuestions.map((question) => (
                    <div key={question.id} className="recent-question-item">
                      <div className="recent-question-content">
                        <button
                          onClick={() => handleSearch(question.question)}
                          className="recent-question-link"
                        >
                          {question.question}
                        </button>
                        <span className="recent-question-date">
                          {formatRelativeTime(question.created_at)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-recent-searches">
                  <p>
                    No recent searches yet. Start searching to see your history
                    here!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
