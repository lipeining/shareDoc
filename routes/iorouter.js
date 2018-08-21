const ioCtrl = require('../controllers/iorouter');

module.exports = function(io) {
    io.on("connection", function(socket) {
        console.log(`in socket.io socket ${socket.id} connect`);
        socket.on("index", async function(data) {
            await ioCtrl.onIndex(socket, data);
        });
        socket.on("docroom", async function(data) {
            await ioCtrl.onDocRoom(socket, data);
        });
        socket.on("chat", async function(data) {
            await ioCtrl.onChat(socket, data);
        });
        socket.on('disconnect', async function() {
            await ioCtrl.onDisconnection(socket);
        });
    });
}
