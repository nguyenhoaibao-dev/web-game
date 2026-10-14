import http from 'http';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';
import { dictionary } from './src/games/noi-tu/dictionary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// HTTP Static Server
const server = http.createServer((req, res) => {
  let reqUrl = req.url.split('?')[0];
  if (reqUrl === '/') reqUrl = '/index.html';
  if (reqUrl === '/noi-tu' || reqUrl === '/noi-tu/') reqUrl = '/src/games/noi-tu/index.html';
  if (reqUrl === '/snake' || reqUrl === '/snake/') reqUrl = '/src/games/snake/index.html';

  const filePath = path.join(__dirname, reqUrl);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found: ' + reqUrl);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

// WebSocket Server & Multiplayer Rooms
const wss = new WebSocketServer({ server });
const rooms = new Map(); // roomCode -> Room

function getLanIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

function generateRoomCode() {
  let code;
  let attempts = 0;
  do {
    code = Math.floor(1000 + Math.random() * 9000).toString();
    attempts++;
  } while (rooms.has(code) && attempts < 100);
  return code;
}

function broadcastToRoom(room, message, excludeWs = null) {
  const payload = JSON.stringify(message);
  room.players.forEach(p => {
    if (p.ws && p.ws.readyState === WebSocket.OPEN && p.ws !== excludeWs) {
      p.ws.send(payload);
    }
  });
}

function sanitizeRoom(room) {
  return {
    code: room.code,
    hostId: room.hostId,
    state: room.state,
    turnTimeLimit: room.turnTimeLimit,
    currentWord: room.currentWord,
    currentTurnPlayerId: room.currentTurnPlayerId,
    timeLeft: room.timeLeft,
    wordHistory: room.wordHistory || [],
    players: room.players.map(p => ({
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      isReady: p.isReady,
      isAlive: p.isAlive,
      score: p.score,
      wordsCount: p.wordsCount,
      wins: p.wins || 0
    }))
  };
}

function startTurnTimer(room) {
  if (room.timerInterval) {
    clearInterval(room.timerInterval);
    room.timerInterval = null;
  }

  room.timeLeft = room.turnTimeLimit;
  room.timerInterval = setInterval(() => {
    room.timeLeft -= 1;

    broadcastToRoom(room, {
      type: 'TURN_TICK',
      timeLeft: room.timeLeft,
      currentTurnPlayerId: room.currentTurnPlayerId
    });

    if (room.timeLeft <= 0) {
      clearInterval(room.timerInterval);
      room.timerInterval = null;
      eliminatePlayer(room, room.currentTurnPlayerId, 'Hết thời gian suy nghĩ!');
    }
  }, 1000);
}

function eliminatePlayer(room, playerId, reason) {
  const player = room.players.find(p => p.id === playerId);
  if (!player) return;

  player.isAlive = false;

  broadcastToRoom(room, {
    type: 'PLAYER_ELIMINATED',
    playerId: player.id,
    playerName: player.name,
    reason: reason || 'Bị loại khỏi ván đấu'
  });

  const alivePlayers = room.players.filter(p => p.isAlive);

  if (alivePlayers.length <= 1) {
    // Trận đấu kết thúc
    if (room.timerInterval) {
      clearInterval(room.timerInterval);
      room.timerInterval = null;
    }
    room.state = 'ENDED';

    const winner = alivePlayers[0] || null;
    if (winner) {
      winner.wins = (winner.wins || 0) + 1;
    }

    const scoreboard = [...room.players].sort((a, b) => b.score - a.score).map(p => ({
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      score: p.score,
      wordsCount: p.wordsCount,
      wins: p.wins || 0,
      isWinner: winner ? p.id === winner.id : false
    }));

    broadcastToRoom(room, {
      type: 'MATCH_OVER',
      winner: winner ? { id: winner.id, name: winner.name, avatar: winner.avatar, score: winner.score, wins: winner.wins || 0 } : null,
      scoreboard
    });
  } else {
    // Chuyển lượt cho người còn sống tiếp theo
    let nextIdx = (room.turnIndex + 1) % room.players.length;
    while (!room.players[nextIdx].isAlive) {
      nextIdx = (nextIdx + 1) % room.players.length;
    }

    room.turnIndex = nextIdx;
    room.currentTurnPlayerId = room.players[nextIdx].id;

    const parts = dictionary.splitWords(room.currentWord);
    const targetSyllable = parts ? parts.last : '';

    broadcastToRoom(room, {
      type: 'NEXT_TURN',
      currentTurnPlayerId: room.currentTurnPlayerId,
      currentWord: room.currentWord,
      targetSyllable,
      timeLeft: room.turnTimeLimit
    });

    startTurnTimer(room);
  }
}

wss.on('connection', (ws) => {
  ws.id = 'p_' + Math.random().toString(36).substring(2, 9);
  ws.roomCode = null;
  ws.playerName = 'Người Chơi';
  ws.playerAvatar = '🐱';

  ws.on('message', (raw) => {
    try {
      const data = JSON.parse(raw.toString());
      handleClientMessage(ws, data);
    } catch (err) {
      console.error('WS Parse Error:', err);
    }
  });

  ws.on('close', () => {
    handleClientDisconnect(ws);
  });
});

function handleClientMessage(ws, data) {
  switch (data.type) {
    case 'CREATE_ROOM': {
      const roomCode = generateRoomCode();
      const playerName = (data.playerName || 'Người Chơi').trim().slice(0, 24);
      const playerAvatar = data.playerAvatar || '🐱';
      const turnTimeLimit = Number(data.turnTimeLimit) || 12;

      ws.roomCode = roomCode;
      ws.playerName = playerName;
      ws.playerAvatar = playerAvatar;

      const turnLimitClean = Math.max(5, Math.min(60, turnTimeLimit));
      const room = {
        code: roomCode,
        hostId: ws.id,
        turnTimeLimit: turnLimitClean,
        state: 'LOBBY',
        currentWord: '',
        usedWords: new Set(),
        wordHistory: [],
        turnIndex: 0,
        currentTurnPlayerId: null,
        timeLeft: turnLimitClean,
        timerInterval: null,
        players: [
          {
            id: ws.id,
            ws: ws,
            name: playerName,
            avatar: playerAvatar,
            isReady: true, // Host luôn sẵn sàng
            isAlive: true,
            score: 0,
            wordsCount: 0,
            wins: 0
          }
        ]
      };

      rooms.set(roomCode, room);

      ws.send(JSON.stringify({
        type: 'ROOM_CREATED',
        room: sanitizeRoom(room),
        playerId: ws.id
      }));
      break;
    }

    case 'JOIN_ROOM': {
      const roomCode = (data.roomCode || '').trim();
      const playerName = (data.playerName || 'Khách').trim().slice(0, 24);
      const playerAvatar = data.playerAvatar || '🐰';

      const room = rooms.get(roomCode);
      if (!room) {
        ws.send(JSON.stringify({ type: 'ERROR', message: `Không tìm thấy phòng có mã PIN "${roomCode}"!` }));
        return;
      }

      if (room.state !== 'LOBBY') {
        ws.send(JSON.stringify({ type: 'ERROR', message: 'Phòng này đang diễn ra trận đấu rồi!' }));
        return;
      }

      if (room.players.length >= 8) {
        ws.send(JSON.stringify({ type: 'ERROR', message: 'Phòng đã đủ 8 người chơi tối đa!' }));
        return;
      }

      ws.roomCode = roomCode;
      ws.playerName = playerName;
      ws.playerAvatar = playerAvatar;

      room.players.push({
        id: ws.id,
        ws: ws,
        name: playerName,
        avatar: playerAvatar,
        isReady: false,
        isAlive: true,
        score: 0,
        wordsCount: 0,
        wins: 0
      });

      ws.send(JSON.stringify({
        type: 'ROOM_JOINED',
        room: sanitizeRoom(room),
        playerId: ws.id
      }));

      broadcastToRoom(room, {
        type: 'ROOM_UPDATE',
        room: sanitizeRoom(room),
        event: `${playerName} đã tham gia phòng!`
      }, ws);
      break;
    }

    case 'TOGGLE_READY': {
      if (!ws.roomCode) return;
      const room = rooms.get(ws.roomCode);
      if (!room || room.state !== 'LOBBY') return;

      const player = room.players.find(p => p.id === ws.id);
      if (player && player.id !== room.hostId) {
        player.isReady = !player.isReady;
        broadcastToRoom(room, {
          type: 'ROOM_UPDATE',
          room: sanitizeRoom(room)
        });
      }
      break;
    }

    case 'UPDATE_SETTINGS': {
      if (!ws.roomCode) return;
      const room = rooms.get(ws.roomCode);
      if (!room || room.hostId !== ws.id || room.state !== 'LOBBY') return;

      const newLimit = Math.max(5, Math.min(60, Number(data.turnTimeLimit) || 12));
      room.turnTimeLimit = newLimit;
      room.timeLeft = newLimit;

      broadcastToRoom(room, {
        type: 'ROOM_UPDATE',
        room: sanitizeRoom(room),
        event: `Chủ phòng đã đổi thời gian: ${newLimit}s/lượt!`
      });
      break;
    }

    case 'START_MATCH': {
      if (!ws.roomCode) return;
      const room = rooms.get(ws.roomCode);
      if (!room || room.hostId !== ws.id) return;
      if (room.state !== 'LOBBY' && room.state !== 'ENDED') return;

      if (room.players.length < 2) {
        ws.send(JSON.stringify({ type: 'ERROR', message: 'Cần tối thiểu 2 người chơi để bắt đầu!' }));
        return;
      }

      // Khởi động trận đấu
      room.state = 'PLAYING';
      room.players.forEach(p => {
        p.isAlive = true;
        p.score = 0;
        p.wordsCount = 0;
      });

      // Xáo trộn ngẫu nhiên thứ tự người chơi
      room.players.sort(() => Math.random() - 0.5);

      const startWord = dictionary.getRandomStartWord();
      room.currentWord = startWord;
      room.usedWords = new Set([dictionary.normalize(startWord)]);
      room.wordHistory = [
        {
          word: startWord,
          playerName: 'Trọng Tài 🤖',
          avatar: '🎮',
          type: 'start'
        }
      ];

      room.turnIndex = 0;
      room.currentTurnPlayerId = room.players[0].id;
      room.timeLeft = room.turnTimeLimit;

      const parts = dictionary.splitWords(startWord);
      const targetSyllable = parts ? parts.last : '';

      broadcastToRoom(room, {
        type: 'MATCH_STARTED',
        room: sanitizeRoom(room),
        startWord,
        targetSyllable,
        currentTurnPlayerId: room.currentTurnPlayerId,
        timeLeft: room.turnTimeLimit
      });

      startTurnTimer(room);
      break;
    }

    case 'TYPING_PREVIEW': {
      if (!ws.roomCode) return;
      const room = rooms.get(ws.roomCode);
      if (!room || room.state !== 'PLAYING') return;
      if (room.currentTurnPlayerId !== ws.id) return;

      const rawText = (data.text || '').trim();
      let text = rawText;
      if (text) {
        const lastParts = dictionary.splitWords(room.currentWord);
        const expectedFirst = lastParts ? lastParts.last : '';
        const parts = text.split(' ').filter(Boolean);
        if (parts.length === 1 && expectedFirst) {
          text = `${expectedFirst} ${parts[0]}`;
        }
      }

      broadcastToRoom(room, {
        type: 'PLAYER_TYPING',
        playerId: ws.id,
        text: text.slice(0, 30)
      }, ws);
      break;
    }

    case 'SUBMIT_WORD': {
      if (!ws.roomCode) return;
      const room = rooms.get(ws.roomCode);
      if (!room || room.state !== 'PLAYING') return;

      const player = room.players.find(p => p.id === ws.id);

      if (room.currentTurnPlayerId !== ws.id) {
        ws.send(JSON.stringify({ type: 'WORD_REJECTED', reason: 'Chưa đến lượt của bạn!' }));
        return;
      }

      const rawInput = (data.word || '').trim();
      let clean = dictionary.normalize(rawInput);

      const rejectAttempt = (reason) => {
        const attemptWord = rawInput || clean || '---';
        broadcastToRoom(room, {
          type: 'WORD_ATTEMPT_FAILED',
          playerId: ws.id,
          playerName: player ? player.name : 'Người chơi',
          word: attemptWord,
          reason: reason
        });
      };

      if (!clean) {
        rejectAttempt('Chưa nhập tiếng nối tiếp nào!');
        return;
      }

      const lastParts = dictionary.splitWords(room.currentWord);
      const expectedFirst = lastParts ? lastParts.last : '';

      const parts = clean.split(' ').filter(Boolean);

      // TỰ ĐỘNG GHÉP:
      // 1. Người chơi chỉ nhập 1 tiếng nối tiếp (chuẩn theo cách chơi mới)
      if (parts.length === 1 && expectedFirst) {
        clean = `${expectedFirst} ${parts[0]}`;
      } else if (parts.length === 2 && expectedFirst) {
        // 2. Người chơi theo thói quen cũ gõ cả 2 tiếng
        if (dictionary.syllablesMatch(parts[0], expectedFirst)) {
          clean = `${expectedFirst} ${parts[1]}`;
        } else {
          rejectAttempt(`Chỉ cần nhập 1 tiếng nối tiếp sau "${expectedFirst}"!`);
          return;
        }
      } else {
        rejectAttempt(`Vui lòng chỉ nhập 1 tiếng nối tiếp sau "${expectedFirst}"!`);
        return;
      }

      const resolved = dictionary.resolveContinuation(rawInput, expectedFirst);
      if (!resolved) {
        rejectAttempt(`Từ "${clean}" chưa có trong từ điển tiếng Việt!`);
        return;
      }

      const currParts = dictionary.splitWords(resolved);

      if (!currParts || !dictionary.syllablesMatch(currParts.first, expectedFirst)) {
        rejectAttempt(`Tiếng đầu tiên phải là "${expectedFirst}"! Bạn đang nhập "${currParts ? currParts.first : ''}"`);
        return;
      }

      if (room.usedWords.has(resolved)) {
        rejectAttempt(`Từ "${resolved}" đã được dùng rồi!`);
        return;
      }

      // NỐI TỪ HỢP LỆ!
      if (room.timerInterval) {
        clearInterval(room.timerInterval);
        room.timerInterval = null;
      }

      room.usedWords.add(resolved);
      room.currentWord = resolved;

      const scoreGain = 10 + Math.max(1, room.timeLeft);
      player.score += scoreGain;
      player.wordsCount += 1;

      const historyItem = {
        word: resolved,
        playerId: player.id,
        playerName: player.name,
        avatar: player.avatar,
        scoreGain
      };
      room.wordHistory.push(historyItem);

      broadcastToRoom(room, {
        type: 'WORD_ACCEPTED',
        word: resolved,
        historyItem,
        playerScore: player.score
      });

      // Chuyển lượt kế tiếp
      let nextIdx = (room.turnIndex + 1) % room.players.length;
      while (!room.players[nextIdx].isAlive) {
        nextIdx = (nextIdx + 1) % room.players.length;
      }
      room.turnIndex = nextIdx;
      room.currentTurnPlayerId = room.players[nextIdx].id;

      const nextParts = dictionary.splitWords(resolved);
      const nextTarget = nextParts ? nextParts.last : '';

      broadcastToRoom(room, {
        type: 'NEXT_TURN',
        currentTurnPlayerId: room.currentTurnPlayerId,
        currentWord: resolved,
        targetSyllable: nextTarget,
        timeLeft: room.turnTimeLimit
      });

      startTurnTimer(room);
      break;
    }

    case 'GIVE_UP': {
      if (!ws.roomCode) return;
      const room = rooms.get(ws.roomCode);
      if (!room || room.state !== 'PLAYING') return;

      if (room.currentTurnPlayerId === ws.id) {
        eliminatePlayer(room, ws.id, 'Người chơi tự nhận bí từ và bỏ cuộc!');
      }
      break;
    }

    case 'RETURN_TO_LOBBY': {
      if (!ws.roomCode) return;
      const room = rooms.get(ws.roomCode);
      if (!room || room.hostId !== ws.id) return;

      if (room.timerInterval) {
        clearInterval(room.timerInterval);
        room.timerInterval = null;
      }

      room.state = 'LOBBY';
      room.currentWord = '';
      room.usedWords.clear();
      room.wordHistory = [];
      room.players.forEach(p => {
        p.isReady = (p.id === room.hostId);
        p.isAlive = true;
        p.score = 0;
        p.wordsCount = 0;
      });

      broadcastToRoom(room, {
        type: 'ROOM_UPDATE',
        room: sanitizeRoom(room),
        event: 'Chủ phòng đã đưa tất cả về phòng chờ!'
      });
      break;
    }

    case 'UPDATE_NAME': {
      const newName = (data.name || '').trim().slice(0, 20);
      if (!newName) return;
      ws.playerName = newName;
      if (ws.roomCode) {
        const room = rooms.get(ws.roomCode);
        if (room) {
          const p = room.players.find(x => x.id === ws.id);
          if (p) {
            p.name = newName;
            broadcastToRoom(room, {
              type: 'ROOM_UPDATE',
              room: sanitizeRoom(room),
              event: `Người chơi đã đổi tên thành "${newName}"`
            });
          }
        }
      }
      break;
    }

    case 'LEAVE_ROOM': {
      handleClientDisconnect(ws);
      break;
    }
  }
}

function handleClientDisconnect(ws) {
  if (!ws.roomCode) return;
  const room = rooms.get(ws.roomCode);
  if (!room) return;

  const playerIdx = room.players.findIndex(p => p.id === ws.id);
  if (playerIdx === -1) return;

  const leavingPlayer = room.players[playerIdx];

  if (room.state === 'PLAYING') {
    if (leavingPlayer.isAlive) {
      if (room.currentTurnPlayerId === ws.id) {
        eliminatePlayer(room, ws.id, `${leavingPlayer.name} đã rời khỏi ván đấu!`);
      } else {
        leavingPlayer.isAlive = false;
        broadcastToRoom(room, {
          type: 'PLAYER_ELIMINATED',
          playerId: ws.id,
          playerName: leavingPlayer.name,
          reason: 'Mất kết nối hoặc rời phòng'
        });

        const alive = room.players.filter(p => p.isAlive && p.id !== ws.id);
        if (alive.length <= 1) {
          if (room.timerInterval) clearInterval(room.timerInterval);
          room.state = 'ENDED';
          const winner = alive[0] || null;
          broadcastToRoom(room, {
            type: 'MATCH_OVER',
            winner: winner ? { id: winner.id, name: winner.name, avatar: winner.avatar, score: winner.score } : null,
            scoreboard: room.players.map(p => ({
              id: p.id,
              name: p.name,
              avatar: p.avatar,
              score: p.score,
              isWinner: winner && p.id === winner.id
            }))
          });
        }
      }
    }
  }

  // Xóa khỏi danh sách phòng
  room.players.splice(playerIdx, 1);
  ws.roomCode = null;

  if (room.players.length === 0) {
    if (room.timerInterval) clearInterval(room.timerInterval);
    rooms.delete(room.code);
  } else {
    // Nếu host rời, chuyển host cho người đầu tiên còn lại
    if (room.hostId === ws.id) {
      room.hostId = room.players[0].id;
      room.players[0].isReady = true;
    }
    broadcastToRoom(room, {
      type: 'ROOM_UPDATE',
      room: sanitizeRoom(room),
      event: `${leavingPlayer.name} đã rời phòng!`
    });
  }
}

server.listen(PORT, '0.0.0.0', () => {
  const lanIp = getLanIp();
  console.log(`\n======================================================`);
  console.log(`🎮 ARCADE VUI DEV SERVER (HTTP + WEBSOCKET)`);
  console.log(`- Local URL:   http://localhost:${PORT}/`);
  console.log(`- Network URL: http://${lanIp}:${PORT}/ (Dùng link này cho điện thoại cùng WiFi)`);
  console.log(`- Nối Từ Game: http://${lanIp}:${PORT}/src/games/noi-tu/index.html`);
  console.log(`======================================================\n`);
});
