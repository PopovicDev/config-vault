import { createContext, useState, useEffect, useRef} from 'react'
import axios from 'axios'
import { toast } from 'react-toastify';

export const AppContent = createContext();

export function AppContextProvider({children}){

    axios.defaults.withCredentials = true;

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [loginstatus, setLoginStatus] = useState(false);
    const [userData, setUserData] = useState(false);
    const [allUsers, setAllUsers] = useState(false);
    const [searchMenu, setSearchMenu] = useState(false);
    const searchMenuRef = useRef(null);

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

    const getAllUsers = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/user/all-users');
            data.success ? setAllUsers(data.users) : toast.error(data.message);
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
        allUsers,
        getAllUsers,
        searchMenuRef,
        searchMenu, setSearchMenu,
    }

    return (
            <AppContent.Provider value={value}>
                {children}
            </AppContent.Provider>
    )
}

export default AppContent;