// import logo from './logo.svg';
import './App.sass';

import React, { useEffect } from 'react';
import { Route, Switch, Link } from 'react-router-dom';

import { f } from './App.js';
// import { default as AnimatedNavigation } from './50projects/animated-navigation/index.jsx';
import { default as RandomChoicePicker } from './50projects/random-choice-picker/index.jsx';
import { default as MovieApp } from './50projects/movie-app/index.jsx';
// import { default as MusicWebapp } from './music-webapp/index.jsx';
// import { default as MaterialUITutorial } from './material-ui-tutorial/index.jsx';
import { default as MyProject } from './database-project/index.jsx';
import { default as MusicPlayer } from './music-player/index.jsx';

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
  '一个简易的web版音乐播放器，有播放，暂停，前一首，后一首，调整进度等功能',
  '一个简易的物流信息查询系统，实现的功能有：用户登陆注册等，产看货物的物流信息，发送货物等，后端是用nodejs和sqlite实现的，但是github page上没有后端，所以部分功能不能展示出来',
  '一个查询电影信息的web app，可以显示出电影的名称，简介和评分，还有按标题中的关键字查询的功能，使用了国外的api接口所以速度可能会有点慢',
  '输入若干个按逗号隔开的项目后可以从里面随机挑选出一个，有动画效果'
];

const projectImgs = [
  'music-player.jpg',
  'database-project.jpg',
  'movie-app.jpg',
  'random-choice-picker.jpg'
];

function App() {
  useEffect(() => {
    f();
  }, []);

  const myProjectLinks = [
    'music-player',
    'project',
    'movie-app',
    // 'animated-navigation',
    'random-choice-picker',
    // 'music-webapp',
    // 'material-ui-tutorial'
  ];
  const myProjects = [
    MusicPlayer,
    MyProject,
    MovieApp,
    // AnimatedNavigation,
    RandomChoicePicker,
    // MusicWebapp,
    // MaterialUITutorial
  ];

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
                to="/"
                onClick={() => handleLinkClick(0)}>homepage</Link>
            </li>
            {myProjectLinks.map((val, idx) => {
              return (
                <li
                  key={val}
                  onClick={() => handleLinkClick(idx + 1)}>
                  <Link to={`/${val}`}>{val}</Link>
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
                    path={`/${myProjectLinks[index]}`}
                    key={myProjectLinks[index]}>
                    {React.createElement(val)}
                  </Route>
                );
              })
            }

            <Route
              path='/'>
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
                  </ul>
                </nav>
              </header>

              <main className="homepage">
                <section className="self-intro" id="about">
                  <h2>慎杰</h2>
                  <h2>华南农业大学</h2>
                  <p>热爱领域：前端, react, 数字图像处理, 神经网络</p>
                  <p>熟悉的编程技能：html, css, javascript, react, python, C++</p>
                </section>

                <section className="my-projects" id="projects">
                  {
                    myProjectLinks.map((val, index) => (
                      <div className="card-wrapper" key={val}>
                        <Link to={`/${val}`}>
                          <div className={`card animate ${{
                            0: 'one',
                            1: 'two',
                            2: 'three',
                            3: 'four'
                          }[index]
                            }`}>
                            <div className="img"
                            style={{backgroundImage: `url(${require(`./assets/${projectImgs[index]}`).default})`}}></div>
                            <h4>{val}</h4>
                            <div className="desc">{projectDescs[index]}</div>
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
                    <span>邮箱: 1484740339@qq.com</span>
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
