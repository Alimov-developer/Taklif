import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  maxHttpBufferSize: 1e8 // 100MB buffer size for large images
});

const DB_FILE = path.join(__dirname, 'db.json');

let db = { visits: 0, leaderboard: [] };

if (fs.existsSync(DB_FILE)) {
  const data = fs.readFileSync(DB_FILE, 'utf-8');
  if (data) db = JSON.parse(data);
}

const saveDB = () => {
  fs.writeFileSync(DB_FILE, JSON.stringify(db));
};

let activeSockets = new Set();

io.on('connection', (socket) => {
  activeSockets.add(socket.id);
  db.visits += 1;
  saveDB();

  io.emit('stats_update', {
    activeUsers: activeSockets.size,
    totalViews: db.visits,
    leaderboard: db.leaderboard
  });

  socket.on('create_invitation', (data) => {
    // data: { groom, bride, date, venue, shortName, ... }
    if (!db.invitations) db.invitations = [];
    
    // Check if exists, update or push
    const idx = db.invitations.findIndex(inv => inv.shortName === data.shortName);
    if (idx !== -1) {
      db.invitations[idx] = data;
    } else {
      db.invitations.push(data);
    }
    saveDB();
    socket.emit('invitation_created', { success: true, shortName: data.shortName });
  });

  socket.on('get_invitation', (shortName) => {
    if (!db.invitations) db.invitations = [];
    const inv = db.invitations.find(i => i.shortName === shortName);
    socket.emit('invitation_data', inv || null);
  });

  socket.on('update_coins', (data) => {
    // data: { email: 'x', name: 'y', c: 10 }
    let existing = db.leaderboard.find(u => u.email === data.email);
    if (existing) {
      existing.c = data.c;
      existing.name = data.name;
    } else {
      db.leaderboard.push({
         id: Date.now(),
         name: data.name,
         email: data.email,
         c: data.c
      });
    }
    // keep top 50, sort by c
    db.leaderboard.sort((a, b) => b.c - a.c);
    db.leaderboard = db.leaderboard.slice(0, 50);
    saveDB();

    io.emit('stats_update', {
      activeUsers: activeSockets.size,
      totalViews: db.visits,
      leaderboard: db.leaderboard
    });
  });

  socket.on('disconnect', () => {
    activeSockets.delete(socket.id);
    io.emit('stats_update', {
      activeUsers: activeSockets.size,
      totalViews: db.visits,
      leaderboard: db.leaderboard
    });
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Backend Server is running on port ${PORT}`);
});
