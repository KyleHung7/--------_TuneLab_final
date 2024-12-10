import { useRef, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import Player from "./components/PlayerSong";
import Song from "./components/Song";
import MusicSelectionForm from "./components/MusicSelectionForm";
import MoodSelectionForm from "./components/MoodSelectionForm";
import "./index.css";

// Importing DATA
import Library from "./components/Library";
import Nav from "./components/Nav";
import { v4 as uuidv4 } from "uuid";

function MusicPlayer({ songs, setSongs }) {
  const { songName } = useParams();
  const [currentSong, setCurrentSong] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [libraryStatus, setLibraryStatus] = useState(false);
  const audioRef = useRef(null);
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
    animationPercentage: 0,
  });

  useEffect(() => {
    if (currentSong) {
      const mood = currentSong.mood[0]; // 假設 mood 是一個包含一個字串的陣列
      switch (mood) {
        case "happy":
          document.body.style.backgroundImage =
            "linear-gradient(0deg, rgba(179,89,0,1) 0%, rgba(237,145,53,1) 15%, rgba(241,221,192,1) 64%, rgba(247,242,237,1) 100%)";
          break;
        case "sad":
          document.body.style.backgroundImage =
            "linear-gradient(0deg, rgba(21,61,140,1) 0%, rgba(55,97,185,1) 28%, rgba(182,182,182,1) 64%, rgba(236,238,242,1) 100%)";
          break;
        case "energetic":
          document.body.style.backgroundImage =
            "linear-gradient(0deg, rgba(179,0,0,1) 0%, rgba(237,53,53,1) 15%, rgba(241,192,192,1) 64%, rgba(247,237,237,1) 100%)";
          break;
        case "calm":
          document.body.style.backgroundImage =
            "linear-gradient(0deg, rgba(56,56,56,1) 0%, rgba(121,121,121,1) 28%, rgba(210,210,210,1) 64%, rgba(246,246,246,1) 100%)";
          break;
        default:
          document.body.style.background = "";
      }
    }
  }, [currentSong]);

  // When songName changes, find and set the selected song
  useEffect(() => {
    if (songName) {
      const selectedSong = songs.find(
        (song) => song.name.toLowerCase() === decodeURIComponent(songName).toLowerCase()
      );
      if (selectedSong) {
        setCurrentSong(selectedSong);
      }
    }
  }, [songName, songs]);

  // Play the current song when it changes
  useEffect(() => {
    if (currentSong && audioRef.current) {
        audioRef.current.pause(); // 停止當前播放
        audioRef.current.load(); // 加載新歌曲
        if (isPlaying) {
            audioRef.current.play(); // 僅當正在播放時才播放新歌曲
       }
    }
  }, [currentSong]);

  const timeUpdateHandler = (e) => {
    const current = e.target.currentTime;
    const duration = e.target.duration;
    const animation = Math.round((current / duration) * 100);
    setSongInfo({
      currentTime: current,
      duration,
      animationPercentage: animation,
    });
  };

  const skipTrackHandler = async (direction) => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    if (direction === "skip-forward") {
      const nextSong = songs[(currentIndex + 1) % songs.length];
      await setCurrentSong(nextSong);
    }
    if (direction === "skip-back") {
      const previousIndex = (currentIndex - 1 + songs.length) % songs.length;
      const previousSong = songs[previousIndex];
      await setCurrentSong(previousSong);
    }
    if (isPlaying) audioRef.current.play();
  };

  const songEndHandler = async () => {
    skipTrackHandler("skip-forward");
  };

  if (!songs || songs.length === 0 || !currentSong) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Nav libraryStatus={libraryStatus} setLibraryStatus={setLibraryStatus} />
      <Song currentSong={currentSong} />
      <Player
        songs={songs}
        songInfo={songInfo}
        setSongInfo={setSongInfo}
        audioRef={audioRef}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        currentSong={currentSong}
        skipTrackHandler={skipTrackHandler} // Passing skip functionality to Player
      />
      <Library
        libraryStatus={libraryStatus}
        setLibraryStatus={setLibraryStatus}
        setSongs={setSongs}
        isPlaying={isPlaying}
        audioRef={audioRef}
        songs={songs}
        setCurrentSong={setCurrentSong}
      />
      <audio
        onLoadedMetadata={timeUpdateHandler}
        onTimeUpdate={timeUpdateHandler}
        src={currentSong.audio}
        ref={audioRef}
        onEnded={songEndHandler}
      ></audio>
    </div>
  );
}

function App() {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    if (!apiKey) {
      console.error("API Key is missing");
      return;
    }

    fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/1l24dQHuELNHEGPEwrhxHnX9U4tQna_eO-AEmU79k4D4/values/工作表1?key=${apiKey}`
    )
      .then((res) => res.json())
      .then((data) => {
        const formattedData = data.values.slice(1).map((item) => ({
          name: item[1],
          cover: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
            item[3]
          )}&bgcolor=FFFFFF`,
          artist: item[2],
          audio: item[3],
          color: ["#205950", "#2ab3bf"],
          id: uuidv4(),
          active: false,
          mood: [item[0].toLowerCase()],
        }));
        setSongs(formattedData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MoodSelectionForm />} />
        <Route path="/songs/:mood" element={<MusicSelectionForm songs={songs} />} />
        <Route path="/player/:songName" element={<MusicPlayer songs={songs} setSongs={setSongs} />} />
      </Routes>
    </Router>
  );
}

export default App;
