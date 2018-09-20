主要的是：mongodb的版本不能过高，暂时使用的mongodb 3.4
    "sharedb": "^1.0.0-beta.9",
如果使用3.6以下的版本，无法使用mongoose中的$ []和array update!
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

1.使用quill生成一个代码编辑器
2.结合服务器提供编译，运行等功能。
3.链接，链接开关，权限功能
4.版本，操作记录量化



1.去除用户，文档关联关系，只用链接关系，提供一个可扩展的quill编辑器

使用队列，kafka,rabbitmq。在大文件处理和消息推送。
使用elasticsearch记录每一个delta，并且提供搜索历史记录的功能。
1.使用一个队列存储每一个待处理的delta
2.将delta存储在 index: 'document'， type:'op' 中
3.通过kibana检查正确性

使用quill delta的包，实现服务器合并操作


关于使用CRDT，有几种可以考虑的：
1.原生的CRDTS
2.AutoMerge CodeMirror
3.AutoMerge+editor => rich
4.peer-crdt CodeMirror
5.roshi
6.conclave
7.AutoMerge trellis
8.y-js全家桶

42["yjsEvent",{
    "type":"update",
    "ops":[{
        "id":["EgJ9CWes8xyHBRqKATg0",3],
        "left":["EgJ9CWes8xyHBRqKATg0",2],
        "right":["Z3x8bGdRy3ITOcO0ATgJ",96],
        "origin":["EgJ9CWes8xyHBRqKATg0",2],
        "parent":["_","List_Richtext_richtext_"],
        "struct":"Insert",
        "content":["d"]
    }],
    "room":"richtext-example-quill-1.0-test"
}]

1.尝试y-webrtc,y-leveldb
2.如何使用y-websockets-server的服务器代码，拦截，存储中间数据。
3.如何读取leveldb的内容。
4.如何构建一个稳定的服务器。

