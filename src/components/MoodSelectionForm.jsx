import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function MoodSelectionForm() {
  const [mood, setMood] = useState("");
  const navigate = useNavigate();

  const moods = ["happy", "sad", "energetic", "calm"];

  const handleMoodChange = (e) => {
    setMood(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mood) {
      navigate(`/songs/${mood}`);
    }
  };

  const handleRandomMood = () => {
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    setMood(randomMood);
  };

  useEffect(() => {
    switch (mood) {
      case "happy":
        document.body.style.backgroundImage = "linear-gradient(0deg, rgba(179,89,0,1) 0%, rgba(237,145,53,1) 15%, rgba(241,221,192,1) 64%, rgba(247,242,237,1) 100%)";
        break;
      case "sad":
        document.body.style.backgroundImage = "linear-gradient(0deg, rgba(21,61,140,1) 0%, rgba(55,97,185,1) 28%, rgba(182,182,182,1) 64%, rgba(236,238,242,1) 100%)";
        break;
      case "energetic":
        document.body.style.backgroundImage = "linear-gradient(0deg, rgba(179,0,0,1) 0%, rgba(237,53,53,1) 15%, rgba(241,192,192,1) 64%, rgba(247,237,237,1) 100%)";
        break;
      case "calm":
        document.body.style.backgroundImage = "linear-gradient(0deg, rgba(56,56,56,1) 0%, rgba(121,121,121,1) 28%, rgba(210,210,210,1) 64%, rgba(246,246,246,1) 100%)";
        break;
      default:
        document.body.style.background = "";
    }
  }, [mood]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-5">
      <h2 className="mb-20 text-3xl text-black-800">Select Music Mood</h2>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <div className="flex flex-col mb-16 space-y-2.5">
          {moods.map((m) => (
            <label key={m} className="flex items-center text-lg text-black cursor-pointer">
              <input
                type="radio"
                value={m}
                checked={mood === m}
                onChange={handleMoodChange}
                className="w-4 h-4 mr-2.5 border-2 border-purple-800 rounded-full appearance-none checked:bg-purple-800 cursor-pointer focus:outline-none"
              />
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </label>
          ))}
        </div>
        <div className="flex space-x-2">
          <button 
            type="button" 
            onClick={handleRandomMood}
            className="px-5 py-2.5 m-1 text-base text-white bg-purple-700 rounded hover:bg-purple-900 transition-colors duration-300"
          >
            Random
          </button>
          <button 
            type="submit"
            className="px-5 py-2.5 m-1 text-base text-white bg-purple-700 rounded hover:bg-purple-900 transition-colors duration-300"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
}

export default MoodSelectionForm;