function Friend({img = "", name = "Friend name"}){
    return (
      <div className='friend section'>
          <img src={img}/>
          <h3>{name}</h3>
          <button aria-label='Show profile'><i className="fa-solid fa-eye"></i> SHOW PROFILE</button>
      </div>
    )
  }

export default Friend;