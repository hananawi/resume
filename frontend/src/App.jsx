// import logo from './logo.svg';
import './App.sass';

import React, { useEffect } from 'react';
import { Route, Switch, Link } from 'react-router-dom';

import { f } from './App.js';
import { default as AnimatedNavigation } from './50projects/animated-navigation/index.jsx';
import { default as RandomChoicePicker } from './50projects/random-choice-picker/index.jsx';
import { default as MovieApp } from './50projects/movie-app/index.jsx';
import { default as MusicWebapp } from './music-webapp/index.jsx';
// import { default as MaterialUITutorial } from './material-ui-tutorial/index.jsx';
import MyProject from './project/index.jsx';

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

function App() {
  useEffect(() => {
    f();
  }, []);

  const myProjectLinks = [
    'animated-navigation',
    'random-choice-picker',
    'movie-app',
    'project',
    'music-webapp',
    // 'material-ui-tutorial'
  ];
  const myProjects = [
    AnimatedNavigation,
    RandomChoicePicker,
    MovieApp,
    MyProject,
    MusicWebapp,
    // MaterialUITutorial
  ];

  function handleLinkClick(currentIdx) {
    const links = document.querySelectorAll('.catalog ul li a');
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
            {myProjectLinks.map((val, idx) => {
              return (
                <li
                  key={val}
                  onClick={() => handleLinkClick(idx)}>
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
          </Switch>
        </div>
      </div>
    </div>
  );
}

export default App;
