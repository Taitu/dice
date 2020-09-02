const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();

const server = http.createServer(app);
server.on('error', function (err) {
  console.log(new Date(), err)
});

function noop() {}

function heartbeat() {
  this.isAlive = true;
}

const wss = new WebSocket.Server({ server });
wss.on('error', function (error) {
  console.log('wsocket error: ', error);
});

wss.on('connection', function connection(ws) {
  ws.isAlive = true;
  ws.on('pong', heartbeat);

  ws.on('message', function incoming(data) {
    wss.clients.forEach(function each(client) {
      const socket = new WebSocket('wss://www.bitdice.me/socket/websocket?vsn=2.0.0');

      socket.addEventListener('open', () => {
        console.log('external ws connected');
        socket.send(JSON.stringify(['3', '3', 'bets:lobby', 'phx_join', {}]));
      });
      socket.addEventListener('error', (e) => {
        console.log('external ws error: ', e);
      });
      socket.onmessage = (e) => {
        const message = JSON.parse(e.data);
        if (message[2] === 'bets:lobby' && message[3] === 'init') {
          wss.broadcast(JSON.stringify({ type: 'bets:init', data: message[4].bets }));
          socket.close();
        }
      };
      socket.onclose = () => {
        console.log('external ws closing');
      };
    });
  });
});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

setInterval(() => {
  if (wss.clients && wss.clients.size > 0) {
    try {
    const data = []
    for (let i = 0; i < 30; i++) {
      data.push(generateBets())
    }
    wss.broadcast(JSON.stringify({ type: 'bets:add', data }));
    } catch (e) {
      console.log(e);
    }
  }
}, 2000);

function generateBets() {
  return {
    amount: (Math.random() * (0.00000285153362484639 - 0.00000485153362484639) + 0.00000485153362484639),
    currency: 'doge',
    data: {
      chance: 49,
      high: true,
      lucky: 49.7269,
      multiplier: (Math.random() * (0.5 - 10) +10),
      nonce: 24089153,
      result: false,
      secret: 649220,
      target: 50.9999,
      user: {
        level: 4, 
        username: Math.random().toString(36).substring(7)
      },
      level: 4,
      username: 'hidden'
    },
    date: Math.round(+new Date() / 1000),
    game: 1000,
    id: Math.floor(Math.random() * 10000000000),
    profit: -0.00000285153362484639,
    wagered: 7.984294149569893e-13,
  }
}

setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();
    ws.isAlive = false;
    ws.ping(noop);
  });
}, 30000);

server.listen(3001, () => {
  console.log('Listening on %d', server.address().port);
});