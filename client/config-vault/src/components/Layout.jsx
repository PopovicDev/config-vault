import { useContext, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Sidebar from '../components/Sidebar.jsx';
import AppContent from '../context/AppContext.jsx';
import '../css/layout.css';

function Layout(){
    const { loginstatus } = useContext(AppContent);
    const [burgerChecked, setBurgerChecked] = useState(false);
    const navigate = useNavigate();
    return (
        <div className='layout-page'>
            <input type='checkbox' id='burger-menu' checked={burgerChecked} onChange={()=>setBurgerChecked(!burgerChecked)}/>
            <Sidebar setBurgerChecked={setBurgerChecked}/>
            <div className='header-mainpage'>
                <Header/>
                <div className='mainpage-section' style={{overflowY: loginstatus ? 'scroll' : 'hidden'}}>
                    <div className='mainpage' style={{filter: loginstatus ? 'blur(0px)' : 'blur(8px)'}}>
                        <Outlet/>
                    </div>
                    {!loginstatus && (
                        <div className='login-box'>
                            <div className='login-message-box'>
                                <h3>ConfigVault helps gamers store, manage, and share their game configurations effortlessly.<br/><br/>Customize settings, access them anytime, and explore setups from other players — all in one place!<br/><br/></h3>
                                <button className='sidebar-login' aria-label='Login' onClick={()=>navigate('/login')}><i className="fa-solid fa-right-to-bracket"></i> LOG IN</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Layout;