import { useContext } from "react"
import AppContent from "../context/AppContext.jsx"
import Game from "../components/Game.jsx"
import '../css/games.css'

function Games(){
    const { loginstatus } = useContext(AppContent);
    return (
        <div className='games-section section'>
            <h1>Games</h1>
            <div className='games'>
              {!loginstatus && (
                <>
                <Game/>
                <Game/>
                <Game/>
                <Game/>
                </>
              )}
            </div>
          </div>
    )
}

export default Games;