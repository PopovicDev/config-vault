function Game({img = "", name = "Game name"}){
    return (
      <div className='game'>
        <img src={img}/>
        <h3>{name}</h3>
        <button aria-label='Show configurations'><i className="fa-solid fa-eye"></i></button>
      </div>
    )
  }

export default Game