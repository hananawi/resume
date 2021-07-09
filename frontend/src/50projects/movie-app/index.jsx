import './index.sass';
import { sleep } from '../../utils.js';

import { useState, useEffect } from 'react';

function MovieInfo(props) {
  return (
    <section className="movie-info">
      {
        props.imgSrc ?
          <div className="movie-img" style={{ backgroundImage: `url(${props.imgSrc})` }}></div>
          :
          <div className="movie-img loading"></div>
      }
      <div className="movie-title-wrapper">
        {
          props.title ?
            <h2 className="movie-title">{props.title}</h2>
            :
            <div className=" movie-title loading"></div>
        }
        {
          props.point ?
            <div className="movie-point"
              style={{
                color: props.point > 7.5 ? '#2ed573' : props.point > 6 ?
                  '#ffa502' : '#d63031'
              }}>
              {props.point}
            </div>
            :
            <div className="movie-point loading"></div>
        }
      </div>
      {
        props.overview ?
          <div className="movie-overview">
            <h4>Overview</h4>
            {props.overview}
          </div>
          :
          <div className="movie-overview loading">
            <h4>Overview</h4>
          </div>
      }
    </section>
  );
}

function MyPage() {
  const [movieInfos, setMovieInfos] = useState([{}, {}, {}]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    getMovieData();
    // setTimeout(getMovieData, 10);
  }, []);

  function handleSearchTextChange(event) {
    setSearchText(event.target.value);
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    setMovieInfos([{}, {}, {}]);
    getMovieData()
      .then((data) => {
        const tmp = [];
        data.forEach((info) => {
          if (info.title.toLowerCase().includes(searchText.toLowerCase())) {
            tmp.push(info);
          }
        });
        setSearchText('');
        setMovieInfos(tmp);
      });
  }

  async function getMovieData() {
    console.log('getMovieData executed!');
    const response = fetch('https://api.themoviedb.org/4/list/1', {
      headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNTAzM2M1YTI5N2I2YzgwNDQyMmUyZDgxNzJmZjEyOCIsInN1YiI6IjYwNjFiMjJjOGYyNmJjMDA3NzZhY2Q3ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.J6xu3bREP8VIXBcUxQlhlaaG7F42Se8UZfnokLKKRkA',
        'Content-Type': 'application/json;charset=utf-8'
      }
    });
    return Promise.all([response, sleep(2)])
      .then((res) => {
        res = res[0];
        if (res.ok) {
          return res.json();
        }
        throw new Error('Network response was not ok.');
      }).then((json) => {
        setMovieInfos(json.results);
        // setTimeout(setMovieInfos, 3000, json.results);
        return json.results;
      }).catch((err) => {
        console.log('There has been a problem with your fetch operation: ', err.message);
      });
  }

  return (
    <div className="movie-app">
      <header></header>
      <nav className="nav-bar">
        <form
          className="search-wrapper"
          onSubmit={handleSearchSubmit}>
          <input type="text"
            className="search-input"
            placeholder="Search"
            value={searchText}
            onChange={handleSearchTextChange}></input>
        </form>
      </nav>
      <main className="movie-container">
        {movieInfos.map((info, index) => (
          <MovieInfo
            key={info.title ? info.title : index}
            imgSrc={info.backdrop_path ?
              `https://image.tmdb.org/t/p/w1280/${info.backdrop_path}` : undefined}
            title={info.title}
            point={info.vote_average}
            overview={info.overview} />
        ))}
      </main>
      <footer></footer>
    </div>
  );
}

export default MyPage;
