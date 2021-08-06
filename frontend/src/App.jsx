// import logo from './logo.svg';
import './App.sass';

import React, { useEffect } from 'react';
import { Route, Switch, Link } from 'react-router-dom';

import { f } from './App.js';
// import { default as AnimatedNavigation } from './50projects/animated-navigation/index.jsx';
// import { default as RandomChoicePicker } from './50projects/random-choice-picker/index.jsx';
import { default as MovieApp } from './50projects/movie-app/index.jsx';
// import { default as MusicWebapp } from './music-webapp/index.jsx';
// import { default as MaterialUITutorial } from './material-ui-tutorial/index.jsx';
import { default as MyProject } from './database-project/index.jsx';
import { default as MusicPlayer } from './music-player/index.jsx';
import { default as CodepenClone } from './codepen-clone/index.jsx';
import { useState } from 'react';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

const projectDescs = [
  '一个简易的web版音乐播放器，有播放，暂停，前一首，后一首，调整进度，调整音量等功能',
  '一个简易的物流信息查询系统，实现的功能有：用户登陆注册等，产看货物的物流信息，发送货物等，后端是用nodejs和sqlite实现的，但是github page上没有后端，所以部分功能不能展示出来',
  '一个查询电影信息的web app，可以显示出电影的名称，简介和评分，还有按标题中的关键字查询的功能，使用了国外的api接口所以速度可能会有点慢',
  '一个模仿codepen的实时代码编辑器, 可以编写html, css, js并且有实时的效果显示, 并且使用了sessionStorage保存数据'
];

const projectDescsEn = [
  'A simple web music player that implements play, pause, previous song, next song, adjust progress and volume, and other functions',
  'A simple logistic infomation query system, achieving the following functions: user login and register, query the info of commodity, send commodity. I used nodejs as backend but there is no backend on github page.',
  'A web app that can query movie infomation, including movie name, synopsis and rating. It also can search movie by keywords in movie name. The app loads resources asynchronously.',
  'A codepen clone web app, can display html page in realtime and used sessionStorage to store user\'s code.'
]

const projectImgs = [
  'music-player.jpg',
  'database-project.jpg',
  'movie-app.jpg',
  'codepen-clone.jpg'
];

const myProjectLinks = [
  'music-player',
  'project',
  'movie-app',
  'codepen-clone'
  // 'animated-navigation',
  // 'random-choice-picker',
  // 'music-webapp',
  // 'material-ui-tutorial'
];
const myProjects = [
  MusicPlayer,
  MyProject,
  MovieApp,
  CodepenClone
  // AnimatedNavigation,
  // RandomChoicePicker,
  // MusicWebapp,
  // MaterialUITutorial
];

const myProjectNames = [
  '音乐播放器',
  '物流查询系统',
  '电影信息查询系统',
  'codepen clone'
];

const myProjectNamesEn = [
  'music player',
  'logistic infomation query',
  'movie infomation query',
  'codepen clone'
]

function App() {
  useEffect(() => {
    f();
  }, []);

  const [lang, setLang] = useState('en');

  function handleLinkClick(currentIdx) {
    const links = document.querySelectorAll('.catalog ul li a');
    if (currentIdx === 0) {
      links[0].style.color = '#7bed9f';
    } else {
      links[0].style.color = '#fff';
    }
    links.forEach((link, idx) => {
      if (idx === currentIdx) {
        link.style.color = '#7bed9f';
      } else {
        link.style.color = '#fff';
      }
    });
  }

  return (
    <div>
      <div className="content-cover"></div>
      <div className="outer-box">
        <i className="fas fa-bars menu-icon"></i>
        <aside className="catalog hidden">
          <ul>
            <li>
              <Link
                to="/resume"
                onClick={() => handleLinkClick(0)}>{lang === 'en' ? 'Homepage' : '主页'}</Link>
            </li>
            {myProjectLinks.map((val, idx) => {
              return (
                <li
                  key={val}
                  onClick={() => handleLinkClick(idx + 1)}>
                  <Link to={`/resume/${val}`}>{lang === 'en' ? myProjectNamesEn[idx] : myProjectNames[idx]}</Link>
                </li>
              );
            })}
          </ul>
        </aside>

        <div className="content-box full">
          <Switch>
            {
              myProjects.map((val, index) => {
                return (
                  <Route
                    path={`/resume/${myProjectLinks[index]}`}
                    key={myProjectLinks[index]}>
                    {React.createElement(val)}
                  </Route>
                );
              })
            }

            <Route
              path='/resume'>
              <header className="homepage">
                <nav>
                  <ul>
                    <li>
                      <a href="#about">About</a>
                    </li>
                    <li>
                      <a href="#projects">Projects</a>
                    </li>
                    <li>
                      <a href="#contact">Contact</a>
                    </li>
                    <li className="lang-list">
                      <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>En</button>
                      <button className={lang === 'en' ? '' : 'active'} onClick={() => setLang('zh')}>中</button>
                    </li>
                  </ul>
                </nav>
              </header>

              <main className="homepage">
                {
                  lang === 'en' ?
                    <section className="self-intro" id="about">
                      <h2>Jie Shen</h2>
                      <h2>South China Agriculture University</h2>
                      <p>Interested fields: frontend, react, digital image processing, deep learning</p>
                      <p>Skills: html, css, javascript, react, python</p>
                    </section>
                    :
                    <section className="self-intro" id="about">
                      <h2>慎杰</h2>
                      <h2>华南农业大学</h2>
                      <p>热爱领域：前端, react, 数字图像处理, 神经网络</p>
                      <p>熟悉的编程技能：html, css, javascript, react, python</p>
                    </section>
                }

                <section className="my-projects" id="projects">
                  {
                    myProjectLinks.map((val, index) => (
                      <div className="card-wrapper" key={val}>
                        <Link to={`/resume/${val}`}>
                          <div className={`card animate ${{
                            0: 'one',
                            1: 'two',
                            2: 'three',
                            3: 'four'
                          }[index]
                            }`}>
                            <div className="img"
                              style={{ backgroundImage: `url(${require(`./assets/${projectImgs[index]}`).default})` }}></div>
                            <h4>{lang === 'en' ? myProjectNamesEn[index] : myProjectNames[index]}</h4>
                            <div className="desc">{lang === 'en' ? projectDescsEn[index] : projectDescs[index]}</div>
                          </div>
                        </Link>
                      </div>
                    ))
                  }
                </section>
              </main>

              <footer className="homepage" id="contact">
                <ul>
                  <li>
                    <a href="https://github.com/hananawi">
                      <i className="fab fa-github"></i>
                      <span>Github</span>
                    </a>
                  </li>
                  <li>
                    <i className="fas fa-envelope"></i>
                    <span>{lang === 'en' ? 'email: antaroezio@gmail.com' : '邮箱: 1484740339@qq.com'}</span>
                  </li>
                </ul>
              </footer>
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
}

export default App;
