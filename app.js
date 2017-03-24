/**
 * Created by keren.kochanovitch on 24/03/2017.
 */
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname + '/public'));
// app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));


app.listen(3000, function () {
    console.log('App listening on port 3000!')
});