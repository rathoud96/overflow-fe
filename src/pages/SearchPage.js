import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header/Header.js";
import SearchResults from "../components/SearchResults/SearchResults.js";
import { searchQuestions, rerankAnswers } from "../services/api.js";
import { processStackOverflowHtml } from "../utils/helpers.js";
import "./SearchPage.css";

// Transform API response to match our component format
const transformQuestion = (apiQuestion) => {
  return {
    id: apiQuestion.question_id,
    title: processStackOverflowHtml(apiQuestion.title),
    body: processStackOverflowHtml(apiQuestion.body || ""),
    votes: apiQuestion.score,
    answers: apiQuestion.answer_count,
    views: apiQuestion.view_count,
    tags: apiQuestion.tags,
    user: {
      name: apiQuestion.owner?.display_name || "Anonymous",
      reputation: apiQuestion.owner?.reputation,
      profileImage: apiQuestion.owner?.profile_image,
      userId: apiQuestion.owner?.user_id,
    },
    createdAt: new Date(apiQuestion.creation_date * 1000).toISOString(), // Convert Unix timestamp
    isAnswered: apiQuestion.is_answered,
    acceptedAnswerId: apiQuestion.accepted_answer_id,
    link: apiQuestion.link,
  };
};

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [preference, setPreference] = useState("relevance");

  // Use ref to track the last search to prevent duplicate calls
  const lastSearchRef = useRef({ query: "", preference: "" });
  const isSearchingRef = useRef(false);

  const performSearch = useCallback(
    async (searchQuery, searchPreference = "relevance") => {
      // Prevent duplicate calls
      if (
        isSearchingRef.current ||
        (lastSearchRef.current.query === searchQuery &&
          lastSearchRef.current.preference === searchPreference)
      ) {
        return;
      }

      isSearchingRef.current = true;
      lastSearchRef.current = {
        query: searchQuery,
        preference: searchPreference,
      };

      setLoading(true);
      setError(null);

      try {
        if (searchPreference === "accuracy") {
          const rerankedResponse = await rerankAnswers({
            question: searchQuery,
            preference: "accuracy",
            answers: results.map((result) => ({
              answer_id: result.id,
              body: result.body,
            })),
          });

          setResults(rerankedResponse.answers.map(transformQuestion));
          setTotalResults(rerankedResponse.answers.length);
        } else {
          const response = await searchQuestions(searchQuery, searchPreference);

          // Handle the new API response structure
          if (response.results && Array.isArray(response.results)) {
            const transformedResults = response.results.map(transformQuestion);
            setResults(transformedResults);
            setTotalResults(response.total || response.results.length);
          } else if (response.questions) {
            // Fallback for old format
            setResults(response.questions.map(transformQuestion));
            setTotalResults(response.total || response.questions.length);
          } else if (Array.isArray(response)) {
            // Fallback for direct array format
            setResults(response.map(transformQuestion));
            setTotalResults(response.length);
          } else {
            setResults([]);
            setTotalResults(0);
          }
        }
      } catch (err) {
        console.error("Search error:", err);
        setError(err);
        setResults([]);
        setTotalResults(0);
      } finally {
        setLoading(false);
        isSearchingRef.current = false;
      }
    },
    []
  );

  useEffect(() => {
    if (query) {
      performSearch(query, preference);
    }
  }, [query, preference, performSearch]);

  const handlePreferenceChange = (newPreference) => {
    setPreference(newPreference);
  };

  return (
    <>
      <Header />

      <main className="search-main">
        <SearchResults
          results={results}
          loading={loading}
          error={error}
          query={query}
          totalResults={totalResults}
          preference={preference}
          onPreferenceChange={handlePreferenceChange}
        />
      </main>
    </>
  );
};

export default SearchPage;
