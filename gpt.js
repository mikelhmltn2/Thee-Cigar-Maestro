
document.addEventListener('DOMContentLoaded', () => {
  // Enhanced context-aware GPT integration with full data access
  let applicationData = null;

  // Function to get application data from the main page
  function getApplicationData() {
    // Try to access the dataManager from the main page
    if (window.dataManager && window.dataManager.loaded) {
      return window.dataManager.data;
    }
    return null;
  }

  // Enhanced context builder for more intelligent responses
  function buildEnhancedContext(userInput) {
    const data = getApplicationData();
    if (!data) {return userInput;}

    let context = userInput;
    const lowerInput = userInput.toLowerCase();

    // Add relevant cigar data context
    if (data.cigars && data.cigars.length > 0) {
      if (lowerInput.includes('maduro') || lowerInput.includes('dark')) {
        const maduroCigars = data.cigars.filter(c => c.wrapper === 'Maduro');
        if (maduroCigars.length > 0) {
          context += `\n\nAvailable Maduro cigars: ${maduroCigars.slice(0, 3).map(c => c.name).join(', ')}`;
        }
      }
      
      if (lowerInput.includes('connecticut') || lowerInput.includes('mild')) {
        const connecticutCigars = data.cigars.filter(c => c.wrapper === 'Connecticut');
        if (connecticutCigars.length > 0) {
          context += `\n\nAvailable Connecticut cigars: ${connecticutCigars.slice(0, 3).map(c => c.name).join(', ')}`;
        }
      }
    }

    // Add pairing context
    if (data.pairings && data.pairings.pairingEngineV3) {
      if (lowerInput.includes('pair') || lowerInput.includes('drink') || lowerInput.includes('whiskey') || lowerInput.includes('coffee')) {
        const lessons = data.pairings.pairingEngineV3.ceuLessons;
        if (lessons && lessons.length > 0) {
          context += `\n\nPairing expertise: Available lessons on ${lessons.map(l => l.focus).join(', ')}`;
        }
      }
    }

    // Add educational context
    if (data.education && data.education.educationTracks) {
      if (lowerInput.includes('learn') || lowerInput.includes('education') || lowerInput.includes('course')) {
        const {tracks} = data.education.educationTracks;
        if (tracks && tracks.length > 0) {
          context += `\n\nEducational tracks available: ${tracks.map(t => t.title).join(', ')}`;
        }
      }
    }

    // Add emotional/ritual context
    if (data.emotional && data.emotional.ritualFlows) {
      if (lowerInput.includes('ritual') || lowerInput.includes('mood') || lowerInput.includes('relax')) {
        const flows = Object.keys(data.emotional.ritualFlows);
        context += `\n\nRitual experiences available: ${flows.join(', ')}`;
      }
    }

    // Add feature context
    if (data.features && data.features.features) {
      if (lowerInput.includes('feature') || lowerInput.includes('what can')) {
        const implementedFeatures = Object.keys(data.features.features).filter(
          key => data.features.features[key].status === 'Implemented'
        );
        context += `\n\nImplemented features: ${implementedFeatures.slice(0, 5).join(', ')}`;
      }
    }

    return context;
  }

  // Utility function for text sanitization
  function sanitizeText(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'position:fixed;top:20px;right:20px;background:rgba(220,20,60,0.9);color:white;padding:10px;border-radius:4px;z-index:9999;';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
  }

  // Success message function (currently unused)
  function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = 'position:fixed;top:20px;right:20px;background:rgba(0,128,0,0.9);color:white;padding:10px;border-radius:4px;z-index:9999;';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    setTimeout(() => successDiv.remove(), 3000);
  }
  
  // Prevent the unused variable warning
  showSuccess;

  // Enhanced local response system for when API is unavailable
  function generateLocalResponse(input) {
    const data = getApplicationData();
    const lowerInput = input.toLowerCase();

    // Wrapper-specific responses
    if (lowerInput.includes('maduro')) {
      const maduroCigars = data?.cigars?.filter(c => c.wrapper === 'Maduro') || [];
      return `Maduro wrappers offer rich, dark flavors with notes of chocolate and espresso. ${
        maduroCigars.length > 0 ? `I recommend trying: ${maduroCigars[0].name} - ${maduroCigars[0].flavor}` : 'Perfect for evening relaxation.'
      }`;
    }

    if (lowerInput.includes('connecticut')) {
      const ctCigars = data?.cigars?.filter(c => c.wrapper === 'Connecticut') || [];
      return `Connecticut wrappers are mild and creamy, perfect for beginners or morning smokes. ${
        ctCigars.length > 0 ? `Try: ${ctCigars[0].name} - ${ctCigars[0].flavor}` : 'Great with coffee or tea.'
      }`;
    }

    // Pairing responses
    if (lowerInput.includes('pair') && lowerInput.includes('coffee')) {
      return 'Coffee pairs beautifully with Maduro cigars! The dark chocolate and espresso notes in the wrapper complement the coffee\'s richness. Try a San Andrés Maduro with a bold espresso.';
    }

    if (lowerInput.includes('pair') && lowerInput.includes('whiskey')) {
      return 'Whiskey and cigars are a classic combination! Habano wrappers with their spice notes complement bourbon, while smooth Connecticut wrappers work well with lighter whiskeys.';
    }

    // Educational responses
    if (lowerInput.includes('learn') || lowerInput.includes('education')) {
      const tracks = data?.education?.educationTracks?.tracks || [];
      return `I can help you learn about cigars! ${
        tracks.length > 0 ? `Available courses include: ${tracks.map(t => t.title).join(', ')}` : 'Topics include wrapper identification, flavor profiles, and pairing principles.'
      }`;
    }

    // Ritual responses
    if (lowerInput.includes('ritual') || lowerInput.includes('relax')) {
      const flows = data?.emotional?.ritualFlows || {};
      const flowNames = Object.keys(flows);
      return `Cigar rituals enhance the experience through mindfulness. ${
        flowNames.length > 0 ? `Try our ${flowNames[0]} ritual for a perfect session.` : 'Focus on the moment, the flavors, and your surroundings.'
      }`;
    }

    // Feature inquiry responses
    if (lowerInput.includes('what can') || lowerInput.includes('feature')) {
      return 'I can help with cigar recommendations, pairings, educational content, ritual guidance, and lounge experiences. Ask me about specific wrappers, flavors, or what you\'d like to pair your cigar with!';
    }

    // Default responses
    const defaultResponses = [
      'I\'m here to guide your cigar journey. Ask me about pairings, wrappers, or educational content!',
      'Thee Cigar Maestro holds many secrets. What aspect of cigars interests you most?',
      'Whether you\'re a beginner or expert, I can help enhance your cigar experience.',
      'Tell me about your flavor preferences or what you\'d like to learn about cigars.'
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  const assistantBtn = document.createElement('button');
  assistantBtn.textContent = "🧠 Ask the Maestro";
  assistantBtn.id = "gpt-maestro-btn";
  assistantBtn.setAttribute('aria-label', 'Open AI Assistant');
  assistantBtn.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:3;background:#5c4033;color:#f0e6d2;padding:10px 14px;border:none;border-radius:4px;cursor:pointer;font-weight:bold;';
  document.body.appendChild(assistantBtn);

  const chatBox = document.createElement('div');
  chatBox.id = "gpt-chat-box";
  chatBox.setAttribute('role', 'dialog');
  chatBox.setAttribute('aria-labelledby', 'gpt-chat-header');
  chatBox.style.cssText = 'position:fixed;bottom:80px;right:20px;width:350px;background:#1e1e1e;color:#f0e6d2;border:1px solid #444;border-radius:8px;padding:1rem;z-index:999;display:none;max-height:70vh;overflow-y:auto;';

  // Create chat box content securely
  const chatHeader = document.createElement('div');
  chatHeader.id = "gpt-chat-header";
  chatHeader.textContent = "🧠 The Maestro";
  chatHeader.style.fontWeight = 'bold';
  chatHeader.style.marginBottom = '8px';

  const conversationDiv = document.createElement('div');
  conversationDiv.id = "conversation-history";
  conversationDiv.style.cssText = 'max-height:200px;overflow-y:auto;margin-bottom:10px;padding:5px;background:#2c2c2c;border-radius:4px;';

  const inputArea = document.createElement('textarea');
  inputArea.id = "gpt-input";
  inputArea.placeholder = "Ask about pairings, rituals, cigars...";
  inputArea.maxLength = 500;
  inputArea.style.cssText = 'width:100%;height:60px;margin-bottom:8px;background:#2c2c2c;border:1px solid #666;color:#fff;padding:5px;resize:vertical;border-radius:4px;';

  const buttonContainer = document.createElement('div');
  buttonContainer.style.cssText = 'display:flex;gap:8px;margin-bottom:8px;';

  const sendBtn = document.createElement('button');
  sendBtn.id = "gpt-send";
  sendBtn.textContent = "Send";
  sendBtn.style.cssText = 'flex:1;padding:8px;background:#c69c6d;border:none;cursor:pointer;font-weight:bold;border-radius:4px;';

  const clearBtn = document.createElement('button');
  clearBtn.textContent = "Clear";
  clearBtn.style.cssText = 'padding:8px 12px;background:#5c4033;border:none;cursor:pointer;color:#f0e6d2;border-radius:4px;';

  const closeBtn = document.createElement('button');
  closeBtn.textContent = "×";
  closeBtn.style.cssText = 'position:absolute;top:5px;right:5px;background:transparent;border:none;color:#f0e6d2;cursor:pointer;font-size:18px;';
  closeBtn.setAttribute('aria-label', 'Close chat');

  const statusDiv = document.createElement('div');
  statusDiv.id = "gpt-status";
  statusDiv.textContent = "Ready to help with your cigar journey...";
  statusDiv.style.cssText = 'font-style:italic;font-size:12px;color:#999;';

  // Assemble chat box
  buttonContainer.appendChild(sendBtn);
  buttonContainer.appendChild(clearBtn);
  
  chatBox.appendChild(closeBtn);
  chatBox.appendChild(chatHeader);
  chatBox.appendChild(conversationDiv);
  chatBox.appendChild(inputArea);
  chatBox.appendChild(buttonContainer);
  chatBox.appendChild(statusDiv);
  
  document.body.appendChild(chatBox);

  // Add conversation history management
  let conversationHistory = [];

  function addToConversation(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `margin:5px 0;padding:5px;border-radius:3px;background:${isUser ? '#c69c6d' : '#3a3a3a'};color:${isUser ? '#121212' : '#f0e6d2'};`;
    messageDiv.innerHTML = `<strong>${isUser ? 'You' : '🧠 Maestro'}:</strong> ${sanitizeText(message)}`;
    conversationDiv.appendChild(messageDiv);
    conversationDiv.scrollTop = conversationDiv.scrollHeight;

    conversationHistory.push({ message, isUser, timestamp: Date.now() });
    
    // Keep only last 10 messages
    if (conversationHistory.length > 10) {
      conversationHistory.shift();
      if (conversationDiv.firstChild) {
        conversationDiv.removeChild(conversationDiv.firstChild);
      }
    }
  }

  // Event handlers
  assistantBtn.onclick = () => {
    const isOpen = chatBox.style.display !== 'none';
    chatBox.style.display = isOpen ? 'none' : 'block';
    if (!isOpen) {
      inputArea.focus();
      // Check if data is available
      applicationData = getApplicationData();
      if (applicationData) {
        statusDiv.textContent = "🚀 Full data integration active - Ask me anything!";
      } else {
        statusDiv.textContent = "⚠️ Limited data - Some features may be reduced.";
      }
    }
  };

  closeBtn.onclick = () => {
    chatBox.style.display = 'none';
  };

  clearBtn.onclick = () => {
    conversationHistory = [];
    conversationDiv.innerHTML = '';
    statusDiv.textContent = "Conversation cleared. How can I help you?";
  };

  // Enhanced send functionality with validation and security
  async function sendMessage() {
    const input = inputArea.value.trim();
    if (!input) {
      showError('Please enter a message');
      return;
    }

    if (input.length > 500) {
      showError('Message too long. Please keep it under 500 characters.');
      return;
    }

    // Add user message to conversation
    addToConversation(input, true);

    // Disable inputs during request
    sendBtn.disabled = true;
    inputArea.disabled = true;
    statusDiv.textContent = "The Maestro is thinking...";

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      // Build enhanced context with application data
      const enhancedPrompt = buildEnhancedContext(input);

      const res = await fetch("https://theecigarmaestro.vercel.app/api/gpt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          prompt: sanitizeText(enhancedPrompt),
          context: {
            hasData: !!applicationData,
            cigarCount: applicationData?.cigars?.length || 0,
            timestamp: new Date().toISOString()
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }

      const data = await res.json();
      
      if (!data || typeof data.response !== 'string') {
        throw new Error('Invalid response format from server');
      }

      // Add response to conversation
      addToConversation(data.response);
      statusDiv.textContent = "Ready for your next question...";
      inputArea.value = ''; // Clear input on success

    } catch (error) {
      console.error('GPT request failed:', error);
      
      let fallbackResponse;
      if (error.name === 'AbortError') {
        fallbackResponse = "Request timed out. Let me try to help locally...";
        statusDiv.textContent = "Connection timeout - using local assistance";
      } else if (error.message.includes('Failed to fetch')) {
        fallbackResponse = "Network unavailable. Using local knowledge...";
        statusDiv.textContent = "Offline mode - local assistance active";
      } else {
        fallbackResponse = "API unavailable. Let me help with local expertise...";
        statusDiv.textContent = "Local mode active";
      }
      
      // Add fallback message and then local response
      addToConversation(fallbackResponse);
      
      // Generate intelligent local response
      setTimeout(() => {
        const localResponse = generateLocalResponse(input);
        addToConversation(localResponse);
        statusDiv.textContent = "Local assistance ready - Ask me more!";
      }, 500);
      
    } finally {
      // Re-enable inputs
      sendBtn.disabled = false;
      inputArea.disabled = false;
    }
  }

  sendBtn.onclick = sendMessage;

  // Allow Enter key to send (with Shift+Enter for new line)
  inputArea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Close chat with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && chatBox.style.display !== 'none') {
      chatBox.style.display = 'none';
    }
  });

  // Initialize with welcome message when data becomes available
  function checkDataAndInitialize() {
    const data = getApplicationData();
    if (data && !conversationHistory.length) {
      setTimeout(() => {
        addToConversation("Welcome to Thee Cigar Maestro! I have access to all cigar data, pairings, educational content, and ritual guidance. What would you like to explore?");
      }, 2000);
    }
  }

  // Check for data availability every few seconds
  setInterval(checkDataAndInitialize, 3000);
});
