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

let mouseDownFlags = Array(2).fill(false);

function DragableBar(props) {

  useEffect(() => {
    props.musicAppRef.current.addEventListener('mousemove', handleMouseMove);
    props.musicAppRef.current.addEventListener('mouseup', handleMouseUp);
  }, []);

  const myRef = useRef(null);

  const handleBarClick = (e) => {
    // const clickX = e.nativeEvent.offsetX;
    // console.log('click', e.nativeEvent, clickX);
    const rect = myRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(myRef.current.clientWidth - 1, e.clientX - rect.left));
    if (props.changeVar) {
      props.changeVar(x / myRef.current.clientWidth);
    }
  }

  // click事件和mousedown等事件的offsetX的值不一样
  function handleMouseDown(e) {
    mouseDownFlags[props.index] = true;
    // console.log('mousedown', e.nativeEvent, e.nativeEvent.offsetX);
  }

  function handleMouseMove(e) {
    if (!mouseDownFlags[props.index]) {
      return;
    }
    const rect = myRef.current.getBoundingClientRect(); // relative to the viewport, and clientX too.
    const x = Math.max(0, Math.min(myRef.current.clientWidth - 1, e.clientX - rect.left));
    // console.log('mousemove', e.nativeEvent, e.nativeEvent.offsetX);
    if (props.changeVar) {
      props.changeVar(x / myRef.current.clientWidth);
    }
  }

  function handleMouseUp(e) {
    if (!mouseDownFlags[props.index]) {
      return;
    }
    const rect = myRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(myRef.current.clientWidth - 1, e.clientX - rect.left));
    // console.log('mouseup', e.nativeEvent, e.nativeEvent.offsetX);
    if (props.changeVar) {
      props.changeVar(x / myRef.current.clientWidth);
    }
    mouseDownFlags[props.index] = false;
  }

  return (
    <div
      className={`dragable-bar-wrapper ${props.className}`}
      ref={myRef}
      onClick={handleBarClick}>
      <div
        className="dragable-bar"
        style={{ width: `${props.width * 100}%` }}></div>
      <div
        className="dragable-point"
        onMouseDown={handleMouseDown}
        style={{ left: `${props.width * 100}%` }}></div>
    </div>
  );
}

function MyPage() {

  const [active, setActive] = useState(false);
  const [volume, setVolume] = useState(0);
  const [progress, setProgress] = useState(0);
  const [songIndex, setSongIndex] = useState(0);

  const audio = useRef(null);
  const musicAppRef = useRef(null);

  useEffect(() => {
    f();
    audio.current.volume = 0;
  }, []);

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
    setProgress(currentTime / duration);
  }

  const loadSong = () => {
    setProgress(0);
  }

  const handleEnded = () => {
    setProgress(0);
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

  const handleVolumeClick = () => {
    if (volume <= 0) {
      setVolume(0.2);
      audio.current.volume = 0.2;
    } else {
      setVolume(0);
      audio.current.volume = 0;
    }
  }

  // percent: [0, 1]
  const changeProgress = (percent) => {
    const duration = audio.current.duration;
    audio.current.currentTime = duration * percent;
    setProgress(percent);
  }

  const changeVolume = (percent) => {
    audio.current.volume = percent;
    setVolume(percent);
  }

  return (
    <div
      className="music-player"
      ref={musicAppRef}>
      <div className="container">
        <h1>
          Music Player
        </h1>

        <h3>{songCovers[songIndex].slice(0, -4)}</h3>

        <div className={`player-container ${active ? 'active' : ''}`}>
          <div className="progress-bar-container">
            <DragableBar
              className="progress-bar"
              musicAppRef={musicAppRef}
              index={0}
              changeVar={changeProgress}
              width={progress} />
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
            <div className="volume-control-wrapper">
              <i
                className={`fas ${volume > 0 ? 'fa-volume-up' : 'fa-volume-mute'}`}
                onClick={handleVolumeClick}></i>
              <DragableBar
                className="volume-control-bar"
                musicAppRef={musicAppRef}
                index={1}
                changeVar={changeVolume}
                width={volume} />
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
