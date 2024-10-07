import { createContext } from "react"
import { Socket } from "socket.io-client"
import { DefaultEventsMap } from "node_modules/socket.io/dist/typed-events"

export const WSContext = createContext<
  Socket<DefaultEventsMap, DefaultEventsMap> | undefined
>(undefined)
