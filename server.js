/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: ____Austin Ngo__________________ Student ID: ___128725223___________ Date: ________________
*  Cyclic Link: _______________________________________________________________
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


app.post('/api/movies', (req, res) => {
    try {
        const newMovie = db.newMovie(req.body);
        res.status(201).json(newMovie);
    } catch (err) {
        console.log(err);
        res.status(500).json({err: 'Internal Server Error.'});
    }
});

app.get('/api/movies', (req, res) => {
    try {
        const { page, perPage, title} = req.query;
        const movies = db.getAllMovies(page, perPage, title);
        res.json(movies);
    } catch (err) {
        console.log(err);
        res.status(500).json({err: 'Internal Server Error.'});
    }
});

app.get('/api/movies/:id', (req, res) => {
    try {
        const movie = db.getMovieById(req.params.id);
        if (movie) {
            res.json(movie);
        } else {
            res.status(404).json({error: 'Movie not found.'});
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Internal Server Error.' });
    }
});

app.put('/api/movies/:id', (req, res) => {
    try {
    const updateMovie = db.updateMovieById(req.body, req.params.id);
    if (updateMovie.nModified > 0) {
        res.status(204).end();
    } else {
        res.status(404).json({ error: 'The specified resource could not be.'});
    }
    } catch (err) {
        console.error(err);
        res.status(500).json({err: 'Internal Server Error.'})
    }
});

app.delete('/api/movies/:id', (req, res) => {
    try {
        const deleteMovie = db.deleteMovieById(req.params.id);
        if (deleteMovie.deleteCount > 0) {
            res.json({message: 'Movie Deleted Succesfully.'});
        } else {
            res.status(404).json({error: 'Movie Not Found.'});
        }
    } catch (err) {
        console.log(err);
        res.status.json({err: 'Internal Server Error.'});
    }
})