document.addEventListener('DOMContentLoaded', () => {
    const currentUser = prompt("Please enter your name:", "Manjari");
    if (!currentUser) {
        alert("A name is required to join the chat.");
        document.body.innerHTML = 'Please refresh and enter a name to chat.';
        return;
    }

    const socket = io();

    const messageForm = document.querySelector('.chat-footer'); // Form is the whole footer now
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const messageArea = document.getElementById('message-area');
    const anonToggleButton = document.getElementById('anon-toggle');
    const anonStatusBar = document.getElementById('anonymous-status');
    
    let isAnonymous = false;

    anonToggleButton.addEventListener('click', () => {
        isAnonymous = !isAnonymous;
        anonToggleButton.classList.toggle('anonymous-on', isAnonymous);
        anonStatusBar.style.display = isAnonymous ? 'flex' : 'none';
    });

    const sendMessage = () => {
        if (messageInput.value.trim()) {
            const messageData = {
                sender_name: isAnonymous ? 'Anonymous' : currentUser,
                message_text: messageInput.value,
                is_anonymous: isAnonymous,
            };
            socket.emit('chat message', messageData);
            messageInput.value = '';
            messageInput.focus();
        }
    };
    
    // Send message on button click or Enter key press
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });

    socket.on('chat message', (msg) => {
        appendMessage(msg);
    });

    function appendMessage(msg) {
        const isSentByMe = (msg.sender_name === currentUser) && !msg.is_anonymous;
        
        const wrapper = document.createElement('div');
        wrapper.classList.add('message-wrapper', isSentByMe ? 'sent' : 'received');

        let messageHTML = '';
        
        // Avatar for received messages
        if (!isSentByMe) {
            const avatarLetter = msg.is_anonymous ? 'A' : msg.sender_name.charAt(0).toUpperCase();
            const avatarSrc = msg.is_anonymous ? '' : `https://i.pravatar.cc/30?u=${msg.sender_name}`;
            messageHTML += `<div class="avatar">${msg.is_anonymous ? '' : `<img src="${avatarSrc}" alt="${avatarLetter}">`}</div>`;
        }

        const formattedTime = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        const readReceipt = isSentByMe ? '<i class="fa-solid fa-check-double"></i>' : '';
        
        messageHTML += `
            <div class="message-content-wrapper">
                ${!isSentByMe && !msg.is_anonymous ? `<div class="sender-name">${msg.sender_name}</div>` : ''}
                <div class="message ${isSentByMe ? 'sent' : 'received'}">
                    <p>${msg.message_text}</p>
                    <div class="timestamp">
                        ${formattedTime} ${readReceipt}
                    </div>
                </div>
            </div>
        `;
        
        wrapper.innerHTML = messageHTML;
        messageArea.appendChild(wrapper);
        messageArea.scrollTop = messageArea.scrollHeight;
    }

    async function loadInitialMessages() {
        try {
            const response = await fetch('/messages');
            if (!response.ok) throw new Error('Failed to fetch messages');
            const messages = await response.json();
            messages.forEach(msg => appendMessage(msg));
        } catch (error) {
            console.error(error);
        }
    }
    
    loadInitialMessages();
});