const keys = require('./keys')

// Express App Setup
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

// setup some middlewares

// CORS = CROSS ORIGIN RESOURCE SHARING
// it's essentially going to allow us to make requests from one domain
// that the react application is going to be running on, to a completely 
// different domain or a different port
app.use(cors())

// bodyParser library is going to parse incoming requests from the react 
// application and turned the body of the post request into a json value
// that our express API can then very easily work with
app.use(bodyParser.json())

// Postgres Client Setup
const { Pool } = require('pg')
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.password,
  port: keys.pgPort
})
pgClient.on('error', () => console.log('Lost PG Connection.'))

// create table named values if not exists
pgClient
  .query('CREATE TABLE IF NOT EXISTS values (number INT)')
  .catch((err) => console.log(err))


// ------------- MORE CHANGES -------------- //

// Redis Client Setup
const redis = require('redis')
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
})

// we are making these duplicate connections in both server and 
// worker files, because according to the Redis documentation for 
// this javascript library, if we ever have a client that's listening 
// or publishing information on Redis, we have to make a duplicate 
// connection because when a connection is turned into a connection
// that's going to listen or suscribe or publish information it cannot 
// be used for other purposes.
const redisPublisher = redisClient.duplicate()


// Express route handlers
app.get('/', (req, res) => {
  res.send('Hi')
})

app.get('/values/all', async (req,res) => {
  const values = await pgClient.query('SELECT * FROM values')
  res.send(values.rows)
})

app.get('/values/current', async (req, res) => {
  // why we are not using the async and await syntax right here ?
  // unfortunately the Redis library for NodeJS doesn't have out 
  // of the box promise support and this is why we have to use
  // callbacks as opposed to making use of the nice async await 
  // syntax.
  redisClient.hgetall('values', (err, values) => {
    res.send(values)
  })
})

app.post('/values', async (req, res) => {
  const index = req.body.index

  if(parseInt(index) > 40){
    return res.status(422).send('Index too high')
  }

  redisClient.hset('values', index, 'Nothing yet!')
  redisPublisher.publish('insert', index)
  pgClient.query('INSERT INTO values(number) VALUES($1)', [index])

  res.send({ working: true })
})

app.listen(5000, err => {
  console.log('Listening')
})
