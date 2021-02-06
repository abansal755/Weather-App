if(process.env.NODE_ENV !== 'production') require('dotenv').config({path: './config/.env'});
const express = require('express');
const path = require('path');
const axios = require('axios');
const AppError = require('./utils/AppError');
const wrapAsync = require('./utils/wrapAsync');

const app = express();
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));

app.get('/',(req,res) => {
    res.render('index');
})

app.get('/api/search',wrapAsync(async (req,res) => {
    const response = await axios.get('http://api.weatherapi.com/v1/search.json',{
        params: {
            key: process.env.API_KEY,
            q: req.query.q
        },
        validateStatus: status => true
    });
    res.status(response.status).send(response.data);
}))

app.get('/api/current',wrapAsync(async (req,res) => {
    const response = await axios.get('http://api.weatherapi.com/v1/current.json',{
        params: {
            key: process.env.API_KEY,
            q: req.query.q
        },
        validateStatus: status => true
    });
    if(response.status<200 || response.status>299) res.status(response.status);
    res.status(response.status).send(response.data);
}))

app.use((req,res) => {
    throw new AppError('Not found',404);
})

app.use((err,req,res,next) => {
    const status = err.status || 500;
    const message = err.message;
    res.status(status).send(message);
})

const port = process.env.PORT || 3000;
app.listen(port,() => console.log(`Server is running on port ${port}...`));