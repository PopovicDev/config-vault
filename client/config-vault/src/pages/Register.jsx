import { useNavigate } from 'react-router-dom'
import '../css/auth.css'

function Register(){
    const navigate = useNavigate();
    return (
        <div className='auth-page'>
            <h1>CONFIG VAULT</h1>
            <div className='register-form'>
                <form>
                    <h2>Create an account</h2>
                    <div>
                        <input type='text' placeholder='Name'/>
                        <input type='text' placeholder='Surname'/>
                    </div>
                    <input type='text' placeholder='Username'/>
                    <input type='email' placeholder='Email'/>
                    <input type='password' placeholder='Password'/>
                    <input type='password' placeholder='Confirm password'/>
                    <button className='sidebar-login' aria-label='Register' onClick={(e)=>{e.preventDefault();}}><i className="fa-solid fa-right-to-bracket"></i> REGISTER</button>
                </form>
                <div className='register-buttons'>
                    <p>Already have an account? <button aria-label='Log in' onClick={()=>navigate('/login')}>Log in</button></p>
                </div>
            </div>
            <button className='go-back' onClick={()=>navigate('/')}><i className="fa-solid fa-arrow-left"></i> GO BACK TO HOMEPAGE</button>
        </div>
    )
}

export default Register;