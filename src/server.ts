import express from 'express'
import payload from 'payload'
const cors = require('cors');
const socketIo = require('socket.io');

require('dotenv').config()
const app = express()
const PORT = process.env.PORT || 8000;
var corsOptions = {
  origin: '*',
  credentials: true,
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

// Redirect root to Admin panel
app.get('/', (_, res) => {
  res.redirect('/admin')
})

const start = async () => {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
    },
  })

  // Add your own express routes here
  const server = app.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`);
	});

  const io = socketIo(server, { cors: { origin: '*' } });

  io.on('connection', socket => {
    console.log('A user connected');
  
    // Handle ICE candidates
    socket.on('iceCandidate', candidate => {
      console.log(candidate)
      socket.broadcast.emit('iceCandidate', candidate);
    });
  
    // Handle SDP offer and answer
    socket.on('sdp', description => {
      console.log(description)
      socket.broadcast.emit('sdp', description);
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });

}

start()
