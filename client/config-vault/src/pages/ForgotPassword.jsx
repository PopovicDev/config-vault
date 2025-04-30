import {useState, useRef, useContext, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import AppContent from '../context/AppContext.jsx';
import { toast } from 'react-toastify';
import axios from 'axios';

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isEmailSent, setIsEmailSent] = useState('');
    const [otp, setOtp] = useState(0);
    const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
    
    const {backendUrl, setLoginStatus, setUserData} = useContext(AppContent);

    axios.defaults.withCredentials = true;

    const inputRefs = useRef([]);

    const handleInput = (e, index) => {
        if(e.target.value.length > 0 && index < inputRefs.current.length - 1){
            inputRefs.current[index + 1].focus();
        }
    }

    const handleKeyDown = (e, index) => {
        if(e.key === 'Backspace' && e.target.value === '' && index > 0){
            inputRefs.current[index - 1].focus();
        }
    }

    const handlePaste = (e) => {
        const pastedData = e.clipboardData.getData('text/plain').split('');
        pastedData.forEach((char, index) => {
            if(inputRefs.current[index]){
                inputRefs.current[index].value = char;
            }
        })
    }

    const onSubmitEmail = async (e) => {
        e.preventDefault();
        try{
            const {data} = await axios.post(backendUrl + '/api/auth/send-reset-otp', {email});
            if(data.success){
                toast.success(data.message);
                setIsEmailSent(true);
            }
            else{
                toast.error(data.message);
            }
        }
        catch(error){
            toast.error(error.message);
        }
    }

    const onSubmitOtp = async (e) => {
        e.preventDefault();
        try{
            const otp = Array.from(inputRefs.current).map(input => input.value).join('');
            setOtp(otp);
            setIsOtpSubmitted(true);
        }
        catch(error){
            toast.error(error.message);
        }
    }

    const onSubmitNewPassword = async (e) => {
        e.preventDefault();
        try{
            const {data} = await axios.post(backendUrl + '/api/auth/reset-password', {email, otp, password: newPassword});
            if(data.success){
                toast.success(data.message);
                logout();
            }
            else{
                toast.error(data.message);
            }
        }
        catch(error){
            toast.error(error.message);
        }

    }

    const logout = async () => {
        try{
            const {data} = await axios.post(backendUrl + '/api/auth/logout');
            if(data.success){
                setLoginStatus(false);
                setUserData(false);
            }
            navigate('/login');
        }
        catch(error){
            toast.error(error.message);
        }
      }

    return (
        <div className='auth-page'>
            <h1>CONFIG VAULT</h1>
            {!isEmailSent && (
                <form className='auth-form' onSubmit={onSubmitEmail}>
                    <h2>Reset password</h2>
                    <p>Enter your registered email address</p>
                    <input type="email" placeholder='Email' required className='auth-form-email' onChange={(e)=>setEmail(e.target.value)} value={email}/>
                    <button className='sidebar-login'>Submit</button>
                </form>
            )}
            {isEmailSent && !isOtpSubmitted && (
                <form className='auth-form' onSubmit={onSubmitOtp}>
                    <h2>Reset password OTP</h2>
                    <p>Enter the 6-digit code sent to your email</p>
                    <div className='auth-form-inputs' onPaste={handlePaste}>
                        {Array(6).fill(0).map((_, index) => (
                            <input type='text' key={index} maxLength='1' required
                                className='auth-form-input' ref={(e) => inputRefs.current[index] = e} onInput={(e) => handleInput(e, index)} onKeyDown={(e) => handleKeyDown(e, index)}
                            />
                        ))}
                    </div>
                    <button type='submit' className='sidebar-login'>Submit</button>
                </form>
            )}
            {isEmailSent && isOtpSubmitted && (
                <form className='auth-form' onSubmit={onSubmitNewPassword}>
                    <h2>New password</h2>
                    <p>Enter the new password below</p>
                    <input type="password" placeholder='Password' required className='auth-form-email' onChange={(e)=>setNewPassword(e.target.value)} value={newPassword}/>
                    <button className='sidebar-login'>Submit</button>
                </form>
            )}
        </div>
    );
}

export default ForgotPassword;