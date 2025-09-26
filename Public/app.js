// public/app.js
document.addEventListener('DOMContentLoaded', () => {
    const sendButton = document.getElementById('send-button');
    const messageInput = document.getElementById('message-input');
    const messagesContainer = document.getElementById('messages');

    const sendMessage = async () => {
        const messageText = messageInput.value.trim();
        if (messageText === '') return;

        // Display user message
        const userMessageElem = document.createElement('div');
        userMessageElem.className = 'message user';
        userMessageElem.textContent = messageText;
        messagesContainer.appendChild(userMessageElem);

        messageInput.value = '';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            // Send message to the server
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

            // Display agent response
            const agentMessageElem = document.createElement('div');
            agentMessageElem.className = 'message agent';
            agentMessageElem.textContent = data.reply;
            messagesContainer.appendChild(agentMessageElem);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

        } catch (error) {
            console.error('Error:', error);
            const errorMessageElem = document.createElement('div');
            errorMessageElem.className = 'message agent';
            errorMessageElem.textContent = 'Sorry, I ran into an error. Please try again.';
            messagesContainer.appendChild(errorMessageElem);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    };

    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
});