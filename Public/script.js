document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    const addMessage = (text, sender) => {
        const message = document.createElement('div');
        message.classList.add('message', `${sender}-message`);
        message.textContent = text;
        chatBox.appendChild(message);
        // Smooth scroll to the bottom
        chatBox.scrollTop = chatBox.scrollHeight;
    };

    const showTypingIndicator = () => {
        const indicator = document.createElement('div');
        indicator.classList.add('message', 'agent-message', 'typing-indicator');
        indicator.innerHTML = '<span></span><span></span><span></span>';
        chatBox.appendChild(indicator);
        chatBox.scrollTop = chatBox.scrollHeight;
        return indicator;
    };

    const handleSendMessage = async () => {
        const messageText = userInput.value.trim();
        if (!messageText) return;

        // Add user's message to the UI
        addMessage(messageText, 'user');
        userInput.value = '';

        // Show typing indicator
        const typingIndicator = showTypingIndicator();

        try {
            // Send message to the server's API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: messageText }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            // Remove typing indicator and add agent's response
            chatBox.removeChild(typingIndicator);
            addMessage(data.reply, 'agent');

        } catch (error) {
            console.error('Error:', error);
            chatBox.removeChild(typingIndicator);
            addMessage('Sorry, I encountered an error. Please try again.', 'agent');
        }
    };

    sendBtn.addEventListener('click', handleSendMessage);
    userInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    });

    // Initial greeting from the agent
    setTimeout(() => {
        addMessage("Hello! I am an analyst specializing in Berkshire Hathaway's shareholder letters. How can I help you today?", 'agent');
    }, 500);
});