import { useState, useContext, useEffect } from 'react'
import { useNavigate} from 'react-router-dom'
import { AppContent } from '../context/AppContext.jsx'
import axios from 'axios'
import { toast } from 'react-toastify';
import '../css/auth.css'

function Login(){
    const navigate = useNavigate();

    const {backendUrl, loginstatus, userData, setLoginStatus, getUserData} = useContext(AppContent);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmitHandler = async (e) => {
        try{
            e.preventDefault();

            axios.defaults.withCredentials = true;

            const {data} = await axios.post(backendUrl + '/api/auth/login',
                {
                    email,
                    password
                }
            )

            if(data.success){
                setLoginStatus(true);
                getUserData();
                navigate('/');
            }
            else{
                toast.error(data.message);
            }
        }
        catch(error){
            toast.error(error.message);
        }
    }

    useEffect(() => {
        loginstatus && userData && navigate('/');
    }, [loginstatus, userData]);

    return (
        <div className='auth-page'>
            <h1>CONFIG VAULT</h1>
            <div className='login-form'>
                <form onSubmit={onSubmitHandler}>
                    <h2>Log into your account</h2>
                    <input type='email' placeholder='Email' onChange={(e)=>setEmail(e.target.value)} value={email}/>
                    <input type='password' placeholder='Password' onChange={(e)=>setPassword(e.target.value)} value={password}/>
                    <button type='submit' className='sidebar-login' aria-label='Log in'><i className="fa-solid fa-right-to-bracket"></i> LOG IN</button>
                </form>
                <div className='login-buttons'>
                    <button aria-label='Create account' onClick={()=>navigate('/register')}>Register account</button>
                    <button aria-label='Forgot password' onClick={()=>navigate('/forgot-password')}>Forgot password?</button>
                </div>
            </div>
            <button className='go-back' onClick={()=>navigate('/')}><i className="fa-solid fa-arrow-left"></i> GO BACK TO HOMEPAGE</button>
        </div>
    )
}

export default Login;