import './index.css';
// import { useScript } from '../../utils';
import { default as f } from './index';

import { useEffect } from 'react';

function MyPage() {
  // useScript('./index.js');
  useEffect(() => {
    f();
  }, []);
  return (
    <section className="animated-navigation">
      <nav>
        <ul>
          <li key="home"><a href="/#">Home</a></li>
          <li key="works"><a href="/#">Works</a></li>
          <li key="about"><a href="/#">About</a></li>
          <li key="contact"><a href="/#">Contact</a></li>
        </ul>
        <button className="animated-button">
          <div></div>
          <div></div>
        </button>
      </nav>
    </section>
  );
}

export default MyPage;
