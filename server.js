console.log('Server-side code running');
const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const app = express();
const random = require('./Random')

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

// start the express web server listening on 8080
app.listen(8080, () => {
    console.log('listening on 8080');
});



console.log('Server-side code running');


// serve files from the public directory
app.use(express.static('public'));

// connect to the db and start the express server
let db;

// ***Replace the URL below with the URL for your database***
const url = 'mongodb://reportsUser:passwd(*@localhost:27017/urls';
// E.g. for option 2) above this will be:
// const url =  'mongodb://localhost:21017/databaseName';

MongoClient.connect(url, (err, database) => {
    if (err) return console.log(err);
    db = database;
    // start the express web server listening on 8080
    app.listen(8888, () => {
        console.log('listening on 8080');
    });
});

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) addres
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}

// serve the homepage
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// add a document to the DB collection recording the click event
app.post('/', (req, res) => {
    if (!validURL(req.body.uri)) req.flash("success", "That is not a valid url")
    let json = {}
    console.log(random.next())
    json["_id"] = random.next()
    json['uri'] = req.body.uri
    // console.log(json)
    db.collection('urls').insertOne(json, (err) => {
        if (err) return console.log(err);
        // console.log('uri added to db');
        // res.flash('success', "That is not a valid url")
    });
});

app.get('/r/:id', function (req, res) {
    // console.log(req.params.id)
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

