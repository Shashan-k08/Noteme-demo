const connectToMongo= require('./db');
const express = require('express')
connectToMongo();

const app = express()
const port = 3005

app.get('/', (req, res) => {
  res.send('Hello Shashank!')
})
app.use(express.json());
//Available Routes

app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})