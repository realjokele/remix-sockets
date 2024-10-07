import { createServer } from "node:http"
import { createRequestHandler } from "@remix-run/express"
import compression from "compression"
import express from "express"
import morgan from "morgan"
import { installGlobals } from "@remix-run/node"
import { Server as SocketServer } from "socket.io"

installGlobals()

const viteDevServer =
  process.env.NODE_ENV === "production"
    ? undefined
    : await import("vite").then((vite) =>
        vite.createServer({
          server: { middlewareMode: true }
        })
      )

const app = express()

// create an httpServer from the Express app
const httpServer = createServer(app)

const io = new SocketServer(httpServer)

io.on("connection", (socket) => {
  console.log(socket.id, "connected")
  socket.emit("event", "connected!")

  setInterval(() => {
    socket.emit("gallery-update", "galleryId")
  }, 5000)

  socket.on("ping", (data) => {
    console.log(socket.id, data)
    socket.emit("event", "pong")
  })
})

const remixHandler = createRequestHandler({
  build: viteDevServer
    ? () => viteDevServer.ssrLoadModule("virtual:remix/server-build")
    : await import("./build/server/index.js"),
  getLoadContext() {
    return { sockets: io.sockets }
  }
})

app.use(compression())

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by")

// handle asset requests
if (viteDevServer) {
  app.use(viteDevServer.middlewares)
} else {
  // Vite fingerprints its assets so we can cache forever.
  app.use(
    "/assets",
    express.static("build/client/assets", { immutable: true, maxAge: "1y" })
  )
}

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("build/client", { maxAge: "1h" }))

app.use(morgan("tiny"))

// handle SSR requests
app.all("*", remixHandler)

const port = process.env.PORT || 3000
httpServer.listen(port, () =>
  console.log(`Express server listening at http://localhost:${port}`)
)
