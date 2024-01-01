const express = require('express');
const app = express();
const socketio = require('socket.io');
const Room = require('./classes/Room');

const namespaces = require('./data/namespaces');



app.use(express.static( __dirname + '/public'));

const expressServer = app.listen(8000);
const io = socketio(expressServer);



//change namespace
app.get('/change-ns', (req,res)=>{
    namespaces[0].addRoom(new Room(0, 'Deleted Articles', 0));
    io.of(namespaces[0].endpoint).emit('nsChange', namespaces[0]);
    res.json(namespaces[0]);
})

io.on('connection', (socket)=>{
    socket.emit('welcome', "Welcome to the server.");
    socket.emit('nsList', namespaces);

})

namespaces.forEach(namespace=>{
    io.of(namespace.endpoint).on('connection', (socket)=>{
        // console.log(`${socket.id} has connected to ${namespace.endpoint}`);
        socket.on('joinRoom', async (roomObj, ackCallBack)=>{

            const thisNs = namespaces[roomObj.namespaceId];
            const thisRoomObj = thisNs.rooms.find(room=>room.roomTitle===roomObj.roomTitle);

            const thisRoomsHistory = thisRoomObj.history;
            const rooms = socket.rooms;
            let i = 0;
            rooms.forEach(room=>{
                if(i!==0){
                    socket.leave(room);
                }
                i++;
            })

            //fetch history
            socket.join(roomObj.roomTitle); 

            const sockets = await io.of(namespace.endpoint).in(roomObj.roomTitle).fetchSockets();
            const socketCount = sockets.length;

            ackCallBack({
                numUsers: socketCount,
                thisRoomsHistory,
            })
        })

        socket.on('newMessageToRoom', messageObj=>{
            
            const rooms = socket.rooms;
            const currentRoom = [...rooms][1];
            io.of(namespace.endpoint).in(currentRoom).emit('messageToRoom', messageObj)
            //push this message to history
            const thisNs = namespaces[messageObj.selectedNsId];
            const thisRoom = thisNs.rooms.find(room=>room.roomTitle===currentRoom)
            thisRoom.addMessage(messageObj);
            
        })
    })
})