const joinNs = (element, nsData) =>{
    const nsEndpoint = element.getAttribute('ns');

    const clickedNs = nsData.find(row=>{
        return row.endpoint === nsEndpoint;
    })
    //global so we can sub,it new message
    selectedNsId = clickedNs.id;
    
    const rooms = clickedNs.rooms;

    let roomList = document.querySelector('.room-list');

    roomList.innerHTML = "";
    
    let firstRoom;

    rooms.forEach((room, i)=>{
        if(i===0){
            firstRoom = room.roomTitle;
        }
        roomList.innerHTML += `<li class="room" namespaceId=${room.namespaceId}>
        <span class="fa-solid fa-${room.privateRoom ? 'lock' : 'globe'} "></span>${room.roomTitle}</li>`
    })
    //init join first room
    joinRoom(firstRoom, clickedNs.id)

    const roomNodes = document.querySelectorAll('.room');
    Array.from(roomNodes).forEach(element=>{
        element.addEventListener('click', e=>{
            // console.log("Someone clicked on" + e.target.innerText);
            const namespaceId = element.getAttribute('namespaceId');
            joinRoom(e.target.innerText, namespaceId);
        })
    })
}