// const videoConstraints = {
//   height: window.innerHeight / 2,
//   width: window.innerWidth / 2,
// };

// let socket;

// const Room = (props) => {
//   const [peers, setPeers] = useState([]);
//   const [me, setMe] = useState();
//   const [message, setMessage] = useState("");
//   const socketRef = useRef();
//   const userVideo = useRef();
//   let peersRef = useRef([]);
//   const roomID = props.match.params.roomID;

//   console.log(peers);
//   //   console.log(socketRef);

//   //   useEffect(() => {
//   //
//   //   }, [socketRef, message]);

//   useEffect(() => {
//     // socket = io.connect("http://localhost:5000/");
//     socket = io("http://localhost:5000/");
//     var latency = 0;

//     socket.on("pong", function (ms) {
//       latency = ms;

//       console.log(latency);
//     });

//     navigator.mediaDevices
//       .getUserMedia({ video: videoConstraints, audio: true })
//       .then((stream) => {
//         userVideo.current.srcObject = stream;
//         socket.emit("join room", roomID);
//         socket.on("again", (data) => {
//           console.log("DATA");
//         });
//         socket.on("all users", (users) => {
//           const peers = [];
//           peersRef.current = [];
//           console.log(peersRef);
//           console.log("GOOD");
//           console.log(users);
//           users.forEach((userID) => {
//             const peer = createPeer(userID, socket.id, stream);
//             peersRef.current.push({
//               peerID: userID,
//               peer,
//             });
//             peers.push(peer);
//           });
//           setPeers(peers);
//         });

//         socket.on("user disconnected", ({ user }) => {
//           console.log("disconnected");
//           console.log(user);
//           console.log(peers);
//           console.log(peersRef);
//           // peers.forEach((peer) => {
//           //   // peer.on("close", () => {
//           //   //   const newPeers = peers.filter((p) => p._id != peer._id);
//           //   //   setPeers(newPeers);
//           //   //   peer.destory();
//           //   // });
//           //   console.log(peer);
//           // });
//           // // peersRef.forEach(p => {
//           //   console.log(p);
//           // })
//           // peersRef.current = peersRef.current.filter((p) => p.peerId != user);
//           // let foundId = peersRef.current.map((p, i) =>
//           //   p.peerID === user ? i : null
//           // );
//           // console.log(foundId);

//           // foundId = foundId.filter((p) => p != null);
//           // // if (foundId.length != 0) peersRef.current.splice(foundId[0], 1);
//           // for (let i = 0; i < peersRef.length; i++) {
//           //   if (peersRef[i].peerId == user) {
//           //     peersRef.current.splice(i, 1);
//           //   }
//           // }
//           console.log(peersRef);
//           setMessage("userLeft");
//         });

//         socket.on("me", (myData) => {
//           console.log("NICE");
//           setMe(myData);
//         });

//         socket.on("user joined", (payload) => {
//           const peer = addPeer(payload.signal, payload.callerID, stream);
//           peersRef.current.push({
//             peerID: payload.callerID,
//             peer,
//           });

//           setPeers((users) => [...users, peer]);
//         });

//         socket.on("receiving returned signal", (payload) => {
//           const item = peersRef.current.find((p) => p.peerID === payload.id);
//           item.peer.signal(payload.signal);
//         });
//       });
//   }, [message]);

//   useEffect(() => {
//     socket.on('')
//   })

//   function createPeer(userToSignal, callerID, stream) {
//     const peer = new Peer({
//       initiator: true,
//       trickle: false,
//       stream,
//     });

//     peer.on("signal", (signal) => {
//       socket.emit("sending signal", {
//         userToSignal,
//         callerID,
//         signal,
//       });
//     });

//     return peer;
//   }

//   function addPeer(incomingSignal, callerID, stream) {
//     const peer = new Peer({
//       initiator: false,
//       trickle: false,
//       stream,
//     });

//     peer.on("signal", (signal) => {
//       socket.emit("returning signal", { signal, callerID });
//     });

//     peer.signal(incomingSignal);

//     return peer;
//   }

//   return (
//     <Container>
//       <StyledVideo muted ref={userVideo} autoPlay playsInline />
//       {peers.map((peer, index) => {
//         return <Video key={index} peer={peer} />;
//       })}
//       {peers.length}
//     </Container>
//   );
// };

// export default Room;