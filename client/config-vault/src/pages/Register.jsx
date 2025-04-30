import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext.jsx'
import axios from 'axios'
import { toast } from 'react-toastify';
import '../css/auth.css'

function Register(){
    const navigate = useNavigate();

    const {backendUrl, loginstatus, userData, setLoginStatus, getUserData} = useContext(AppContent);

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmitHandler = async (e) => {
        try{
            e.preventDefault();

            axios.defaults.withCredentials = true;

            const {data} = await axios.post(backendUrl + '/api/auth/register',
                {
                    name,
                    surname,
                    username,
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
            <div className='register-form'>
                <form onSubmit={onSubmitHandler}>
                    <h2>Create an account</h2>
                    <div>
                        <input type='text' placeholder='Name' onChange={(e)=>setName(e.target.value)} value={name}/>
                        <input type='text' placeholder='Surname' onChange={(e)=>setSurname(e.target.value)} value={surname}/>
                    </div>
                    <input type='text' placeholder='Username' onChange={(e)=>setUsername(e.target.value)} value={username}/>
                    <input type='email' placeholder='Email' onChange={(e)=>setEmail(e.target.value)} value={email}/>
                    <input type='password' placeholder='Password' onChange={(e)=>setPassword(e.target.value)} value={password}/>
                    <button type='submit' className='sidebar-login' aria-label='Register'><i className="fa-solid fa-right-to-bracket"></i> REGISTER</button>
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