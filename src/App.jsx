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
      audioRef.current.pause(); // Stop previous song if playing
      audioRef.current.load(); // Load the new song
      if (isPlaying) {
        audioRef.current.play(); // Play the new song if `isPlaying` is true
      }
    }
  }, [currentSong, isPlaying]);

  const timeUpdateHandler = (e) => {
    const current = e.target.currentTime;
    const duration = e.target.duration;
    const roundedCurrent = Math.round(current);
    const roundedDuration = Math.round(duration);
    const animation = Math.round((roundedCurrent / roundedDuration) * 100);
    setSongInfo({
      currentTime: current,
      duration,
      animationPercentage: animation,
    });
  };

  const songEndHandler = async () => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
    if (isPlaying) audioRef.current.play();
  };

  if (!songs || !currentSong) {
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
        setCurrentSong={setCurrentSong}
        setSongs={setSongs}
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
