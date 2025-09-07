import AppContent from '../context/AppContext.jsx';
import { useContext } from 'react';
import axios from 'axios'
import { toast } from 'react-toastify';

function Config({img = "", game_name = 'Game name', name = "Config name", config_preset = "", config_status = "private", id="", buttonsStatus = true}) {
    const {backendUrl, setConfigAdd, setCurrentPage, setCurrentGame, setConfigPreset, setConfigName, setConfigStatus, setConfigEdit, setConfigId, setShowCfg, getOwnConfigs} = useContext(AppContent);
    
    const imageSrc = img || `../games_icons/${game_name.toLowerCase().replaceAll(' ', '_')}.jpg`;

    const editConfig = async() => {
      try{
        setConfigAdd(true);
        setCurrentPage(1);
        setCurrentGame(game_name);
        setConfigName(name);
        setConfigPreset(config_preset);
        setConfigStatus(config_status);
        setConfigEdit(true);
        setConfigId(id);
      }
      catch(error){
        toast.error(error.message);
      }
    }

    const deleteConfig = async() => {
      try{
        const {data} = await axios.post(backendUrl + '/api/user/deleteconfig', {configId: id});
        if(data.success){
          toast.success(data.message);
          getOwnConfigs();
        }
      }
      catch(error){
        toast.error(error.message);
      }
    }

    const showConfig = async () => {
      try{
        const {data} = await axios.post(backendUrl + '/api/user/showConfig', {configId: id});
        if(data.success){
          setShowCfg(true);
          setConfigAdd(true);
          setCurrentPage(1);
          setCurrentGame(data.config.game_name);
          setConfigName(data.config.config_name);
          setConfigPreset(data.config.settings);
          setConfigStatus(data.config.visibility);
          setConfigEdit(false);
          setConfigId(id);
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
      <div className='config'>
        <div className='config-info'>
          <img src={imageSrc}/>
          <h3>{name}</h3>
        </div>
        <div className='config-buttons'>
          {buttonsStatus ? (
            <>
              <button aria-label='Edit configuration' onClick={()=>editConfig()}><i className="fa-solid fa-pen-to-square"></i></button>
              <button aria-label='Delete configuration' onClick={()=>deleteConfig()}><i className="fa-solid fa-x"></i></button>
            </>
          ) : <button aria-label='Show configuration' onClick={()=>showConfig()}><i className="fa-solid fa-eye"></i></button>}
        </div>
      </div>
    )
  }

export default Config