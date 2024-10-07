import * as React from "react"
import type { AppLoadContext, LoaderFunctionArgs } from "@remix-run/node"

import { Socket } from "socket.io-client"
import { DefaultEventsMap } from "node_modules/socket.io/dist/typed-events"
import { WSContext } from "~/ws.context"

function getSocket(context: AppLoadContext) {
  return context.sockets as Socket<DefaultEventsMap, DefaultEventsMap>
}

export async function loader({ context }: LoaderFunctionArgs) {
  const socket = getSocket(context)
  socket.emit("gallery-update", "galleryIdblubb")

  return null
}

export default function Index() {
  const socket = React.useContext(WSContext)

  const ping = () => {
    socket?.emit("ping", "Hello from the client!")
  }

  React.useEffect(() => {
    if (!socket) return
    socket.on("gallery-update", (data) => {
      console.log("Socket event", data)
    })
    socket.on("event", (data) => {
      console.log("Server pong", data)
    })
  }, [socket])

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-[200px] flex flex-col gap-2">
        Open your browser console to see the message from the server.
        <button
          className="bg-slate-300 border-solid border border-slate-500"
          onClick={() => {
            ping()
          }}
        >
          Send Ping
        </button>
      </div>
    </div>
  )
}
