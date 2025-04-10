import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Homepage from './pages/Homepage.jsx'
import Games from './pages/Games.jsx'
import Saved from './pages/Saved.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'

function App(){
  return (
    <>
        <Routes>
            <Route path='/' element={<Layout/>}>
                <Route index element={<Homepage/>}/>
                <Route path='games' element={<Games />}/>
                <Route path='saved' element={<Saved />}/>
            </Route>
            <Route path='/register' element={<Register/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/forgot-password' element={<ForgotPassword/>}/>
        </Routes>
    </>
  )
}

export default App