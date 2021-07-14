import { useEffect, useState, useRef } from 'react';

import { f } from './index.js';
import './index.sass';

const songCovers = [
  '琴弦上.jpg',
  '惊鹊.png',
  '易安难安.jpg'
];

const songTitles = [
  '琴弦上（赤绫）（翻自 李懋扬(T2o)）.mp3',
  '忘川风华录,星尘Minus,海伊 - 惊鹊.mp3',
  '忘川风华录,赤羽 - 易安难安.mp3'
];

function MyPage() {
  useEffect(() => {
    f();
  }, []);

  const [active, setActive] = useState(false);
  const [width, setWidth] = useState('50%');
  const [volume, setVolume] = useState(false);
  const [volumeWidth, setVolumeWidth] = useState('0');
  const [songIndex, setSongIndex] = useState(0);

  const audio = useRef(null);
  const progressBar = useRef(null);
  const volumeBar = useRef(null);

  useEffect(() => {
    if (active) {
      audio.current.play();
    }
  });

  const handlePlayClick = () => {
    setActive(!active);
    if (active) {
      audio.current.pause();
    } else {
      audio.current.play();
    }
  }

  const handleTimeUpdate = (e) => {
    const { duration, currentTime } = e.target;
    setWidth(`${currentTime / duration * 100}%`);
  }

  const handleProgressBarClick = (e) => {
    const width = progressBar.current.clientWidth;
    const clickX = e.nativeEvent.offsetX;
    const duration = audio.current.duration;
    audio.current.currentTime = clickX / width * duration;
  }

  const loadSong = () => {
    setWidth(0);
  }

  const handleEnded = () => {
    setWidth(0);
    handleNextClick();
  }

  const handlePrevClick = () => {
    setSongIndex(songIndex === 0 ? songTitles.length - 1 : songIndex - 1);
    loadSong();
  }

  const handleNextClick = () => {
    setSongIndex((songIndex + 1) % songTitles.length);
    loadSong();
  }

  const handleVolumeClick = (e) => {
    const width = volumeBar.current.clientWidth;
    const clickX = e.nativeEvent.offsetX;
    console.log(width, clickX);
    if(clickX < 0) {
      setVolume(!volume);
      setVolumeWidth('0');
      audio.current.volume = 0;
    } else {
      audio.current.volume = clickX / width;
      setVolume(true);
      setVolumeWidth(`${clickX / width * 100}%`);
    }
  }

  const handleMouseDown = (e) => {

  }

  return (
    <div className="music-player">
      <div className="container">
        <h1>
          Music Player
        </h1>

        <h3>{songCovers[songIndex].slice(0, -4)}</h3>

        <div className={`player-container ${active ? 'active' : ''}`}>
          <div className="progress-bar-container">
            <div className="progress-bar"
              onClick={handleProgressBarClick}
              onMouseDown={handleMouseDown}
              ref={progressBar}>
              <div className="progress" style={{ width: width }}></div>
            </div>
          </div>
          <div className="player-bar">
            <div className="img"
              style={{ backgroundImage: `url(${require(`../assets/music-player/${songCovers[songIndex]}`).default})` }}
            ></div>
            <div className="navigation">
              <button
                onClick={handlePrevClick}>
                <i className="fas fa-backward"></i>
              </button>
              <button
                onClick={handlePlayClick}>
                <i className={`fas ${active ? 'fa-pause' : 'fa-play'}`}></i>
              </button>
              <button
                onClick={handleNextClick}>
                <i className="fas fa-forward"></i>
              </button>
            </div>
            <div className={`volume-control-bar ${volume ? '' : 'volume-off'}`}
              onClick={handleVolumeClick}
              ref={volumeBar}>
              <div className="volume-control"
              style={{width: volumeWidth}}></div>
            </div>
          </div>
        </div>
      </div>
      <audio src={require(`../assets/music-player/${songTitles[songIndex]}`).default}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        ref={audio}></audio>
    </div>
  );
}

export default MyPage;
