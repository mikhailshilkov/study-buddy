// Study Buddy - Client Application

const state = {
  currentTopic: null,
  currentUser: null,
  messages: [],
  isLoading: false,
};

// DOM Elements
const userNameInput = document.getElementById("user-name");
const topicSelect = document.getElementById("topic");
const messagesContainer = document.getElementById("messages");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Initialize app
async function init() {
  await loadTopics();

  userNameInput.addEventListener("input", handleUserNameChange);
  userNameInput.addEventListener("change", handleUserNameChange);
  topicSelect.addEventListener("change", handleTopicChange);
  chatForm.addEventListener("submit", handleSubmit);

  // Check URL for parameters
  const urlParams = new URLSearchParams(window.location.search);
  const userFromUrl = urlParams.get("user");
  const topicFromUrl = urlParams.get("topic");

  if (userFromUrl) {
    userNameInput.value = userFromUrl;
    state.currentUser = userFromUrl;
    topicSelect.disabled = false;
  }

  if (topicFromUrl && state.currentUser && topicSelect.querySelector(`option[value="${topicFromUrl}"]`)) {
    topicSelect.value = topicFromUrl;
    await handleTopicChange({ target: topicSelect });
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

// Handle user name change
function handleUserNameChange(e) {
  const name = e.target.value.trim();
  state.currentUser = name || null;

  // Enable/disable topic selector based on whether we have a name
  topicSelect.disabled = !name;

  if (!name) {
    // Reset if name is cleared
    state.currentTopic = null;
    state.messages = [];
    topicSelect.value = "";
    renderMessages();
    setInputEnabled(false);
    updateUrl();
  } else {
    updateUrl();
    // If a topic is already selected, reload its history
    if (state.currentTopic) {
      loadHistory();
    }
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
    updateUrl();
    return;
  }

  state.currentTopic = topicId;
  state.messages = [];
  updateUrl();

  // Clear and show loading
  messagesContainer.innerHTML = "";
  setInputEnabled(false);

  // Try to load existing history
  const hasHistory = await loadHistory();

  if (!hasHistory) {
    // Start new conversation
    await sendMessage("Hi! Let's start learning.");
  }

  setInputEnabled(true);
  userInput.focus();
}

// Load conversation history from server
async function loadHistory() {
  if (!state.currentUser || !state.currentTopic) return false;

  try {
    const response = await fetch(
      `/api/history?user=${encodeURIComponent(state.currentUser)}&topic=${encodeURIComponent(state.currentTopic)}`
    );
    const data = await response.json();

    if (data.messages && data.messages.length > 0) {
      state.messages = data.messages;
      renderMessages();
      scrollToBottom();
      return true;
    }
  } catch (error) {
    console.error("Failed to load history:", error);
  }
  return false;
}

// Update URL with current state
function updateUrl() {
  const url = new URL(window.location);

  if (state.currentUser) {
    url.searchParams.set("user", state.currentUser);
  } else {
    url.searchParams.delete("user");
  }

  if (state.currentTopic) {
    url.searchParams.set("topic", state.currentTopic);
  } else {
    url.searchParams.delete("topic");
  }

  history.replaceState(null, "", url);
}

// Handle form submission
async function handleSubmit(e) {
  e.preventDefault();

  const text = userInput.value.trim();
  if (!text || state.isLoading || !state.currentTopic || !state.currentUser) return;

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
        user: state.currentUser,
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

  if (displayMessages.length === 0 && !state.currentTopic) {
    messagesContainer.innerHTML = `
      <div class="welcome-message">
        <p>Welcome to Study Buddy!</p>
        <p>Enter your name and select a topic to start learning.</p>
      </div>
    `;
  } else {
    displayMessages.forEach((el) => messagesContainer.appendChild(el));
  }

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
