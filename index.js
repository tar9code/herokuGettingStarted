var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

/*
const Pool = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
});

app.get('/db', async (req, res) => {
    try {
        const client = await pool.connect()
        const result = await client.query('SELECT * FROM test_table');
        res.render('pages/db', result);
        client.release();
        }
        catch (err) {
        console.error(err);
        res.send("Error " + err);
        }
});
*/
//var express = require('express');
var mongodb = require('mongodb');
var router = express.Router();
/* GET home page. */
/*router.get('/', function(req, res, next)
{   res.render('index', { title: 'Express' }); });*/
module.exports = router;
//**************************************************************************
// ***** mongodb get all of the Routes in Routes collection where frequence>=1
//      and sort by the name of the route.  Render information in the views/pages/mongodb.ejs
//
//var mongoRouteUrl = 'mongodb://heroku_pmk6n54s:penh0a964unc8citdi3c1943cv@ds153869.mlab.com:53869/heroku_pmk6n54s';
var mongoRouteUrl = 'mongodb://heroku_nhr73h2j:m925ongoDB@ds149279.mlab.com:49279/heroku_nhr73h2j';
router.get('/mongodb', function (request, response)
{
    mongodb.MongoClient.connect(mongoRouteUrl, function(err, client) {
        mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, db) {  // works with mongodb v2 but not v3
            if (err) throw err;         //get collection of routes
            var db = client.db('heroku_nhr73h2j');  // in v3 we need to get the db from the client
            var Routes = db.collection('Routes');         //get all Routes with frequency >=1
            Routes.find({frequency: {$gte: 0}}).sort({name: 1}).toArray(function (err, docs) {
                if (err) throw err;
                response.render('mongodb', {results: docs});
            });          //close connection when your app is terminating.         //
            db.close(function (err) {
                client.close(function (err) {
                    if (err) throw err;
                });
            });//end of connect
        });
        //end app.get
    });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
