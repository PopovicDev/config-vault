import { useNavigate } from "react-router-dom";

function Friend({name = "Friend name", username = "Friend username"}){
    const navigate = useNavigate();
    return (
      <div className='friend section'>
          <div className="friend-pic">
          <h1>{username[0].toUpperCase()}</h1>
          </div>
          <h3>{name}</h3>
          <h5>{username}</h5>
          <button aria-label='Show profile' onClick={()=>navigate('/profile/' + username)}><i className="fa-solid fa-eye"></i> SHOW PROFILE</button>
      </div>
    )
  }

export default Friend;