"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const socket_io_1 = require("socket.io");
const dgram_1 = __importDefault(require("dgram"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.static(__dirname + '/public'));
var server;
var io;
const port = process.env.WEB_PORT;
const viewAllPort = Number(process.env.VIEWALL_PORT);
const viewAllIp = process.env.VIEWALL_IP;
function start() {
    server = http_1.default.createServer(app);
    var client = dgram_1.default.createSocket('udp4');
    io = new socket_io_1.Server(server, {
        cors: {
            origin: "*"
        }
    });
    //FOR TESTING PURPOSES
    // setInterval(() => { 
    //   io.emit("bevo-data", `4;21;bevo HC;${Math.floor(Math.random() * 40)}`);
    // }, 2000);
    console.log(`${viewAllIp}:${viewAllPort} `);
    client.bind(viewAllPort);
    client.on('message', (msg, info) => {
        io.emit("bevo-data", msg.toString());
    });
    server.listen(port, () => {
        console.log(`Started express on port ${port}`);
    });
}
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname + '/html/index.html'));
});
app.get("/overlay", (req, res) => {
    res.sendFile(path_1.default.join(__dirname + '/html/overlay.html'));
});
start();
