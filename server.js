const express = require('express')
const bcrypt = require('bcryptjs')
const cors = require('cors')
const knex = require('knex')({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'ubuntu',
      port: 5432,
      password : 'toor',
      database : 'smart-brain'
    }
  });

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

knex.select('*').from('users').then(data => {
    // console.log(data)
});

const app = express()


app.use(express.json())
app.use(cors())

app.get('/', (req,res)=> { res.send('it is working')})
app.post('/signin', (req,res) => {signin.handleSignin(req, res, knex, bcrypt)})
app.post('/register', (req,res) => {register.handleRegister(req, res, knex, bcrypt)})
app.get('/profile/:id', (req, res) => {profile.handleProfile(req, res, knex)})  
app.put('/image', (req,res) => {image.handleImage(req, res, knex)})
app.post('/imageurl', (req,res) => {image.handleApiCall(req, res)})

app.listen(process.env.PORT || 3000, ()=> {
    console.log(`app is running on port ${process.env.PORT}`)
})

