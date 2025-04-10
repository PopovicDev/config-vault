import { useNavigate} from 'react-router-dom'
import '../css/auth.css'

function Login(){
    const navigate = useNavigate();
    return (
        <div className='auth-page'>
            <h1>CONFIG VAULT</h1>
            <div className='login-form'>
                <form>
                    <h2>Log into your account</h2>
                    <input type='text' placeholder='Username'/>
                    <input type='password' placeholder='Password'/>
                    <button className='sidebar-login' aria-label='Log in' onClick={(e)=>{e.preventDefault();}}><i className="fa-solid fa-right-to-bracket"></i> LOG IN</button>
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