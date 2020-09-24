require('./db/connection');
const path = require('path');
const express = require('express');
const bodyparser = require('body-parser');

const postsRoutes = require('./Routes/posts');
const notesRoutes = require('./Routes/notes');
const userRoutes = require('./Routes/user');

const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods", 
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/user", userRoutes);

module.exports = app