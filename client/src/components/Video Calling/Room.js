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
import { mainUrl } from "../../api/index";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../App.js";
import Mute from "../../assets/images/VideoCalling/mute.png";
import Unmute from "../../assets/images/VideoCalling/unmute.png";
import VideoOn from "../../assets/images/VideoCalling/videoOn.png";
import VideoOff from "../../assets/images/VideoCalling/videoOff.png";
import Leave from "../../assets/images/VideoCalling/end-call.png";
import "./Room.css";
import Loading from "./../General/Loading/Loading";

const StyledVideo = styled.video``;

// Video of other users
const Video = (props) => {
  const ref = useRef();
  const [constraints, setConstraints] = useState(props.constraints);

  useEffect(() => {
    props.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;

      ref.current.play();
    });
    setConstraints(props.constraints);
  }, [props]);

  useEffect(() => {
    setConstraints(props.constraints);
  }, [props.constraints]);

  return (
    <>
      <StyledVideo
        playsInline
        autoPlay
        ref={ref}
        className={`peerVideo${props.constraints.video} ${props.classNameType}`}
      />
      <div
        className={`videoOff-${!props.constraints.video} ${
          props.videoOffclassNameType
        }`}
      >
        {!constraints.video && (
          <div className="videoOffName">
            {props.name.match(/\b(\w)/g).join("")}
          </div>
        )}
      </div>
    </>
  );
};

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
  const [isLoading, setIsLoading] = useState(false);

  // Function to create new peer connection (when the user itself joins)
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

  // Function to add peers when other users join
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
    setPeers((prev) => {
      const newPeers = prev.filter((p) => p.peerID !== peerObj.peerID);
      return [...newPeers, peerObj];
    });
  }, []);

  const joinPerrHandler = (newPeers) => {
    console.log(newPeers);

    setPeers(newPeers);
  };

  const onVideoHandler = useCallback((payload) => {
    setPeers((users) => {
      const peerObj = users.find((p) => p.peerID === payload.id);
      if (peerObj) peerObj.constraints = payload.constraints;
      const prev = users.filter((p) => p.peerID !== payload.id);
      return [...prev, peerObj];
    });
  }, []);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setEnter(1);
        setIsLoading(false);

        // Adding the stream to the userVideo Ref
        userVideo.current.srcObject = stream;

        // when the user connects it joins the room (client to server)
        socketRef.current.emit(
          "join room",
          { roomID, name: state.name, userId: state._id },
          (err) => {}
        );

        // Getting all the users(and there video) for the room from the server
        socketRef.current.on("all users", (users) => {
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
          joinPerrHandler(peers);
        });

        // When a new user joins the video calling room
        socketRef.current.on("user joined", (payload) => {
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

          addPeersHandler(peerObj);
        });

        // When the singal is returned from the server
        socketRef.current.on("receiving returned signal", (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          item.constraints = payload.constraints;
          item.peer.signal(payload.signal);
        });

        // When video is turn off by the other user
        socketRef.current.on("user videoOff", (payload) => {
          peersRef.current.forEach((p) => {
            if (p.peerID === payload.id) {
              p.constraints = payload.user.constraints;
            }
          });

          setPeers(peersRef.current);
        });

        // When video is turn on by the other user
        socketRef.current.on("user videoOn", (payload) => {
          peersRef.current.forEach((p) => {
            if (p.peerID === payload.id) {
              p.constraints = payload.user.constraints;
            }
          });
          onVideoHandler(payload);
        });

        //  When some user left the room
        socketRef.current.on("user left", (id) => {
          const peerObj = peersRef.current.find((p) => p.peerID === id);
          if (peerObj) {
            peerObj.peer.destroy();
          }
          const peers = peersRef.current.filter((p) => p.peerID !== id);
          peersRef.current = peers;
          setPeers(peersRef.current);
        });
      })
      .catch((err) => {
        console.log(err.name + " " + err.message);
        setEnter(-1);
        setIsLoading(false);
      });
    setEnter();
  }, []);

  useEffect(() => {
    setPeers(peersRef.current);
  }, []);

  // When the user leaves the meeting
  const leaveMeeting = () => {
    socketRef.current.disconnect();
    userVideo.current.srcObject.getTracks().forEach((track) => {
      track.stop();
    });
    userVideo.current.srcObject = null;
    history.push("/chat");
  };

  // When the user toggles the video
  const toggleVideo = () => {
    userVideo.current.srcObject.getVideoTracks()[0].enabled =
      !constraints.video;
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

  // When the user toggles the audio
  const toggleAudio = () => {
    userVideo.current.srcObject.getAudioTracks()[0].enabled =
      !constraints.audio;
    setConstraints((prev) => ({ ...prev, audio: !prev.audio }));
  };

  if (isLoading) return <Loading />;
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
                {!constraints.video && (
                  <div className="videoOffName">
                    {state.name.match(/\b(\w)/g).join("")}
                  </div>
                )}
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
                      name={peer.name}
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
        <h1 className="videoCallingStart">
          LOADINGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG
        </h1>
      )}
      {enter === -1 && <h1 className="videoCallingStart">CANNOT CONNECT</h1>}
    </div>
  );
};

export default Room;
