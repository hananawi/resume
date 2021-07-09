import { Switch, Route, Link, useRouteMatch } from "react-router-dom";
import DiscoverMusic from "./DiscoverMusic";

import './Main.sass';

const divStyle = {
  display: 'flex',
  alignItems: 'stretch',
  minHeight: 'calc(100vh - 5rem)'
}

function Main(props) {
  const { url, path } = useRouteMatch();

  return (
    <div style={divStyle}>
      <aside className="aside-menu">
        <ul>
          <li>
            <Link to={`${url}/discovermusic`}>发现音乐</Link>
          </li>
        </ul>
      </aside>

      <div className="main-content">
        <Switch>
          <Route path={`${path}/discovermusic`}>
            <DiscoverMusic myTracks={props.myTracks} />
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default Main;
