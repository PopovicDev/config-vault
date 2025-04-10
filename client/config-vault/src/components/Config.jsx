function Config({img = "", name = "Game name"}){
    return (
      <div className='config'>
        <img src={img}/>
        <h3>{name}</h3>
        <button aria-label='Edit configuration'><i className="fa-solid fa-pen-to-square"></i></button>
      </div>
    )
  }

export default Config