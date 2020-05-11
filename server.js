console.log('Server-side code running');
const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const https = require('https');
const fs = require('fs');
const csrf = require('csurf');
const random = require('./Random');
const app = express();
const redirectApp = express();
const helmet = require('helmet');
const ping = require("net-ping");
const request = require('request');

const expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
const middlewares = [
    express.static('public'),
    bodyParser.json(),
    bodyParser.urlencoded({extended: false}),
    cookieParser(),
    express.static('public'),
    csrf({
        cookie: {
            maxAge: 60000,
            secure: true,
            httpOnly: true,
            domain: 'dont.comeat.me',
            path: 'foo/bar',
            expires: expiryDate
        }
    }),
    helmet(),
    helmet.noSniff(),
];
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
})
app.set('etag', false)
app.disable('x-powered-by');
app.set('view engine', 'ejs');
app.set('trust proxy', 1)
app.use(middlewares)

console.log('Server-side code running');

// connect to the db and start the express server
let db;

MongoClient.connect('mongodb://localhost:27017/urls', (err, client) => {
    if (err) return console.log(err);
    db = client.db("url");
    let redirectPort = 80
    redirectApp.listen(redirectPort, () => {
        console.log("redirect listening on " + redirectPort);
    });
    // let port = 8080
    // app.listen(port, () => {
    //     console.log("redirect listening on " + port);
    // });
});

// serve the homepage
app.get('/', (req, res) => {
    res.render(__dirname + '/public/index.ejs', {
        csrfToken: req.csrfToken(),
        url: "",
        showUrl: 'hidden'
    });
});

function validate(uri) {
    const url = require("url");
    const result = url.parse(uri);
    console.log(result);
    if (result.hostname == null) return false
    const session = ping.createSession();
    session.pingHost(result.href, function (error, target) {
        if (error) return false
        else console.log(target + ": Alive");
    });
    request({method: 'HEAD', uri: target}, function (error, response, body) {
        if (!error && response.statusCode === 200) return false
    })
    return true
}

// add a document to the DB collection recording the click event
app.post('/link', (req, res) => {
    if (!validate(req.body.uri))
        return res.render(__dirname + '/public/index.ejs', {
            csrfToken: req.csrfToken(),
            url: 'invalid url',
            showUrl: ''
        });
    let json = {}
    json["_id"] = random.next()
    json['uri'] = req.body.uri
    // console.log(json)
    db.collection('urls').insertOne(json, (err) => {
        if (err) return console.log(err);
    });
    res.render(__dirname + '/public/index.ejs', {
        csrfToken: req.csrfToken(),
        url: 'https://dont.comeat.me/r/' + json['_id'],
        showUrl: ''
    });
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
    res.render(__dirname + '/public/index.ejs', {
        csrfToken: req.csrfToken(),
        url: 'https://dont.comeat.me/r/' + json['_id'],
        showUrl: ''
    });
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
    res.render(__dirname + '/public/index.ejs', {
        csrfToken: req.csrfToken(),
        url: 'https://dont.comeat.me/r/' + json['_id'],
        showUrl: ''
    });
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
            res.redirect(r["uri"])
        })
    } else {
        res.redirect('/')
    }
});

// error handler
app.use(function (err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') return next(err)

    // handle CSRF token errors here
    res.status(403)
    res.send('form tampered with')
})

https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/dont.comeat.me/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/dont.comeat.me/fullchain.pem'),
}, app).listen(443);
