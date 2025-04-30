import {useRef, useContext, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import AppContent from '../context/AppContext.jsx';
import { toast } from 'react-toastify';
import axios from 'axios';

function EmailVerify() {
    const navigate = useNavigate();

    const {backendUrl, loginstatus, userData, getUserData} = useContext(AppContent);

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

    const onSubmitHandler = async (e) => {
        try{
            e.preventDefault();
            const otp = Array.from(inputRefs.current).map(input => input.value).join('');

            const {data} = await axios.post(backendUrl + '/api/auth/verify-account', {otp});

            if(data.success){
                toast.success(data.message);
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
        loginstatus && userData && userData.isAccountVerified && navigate('/');
    }, [loginstatus, userData]);

    return (
        <div className='auth-page'>
                <h1>CONFIG VAULT</h1>
            <form className='auth-form' onSubmit={onSubmitHandler}>
                <h2>Email Verify OTP</h2>
                <p>Enter the 6-digit code sent to your email</p>
                <div className='auth-form-inputs' onPaste={handlePaste}>
                    {Array(6).fill(0).map((_, index) => (
                        <input type='text' key={index} maxLength='1' required
                            className='auth-form-input' ref={(e) => inputRefs.current[index] = e} onInput={(e) => handleInput(e, index)} onKeyDown={(e) => handleKeyDown(e, index)}
                        />
                    ))}
                </div>
                <button type='submit' className='sidebar-login'>Verify Email</button>
            </form>
            <button className='go-back' onClick={()=>navigate('/')}><i className="fa-solid fa-arrow-left"></i> GO BACK TO HOMEPAGE</button>
        </div>
    );
}

export default EmailVerify;