const API_BASE_URL = "http://localhost:8080/api";

async function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
        const data = await response.json();
        print(data);
        localStorage.setItem("token", data.accessToken);
        document.getElementById("login-form").style.display = "none";
        document.getElementById("chat-section").style.display = "block";
    } else {
        alert("Login failed!");
    }
}

async function handleSignup(event) {
    event.preventDefault();
    const username = document.getElementById("signup-username").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
    });

    if (response.ok) {
        alert("Signup successful! Please login.");
        document.getElementById("signup-form").style.display = "none";
    } else {
        alert("Signup failed!");
    }
}

function createChatRoom(event) {
    event.preventDefault();

    const chatRoomName = document.getElementById('chat-room-name').value;
    const user1Id = document.getElementById('user1-id').value;
    const user2Id = document.getElementById('user2-id').value;

    const chatRoomData = {
        name: chatRoomName,
        createdBy: user1Id,
        users: [user1Id, user2Id] // An array of user IDs
    };

    fetch(`http://localhost:8080/api/chat_rooms/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`,

        },
        body: chatRoomData,
    })
        .then(response => response.json())
        .then(data => {
            alert(`Chat room "${data.name}" created successfully!`);
        })
        .catch(error => {
            console.error('Error creating chat room:', error);
            alert('Failed to create chat room. Please try again.');
        });
}
async function sendMessage(event) {
    event.preventDefault();
    const messageContent = document.getElementById("message-content").value;

    const response = await fetch(`${API_BASE_URL}/messages/send`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ content: messageContent }),
    });

    if (response.ok) {
        const message = await response.json();
        const messagesDiv = document.getElementById("messages");
        const messageDiv = document.createElement("div");
        messageDiv.textContent = message.content;
        messagesDiv.appendChild(messageDiv);
        document.getElementById("message-content").value = "";
    } else {
        alert("Failed to send message.");
    }
}
