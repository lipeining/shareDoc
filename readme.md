主要的是：mongodb的版本不能过高，暂时使用的mongodb 3.4
    "sharedb": "^1.0.0-beta.9",

##socket.io与websocket
socket.io与websocket可以同时共享一个server，不过，

##todo 
1. replace the chat with room
2. use request.url to set up different room 
3. use redis to store the userMapSocket
4. make it easy to push message and get the cursor info!
## about socket.io websocket-server
1. can we use socket.io instead the websocket 
2. WebSocket server?
https://stackoverflow.com/questions/18333396/socket-io-and-webscocket-listen-on-the-same-server



should follow the ws document to set up our own room ?
https://github.com/websockets/ws/blob/master/doc/ws.md
here is the guide line for a room
https://stackoverflow.com/questions/4445883/node-websocket-server-possible-to-have-multiple-separate-broadcasts-for-a-si




