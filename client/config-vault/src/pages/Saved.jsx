import { useContext, useState } from 'react';
import AppContent from '../context/AppContext.jsx'
import Config from '../components/Config.jsx';
import { toast } from 'react-toastify';
import axios from 'axios';
import '../css/saved.css';

function Saved(){
    const { loginstatus, backendUrl } = useContext(AppContent);

    return (
    <div className='saved-section section'>
        <h1>Liked configurations</h1>
        <div className='saved-settings'>
            {!loginstatus ? (
                <>
                <Config/>
                <Config/>
                <Config/>
                <Config/>
                </>
            )
            :
            ''}
        </div>
    </div>
    )
}

export default Saved;