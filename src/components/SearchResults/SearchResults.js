import React from "react";
import QuestionCard from "../QuestionCard/QuestionCard.js";
import "./SearchResults.css";

const SearchResults = ({
  results = [],
  loading = false,
  error = null,
  query = "",
  totalResults = 0,
  preference = "relevance",
  onPreferenceChange = () => {},
}) => {
  if (loading) {
    return (
      <div className="search-results">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Searching...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="search-results">
        <div className="error">
          <h3>Something went wrong</h3>
          <p>
            {error.message || "Failed to search questions. Please try again."}
          </p>
        </div>
      </div>
    );
  }

  if (!results.length && query) {
    return (
      <div className="search-results">
        <div className="no-results">
          <h3>No results found</h3>
          <p>
            We couldn't find anything matching your search for "
            <strong>{query}</strong>"
          </p>
          <div className="no-results-suggestions">
            <p>Try:</p>
            <ul>
              <li>Different keywords</li>
              <li>More general terms</li>
              <li>Checking your spelling</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results">
      <div className="results-header">
        <div className="results-info">
          <h2>Search Results</h2>
          {query && (
            <p className="results-summary">
              Results for <strong>"{query}"</strong>
              {totalResults > 0 &&
                ` (${totalResults.toLocaleString()} results)`}
            </p>
          )}
        </div>

        <div className="results-controls">
          <div className="sort-options">
            <button
              className={`sort-btn ${
                preference === "relevance" ? "active" : ""
              }`}
              onClick={() => onPreferenceChange("relevance")}
            >
              Relevance
            </button>
            <button
              className={`sort-btn ${preference === "newest" ? "active" : ""}`}
              onClick={() => onPreferenceChange("newest")}
            >
              Newest
            </button>
            <div className="dropdown">
              <button className="sort-btn dropdown-btn">More ▼</button>
            </div>
          </div>
        </div>
      </div>

      <div className="results-list">
        {results.map((question, index) => (
          <QuestionCard key={question.id || index} question={question} />
        ))}
      </div>

      {results.length > 0 && (
        <div className="results-footer">
          <p>
            Showing {results.length} of {totalResults} results
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
