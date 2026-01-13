//* MNT
const express = require('express');
const morgan = require('morgan');
const resourcesController = require('./controllers/resources.js');
const searchController = require('./controllers/search.js');

//* VAR
const port = 3001;

//* APP
const app = express();

//* MID
require('./db/connection.js');
app.use(express.static('public'));
app.use(express.urlencoded({ extended:true }));
app.use(morgan('tiny'));

//* ROUTE
// STATIC
app.get('/', (req,res) => { 
    res.render('home.ejs');
})

app.use('/resources', resourcesController);
app.use('/search', searchController);

app.get('/*splat', (req,res) => {
    res.render('404.ejs', { url:req.url })
})

//* LISTEN
app.listen(port, ()=>console.log(`Server Running on Port ${port}. Access at [http://localhost:${port}]`));