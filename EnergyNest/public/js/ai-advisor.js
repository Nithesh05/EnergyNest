document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatHistory = document.getElementById('chat-history');

    const appendMessage = (text, sender) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${sender}`;
        
        const iconDiv = document.createElement('i');
        iconDiv.className = 'msg-icon';
        iconDiv.setAttribute('data-lucide', sender === 'ai' ? 'bot' : 'user');
        
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'msg-bubble';
        
        // Parse markdown loosely to HTML
        let sanitizedText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        // Convert basic bold (**bold**) to <strong>bold</strong>
        sanitizedText = sanitizedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Convert basic new lines to <br>
        sanitizedText = sanitizedText.replace(/\n/g, '<br>');
        
        bubbleDiv.innerHTML = sanitizedText;
        
        msgDiv.appendChild(iconDiv);
        msgDiv.appendChild(bubbleDiv);
        
        chatHistory.appendChild(msgDiv);
        
        // Re-render icons
        if(window.lucide) window.lucide.createIcons();
        
        // Scroll to bottom
        chatHistory.scrollTop = chatHistory.scrollHeight;
    };

    const addTypingIndicator = () => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ai typing-indicator`;
        msgDiv.id = 'typing-indicator';
        
        msgDiv.innerHTML = `
            <i data-lucide="bot" class="msg-icon"></i>
            <div class="msg-bubble" style="display:flex;gap:4px;align-items:center;min-height:24px;">
                <span style="font-size:1.5rem; line-height:0; display:inline-block; animation: pulseAnim 1s infinite alternate;">.</span>
                <span style="font-size:1.5rem; line-height:0; display:inline-block; animation: pulseAnim 1s infinite alternate; animation-delay: 0.2s">.</span>
                <span style="font-size:1.5rem; line-height:0; display:inline-block; animation: pulseAnim 1s infinite alternate; animation-delay: 0.4s">.</span>
            </div>
        `;
        
        chatHistory.appendChild(msgDiv);
        if(window.lucide) window.lucide.createIcons();
        chatHistory.scrollTop = chatHistory.scrollHeight;
    };

    const removeTypingIndicator = () => {
        const indicator = document.getElementById('typing-indicator');
        if(indicator) {
            indicator.remove();
        }
    };

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const message = chatInput.value.trim();
        if(!message) return;

        // Display user message
        appendMessage(message, 'user');
        chatInput.value = '';
        
        // Add typing indicator
        addTypingIndicator();

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });
            const data = await res.json();
            
            removeTypingIndicator();
            
            if(data.reply) {
                appendMessage(data.reply, 'ai');
            } else if (data.error) {
                appendMessage(`**Error:** ${data.error}`, 'ai');
            }
        } catch (error) {
            console.error('Chat error:', error);
            removeTypingIndicator();
            appendMessage(`**Connection Error:** Unable to reach the AI Advisor.`, 'ai');
        }
    });
});
