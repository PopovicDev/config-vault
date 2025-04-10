import { useContext } from 'react';
import { AppContent } from '../context/AppContext.jsx'
import Config from '../components/Config.jsx';
import '../css/saved.css';

function Saved(){
    const { loginstatus } = useContext(AppContent);
    <div className='saved-section section'>
        <h1>Your saved settings</h1>
        <div className='saved-settings'>
            {!loginstatus && (
                <>
                <Config/>
                <Config/>
                <Config/>
                <Config/>
                </>
            )}
        </div>
    </div>
}

export default Saved;