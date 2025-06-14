'use client'

import { createContext, useState, useContext } from "react"
import { io } from "socket.io-client"

const WebsocketContext = createContext()

export function useSocket() {
    const context = useContext(WebsocketContext)
    if (!context) throw new Error("useSocket must be used within a ClientProvider")
    return context.socket
}

export default function ClientProvider({ children }) {
    const [socket] = useState(() => io(process.env.NEXT_PUBLIC_ECOM_WEB_URL)) 

    return (
        <WebsocketContext.Provider value={{ socket }}>
            {children}
        </WebsocketContext.Provider>
    )
}
