import { useState, useContext, useEffect } from 'react';
import ConfigPreset from './ConfigPreset.jsx'
import AppContent from '../context/AppContext.jsx';
import axios from 'axios'
import { toast } from 'react-toastify';
import '../css/addConfig.css';

function AddConfig() {
    const { backendUrl, configAdd, setConfigAdd, allGames, getAllGames, currentPage, setCurrentPage, currentGame, setCurrentGame, configPreset, setConfigPreset, configName, setConfigName, configStatus, setConfigStatus, configEdit, setConfigEdit, configId, getOwnConfigs, showCfg, setShowCfg} = useContext(AppContent);

    const [searchValue, setSearchValue] = useState('');
    const [searchList, setSearchList] = useState([]);

    useEffect(() => {
        configAdd && getAllGames();
        allGames.length > 0 && setSearchList(allGames);
    }, [configAdd]);

    useEffect(() => {
        if(searchValue === ''){
            setSearchList(allGames);
        }
        else {
            setSearchList(allGames.filter(game => game.name.toLowerCase().includes(searchValue.toLowerCase())));
        }
    }, [allGames])

    const handleSearchValue = () => {
         setSearchList(allGames.filter(game => game.name.toLowerCase().includes(searchValue.toLowerCase())));
    }

    const getConfigPreset = async () => {
        try{
            const {data} = await axios.get(backendUrl + '/api/user/cfgpreset', {params: {game: currentGame}});
            if(data.success){
                setConfigPreset(data.preset);
            }
            else{
                toast.error(data.message);
            }
        }
        catch(error){
            toast.error(error.message);
        }
    }

    const saveConfig = async () => {
        try{
            if(configName === ''){
                return toast.error("You need to enter config name!");
            }
            const {data} = await axios.post(backendUrl + '/api/user/saveconfig', {configName: configName, gameName: currentGame, configPreset: configPreset, visibility: configStatus});
            if(data.success){
                toast.success(data.message);
                setCurrentPage(0);
                setCurrentGame('');
                setConfigStatus('private');
                setConfigName('');
                setConfigPreset('');
                setConfigAdd(false);
                setConfigEdit(false);
                getOwnConfigs();
            }
            else{
                toast.error(data.message);
            }
        }
        catch(error){
            toast.error(error.message);
        }
    }

    const editConfig = async() => {
        try{
            const {data} = await axios.post(backendUrl + '/api/user/editconfig', {configId: configId, configName: configName, gameName: currentGame, configPreset: configPreset, visibility: configStatus});
            if(data.success){
                toast.success(data.message);
                setCurrentPage(0);
                setCurrentGame('');
                setConfigStatus('private');
                setConfigName('');
                setConfigPreset('');
                setConfigAdd(false);
                setConfigEdit(false);
            }
            else{
                toast.error(data.message);
            }
        }
        catch(error){
            toast.error(error.message);
        }
    }

    return (
        <>{configAdd && (
            <div className='add-config-section'>
                <button className='add-config-close' onClick={() => { setConfigAdd(false); setCurrentPage(0); setCurrentGame('');setConfigStatus('private'); setConfigName(''); setConfigPreset(''); setConfigEdit(false); setShowCfg(false)}}><i className="fa-solid fa-xmark"></i></button>
                <h1 className='add-config-title'>ADD CONFIG</h1>
                <h2 className='add-config-undertitle'>{currentGame}</h2>
                <div className='add-config-container' style={{alignItems: currentPage === 0 ? 'center' : 'flex-start'}}>
                {currentPage === 0 && (
                    <>
                        <div className='add-config-selectgame'>
                            <div className='selectgame-left'>
                                <div className='selectgame-left-top'>
                                    <input type='text' placeholder='Search for a game...' onKeyDown={()=>{handleSearchValue()}} onChange={(e)=>setSearchValue(e.target.value)}/>
                                    <h3>Select a game you want and make a config out of it!</h3>
                                </div>
                                <div className='selectgame-left-bottom'>
                                    <h3>Game: <span className=''>{currentGame}</span></h3>
                                    <button className={currentGame === '' ? 'sidebar-login active' : 'sidebar-login'} onClick={()=>{currentGame !== '' && setCurrentPage(1); getConfigPreset()}}>SUBMIT</button>
                                </div>
                            </div>
                            <div className='selectgame-right'>
                                {searchList && searchList.map((game, index) => {
                                    return (
                                        <div key={index} style={{backgroundColor:currentGame == game.name ? 'var(--primary-color)' : 'var(--background-color-light)'}} onClick={()=>{ currentGame == game.name ? setCurrentGame('') : setCurrentGame(game.name);}} className='selectgame-right-game'>
                                            <h3>{game.name}</h3>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </>
                )}
                {currentPage === 1 && (
                    <>
                    <div className='add-config-edit'>
                        <ConfigPreset configPreset={configPreset} setConfigPreset={setConfigPreset}/>
                    </div>
                    {!showCfg ? (
                        <div className='add-config-menu'>
                        <div className='add-config-name'>
                            <h3>CONFIG NAME: </h3>
                            <input type='text' placeholder='Enter config name...' onChange={(e)=>setConfigName(e.target.value)} value={configName}/>
                        </div>
                        <div className='add-config-buttons'>
                            <button onClick={()=>setConfigStatus('private')} style={{border: configStatus === 'private' ? '2px solid var(--secondary-color)' : '2px solid transparent'}}>PRIVATE</button>
                            <button onClick={()=>setConfigStatus('public')} style={{border: configStatus === 'public' ? '2px solid var(--secondary-color)' : '2px solid transparent'}}>PUBLIC</button>
                        </div>
                        {configEdit ? <button className='add-config-save' onClick={()=>editConfig()}>EDIT CONFIG</button> : <button className='add-config-save' onClick={()=>saveConfig()}>SAVE CONFIG</button>}
                        </div>
                    ): (
                        <div className='add-config-menu'>
                            <div className='add-config-name'>
                                <h3>{configName}</h3>
                            </div>
                        </div>
                    )}
                    </>
                )}
                </div>
            </div>
        )}
        </>
    );
}

export default AddConfig;