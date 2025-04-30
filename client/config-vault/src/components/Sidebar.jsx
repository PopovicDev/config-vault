import { useContext } from 'react';
import AppContent from '../context/AppContext.jsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function Sidebar({setBurgerChecked}){
    const navigate = useNavigate();
    const { loginstatus, backendUrl, setLoginStatus, setUserData } = useContext(AppContent);

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

    return (
      <div className='sidebar section'>
      <h3><i className="fa-solid fa-dice-d20"></i> My Dashboard</h3>
        <ul>
          <li onClick={()=>{setBurgerChecked(false); navigate('/'); window.scrollTo({top: 0, behavior: 'smooth'});}}><i className="fa-solid fa-house"></i> Homepage</li>
          {loginstatus && (
            <>
              <li onClick={()=>{setBurgerChecked(false); navigate('/games')}}><i className="fa-solid fa-gamepad"></i> Games</li>
              <li onClick={()=>{setBurgerChecked(false); navigate('/saved')}}><i className="fa-solid fa-list-check"></i> Saved Settings</li>
              <li><i className="fa-solid fa-plus"></i> Add Settings</li>
              </>
          )}
        </ul>
        <div className='sidebar-friends'>
          <h3><i className="fa-solid fa-user-group"></i> Friends</h3>
          <button aria-label='Add friend'>
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
        {!loginstatus ? <p>If you want to add friends, you'll need to log in!</p> : <ul></ul>}
        {loginstatus ? <button className='sidebar-login' aria-label='Log out' onClick={()=>logout()}><i className="fa-solid fa-plug-circle-xmark"></i> LOG OUT</button> : <button className='sidebar-login' aria-label='Login' onClick={()=>{setBurgerChecked(false); navigate('/login')}}><i className="fa-solid fa-right-to-bracket"></i> LOG IN</button>}
      </div>
    )
}

export default Sidebar
