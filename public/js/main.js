const socket = io();

const chatForm = document.getElementById('chat-form')
const chats = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')

// Get useraname and room from url
const {username , room} = Qs.parse(location.search, {
    ignoreQueryPrefix : true // symbols
})

// Join room event emit
socket.emit('join-room' , {username,room})

// get room and users
socket.on('show-Room-users',({room,users}) =>{
    outputRoomName(room);
    outputRoomUsers(users);
})

// in basics we emitted separate event everytime
// coz we have diff html position for left/recived/sent
// here we append at the same place
// but we can handle with same name if working is same

socket.on('showMessage', message =>{
    console.log(message)
    appendMessage(message)

    // scroll to last msg  , refocus cursor
    chats.scrollTop = chats.scrollHeight
})

// message submit  : get message
// emit event to recive msg to  server
// at server emit event to add to dom

chatForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const messageInp = document.getElementById('msg')
    const message= messageInp.value ;
    socket.emit('send' , message)
    messageInp.value=''
    messageInp.focus();
}) 


// creatimg message box for html
// dynamically populating everytime

function appendMessage(message){
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `<p class="meta"> ${message.username} <span> ${message.time} </span></p>
    <p class="text">
        ${message.text}
    </p>`
    
    chats.append(div)
}

// Add room name to dom
function outputRoomName(room){
    roomName.innerText=room;
}

// Add users to DOM
function outputRoomUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
      const li = document.createElement('li');
      li.innerText = user.username;
      userList.appendChild(li);
    });
  }


//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom? 🥺');
    if (leaveRoom) {
      window.location = '../index.html';
    } else {
    }
  });
  