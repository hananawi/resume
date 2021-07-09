import { Switch, Route, Link, useRouteMatch } from "react-router-dom";

import './DiscoverMusic.sass';
import Recommend from "./Recommend";

function DiscoverMusic(props) {
  const { url, path } = useRouteMatch();

  return (
    <div>
      <nav className="nav-bar">
        <ul>
          <li>
            <Link to={`${url}/recommend`}>个性推荐</Link>
          </li>
          <li>
            <Link to="/#">个性推荐</Link>
          </li>
          <li>
            <Link to="/">个性推荐</Link>
          </li>
          <li>
            <Link to="/#">个性推荐</Link>
          </li>
          <li>
            <Link to="/">个性推荐</Link>
          </li>
          <li>
            <Link to="/#">个性推荐</Link>
          </li>
        </ul>
      </nav>
      <Switch>
        <Route path={`${path}/recommend`}>
          <Recommend myTracks={props.myTracks} />
        </Route>
      </Switch>
    </div>
  );
}

export default DiscoverMusic;
