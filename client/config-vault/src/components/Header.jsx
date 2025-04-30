import { useState, useContext } from 'react';
import AppContent from '../context/AppContext.jsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function Header(){
    const { loginstatus, userData, backendUrl, setLoginStatus, setUserData } = useContext(AppContent);
    const [userInfo, setUserInfo] = useState(false);
    const navigate = useNavigate();

    const logout = async () => {
      try{
          axios.defaults.withCredentials = true;
          const {data} = await axios.post(backendUrl + '/api/auth/logout');
          if(data.success){
              setLoginStatus(false);
              setUserData(false);
          }
          navigate('/');
      }
      catch(error){
          toast.error(error.message);
      }
    }

    const sendVerificationOtp = async () => {
      try{
          axios.defaults.withCredentials = true;
          const {data} = await axios.post(backendUrl + '/api/auth/send-verify-otp');
          if(data.success){
              navigate('/verify-email');
              toast.success(data.message);
          }
          else{
              toast.error(data.message);
          }
      }
      catch(error){
          toast.error(error.message);
      }
    }

    return (
      <div className='header section' style={{justifyContent: (!loginstatus && window.innerWidth > 600) ? 'flex-end' : 'space-between'}}>
        <div className='header-inputs'>
          <label htmlFor='burger-menu'><i className="fa-solid fa-bars bg-menu"/></label>
          {loginstatus && (
            <div className='search-bar'>
              <input type='text' placeholder='Search for friends...'/>
            </div>
          )}
        </div>
        <div className='header-funcs'>
            {!loginstatus && (
              <button className='login' aria-label='Login' onClick={()=>navigate('/login')}><i className="fa-solid fa-right-to-bracket"/></button>
            )}
            {userData && (
              <>
              <div className='user-profile'>
                <div className='user-profile-pic' onClick={()=>setUserInfo(!userInfo)}>
                  <h1>{userData.name[0]}</h1>
                </div>
                {userInfo && (
                  <div className='user-profile-info'> 
                    <h5>{userData.username}</h5>
                    <p>{userData.name + " " + userData.surname}</p>
                  </div>
                )}
              </div>
              <div className='user-funcs'>
                <i className="fa-solid fa-gear"/>
                <div className='user-funcs-dropdown'>
                  <ul>
                    {!userData.isAccountVerified && <li onClick={()=>sendVerificationOtp()}>Verify mail</li>}
                    <li onClick={()=>logout()}>Logout</li>
                  </ul>

                </div>
              </div>
              </>
            )}
        </div>
      </div>
    )
}

export default Header