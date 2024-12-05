import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const MusicSelectionForm = ({ songs }) => {
  const [selectedSong, setSelectedSong] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedSong) {
      const songToPlay = songs.find(song => song.name === selectedSong);
      if (songToPlay) {
        navigate(`/player/${encodeURIComponent(songToPlay.name)}`);
      }
    }
  };

  const { mood } = useParams();
  

  const filteredSongs = mood === "default" ? songs : songs.filter(song => song.mood.includes(mood));

  if (filteredSongs.length === 0) {
    return <div>No songs found for this mood</div>;
  }
  
  const handleRandomSong = () => {
    if (filteredSongs.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredSongs.length);
        const randomSong = filteredSongs[randomIndex];
        setSelectedSong(randomSong.name);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-5">
      <h2 className="text-center text-black mb-16 text-3xl">Select Music Name</h2> {/* 保留标题 */}
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <div className="mb-16">
          {filteredSongs.map((song) => (
            <div key={song.id} className="my-4 flex items-center gap-4">
              <input
                type="radio"
                id={song.id}
                name="song"
                value={song.name}
                checked={selectedSong === song.name}
                onChange={(e) => setSelectedSong(e.target.value)}
                className="w-4 h-4 mr-2.5 border-2 border-purple-800 rounded-full appearance-none checked:bg-purple-800 cursor-pointer focus:outline-none"
              />
              <label htmlFor={song.id} className="text-lg text-black cursor-pointer">
                {song.name}
              </label>
            </div>
          ))}
        </div>

        <div className="flex gap-4 justify-center">
          <button 
            type="button" 
            onClick={handleRandomSong}
            className="px-5 py-2.5 m-1 text-base text-white bg-purple-700 rounded hover:bg-purple-900 transition-colors duration-300"
          >
            Random
          </button>
          <button 
            type="submit" 
            disabled={!selectedSong}
            className="px-5 py-2.5 m-1 text-base text-white bg-purple-700 rounded hover:bg-purple-900 transition-colors duration-300"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default MusicSelectionForm;