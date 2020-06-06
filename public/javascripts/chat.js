$(function () {
  console.log('chat.js running');

  // connection to socket
  const socket = io.connect('http://localhost:3000');

  // selector html
  const $userOnlineList = $('#chat_user_online');
  const $chatroom = $('#chat_room');
  const $feedback = $('#chat_feedback');
  const $message = $('#chat_message');
  const $btnSend = $('#chat_send_message');
  const nickName = Math.random().toString(36).replace(/[^a-zA-z]+/g, '').substr(0, 10);

  // emit event name 'set_username'
  socket.emit('set_username', { nickName: nickName });
  socket.on('get_users_online', data => {
    let html = '';
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      html += `
        <li class="list-group-item p-2">
          <div class="media">
            <img class="mr-2" src="https://api.adorable.io/avatars/48/${item.username}.png" alt="${item.username}.png">
            <div class="media-body">
              <span>${item.username}</span>
              <span class="chat-user__status online float-right material-icons">fiber_manual_record</span>
            </div>
          </div>
        </li>`;
      $userOnlineList.html(html)
    }
  });


  // emit 'typing'
  $message.bind('keypress', e => {
    let keycode = (e.keyCode ? e.keyCode : e.which);
    // console.log(keycode);
    if (keycode !== 13) {
      // console.log('typing');
      socket.emit('typing')
    }
  });
  socket.on('typing', data => {
    $feedback.html(`<i><strong>${data.username} &nbsp;</strong><span>is typing a message...</span></i>`)
  });

  // send new message to all user in server
  // when clicked button send message
  $btnSend.on('click', () => {
    socket.emit('new_message', {
      username: nickName,
      ssage: $message.val()
    })
  });
  // when press enter key in input message
  $message.on('keypress', e => {
    let keycode = (e.keyCode ? e.keyCode : e.which);
    if (keycode === 13) {
      console.log('sended');
      socket.emit('new_message', {
        username: nickName,
        message: $message.val()
      })
    }
  });

  // listen on emit event name 'new_message'
  socket.on('new_message', data => {
    $feedback.html('');
    $message.val('');
    console.log(data);

    // append new message on the chatroom
    $('#chat_room').append(`
      <div>
        <strong>${data.username}: &nbsp;</strong>
        <span>${data.message}</span>
      </div>
    `)

    keepTheChatRoomToTheBottom();
  });


  // function keep the chatbox stick to the bottom
  const keepTheChatRoomToTheBottom = () => {
    $chatroom.scrollTop = $chatroom.scrollHeight - $chatroom.clientHeight
  };
});