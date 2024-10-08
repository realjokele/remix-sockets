# Using sockets with Remix and Express

## Additional packages

- socket.io
- socket.io-client

## server.mjs

- Create socket server
- Add sockets to AppContext, so action and loader functions can access them

## app/ws.client.ts

- Implements connection()
- connection() is used by root.tsx to connect the client

## app/ws.context.ts

- Creates a React Context, which is used by root.tsx

## root.tsx

- Connects the client
- Add the socket context

## app/routes/\_index.tsc

- Sends a message from the loader
- Sends a message from the client
- Receives messages

## Sources

- https://sergiodxa.com/tutorials/use-remix-with-socket-io
- https://stackblitz.com/~/github.com/rossipedia/rossipedia-remix-socket-io?file=app/ws.context.ts
