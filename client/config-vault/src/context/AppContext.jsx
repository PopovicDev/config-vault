import { createContext, useState, useEffect} from 'react'
import axios from 'axios'
import { toast } from 'react-toastify';

export const AppContent = createContext();

export function AppContextProvider({children}){

    axios.defaults.withCredentials = true;

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [loginstatus, setLoginStatus] = useState(false);
    const [userData, setUserData] = useState(false);

    const getAuthState = async () => {
        try{
            const {data} = await axios.get(backendUrl + '/api/auth/is-auth');
            if(data.success){
                setLoginStatus(true);
                getUserData();
            }
        }
        catch(error){
            toast.error(error.message);
        }
    }

    const getUserData = async () => {
        try{
            const {data} = await axios.get(backendUrl + '/api/user/data');
            data.success ? setUserData(data.userData) : toast.error(data.message);
        }
        catch(error){
            toast.error(error.message);
        }
    }

    useEffect(() => {
        getAuthState();
    }, []);

    const value = {
        backendUrl,
        loginstatus, setLoginStatus,
        userData, setUserData,
        getUserData,
    }

    return (
            <AppContent.Provider value={value}>
                {children}
            </AppContent.Provider>
    )
}

export default AppContent;