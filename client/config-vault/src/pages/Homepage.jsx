import { useContext } from 'react';
import Config from '../components/Config.jsx';
import FriendList from '../components/FriendList.jsx';
import AppContent from '../context/AppContext.jsx';
import '../css/homepage.css';

function Homepage(){
  const { loginstatus } = useContext(AppContent);
  return (
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
              <div className='game-slider section' style={{backgroundImage: ""}}>
                <h2>Game name</h2>
                <p>Game description</p>
              </div>
            </div>
            <h4>Check out your friend's configurations <i className="fa-solid fa-chevron-down"></i></h4>
            <FriendList loginstatus={loginstatus}/>
          </div>
  )
}

export default Homepage;