import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import udp, { RemoteInfo } from 'dgram';
import http from 'http';
import path from 'path';
import cors from 'cors';
dotenv.config();

const app: Express = express();
app.use(cors());
app.use(express.static(__dirname + '/public'));
var server;
var io: Server;
const port = process.env.WEB_PORT;
const viewAllPort = Number(process.env.VIEWALL_PORT);
const viewAllIp = process.env.VIEWALL_IP;


function start() {
  server = http.createServer(app);
  var client = udp.createSocket('udp4');
  io = new Server(server, {
    cors: {
      origin: "*"
    }
  });
  // setInterval(() => { 
  //   io.emit("bevo-data", `4;21;bevo HC;${Math.floor(Math.random() * 40)}`);
  // }, 2000);
  console.log(`${viewAllIp}:${viewAllPort} `);
  // client.connect(viewAllPort, viewAllIp, () => {
  //   console.log("connected");
  // });
  client.bind(viewAllPort);
  client.on('message', (msg: Buffer, info: RemoteInfo) => {
    // console.log(msg.toString());
    // console.log("hi");
    io.emit("bevo-data", msg.toString());
  });
  server.listen(port, () => {
    console.log(`Started express on port ${port}`);
  });
}
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname + '/html/index.html'));
});

app.get("/overlay", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname + '/html/overlay.html'));
})


start();