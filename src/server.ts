import express from 'express'
import payload from 'payload'
var cors = require('cors');

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

}

start()
