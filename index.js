if(process.env.NODE_ENV !== 'production') require('dotenv').config({path: './config/.env'});
const weather = require('./weatherapi-Node-js/lib');
const express = require('express');
const path = require('path');
const AppError = require('./utils/AppError');

const app = express();
app.listen(3000,() => console.log('Server is running on port 3000...'));
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));

weather.Configuration.key = process.env.API_KEY;
const weatherController = weather.APIsController;

app.get('/',(req,res) => {
    res.render('index');
})

app.get('/api/search',(req,res,next) => {
    const {q} = req.query;
    weatherController.searchAutocompleteWeather(q,function(error,response){
        if(error) next(new AppError(error.errorMessage,error.errorCode));
        else res.send(response);
    })
})

app.get('/api/current',(req,res,next) => {
    const {q} = req.query;
    weatherController.getRealtimeWeather(q,'',function(error,response){
        if(error) next(new AppError(error.errorMessage,error.errorCode));
        else res.send(response);
    })
})

app.use((req,res) => {
    throw new AppError('Not found',404);
})

app.use((err,req,res,next) => {
    const status = err.status || 500;
    const message = err.message;
    res.status(status).send(message);
})