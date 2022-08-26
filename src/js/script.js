let messages = [];
let users = [];
let myname = "";
let input = document.getElementById("my-message");

input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("myBtn").click();
  }
});

function addUserName() {
	document.querySelector(".name-enter").classList.toggle("hidden");
	document.querySelector(".name-enter-loading").classList.toggle("hidden");
	myname = document.querySelector("#my-username").value;

	const newUserName = {
		name: myname,
	};

	const promisse = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", newUserName);
	promisse.then(getParticipants);
	promisse.then(getMessages);
	promisse.then(loginScreen);
	promisse.catch(statusErrorLogin);
	setInterval(getMessages, 3000);
	setInterval(statusUser, 5000);
	setInterval(getParticipants, 10000);
}

function getParticipants() {
	const promisse = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
	promisse.then(participantsArrived);
}

function participantsArrived(data) {
	users = data.data;
	renderUsers();
}

function renderUsers() {
	const user = document.querySelector(".choose-contact");
	user.innerHTML = `
	<div class="contacts">
	<div class="ion-icon-p">
	<ion-icon name="people-circle"></ion-icon>
	<p>Todos</p>
	</div>
	<ion-icon class="check" name="checkmark-outline"></ion-icon>
	</div>	
	`;

	for (let i = 0; i < users.length; i++) {
		user.innerHTML += `
		<div class="contacts">
		<div class="ion-icon-p">
		<ion-icon name="person-circle"></ion-icon>
		<p>${users[i].name}</p>
		</div>
		<ion-icon class="check hidden" name="checkmark-outline"></ion-icon>
		</div>	
		`;
	}
}

function statusUser() {
	const userNameActive = {
		name: myname,
	};

	axios.post("https://mock-api.driven.com.br/api/v6/uol/status", userNameActive);
}

function sendMessage() {
	const message = document.querySelector("#my-message");

	const newMessage = {
		from: myname,
		to: "Todos",
		text: message.value,
		type: "message",
	};

	const promisse = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", newMessage);
	promisse.then(getMessages);
	promisse.catch(reloadPage);

	message.value = "";
}

function getMessages() {
	const promisse = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
	promisse.then(messagesArrived);
}


function messagesArrived(data) {
	messages = data.data;
	
	renderMessages();
}

function renderMessages() {
	const message = document.querySelector(".messages");
	message.innerHTML = "";
	
	for (let i = 0; i < messages.length; i++) {
		if (messages[i].type === "message") {
			message.innerHTML += `
			<li class="message">
			<span class="message-time">(${messages[i].time})</span>
			<span class="message-from">${messages[i].from}</span>
			<span>para</span>
			<span class="message-to">${messages[i].to}:</span>
			<span class="message-text">${messages[i].text}</span>				
			</li>
			`;
		} else if (messages[i].type === "status") {
			message.innerHTML += `
			<li class="message status">
			<span class="message-time">(${messages[i].time})</span>
			<span class="message-from">${messages[i].from}</span>
			<span class="message-text">${messages[i].text}</span>	
			</li>
			`;
		} else if (messages[i].type === "private_message" /*&& messages[i].to === myname*/) {
			message.innerHTML += `
			<li class="message private">
			<span class="message-time">(${messages[i].time})</span>
			<span class="message-from">${messages[i].from}</span>
			<span>reservadamente para</span>
			<span class="message-to">${messages[i].to}:</span>
			<span class="message-text">${messages[i].text}</span>
			</li>
			`;
		}
	}
	message.lastElementChild.scrollIntoView();
}

function statusErrorLogin(erro) {
	if (erro.response.status === 400) {
		alert("Usuário já está logado, digite outro nome");
	}
	document.querySelector(".name-enter").classList.toggle("hidden");
	document.querySelector(".name-enter-loading").classList.toggle("hidden");
}

function activateMenu() {
	document.querySelector(".menu").classList.toggle("hidden");
}

function loginScreen() {
	document.querySelector(".login-screen").classList.toggle("hidden");
}

function reloadPage() {
	window.location.reload();
}

