import { useContext } from 'react';
import Friend from '../components/Friend.jsx';
import AppContent from '../context/AppContext.jsx';

function FriendList({img = "", name = "Friend name"}){
    const { loginstatus } = useContext(AppContent);
    return (
      <>
      <div className='friends-mob section'>
        <img height={100} width={100} src={img}/>
        <div className='friend-info'>
          <h3>{name}</h3>
          <button aria-label='Show profile'><i className="fa-solid fa-eye"></i> SHOW PROFILE</button>
        </div>
        <div className='friends-buttons'>
          <button aria-label='Go back'><i className="fa-solid fa-chevron-left"></i></button>
          <button aria-label='Go forward'><i className="fa-solid fa-chevron-right"></i></button>
        </div>
      </div>
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
      </div>
      </>
    )
}

export default FriendList;