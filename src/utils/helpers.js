import { formatDistanceToNow, format } from "date-fns";
import { parse } from "node-html-parser";

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

// Format absolute time (e.g., "Aug 9, 2013 at 18:24")
export const formatAbsoluteTime = (date) => {
  return format(new Date(date), "MMM d, yyyy 'at' HH:mm");
};

// Format numbers with commas (e.g., 1,234)
export const formatNumber = (num) => {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 200) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + "...";
};

// Extract tags from question data
export const formatTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  if (typeof tags === "string") return tags.split(",").map((tag) => tag.trim());
  return [];
};

// Decode HTML entities (for Stack Overflow API responses)
export const decodeHtmlEntities = (text) => {
  if (!text) return "";
  const textArea = document.createElement("textarea");
  textArea.innerHTML = text;
  return textArea.value;
};

// Convert HTML to JSX-safe content (basic implementation)
export const renderHtmlContent = (htmlContent) => {
  if (!htmlContent) return "";

  // Decode HTML entities first
  const decoded = decodeHtmlEntities(htmlContent);

  // Basic sanitization - remove any potential script tags for security
  const sanitized = decoded
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "");

  return sanitized;
};

// Process and clean Stack Overflow HTML content
export const processStackOverflowHtml = (htmlContent) => {
  if (!htmlContent) return "";

  // Parse the HTML content
  const root = parse(htmlContent);

  // Process executable code blocks
  root.querySelectorAll(".snippet").forEach((snippet) => {
    const lang = snippet.getAttribute("data-lang") || "html";
    const codeContent = snippet.querySelector(".snippet-code")?.innerHTML || "";

    // Escape double quotes in code content
    const escapedCodeContent = codeContent.replace(/"/g, "&quot;");

    // Replace snippet with iframe for execution
    const iframe = `<iframe sandbox="allow-scripts" style="width: 100%; height: 300px; border: none;" srcdoc="${escapedCodeContent}"></iframe>`;
    snippet.set_content(iframe);
  });

  return root.toString();
};
