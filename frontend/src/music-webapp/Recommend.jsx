import axios from 'axios';
import { useState, useEffect } from 'react';

import './Recommend.sass';

let imgEls = null;
let indicators = null
let audio = null;
let curIndex = 0, nextID = 0;
let fIndex = [0, 1, 2];
let audioLoadedFlag = false;
let audioPlayingFlag = false;
let curMusicIndex = -1;

function Recommend(props) {
  const [picUrls, setPicUrls] = useState([]);
  const [randomTracks, setRandomTracks] = useState([]);
  const [randomTrackUrls, setRandomTrackUrls] = useState({});
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    getCarouselPicUrls();
  }, []);

  useEffect(() => {
    imgEls = document.querySelectorAll('.carousel .pic-wrapper img');
    indicators = document.querySelectorAll('.carousel .indicators ul li');
    audio = document.querySelector('.audio-player');
    if (indicators[0]) {
      indicators[0].classList.add('current');
    }
    clearInterval(nextID);
    nextID = setInterval(nextScroll, 2000);
  }, [picUrls]);

  useEffect(() => {
    getRandomTracks(props.myTracks);
  }, [props.myTracks]);

  useEffect(() => {
    getRandomTrackUrls();
  }, [randomTracks]);

  function nextScroll() {
    const prevEl = imgEls[fIndex[0]];
    const curEl = imgEls[fIndex[1]];
    const nextEl = imgEls[fIndex[2]];

    prevEl.classList.remove('prev');
    curEl.style['z-index'] = 5;
    curEl.classList.replace('cur', 'prev');
    nextEl.style['z-index'] = 5;
    nextEl.classList.replace('next', 'cur');
    fIndex = fIndex.map(val => val === picUrls.length - 1 ? 0 : val + 1);
    imgEls[fIndex[2]].style['z-index'] = -1;
    imgEls[fIndex[2]].classList.add('next');

    indicators[curIndex].classList.remove('current');
    console.log(fIndex, picUrls.length);
    if (curIndex === picUrls.length - 1) {
      curIndex = 0;
    } else {
      curIndex++;
    }
    indicators[curIndex].classList.add('current');
  }

  function myScroll(direction) {
    clearInterval(nextID);
    const prevEl = imgEls[fIndex[0]];
    const curEl = imgEls[fIndex[1]];
    const nextEl = imgEls[fIndex[2]];
    if (direction === 'prev') {
      nextEl.classList.remove('next');
      prevEl.style['z-index'] = 5;
      prevEl.classList.replace('prev', 'cur');
      curEl.style['z-index'] = 5;
      curEl.classList.replace('cur', 'next');
      fIndex = fIndex.map(val => val === 0 ? picUrls.length - 1 : val - 1);
      imgEls[fIndex[0]].style['z-index'] = -1;
      imgEls[fIndex[0]].classList.add('prev');

      indicators[curIndex].classList.remove('current');
      if (curIndex === 0) {
        curIndex = picUrls.length - 1;
      } else {
        curIndex--;
      }
      indicators[curIndex].classList.add('current');
    } else if (direction === 'next') {
      nextScroll();
    }
    nextID = setInterval(nextScroll, 2000);
  }

  // function handleIndicatorClick(index) {

  // }

  function handleTrackCoverImgClick(index) {
    console.log(1, randomTrackUrls[randomTracks[index].id]);
    setCurrentUrl(randomTrackUrls[randomTracks[index].id]);
    if(!audioLoadedFlag || curIndex !== index) {
      audio.load();
      audioLoadedFlag = true;
      curIndex = index;
      audioPlayingFlag = false;
    }
    if (!audioPlayingFlag) {
      audio.play();
      audioPlayingFlag = true;
    } else {
      audio.pause();
      audioPlayingFlag = false;
    }
  }

  function getCarouselPicUrls() {
    axios.get('/homepage/block/page', {
      proxy: {
        protocol: 'http',
        host: 'localhost',
        port: 5000
      }
    }).then(res => {
      return res.data.data;
    }).then(data => {
      setPicUrls(data.blocks[0].extInfo.banners.map((val) => val.pic));
    }).catch(err => {
      console.log(err);
    });
  }

  function getRandomTracks(myTracks) {
    if (!myTracks) {
      return;
    }
    let c = 0;
    const f = {};
    const tmp = [];
    while (c < 9) {
      const index = Math.floor(Math.random() * myTracks.length);
      if (f[index]) {
        continue;
      }
      f[index] = true;
      c++;
      tmp.push(myTracks[index]);
    }
    setRandomTracks(tmp);
  }

  function getRandomTrackUrls() {
    randomTracks.forEach((track) => {
      axios.get(`/song/url?id=${track.id}`)
        .then(res => {
          console.log(res);
          return res.data.data;
        }).then(data => {
          setRandomTrackUrls((prev) => {
            const tmp = Object.assign({}, prev);
            tmp[track.id] = data[0].url;
            return tmp;
          });
        }).catch(err => {
          console.log(err);
        })
    })
  }

  return (
    <div>
      <div className="carousel">
        <i className="fas fa-angle-left" onClick={() => myScroll('prev')}></i>
        <div className="pic-wrapper">
          {
            picUrls.map((url, index) => (
              <img src={url} alt="loaded error:("
                key={url}
                className={index === 0 ? 'prev' :
                  index === 1 ? 'cur' : index === 2 ? 'next' : ''}></img>
            ))
          }
          {/* <img src={picUrls[0]} alt="loading error:(" className="prev"></img>
          <img src={picUrls[1]} alt="loading error:(" className="current"></img>
          <img src={picUrls[2]} alt="loading error:(" className="next"></img> */}
        </div>
        <i className="fas fa-angle-right" onClick={() => myScroll('next')}></i>
        <div className="indicators">
          <ul>
            {
              picUrls.map((url, index) => (
                <li key={url} onClick={() => { }}></li>
              ))
            }
          </ul>
        </div>
      </div>
      <div className="recommend-music">
        <div className="music-cards">
          {
            randomTracks.map((track, index) => (
              <div className="music-card" key={track.name}>
                <img className="track-cover-img"
                  src={track.al.picUrl} alt="loading error:("
                  onClick={() => handleTrackCoverImgClick(index)}></img>
                <h5 className="track-title">{track.name}</h5>
                <h6 className="track-detail">
                  {track.ar.map((val) => val.name).join('/') + ' - ' + track.al.name}
                </h6>
              </div>
            ))
          }
        </div>

        <audio className="audio-player" controls>
          <source src={currentUrl}></source>
          {/* http://m701.music.126.net/20210405204842/54e2285a5174725b834b7898434ed40d/jdymusic/obj/w5zDlMODwrDDiGjCn8Ky/2342613624/7eb0/4132/d0cb/d1ef65741010df2d40139b71c5ed15bc.flac */}
        </audio>
      </div>
    </div>
  );
}

export default Recommend;
