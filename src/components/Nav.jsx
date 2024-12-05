import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic } from "@fortawesome/free-solid-svg-icons";

const Nav = ({ libraryStatus, setLibraryStatus }) => {
  const navigate = useNavigate();

  return (
    <>
      <style>
        {`h1, h4 { @apply text-[rgb(9,70,9)]; }`}
      </style>

      <nav className="min-h-[10vh] flex justify-around items-center">
        <button 
          onClick={() => navigate(-1)}
          className="bg-transparent border-2 border-[rgb(65,65,65)] p-2 cursor-pointer
          transition-all duration-300 ease-in-out hover:bg-[rgb(65,65,65)] hover:text-white
          md:z-10"
        >
          Back
        </button>
        <button 
          onClick={() => setLibraryStatus(!libraryStatus)}
          className="bg-transparent border-2 border-[rgb(65,65,65)] p-2 cursor-pointer
          transition-all duration-300 ease-in-out hover:bg-[rgb(65,65,65)] hover:text-white
          md:z-10"
        >
          Library
          <FontAwesomeIcon icon={faMusic} />
        </button>
      </nav>
    </>
  );
};

export default Nav;
