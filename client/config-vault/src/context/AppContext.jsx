import { createContext, useState} from 'react'

export const AppContent = createContext();

export function AppContextProvider({children}){

    const [loginstatus, setLoginStatus] = useState(false);

    const value = {
        loginstatus, setLoginStatus
    }

    return (
            <AppContent.Provider value={value}>
                {children}
            </AppContent.Provider>
    )
}

export default AppContent;