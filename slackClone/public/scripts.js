const userName = prompt("Username");
const password = "kirchoff";

const clientOptions = {
    auth:{
        userName,
        password
    }
}

const socket = io("http://localhost:8000", clientOptions);

const nameSpaceSockets = [];

const listeners = {
  nsChange: [],
  messageToRoom: [],
};

let selectedNsId = 0;

document.querySelector("#message-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const newMessage = document.querySelector("#user-message").value;
  // console.log(newMessage, selectedNsId);
  nameSpaceSockets[selectedNsId].emit("newMessageToRoom", {
    newMessage,
    date: Date.now(),
    avatar: "https://via.placeholder.com/30",
    userName: userName,
    selectedNsId,
  });
  document.querySelector("#user-message").value = ""
});

//manage all listeners
const addListeners = (nsId) => {
  if (!listeners.nsChange[nsId]) {
    nameSpaceSockets[nsId].on("nsChange", (data) => {
      console.log("Namespace Changed!");
      console.log(data);
    });
    listeners.nsChange[nsId] = true;
  }
  if (!listeners.messageToRoom[nsId]) {
    nameSpaceSockets[nsId].on("messageToRoom", (messageObj) => {
    //   console.log(buildMessageHtml(messageObj));
      document.querySelector("#messages").innerHTML += buildMessageHtml(messageObj);
    });
    listeners.messageToRoom[nsId] = true;
  }
};

socket.on("connect", () => {
  console.log("Connected");
  socket.emit("clientConnect");
});
//ns list event
socket.on("nsList", (nsData) => {
  const nameSpaceDiv = document.querySelector(".namespaces");
  nameSpaceDiv.innerHTML = "";
  nsData.forEach((ns) => {
    nameSpaceDiv.innerHTML += `<div class="namespace" ns="${ns.endpoint}"><img src="${ns.image}"></div>`;

    let thisNs = nameSpaceSockets[ns.id];
    if (!nameSpaceSockets[ns.id]) {
      nameSpaceSockets[ns.id] = io(`http://localhost:8000${ns.endpoint}`);
    }

    addListeners(ns.id);
  });

  Array.from(document.getElementsByClassName("namespace")).forEach(
    (element) => {
      element.addEventListener("click", (e) => {
        joinNs(element, nsData);
      });
    }
  );

  joinNs(document.getElementsByClassName("namespace")[0], nsData);
});


