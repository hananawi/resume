import './index.sass';
import { f, fLogin } from './index';
import '../assets/password.ttf';
import { useConstructor } from '../utils.js';

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

// const font = new FontFace('password', `url(${process.env.PUBLIC_URL}/password.ttf)`);
// font.load()
//   .then(() => {
//     document.fonts.add(font);
//   }).catch(err => {
//     console.log(err);
//   });

const PopupWindow = React.forwardRef((props, ref) => {
  return (
    <div className="popup-window" ref={ref}
      onClick={(event) => { event.stopPropagation(); }}>
      {props.children}
    </div>
  );
});

const LoginForm = React.forwardRef((props, ref) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const labelsRef = useRef([]);

  useEffect(() => {
    fLogin({
      labels: labelsRef.current
    });
  }, []);

  useEffect(() => {
    setUsername('');
    setPassword('');
  }, [props.isLogin]);

  function handleCommitButtonClick(event) {
    event.preventDefault();
    if (!username || !password) {
      props.createSnackbar('请填完所有表单信息', 'error');
      return;
    }
    if (props.isLogin) {
      axios.post('/database/login', {
        'username': username,
        'password': password
      })
        .then(res => {
          return res.data;
        }).then(data => {
          if (!data.sender_name) {
            throw Error('user don\'t exist');
          }
          props.setUserInfo({
            senderID: data.sender_id,
            senderName: data.sender_name,
            avatarUrl: `${process.env.PUBLIC_URL}/logo192.png`
          });
          props.togglePopupWindow(event, ref);
          props.createSnackbar('login successfully!');
          setUsername('');
          setPassword('');
        }).catch(err => {
          console.log(err);
          props.createSnackbar('用户名或密码错误', 'error');
          setPassword('');
        });
    } else {
      axios.post('/database/register', {
        'username': username,
        'password': password
      })
        .then(res => {
          console.log(res);
          return res.data;
        }).then(data => {
          props.togglePopupWindow(event, ref);
          props.createSnackbar('注册成功');
          setUsername('');
          setPassword('');
        }).catch(err => {
          console.log(err);
        });
    }
  }

  return (
    <PopupWindow ref={ref}>
      <form className="login-form animated-form">
        <div className="form-control label-float">
          <input type="text" id="username" name="username"
            required autoComplete="off" value={username}
            onChange={(event) => setUsername(event.target.value)}></input>
          <label ref={(el) => labelsRef.current[0] = el} htmlFor="username">username</label>
        </div>
        <div className="form-control label-float">
          <input type="text" id="password" name="password"
            required autoComplete="off" value={password}
            onChange={(event) => setPassword(event.target.value)}></input>
          <label ref={(el) => labelsRef.current[1] = el} htmlFor="password">password</label>
          {/* ref={labelsRef.current[1]} can't work,
          cause undefined(i.e. labelsRef.current[1]).current can't be assigned a value */}
        </div>
        <button type="submit"
          onClick={handleCommitButtonClick}>{props.isLogin ? "Login" : "Register"}</button>
        {
          props.isLogin ?
            <div className="text">
              Don't have an account?
            <span onClick={() => props.setIsLogin(false)}> Register</span>
            </div>
            :
            <div className="text">
              Already have an account?
            <span onClick={() => props.setIsLogin(true)}> Login</span>
            </div>
        }
      </form>
    </PopupWindow>
  );
});

const SendForm = React.forwardRef((props, ref) => {
  const [receiverName, setReceiverName] = useState('');
  const [goodsName, setGoodsName] = useState('');
  const [goodsType, setGoodsType] = useState('');
  const [goodsWeight, setGoodsWeight] = useState(0);
  const [expressType, setExpressType] = useState('');

  const labelsRef = useRef([]);

  useEffect(() => {
    fLogin({
      labels: labelsRef.current
    })
  }, []);

  function handleCommitButtonClick(event) {
    event.preventDefault();
    if (!receiverName || !goodsName || !goodsType || !goodsWeight || !expressType) {
      props.createSnackbar('请填完所有表单信息', 'error');
      return;
    }
    axios.post('/database/api/sendGoods', {
      receiverName,
      goodsName,
      goodsType,
      goodsWeight,
      expressType
    })
      .then(res => {
        console.log(res);
        return res.data;
      }).then(data => {
        props.getRecords();
        props.togglePopupWindow(event, ref);
        props.createSnackbar('send successfully!');
        setReceiverName('');
        setGoodsName('');
        setGoodsType('');
        setGoodsWeight(0);
        setExpressType('');
      }).catch(err => {
        console.log(err);
      });
  }

  return (
    <PopupWindow ref={ref}>
      <form className="send-form animated-form">
        <div className="form-control label-float">
          <input type="text" id="receiver" name="receiver"
            required autoComplete="off"
            value={receiverName}
            onChange={(event) => setReceiverName(event.target.value)}></input>
          <label ref={(el) => labelsRef.current[0] = el} htmlFor="receiver">收件人</label>
        </div>
        <div className="form-control label-float">
          <input type="text" id="goods" name="goods"
            required autoComplete="off"
            value={goodsName}
            onChange={(event) => setGoodsName(event.target.value)}></input>
          <label ref={(el) => labelsRef.current[1] = el} htmlFor="goods">货物名称</label>
        </div>
        <fieldset className="form-control radio-group"
          onChange={(event) => setGoodsType(event.target.value)}>
          <legend>货物类型</legend>
          <div>
            <input required type="radio" id="small" name="goods_type" value="small"
              checked={goodsType === 'small'} onChange={() => { }}></input>
            <label htmlFor="small">小型货物</label>
          </div>
          <div>
            <input type="radio" id="medium" name="goods_type" value="medium"
              checked={goodsType === 'medium'} onChange={() => { }}></input>
            <label htmlFor="medium">中型货物</label>
          </div>
          <div>
            <input type="radio" id="large" name="goods_type" value="large"
              checked={goodsType === 'large'} onChange={() => { }}></input>
            <label htmlFor="large">大型货物</label>
          </div>
        </fieldset>
        <fieldset className="form-control radio-group"
          onChange={(event) => setExpressType(event.target.value)}>
          <legend>快递类型</legend>
          <div>
            <input type="radio" id="normal" name="express_type" value="normal"
              checked={expressType === 'normal'} onChange={() => { }}></input>
            <label htmlFor="normal">普通</label>
          </div>
          <div>
            <input type="radio" id="fast" name="express_type" value="fast"
              checked={expressType === 'fast'} onChange={() => { }}></input>
            <label htmlFor="fast">快速</label>
          </div>
        </fieldset>
        <div className="form-control number-input">
          <label htmlFor="goods_weight">货物重量</label>
          <input type="number" id="goods_weight" name="goods_weight"
            value={goodsWeight}
            onChange={(event) => setGoodsWeight(event.target.value)}></input>
          <label htmlFor="goods_weight">kg</label>
        </div>
        <button type="submit" onClick={handleCommitButtonClick}>确认</button>
      </form>
    </PopupWindow>
  );
});

function UserRecords(props) {
  return (
    <div className="records">
      <div className="records-header">
        <div className="header-item">物品名</div>
        <div className="header-item">收件人</div>
        <div className="header-item">运输状态</div>
        <div>运输状态</div>
      </div>
      {props.records.map((record, index) => (
        <div className="record" key={index}>
          <div className="goods-name">{record.goodsName}</div>
          <div className="receiver-name">{record.receiverName}</div>
          <div className="transport-state">
            {
              record.arriveTime ?
                record.arriveTime
                :
                '正在运输'
            }
          </div>
          <button onClick={() => props.showRecordDetail(record.expressID)}>查看详情</button>
        </div>
      ))}
    </div>
  );
}

function RecordDetail(props) {
  function renderTransportDetail(time, month, date, info, key) {
    return (
      <div className="transport-detail" key={key}>
        <div className="transport-time">
          <div className="time">{time}</div>
          <div className="date">{month}-{date}</div>
        </div>
        {
          key === props.detail.data.transports.length - 1 ?
            <i className="fas fa-truck icon"></i>
            :
            <i className="fas fa-check-circle icon"></i>
        }
        <div className="info">{info}</div>
      </div>
    );
  }

  return (
    <div className="record-detail">
      <div className="record-nav">
        <div className="record-button">
          <button onClick={props.hiddenRecordDetail}>返回</button>
          {/* <button>删除</button> */}
        </div>
        <div className="record-info">
          <div className="express-id">快递单号: {props.detail.expressID}</div>
          <div>寄件人：{props.detail.data.senderName}</div>
          <div>收件人：{props.detail.data.receiverName}</div>
          <div>
            物品名：
            <span className="goods-name">{props.detail.data.goodsName}</span>
          </div>
          <div>快递类型：{props.detail.data.expressType === 'normal' ? '普通' : '快速'}</div>
          <div>运费：{props.detail.data.expressPrice}元</div>
        </div>
      </div>
      <div className="transport-flow"></div>
      <div className="transport-details">
        {
          props.detail.data.transports.map((row, index) => (
            renderTransportDetail(`${('00' + row.hour).slice(-2)}: ${('00' + row.minute).slice(-2)}`,
              row.month, row.date, `从${row.sendAddress}出发，
              ${index === props.detail.data.transports.length - 1 ? '正在运往' : '已送到'}
              ${row.receiveAddress}`, index)
          ))
        }
      </div>
    </div>
  );
}

function MyProject() {
  const [isLogin, setIsLogin] = useState(true);
  const [isDetail, setIsDetail] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [userInfo, setUserInfo] = useState({});
  const [snackbarMessage, setSnckbarMesssage] = useState('');
  const [records, setRecords] = useState([]);
  const [detail, setDetail] = useState({});

  const loginFormRef = useRef(null);
  const sendFormRef = useRef(null);
  const snackbarRef = useRef(null);
  const dropdownRef = useRef(null);

  let flag = false;  // 解决userinfo的点击事件的元素覆盖影响到登出的问题

  useConstructor(() => {
    const senderID = document.cookie.split('; ').find(val => val.startsWith('senderID'));
    const senderName = document.cookie.split('; ').find(val => val.startsWith('senderName'));
    if (senderName) {
      setUserInfo({
        senderID: senderID.split('=')[1],
        senderName: senderName.split('=')[1],
        avatarUrl: `${process.env.PUBLIC_URL}/logo192.png`
      });
    }
  });

  useEffect(() => {
    f({
      loginForm: loginFormRef.current,
      sendForm: sendFormRef.current
    });
  }, []);

  useEffect(() => {
    if (userInfo.senderID) {
      getRecords();
    }
  }, [userInfo]);

  function getRecords() {
    axios.get(`/database/api/getRecords?senderID=${userInfo.senderID}`)
      .then(res => {
        return res.data;
      }).then(data => {
        setRecords(data);
        setIsDetail(false);
      }).catch(err => {
        console.log(err);
      });
  }

  function getDetail(expressID) {
    axios.get(`/database/api/getDetail?expressID=${expressID}`)
      .then(res => {
        return res.data;
      }).then(data => {
        setDetail({
          expressID,
          data
        });
        setIsDetail(true);
      }).catch(err => {
        console.error(err);
        createSnackbar('该订单号不存在', 'error');
      });
  }

  function logout() {
    if (!flag) {
      return;
    }
    setUserInfo({});
    createSnackbar('logout successfully!');
    document.cookie = 'senderID=;max-age=-1;path=/';
    document.cookie = 'senderName=;max-age=-1;path=/';
    flag = false;
  }

  function showRecordDetail(expressID) {
    getDetail(expressID);
  }

  function hiddenRecordDetail() {
    setIsDetail(false);
  }

  function createSnackbar(message, type) {
    setSnckbarMesssage(message);
    snackbarRef.current.classList.add('active');
    if (type === 'error') {
      snackbarRef.current.style.backgroundColor = '#f44336';
    } else {
      snackbarRef.current.style.backgroundColor = '#4caf50';
    }
    setTimeout(() => {
      snackbarRef.current.classList.remove('active');
    }, 2000);
  }

  const togglePopupWindow = (event, popupWindowRef) => {
    event.stopPropagation();
    popupWindowRef.current.classList.toggle('active');
  }

  function handleLoginButtonClick(event) {
    togglePopupWindow(event, loginFormRef);
    setIsLogin(true);
  }

  function handleSendButtonClick(event) {
    if (!userInfo.senderName) {
      createSnackbar('请先登录', 'error');
      return;
    }
    togglePopupWindow(event, sendFormRef);
  }

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  }

  const handleDeleteButtonClick = (event) => {
    setSearchText('');
  }

  const handleSearchButtonClick = (event) => {
    event.preventDefault();
    if (!searchText) {
      createSnackbar('快递单号不能为空', 'error');
      return;
    }
    getDetail(Number(searchText));
    setSearchText('');
  }

  return (
    <section className="database-project">
      <header>
        <nav className="nav-bar">
          {
            userInfo.senderName ?
              <div className="nav-item userinfo"
                onClick={() => { dropdownRef.current.classList.toggle('active'); flag = !flag; }}>
                <img src={userInfo.avatarUrl} alt="img error:("
                  height="32" width="32"></img>
                {userInfo.senderName}
                <div className="dropdown-menu" ref={dropdownRef}>
                  <div className="dropdown-item">个人信息</div>
                  <div className="dropdown-item"
                    onClick={logout}>退出登录</div>
                </div>
              </div>
              :
              <button className="login-button nav-item"
                onClick={handleLoginButtonClick}>Login</button>
          }
          <button className="send-button nav-item"
            onClick={handleSendButtonClick}>Send</button>
        </nav>
        <form className="search-bar" onSubmit={handleSearchButtonClick}>
          <div className="search-input-wrapper">
            <input className="search-input"
              placeholder="快递单号"
              type="search"
              value={searchText}
              onChange={handleSearchTextChange}></input>
            <i className="fas fa-trash-alt" onClick={handleDeleteButtonClick}></i>
          </div>
          <button className="search-button" type="submit">查询</button>
        </form>
      </header>
      <main>
        {
          isDetail ?
            <RecordDetail
              hiddenRecordDetail={hiddenRecordDetail}
              detail={detail} />
            :
            userInfo.senderName ?
              <UserRecords
                records={records}
                showRecordDetail={showRecordDetail} />
              :
              <div style={{ textAlign: 'center' }}>登陆后可查看运输记录</div>
        }
      </main>
      <LoginForm ref={loginFormRef}
        setUserInfo={setUserInfo}
        togglePopupWindow={togglePopupWindow}
        createSnackbar={createSnackbar}
        isLogin={isLogin}
        setIsLogin={setIsLogin} />
      <SendForm ref={sendFormRef}
        togglePopupWindow={togglePopupWindow}
        createSnackbar={createSnackbar}
        getRecords={getRecords} />
      <div className="snackbar" ref={snackbarRef}>
        {snackbarMessage}
      </div>
    </section>
  );
}

export default MyProject;
