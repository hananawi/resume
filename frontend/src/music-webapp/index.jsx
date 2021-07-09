import axios from 'axios';

import Header from './Header.jsx';
import Main from './Main.jsx';
import { useConstructor } from '../utils.js';
import { useState } from 'react';

let uid = null;
const myUid = 615553605;
const myLikedPlayListId = 953432823;

function login() {
  axios.get('/login/cellphone?phone=13527699361&password=rifadaisuki4445')
    .then(res => {
      console.log(res);
      return res.data;
    }).then(data => {
      uid = data.account.id;
      getUserPlayList();
    }).catch(err => {
      console.log(err);
    });
}

function getUserPlayList() {
  axios.get(`/user/playlist?uid=${uid}`)
    .then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    });
}

function MyPage() {
  const [myTracks, setMyTracks] = useState(null);

  useConstructor(() => {
    // login();
    initMyTracks();
  });

  function initMyTracks() {
    axios.get('/playlist/detail?id=3029447016')
      .then(res => {
        return res.data;
      }).then(data => {
        setMyTracks(data.playlist.tracks);
        return data.playlist.tracks;
      }).catch(err => {
        console.log(err);
      })
  }

  return (
    <div>
      <Header />
      <Main myTracks={myTracks} />
    </div>
  );
}

export default MyPage;
