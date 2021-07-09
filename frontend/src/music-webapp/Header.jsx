import './Header.sass';

function Header() {
  return (
    <header className="app-header">
      <h2>music-web-app</h2>
      <div className="search-bar">
        <i className="fas fa-angle-left"></i>
        <i className="fas fa-angle-right"></i>
        <form method="get" action="#">
          <i className="fas fa-search"></i>
          <input type="text"></input>
        </form>
      </div>
      <div className="user-login">
        <i className="fas fa-user"></i>
        <div>
          未登录
        </div>
        <div>开通VIP</div>
        <i className="fas fa-cog"></i>
        <i className="fas fa-tshirt"></i>
        <i className="fas fa-envelope"></i>
        <div className="minimize-button"></div>
        <div className="maximize-button"></div>
        <div className="exit-button"></div>
      </div>
    </header>
  );
}

export default Header;
