// Study Buddy - Client Application

const state = {
  currentTopic: null,
  messages: [],
  isLoading: false,
};

// DOM Elements
const topicSelect = document.getElementById("topic");
const messagesContainer = document.getElementById("messages");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Initialize app
async function init() {
  await loadTopics();
  topicSelect.addEventListener("change", handleTopicChange);
  chatForm.addEventListener("submit", handleSubmit);

  // Check URL for topic parameter
  const urlParams = new URLSearchParams(window.location.search);
  const topicFromUrl = urlParams.get("topic");
  if (topicFromUrl && topicSelect.querySelector(`option[value="${topicFromUrl}"]`)) {
    topicSelect.value = topicFromUrl;
    topicSelect.dispatchEvent(new Event("change"));
  }
}

// Load available topics from API
async function loadTopics() {
  try {
    const response = await fetch("/api/topics");
    const data = await response.json();

    data.topics.forEach((topic) => {
      const option = document.createElement("option");
      option.value = topic.id;
      option.textContent = `${topic.name} - ${topic.level}`;
      topicSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Failed to load topics:", error);
    showError("Failed to load topics. Please refresh the page.");
  }
}

// Handle topic selection
async function handleTopicChange(e) {
  const topicId = e.target.value;

  if (!topicId) {
    state.currentTopic = null;
    state.messages = [];
    renderMessages();
    setInputEnabled(false);
    // Clear URL param
    history.replaceState(null, "", window.location.pathname);
    return;
  }

  state.currentTopic = topicId;
  state.messages = [];

  // Update URL with topic
  const url = new URL(window.location);
  url.searchParams.set("topic", topicId);
  history.replaceState(null, "", url);

  // Clear and show loading
  messagesContainer.innerHTML = "";
  setInputEnabled(false);

  // Start conversation with initial message
  await sendMessage("Hi! Let's start learning.");
  setInputEnabled(true);
  userInput.focus();
}

// Handle form submission
async function handleSubmit(e) {
  e.preventDefault();

  const text = userInput.value.trim();
  if (!text || state.isLoading || !state.currentTopic) return;

  userInput.value = "";
  await sendMessage(text);
}

// Send message to API
async function sendMessage(text) {
  // Add user message
  state.messages.push({ role: "user", content: text });
  renderMessages();

  // Show loading
  state.isLoading = true;
  setInputEnabled(false);
  showLoading();

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: state.currentTopic,
        messages: state.messages,
      }),
    });

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data = await response.json();

    // Add assistant message
    state.messages.push({ role: "assistant", content: data.message });
  } catch (error) {
    console.error("Chat error:", error);
    state.messages.push({
      role: "assistant",
      content: "Sorry, something went wrong. Please try again.",
    });
  }

  state.isLoading = false;
  hideLoading();
  renderMessages();
  setInputEnabled(true);
  userInput.focus();
  scrollToBottom();
}

// Render all messages
function renderMessages() {
  // Keep only non-loading messages
  const messageElements = state.messages.map((msg, index) => {
    const div = document.createElement("div");
    div.className = `message ${msg.role}`;

    if (msg.role === "assistant") {
      // Simple markdown-like formatting
      div.innerHTML = formatMessage(msg.content);
    } else {
      div.textContent = msg.content;
    }

    return div;
  });

  // Filter out initial "Hi" message from display
  const displayMessages = messageElements.filter((el, i) => {
    return !(i === 0 && state.messages[0]?.content === "Hi! Let's start learning.");
  });

  messagesContainer.innerHTML = "";
  displayMessages.forEach((el) => messagesContainer.appendChild(el));
  scrollToBottom();
}

// Format message with basic markdown
function formatMessage(text) {
  return text
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/^/, "<p>")
    .replace(/$/, "</p>");
}

// Show loading indicator
function showLoading() {
  const loadingDiv = document.createElement("div");
  loadingDiv.className = "message assistant loading";
  loadingDiv.id = "loading-indicator";
  loadingDiv.innerHTML = `
    <div class="typing-indicator">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;
  messagesContainer.appendChild(loadingDiv);
  scrollToBottom();
}

// Hide loading indicator
function hideLoading() {
  const loading = document.getElementById("loading-indicator");
  if (loading) loading.remove();
}

// Show error message
function showError(text) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "message assistant";
  errorDiv.style.background = "#ffe6e6";
  errorDiv.style.color = "#cc0000";
  errorDiv.textContent = text;
  messagesContainer.appendChild(errorDiv);
}

// Enable/disable input
function setInputEnabled(enabled) {
  userInput.disabled = !enabled;
  sendBtn.disabled = !enabled;
}

// Scroll to bottom of messages
function scrollToBottom() {
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Start the app
init();
