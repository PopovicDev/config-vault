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
    const [configAdd, setConfigAdd] = useState(false);
    const [allGames, setAllGames] = useState(false);
    const [allConfigs, setAllConfigs] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [currentGame, setCurrentGame] = useState('');
    const [configPreset, setConfigPreset] = useState('');
    const [configName, setConfigName] = useState('');
    const [configStatus, setConfigStatus] = useState('private');
    const [configEdit, setConfigEdit] = useState(false);
    const [configId, setConfigId] = useState('');
    const [showCfg, setShowCfg] = useState(false);
    const [likes, setLikes] = useState('');
    const [likeCount, setLikeCount] = useState(0);
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

    const getAllGames = async () => {
        try{
            const {data} = await axios.get(backendUrl + '/api/user/all-games');
            if(data.success){
                setAllGames(data.games);
            }
            else {
                toast.error(data.message);
            }
        }
        catch(error){
            toast.error(error.message);
        }
    }

    const getOwnConfigs = async () => {
        try{
            const {data} = await axios.get(backendUrl + '/api/user/getOwnConfigs');
            if(data.success){
                setAllConfigs(data.configs);
            }
            else {
                toast.error(data.message);
            }
        }
        catch(error){
            toast.error(error.message);
        }
    }

    const checkLikes = async (name) => {
        try{
            const {data} = await axios.post(backendUrl + '/api/user/checkLikes', {username: name});
            if(data.success){
                toast.success(data.message);
                setLikes(data.likes);
            }
            else {
                toast.error(data.message);
            }
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
        configAdd, setConfigAdd,
        allGames, setAllGames,
        getAllGames,
        allConfigs, setAllConfigs,
        getOwnConfigs,
        currentPage, setCurrentPage,
        currentGame, setCurrentGame,
        configPreset, setConfigPreset,
        configName, setConfigName,
        configStatus, setConfigStatus,
        configEdit, setConfigEdit,
        configId, setConfigId,
        showCfg, setShowCfg,
        likes, setLikes,
        checkLikes,
        likeCount, setLikeCount
    }

    return (
            <AppContent.Provider value={value}>
                {children}
            </AppContent.Provider>
    )
}

export default AppContent;