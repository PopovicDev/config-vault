import { useContext } from 'react';
import AppContent from '../context/AppContext.jsx';
import { useNavigate } from 'react-router-dom';

function Header(){
    const { loginstatus } = useContext(AppContent);
    const navigate = useNavigate();
    return (
      <div className='header section' style={{justifyContent: (!loginstatus && window.innerWidth > 600) ? 'flex-end' : 'space-between'}}>
        <label htmlFor='burger-menu'><i className="fa-solid fa-bars bg-menu"/></label>
        <div className='header-funcs'>
            {!loginstatus && (
              <button className='login' aria-label='Login' onClick={()=>navigate('/login')}><i className="fa-solid fa-right-to-bracket"/></button>
            )}
        </div>
      </div>
    )
}

export default Header