import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import { mainUrl } from "../api/index";
import { useHistory } from "react-router-dom";
import { UserContext } from "../App.js";
import Mute from "../assets/images/VideoCalling/mute.png";
import Unmute from "../assets/images/VideoCalling/unmute.png";
import VideoOn from "../assets/images/VideoCalling/videoOn.png";
import VideoOff from "../assets/images/VideoCalling/videoOff.png";
import Leave from "../assets/images/VideoCalling/end-call.png";
import "./Room.css";
// import { createTeam } from "../api/chatting";

// const Container = styled.div``;

const StyledVideo = styled.video``;

const Video = (props) => {
  const ref = useRef();
  const [constraints, setConstraints] = useState(props.constraints);
  // console.log(props);

  useEffect(() => {
    props.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;

      ref.current.play();
    });
    setConstraints(props.constraints);
  }, [props]);

  // console.log(constraints);
  useEffect(() => {
    setConstraints(props.constraints);
  }, [props.constraints]);

  // useEffect(() => {
  // console.log(props.peer);
  // const isVideoOn = useCallback(() => {
  //   if (props.peer._remoteTracks) {
  //     console.log(props.peer._remoteTracks);
  //     const videoTrack = props.peer._remoteTracks.find(
  //       (track) => track.track.kind === "video"
  //     );

  //     if (videoTrack) {
  //       console.log(videoTrack.track);
  //       console.log(videoTrack.stream.getVideoTracks()[0]);
  //       return videoTrack.track.enabled;
  //     } else return true;
  //   }
  //   return true;
  //   // return true;
  // }, [props.peer]);

  return (
    <>
      {/* {!constraints.video && <div>NO VIDEO PEER</div>} */}
      <StyledVideo
        playsInline
        autoPlay
        ref={ref}
        className={`peerVideo${props.constraints.video} ${props.classNameType}`}
        // className="peerVideo"
      />
      <div
        className={`videoOff-${!props.constraints.video} ${
          props.videoOffclassNameType
        }`}
      >
        {!constraints.video && <div className="videoOffName">EK</div>}
      </div>
    </>
  );
};

// const videoConstraints = {
//   height: window.innerHeight / 2,
//   width: window.innerWidth / 2,
// };

const Room = (props) => {
  const [peers, setPeers] = useState([]);
  const socketRef = useRef(io(mainUrl));
  const userVideo = useRef();
  const peersRef = useRef([]);
  const roomID = props.match.params.roomID;
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  const [constraints, setConstraints] = useState({ video: true, audio: true });
  const [enter, setEnter] = useState(0);

  // console.log(peers);
  // console.log(peersRef);

  // console.log(socketRef);

  const createPeer = (userToSignal, callerID, constraints, stream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerID,
        constraints,
        signal,
        name: state.name,
      });
    });

    return peer;
  };

  const addPeer = (incomingSignal, callerID, constraints, stream) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", {
        signal,
        callerID,
        constraints,
        name: state.name,
      });
    });

    peer.signal(incomingSignal);

    return peer;
  };

  const addPeersHandler = useCallback((peerObj) => {
    // console.log(peerObj);
    // const foundPeer = peers.find((p) => p.peerID == peerObj.peerID);
    // console.log("YES");
    const prev = peers.filter((p) => p.peerID != peerObj.peerID);
    setPeers((users) => [...prev, peerObj]);
  }, []);

  const joinPerrHandler = useCallback((newPeers) => {
    console.log(newPeers);

    setPeers(newPeers);
  }, []);
  const onVideoHandler = useCallback((payload) => {
    const peerObj = peersRef.current.find((p) => p.peerID == payload.id);
    if (peerObj) peerObj.constraints = payload.constraints;

    const prev = peers.filter((p) => p.peerID != payload.id);
    setPeers((users) => [...prev, peerObj]);
  }, []);

  useEffect(() => {
    // socketRef.current = io.connect("http://localhost:5000");
    console.log("USEeffect");
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setEnter(1);
        console.log(stream);
        console.log(stream.getVideoTracks());
        console.log(stream.getVideoTracks()[0]);
        userVideo.current.srcObject = stream;
        socketRef.current.emit(
          "join room",
          { roomID, name: state.name, userId: state._id },
          (err) => {}
        );
        socketRef.current.on("all users", (users) => {
          // stream.getVideoTracks()[0].enabled = true;
          // stream.getAudioTracks()[0].enabled = true;
          const peers = [];
          users.forEach((user) => {
            const peer = createPeer(
              user.id,
              socketRef.current.id,
              user.constraints,
              stream
            );
            peersRef.current.push({
              peerID: user.id,
              peer,
              constraints: user.constraints,
              name: user.name,
            });
            peers.push({
              peerID: user.id,
              peer,
              constraints: user.constraints,
              name: user.name,
            });
          });
          // setPeers((prev) => peers);
          joinPerrHandler(peers);
        });

        socketRef.current.on("user joined", (payload) => {
          // stream.getVideoTracks()[0].enabled = true;
          // stream.getAudioTracks()[0].enabled = true;
          // setState()
          const peer = addPeer(
            payload.signal,
            payload.callerID,
            payload.constraints,
            stream
          );

          peersRef.current.push({
            peerID: payload.callerID,
            peer,
            constraints: { video: true, audio: true },
            name: payload.name,
          });

          const peerObj = {
            peerID: payload.callerID,
            peer,
            constraints: { video: true, audio: true },
            name: payload.name,
          };

          // setPeers((users) => [...users, peerObj]);
          addPeersHandler(peerObj);
          // socketRef.current.emit("videoOff", {
          //   id: payload.callerID,
          //   roomID,
          //   constraints: {
          //     video: !constraints.video,
          //     audio: constraints.audio,
          //   },
          // setPeers(peersRef.current);

          // stream.getVideoTracks()[0].enabled = constraints.video;
          // stream.getAudioTracks()[0].enabled = constraints.audio;
        });

        socketRef.current.on("receiving returned signal", (payload) => {
          // peersRef.current.forEach((p) => {
          //   if (p.peerID === payload.id) p.constraints = payload.constraints;
          // });
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          item.constraints = payload.constraints;
          // setPeers(peersRef.current);
          item.peer.signal(payload.signal);
        });

        // console.log(stream);

        socketRef.current.on("user videoOff", (payload) => {
          // let item = peers.find((p) => p.peerID === payload.id);
          peersRef.current.forEach((p) => {
            if (p.peerID === payload.id) {
              p.constraints = payload.user.constraints;
            }
          });

          // joinPerrHandler(peersRef.current);
          // joinPerrHandler(peersRef.current);
          onVideoHandler(payload);
          // if(peerObj){
          //   peerObj.constraints = payload.user.constraints;
          // }
        });

        socketRef.current.on("user left", (id) => {
          const peerObj = peersRef.current.find((p) => p.peerID === id);
          if (peerObj) {
            peerObj.peer.destroy();
          }
          const peers = peersRef.current.filter((p) => p.peerID !== id);
          peersRef.current = peers;
          // setPeers(peers);
          joinPerrHandler(peers);
        });
      })
      .catch((err) => {
        console.log(err.name + " " + err.message);
        setEnter(-1);
      });
    setEnter();
  }, []);

  console.log(peers);

  const leaveMeeting = () => {
    socketRef.current.disconnect();
    userVideo.current.srcObject.getTracks().forEach((track) => {
      track.stop();
    });
    userVideo.current.srcObject = null;
    history.push("/chat");
  };

  const toggleVideo = () => {
    // console.log(userVideo.current.srcObject.getVideoTracks()[0]);
    userVideo.current.srcObject.getVideoTracks()[0].enabled =
      !constraints.video;
    // console.log(userVideo.current.srcObject.getVideoTracks()[0]);
    socketRef.current.emit("videoOff", {
      id: socketRef.current.id,
      roomID,
      constraints: {
        video: !constraints.video,
        audio: constraints.audio,
      },
    });

    setConstraints((prev) => ({ ...prev, video: !prev.video }));
  };
  const toggleAudio = () => {
    // console.log(userVideo.current.srcObject.getVideoTracks()[0]);
    userVideo.current.srcObject.getAudioTracks()[0].enabled =
      !constraints.audio;
    // console.log(userVideo.current.srcObject.getAudioTracks()[0]);

    setConstraints((prev) => ({ ...prev, audio: !prev.audio }));
  };

  // console.log(peers);

  return (
    <div>
      {enter === 1 && (
        <div className="videoCalling">
          <div className="headVideoPanel">
            <div className="controlVideo" onClick={toggleAudio}>
              <img src={constraints.audio ? Mute : Unmute} alt="mute" />
            </div>
            <div className="controlVideo" onClick={toggleVideo}>
              <img
                src={constraints.video ? VideoOn : VideoOff}
                alt="video off"
              />
            </div>
            <div className="controlVideo " onClick={leaveMeeting}>
              <div className="leave">
                <img src={Leave} alt="video off" /> Leave
              </div>
            </div>
          </div>
          <div className="videos">
            <>
              <StyledVideo
                muted
                ref={userVideo}
                autoPlay
                playsInline
                className={`userVideo${constraints.video} videoFor${
                  peers.length + 1
                }`}
              />
              <div
                className={`videoOff-${!constraints.video} videoOffFor${
                  peers.length + 1
                }`}
              >
                {!constraints.video && <div className="videoOffName">EK</div>}
              </div>
            </>

            {peers &&
              peers.map((peer) => {
                return (
                  <>
                    {" "}
                    <Video
                      key={peer.peerID}
                      peer={peer.peer}
                      constraints={peer.constraints}
                      peerData={peer}
                      peerClassVideo={`peerVideo${peer.constraints.video}`}
                      peerClassVideoOff={`videoOff-${!peer.constraints.video}`}
                      classNameType={`videoFor${peers.length + 1}`}
                      videoOffclassNameType={`videoOffFor${peers.length + 1}`}
                    />
                  </>
                );
              })}
          </div>
        </div>
      )}
      {enter === 0 && (
        <h1 className="videoCalling">LOADINGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG</h1>
      )}
      {enter === -1 && <h1 className="videoCalling">CANNOT CONNECT</h1>}
    </div>
  );
};

export default Room;
