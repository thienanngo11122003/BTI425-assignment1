/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: ____Austin Ngo__________________ Student ID: ___128725223___________ Date: _______17/01/2024_________
*  Cyclic Link: https://orange-nightingale-yoke.cyclic.app
*
********************************************************************************/ 


const express = require('express');
const cors = require('cors');
require('dotenv').config();
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

//middleware
app.use(cors());
app.use(express.json());

//routes
app.get('/', (req, res) => {
    res.json({message: "API Listening"});
});

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});


app.post("/api/movies", (req, res) => {
    db.addNewMovie(req.body)
      .then((movie) => {
        res.status(201).json(movie);
      })
      .catch(() => {
        console.error(err);
        res.status(500).json({ err: 'Internal Server Error.' } ) 
    });
  });
  
  //AC
  app.get("/api/movies", (req, res) => {
    db.getAllMovies(req.query.page, req.query.perPage, req.query.title)
      .then((movie) => {
        res.status(201).json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ err: 'Internal Server Error.' }) 
      });
  });

app.get('/api/movies/:id', (req, res) => {
    db.getMovieById(req.params.id)
    .then((movie) => {
      res.status(200).json(movie);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

app.put('/api/movies/:id', (req, res) => {
    db.updateMovieById(req.body, req.params.id)
    .then((movie) => {
      res.status(200).json(movie);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

app.delete('/api/movies/:id', (req, res) => {
    db.deleteMovieById(req.params.id);
    res.status(204).end();
})



