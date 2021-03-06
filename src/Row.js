import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow}) {
  const [movies, setMovies ] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  useEffect(() => {
    // When row loads pull information
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      // console.log(request);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {

      autoplay: 1,
    },
  };

  const handleClick = (movie) => {
    console.log(movie);

    if (trailerUrl) {
      setTrailerUrl('');
    } else {
      let title = "";

      if(movie?.name == null) {
        title = movie?.original_title;
      } else {
        title = movie?.name;
      }
      movieTrailer(title)
        .then(async (url) => {
          console.log(`Movie Name: ${title}`);
          // const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(url.slice(url.length - 11));
          console.log(`FINAL URL: ${url.slice(url.length - 11)}`);
      }).catch(error => console.log(error))
    }
  }

  // console.log(movies);
  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row__posters">
        {movies.map((movie) => (
          <img
            key={movie.id}
            onClick={() => {
              handleClick(movie);
            }}
            className={`row__poster ${isLargeRow && "row__posterLarge"}`}
            src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
            alt={movie.name}
          />
        ))}
      </div>
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}

export default Row;