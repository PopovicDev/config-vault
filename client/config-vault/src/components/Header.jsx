import { useState, useContext, useEffect } from 'react';
import AppContent from '../context/AppContext.jsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function Header(){
    const { loginstatus, userData, backendUrl, setLoginStatus, setUserData, allUsers, getAllUsers, searchMenu, setSearchMenu, searchMenuRef} = useContext(AppContent);
    const [userInfo, setUserInfo] = useState(false);
    const [searchList, setSearchList] = useState([]);
    const [searchValue, setSearchValue] = useState('');
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

    const handleSearchMenu = () => {
      setSearchList(allUsers.filter(user => user.username.toLowerCase().includes(searchValue.toLowerCase())));
    }

    useEffect(() => {
      if(loginstatus){
        getAllUsers();
      }
    }, [loginstatus]);

    useEffect(() => {
        if(searchValue === ''){
            setSearchList([]);
        }
        else {
            setSearchList(allUsers.filter(user => user.username.toLowerCase().includes(searchValue.toLowerCase())));
        }
    }, [searchValue])

    return (
      <div className='header section' style={{justifyContent: (!loginstatus && window.innerWidth > 600) ? 'flex-end' : 'space-between'}}>
        <div className='header-inputs'>
          <label htmlFor='burger-menu'><i className="fa-solid fa-bars bg-menu"/></label>
          {loginstatus && (
            <div className='search-bar'>
              <input type='text' placeholder='Search for friends...' onChange={(e)=>{setSearchMenu(true); setSearchValue(e.target.value)}} onBlur={()=> setTimeout(()=>{setSearchMenu(false)},100)} onKeyDown={()=>handleSearchMenu()} value={searchValue} ref={searchMenuRef}/>
              {searchMenu && searchList.length !== 0 && (
                <div className='search-menu'>
                  <ul>
                    {allUsers && searchList.map((user, index) => {
                      return (
                        <li key={index} onClick={()=>{setSearchMenu(false); navigate('/profile/' + user.username); setSearchList([]); setSearchValue('')}}>
                          <h4>{user.username}</h4>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
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
                <div className='user-profile-pic' onClick={()=>{setUserInfo(!userInfo); navigate('/profile/' + userData.username)}}>
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
                    <li onClick={()=>navigate('/profile/' + userData.username)}>View profile</li>
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