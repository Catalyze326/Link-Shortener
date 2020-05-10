console.log('Server-side code running');
const redirectToHTTPS = require('express-http-to-https').redirectToHTTPS
const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const https = require('https');
const fs = require('fs')
const random = require('./Random')
const app = express();
const redirectApp = express();

// TODO use only the first 6 chars for grabbing the url from the mongo db because they all start with next I could also use more nums at the beginning to make the database bigger

const middlewares = [
    express.static('public'),
    bodyParser.json(),
    bodyParser.urlencoded({extended: true}),
    cookieParser(),
    flash(),
    session({
        secret: 'super-secret-key',
        key: 'super-secret-cookie',
        resave: false,
        saveUninitialized: false,
        cookie: {maxAge: 60000}
    }),
];

app.use(middlewares)

console.log('Server-side code running');


// serve files from the public directory
app.use(express.static('public'));

// connect to the db and start the express server
let db;

// ***Replace the URL below with the URL for your database***
const url = 'mongodb://localhost:27017/urls';
// E.g. for option 2) above this will be:
// const url =  'mongodb://localhost:21017/databaseName';

MongoClient.connect(url, (err, client) => {
    if (err) return console.log(err);
    db = client.db("url");
    // start the express web serve listening on 8080
    let redirectPort = 80
    redirectApp.listen(redirectPort, () => {
        console.log("redirect listening on " + redirectPort);
    });
    // let port = 8080
    // app.listen(port, () => {
    //     console.log("redirect listening on " + port);
    // });
});

redirectApp.get('/', (req, res) => {
    res.redirect("https://dont.comeat.me" + req.url)
});

// serve the homepage
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// add a document to the DB collection recording the click event
app.post('/link', (req, res) => {
    let json = {}
    json["_id"] = random.next()
    json['uri'] = req.body.uri
    // console.log(json)
    db.collection('urls').insertOne(json, (err) => {
        if (err) return console.log(err);
    });
    //res.send('http://localhost/r/' + json['_id'])
    res.send('https://dont.comeat.me/r/' + json['_id'])
});

// add a document to the DB collection recording the click event
app.post('/lonk', (req, res) => {
    let json = {}
    json["_id"] = random.lonk()
    json['uri'] = req.body.uri
    // console.log(json)
    db.collection('urls').insertOne(json, (err) => {
        if (err) return console.log(err);
    });
    //res.send('http://localhost/r/' + json['_id'])
    res.send('https://dont.comeat.me/r/' + json['_id'])
});

// add a document to the DB collection recording the click event
app.post('/sketchy', (req, res) => {
    let json = {}
    // console.log(random.sketchy())
    json["_id"] = random.sketchy()
    json['uri'] = req.body.uri
    // console.log(json)
    db.collection('urls').insertOne(json, (err) => {
        if (err) return console.log(err);
    });
    //res.send('http://localhost/r/' + json['_id'])
    res.send('https://dont.comeat.me/r/' + json['_id'])
});

// app.post('/lyrics', (req, res) => {
//     let json = {}
//     console.log(random.next())
//     json["_id"] = random.next()
//     json['uri'] = req.body.uri
//     // console.log(json)
//     db.collection('urls').insertOne(json, (err) => {
//         if (err) return console.log(err);
//     });
//     //res.send('http://localhost/r/' + json['_id'])
//     res.send('https://dont.comeat.me/r/' + json['_id'])
// });

app.get('/r/:id', function (req, res) {
    console.log(req.params.id)
    if (req.params.id) {
        const cursor = db.collection("urls").find({_id: req.params.id});
        cursor.next().then(r => {
            // console.log(r)
            res.redirect(r["uri"])
        })
    } else {
        res.redirect('/')
    }
});

https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/dont.comeat.me/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/dont.comeat.me/fullchain.pem'),
}, app).listen(443);
