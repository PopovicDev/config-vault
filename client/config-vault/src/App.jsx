import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Homepage from './pages/Homepage.jsx'
import Games from './pages/Games.jsx'
import Saved from './pages/Saved.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import EmailVerify from './pages/EmailVerify.jsx'
import Profile from './pages/Profile.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App(){
  return (
    <>
        <ToastContainer/>
        <Routes>
            <Route path='/' element={<Layout/>}>
                <Route index element={<Homepage/>}/>
                <Route path='games' element={<Games />}/>
                <Route path='saved' element={<Saved />}/>
                <Route path='/profile/:username' element={<Profile/>}/>
            </Route>
            <Route path='/register' element={<Register/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/forgot-password' element={<ForgotPassword/>}/>
            <Route path='/verify-email' element={<EmailVerify/>}/>
        </Routes>
    </>
  )
}

export default App