const joinRoom = async (roomTitle, namespaceId) => {
    const ackResp = await nameSpaceSockets[namespaceId].emitWithAck(
    'joinRoom',
    {
      roomTitle,
      namespaceId
    }
  );
  document.querySelector(
    ".curr-room-num-users"
  ).innerHTML = `${ackResp.numUsers} <span class="fa-solid fa-user">`;
  document.querySelector(".curr-room-text").innerHTML = roomTitle;

  document.querySelector('#messages').innerHTML = "";

  ackResp.thisRoomsHistory.forEach(message=>{
    document.querySelector('#messages').innerHTML += buildMessageHtml(message)
  })
};
