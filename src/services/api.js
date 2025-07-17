import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Search for questions
export const searchQuestions = async (query, preference = "relevance") => {
  try {
    const response = await apiClient.post("/search", {
      query,
      preference,
    });
    return response.data;
  } catch (error) {
    console.error("Error searching questions:", error);
    throw error;
  }
};

// Get question details (assuming this endpoint exists)
export const getQuestionById = async (questionId) => {
  try {
    const response = await apiClient.get(`/questions/${questionId}`);

    // Transform the response if it's in Stack Overflow API format
    if (response.data.items && Array.isArray(response.data.items)) {
      const question = response.data.items[0];
      return {
        id: question.question_id,
        title: question.title,
        body: question.body,
        votes: question.score,
        answers: question.answer_count,
        views: question.view_count,
        tags: question.tags,
        user: {
          name: question.owner?.display_name || "Anonymous",
          reputation: question.owner?.reputation,
          profileImage: question.owner?.profile_image,
          userId: question.owner?.user_id,
        },
        createdAt: new Date(question.creation_date * 1000).toISOString(),
        isAnswered: question.is_answered,
        acceptedAnswerId: question.accepted_answer_id,
        link: question.link,
      };
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching question:", error);
    throw error;
  }
};

// Get answers for a question (returns both question and answers)
export const getAnswers = async (questionId) => {
  try {
    const response = await apiClient.get(`/search/answers/${questionId}`);

    // Handle the new API response format with question and answers
    if (response.data.answers && Array.isArray(response.data.answers)) {
      return response.data.answers.map((answer) => ({
        id: answer.answer_id,
        questionId: answer.question_id,
        body: answer.body,
        votes: answer.score,
        user: {
          name: answer.owner?.display_name || "Anonymous",
          reputation: answer.owner?.reputation,
          profileImage: answer.owner?.profile_image,
          userId: answer.owner?.user_id,
        },
        createdAt: new Date(answer.creation_date * 1000).toISOString(),
        lastEditDate: answer.last_edit_date
          ? new Date(answer.last_edit_date * 1000).toISOString()
          : null,
        isAccepted: answer.is_accepted || false,
        link: answer.link,
      }));
    }

    // Fallback for old format
    if (response.data.items && Array.isArray(response.data.items)) {
      return response.data.items.map((answer) => ({
        id: answer.answer_id,
        questionId: answer.question_id,
        body: answer.body,
        votes: answer.score,
        user: {
          name: answer.owner?.display_name || "Anonymous",
          reputation: answer.owner?.reputation,
          profileImage: answer.owner?.profile_image,
          userId: answer.owner?.user_id,
        },
        createdAt: new Date(answer.creation_date * 1000).toISOString(),
        lastEditDate: answer.last_edit_date
          ? new Date(answer.last_edit_date * 1000).toISOString()
          : null,
        isAccepted: answer.is_accepted || false,
        link: answer.link,
      }));
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching answers:", error);
    throw error;
  }
};

// Get question with answers (new combined API response)
export const getQuestionWithAnswers = async (questionId) => {
  try {
    const response = await apiClient.get(`/search/answers/${questionId}`);

    const result = { question: null, answers: [] };

    // Extract question data from the new API response format
    if (response.data.question) {
      const q = response.data.question;
      result.question = {
        id: q.question_id,
        title: q.title,
        body: q.body,
        votes: q.score,
        answers: q.answer_count,
        views: q.view_count,
        tags: q.tags,
        user: {
          name: q.owner?.display_name || "Anonymous",
          reputation: q.owner?.reputation,
          profileImage: q.owner?.profile_image,
          userId: q.owner?.user_id,
        },
        createdAt: new Date(q.creation_date * 1000).toISOString(),
        lastModified: q.last_edit_date
          ? new Date(q.last_edit_date * 1000).toISOString()
          : new Date(q.creation_date * 1000).toISOString(),
        isAnswered: q.is_answered,
        acceptedAnswerId: q.accepted_answer_id,
        link: q.link,
      };
    }

    // Extract answers data
    if (response.data.answers && Array.isArray(response.data.answers)) {
      result.answers = response.data.answers.map((answer) => ({
        id: answer.answer_id,
        questionId: answer.question_id,
        body: answer.body,
        votes: answer.score,
        user: {
          name: answer.owner?.display_name || "Anonymous",
          reputation: answer.owner?.reputation,
          profileImage: answer.owner?.profile_image,
          userId: answer.owner?.user_id,
        },
        createdAt: new Date(answer.creation_date * 1000).toISOString(),
        lastEditDate: answer.last_edit_date
          ? new Date(answer.last_edit_date * 1000).toISOString()
          : null,
        isAccepted: answer.is_accepted || false,
        link: answer.link,
      }));
    }

    return result;
  } catch (error) {
    console.error("Error fetching question with answers:", error);
    throw error;
  }
};

// Rerank answers based on user feedback or other criteria
export const rerankAnswers = async (requestBody) => {
  try {
    const response = await apiClient.post("/rerank", requestBody);
    return response.data;
  } catch (error) {
    console.error("Error reranking answers:", error);
    throw error;
  }
};

// Authentication APIs
export const signup = async (userData) => {
  try {
    const response = await apiClient.post("/signup", userData);
    return response.data;
  } catch (error) {
    console.error("Error during signup:", error);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await apiClient.post("/login", credentials);
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

// Add token to axios headers for authenticated requests
export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};

// Remove token and clear authentication
export const logout = () => {
  setAuthToken(null);
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Get recent search questions for authenticated users
export const getRecentSearchQuestions = async () => {
  try {
    const response = await apiClient.get("/search/recent");
    return response.data;
  } catch (error) {
    console.error("Error fetching recent search questions:", error);
    throw error;
  }
};

export default apiClient;
