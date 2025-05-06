import { useParams } from 'react-router-dom'
import { useState, useContext, useEffect } from 'react';
import AppContent from '../context/AppContext.jsx';
import { toast } from 'react-toastify';
import axios from 'axios';
import '../css/profile.css'

function Profile({likes="0"}) {
    const { username } = useParams();
    const { backendUrl, userData } = useContext(AppContent);
    const [userProfile, setUserProfile] = useState(false);
    
    const getUserProfile = async () => {
        try{
            const {data} = await axios.get(backendUrl + '/api/user/profile-data/' + username);
            data.success ? setUserProfile(data.userData) : toast.error(data.message);
        }
        catch(error){
            toast.error(error.message);
        }
    }

    const addFollower = async () => {
        try{
            const {data} = await axios.post(backendUrl + '/api/user/addFollower', {followerId: userProfile.userId});
            data.success ? getUserProfile() : toast.error(data.message);
        }
        catch(error){
            toast.error(error.message);
        }
    }

    const removeFollower = async () => {
        try{
            const {data} = await axios.post(backendUrl + '/api/user/removeFollower', {followerId: userProfile.userId});
            data.success ? getUserProfile() : toast.error(data.message);
        }
        catch(error){
            toast.error(error.message);
        }
    }

    useEffect(() => {
        getUserProfile();
    }, [username]);
    
    return (
        <div className='profile-page'>
            <div className="profile-info">
                <div className="profile-m-info">
                    <div className="profile-pic">
                        <h1>{userProfile.name ? userProfile.name[0] : ""}</h1>
                    </div>
                    <div>
                        <h1>{userProfile.name + " " + userProfile.surname}</h1>
                        <h4>{username}</h4>
                        {userData.username !== userProfile.username ? (
                            <>
                                {userProfile.followingStatus ? <button className='sidebar-login' onClick={()=>removeFollower()}><i className="fa-solid fa-x"/> Remove</button> : <button className='sidebar-login' onClick={()=>addFollower()}><i className="fa-solid fa-plus"/> Follow</button>}
                            </>
                        ) : ''}
                    </div>
                </div>
                <div className="profile-o-info">
                    <div>
                        <h4>Followers</h4>
                        <h1>{userProfile.followersCount ? userProfile.followersCount[0].followers : ''}</h1>
                    </div>
                    <div>
                        <h4>Following</h4>
                        <h1>{userProfile.followingCount ? userProfile.followingCount[0].following : ''}</h1>
                    </div>
                    <div>
                        <h4>Likes</h4>
                        <h1>{likes}</h1>
                    </div>
                </div>
            </div>
            <hr/>
        </div>
    );
}

export default Profile;