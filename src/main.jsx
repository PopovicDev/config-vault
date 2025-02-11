import { StrictMode, useState, useEffect, useRef} from 'react'
import { createRoot } from 'react-dom/client'
import './general.css'
import './homepage.css'

function App(){
  const [isLogged, setIsLogged] = useState(false);
  return (
    <>
      <Homepage loginstatus={isLogged}/>
    </>
  )
}

function Homepage({loginstatus}){
  const [mainpageStatus, setMainpageStatus] = useState('cfg');
  const [burgerChecked, setBurgerChecked] = useState(false);
  return (
    <div className='homepage'>
      <input type='checkbox' id='burger-menu' checked={burgerChecked} onChange={()=>setBurgerChecked(!burgerChecked)}/>
      <Sidebar loginstatus={loginstatus} mpstatus={setMainpageStatus} burgerChecked={burgerChecked} setBurgerChecked={setBurgerChecked}/>
      <div className='header-mainpage'>
        <Header loginstatus={loginstatus}/>
        <Mainpage loginstatus={loginstatus} pageStatus={mainpageStatus}/>
      </div>
    </div>
  )
}

function Header({loginstatus}){
  return (
    <div className='header section' style={{justifyContent: (!loginstatus && window.innerWidth > 600) ? 'flex-end' : 'space-between'}}>
      <label htmlFor='burger-menu'><i className="fa-solid fa-bars bg-menu"/></label>
      <div className='header-funcs'>
          {!loginstatus && <Login/>}
      </div>
    </div>
  )
}

function Login(){
  return (
    <button className='login' aria-label='Login'>
      <i className="fa-solid fa-right-to-bracket"/>
    </button>
  )
}

function Sidebar({loginstatus, mpstatus, burgerChecked, setBurgerChecked}){
  return (
    <div className='sidebar section'>
    <h3><i className="fa-solid fa-dice-d20"></i> My Dashboard</h3>
      <ul>
        <li key={0} onClick={()=>{mpstatus('cfg'); setBurgerChecked(false); window.scrollTo({top: 0, behavior: 'smooth'});}}><i className="fa-solid fa-house"></i> Homepage</li>
        {loginstatus && <li key={1} onClick={()=>{mpstatus('games'); setBurgerChecked(false);}}><i className="fa-solid fa-gamepad"></i> Games</li>}
        {loginstatus && <li key={2} onClick={()=>{mpstatus('saved'); setBurgerChecked(false);}}><i className="fa-solid fa-list-check"></i> Saved Settings</li>}
        {loginstatus && <li key={3}><i className="fa-solid fa-plus"></i> Add Settings</li>}
      </ul>
      <div className='sidebar-friends'>
        <h3><i className="fa-solid fa-user-group"></i> Friends</h3>
        <button aria-label='Add friend'>
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>
      {!loginstatus ? <p>If you want to add friends, you'll need to log in!</p> : <ul></ul>}
      {loginstatus ? <button className='sidebar-login' aria-label='Log out'><i className="fa-solid fa-plug-circle-xmark"></i> LOG OUT</button> : <button className='sidebar-login' aria-label='Login'><i className="fa-solid fa-right-to-bracket"></i> LOG IN</button>}
    </div>
  )
}

function Mainpage({loginstatus, pageStatus}){
  const pageactive = 'display: flex;';
  return (
    <div className='mainpage-section' style={{overflowY: loginstatus ? 'scroll' : 'hidden'}}>
      <div className='mainpage' style={{filter: loginstatus ? 'blur(0px)' : 'blur(8px)'}}>
        {pageStatus === 'cfg' && (
          <div className='cfg-section'>
            <div className='cfg-box1'>
              <div className='your-configs section'>
                <h3>Your configs</h3>
                {!loginstatus && (
                  <div className='configs'>
                  <Config/>
                  <Config/>
                  <Config/>
                  <Config/>
                  </div>
                )}
              </div>
            <GameSlider/>
            </div>
            <h4>Check out your friend's configurations <i className="fa-solid fa-chevron-down"></i></h4>
            <FriendList loginstatus={loginstatus}/>
          </div>
        )}
        {pageStatus === 'games' && (
          <div className='games-section section'>
            <h1>Your games</h1>
            <div className='games'>
              {!loginstatus && (
                <>
                <Game/>
                <Game/>
                <Game/>
                <Game/>
                </>
              )}
            </div>
          </div>
        )}
        {pageStatus === 'saved' && (
          <div className='saved-section section'>
            <h1>Your saved settings</h1>
            <div className='saved-settings'>
              {!loginstatus && (
                <>
                <Config/>
                <Config/>
                <Config/>
                <Config/>
                </>
              )}
            </div>
          </div>
        )}
      </div>
        {!loginstatus && (
          <div className='login-message'>
            <div className='login-message-box'>
              <h3>ConfigVault helps gamers store, manage, and share their game configurations effortlessly.<br/><br/>Customize settings, access them anytime, and explore setups from other players — all in one place!<br/><br/></h3>
              <button className='sidebar-login' aria-label='Login'><i className="fa-solid fa-right-to-bracket"></i> LOG IN</button>
            </div>
          </div>
        )}
    </div>
  )
}

function Config({img = "", name = "Game name"}){
  return (
    <div className='config'>
      <img src={img}/>
      <h3>{name}</h3>
      <button aria-label='Edit configuration'><i className="fa-solid fa-pen-to-square"></i></button>
    </div>
  )
}

function GameSlider({bg = "", name = "Game name", desc = "Game description"}){
  return (
    <div className='game-slider section' style={{backgroundImage: `url(${bg})`}}>
      <h2>{name}</h2>
      <p>{desc}</p>
    </div>
  )
}

function Game({img = "", name = "Game name"}){
  return (
    <div className='game'>
      <img src={img}/>
      <h3>{name}</h3>
      <button aria-label='Show configurations'><i className="fa-solid fa-eye"></i></button>
    </div>
  )
}

function FriendList({img = "", name = "Friend name", loginstatus}){
  return (
    <>
    <div className='friends-mob section'>
      <img height={100} width={100} src={img}/>
      <div className='friend-info'>
        <h3>{name}</h3>
        <button aria-label='Show profile'><i className="fa-solid fa-eye"></i> SHOW PROFILE</button>
      </div>
      <div className='friends-buttons'>
        <button aria-label='Go back'><i className="fa-solid fa-chevron-left"></i></button>
        <button aria-label='Go forward'><i className="fa-solid fa-chevron-right"></i></button>
      </div>
    </div>
    <div className='friends-desk'>
      {!loginstatus && (
        <>
        <Friend/>
        <Friend/>
        <Friend/>
        <Friend/>
        <Friend/>
        <Friend/>
        </>
      )}
    </div>
    </>
  )
}

function Friend({img = "", name = "Friend name"}){
  return (
    <div className='friend section'>
        <img src={img}/>
        <h3>{name}</h3>
        <button aria-label='Show profile'><i className="fa-solid fa-eye"></i> SHOW PROFILE</button>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)