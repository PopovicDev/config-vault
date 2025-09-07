import { useContext } from 'react';
import Friend from '../components/Friend.jsx';
import AppContent from '../context/AppContext.jsx';

function FriendList(){
    const { loginstatus, userData } = useContext(AppContent);
    return (
      <div className='friends-desk'>
        {!loginstatus && (
          <>
          <Friend/>
          <Friend/>
          <Friend/>
          <Friend/>
          <Friend/>
          <Friend/>
          </>
        )}
        {userData.followers && userData.followers.length !== 0 ? userData.followers.map((user, index)=> {
          return (
            <Friend key={index} name={user.name + " " + user.surname} username={user.username}/>
          )
        }) : ''}
      </div>
    )
}

export default FriendList;