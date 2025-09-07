import { useContext, useEffect } from 'react';
import Config from '../components/Config.jsx';
import FriendList from '../components/FriendList.jsx';
import AppContent from '../context/AppContext.jsx';
import '../css/homepage.css';

function Homepage(){
  const { loginstatus, userData, getOwnConfigs, allConfigs } = useContext(AppContent);

  useEffect(() => {
    loginstatus && getOwnConfigs();
  }, [loginstatus]);

  return (
    <div className='cfg-section'>
            <div className='cfg-box1'>
              <div className='your-configs section'>
                <h3>Your configs</h3>
                {!loginstatus ? (
                  <div className='configs'>
                  <Config/>
                  <Config/>
                  <Config/>
                  <Config/>
                  </div>
                ) : 
                (
                <div className='configs cfgs'>
                  {allConfigs && allConfigs.map((config, index) => (
                    <Config key={index} game_name={config.game_name} name={config.config_name} config_preset={config.settings} config_status={config.visibility} id={config.config_id}/>
                  ))}
                </div>
                )}
              </div>
              <div className='game-slider section' style={{backgroundImage: ""}}>
                <h2>Game name</h2>
                <p>Game description</p>
              </div>
            </div>
            {userData.followers && userData.followers.length !== 0 ? (
              <>
                <h4>Check out your friend's configurations <i className="fa-solid fa-chevron-down"></i></h4>
              </>
            ) : <h4>You aren't following anyone yet, follow somebody and see their configs! </h4>}
            <FriendList loginstatus={loginstatus}/>
          </div>
  )
}

export default Homepage;