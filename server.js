const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3000;
//const http_ = require('http');//for built in http support
var XMLHttpRequest = require('xhr2');


server.use(jsonServer.bodyParser)


//Create custom route (api) access is by url:"http:://get/users/user_to_find":
//server.use(jsonServer.rewriter({
//    '/api/users': '/users'
//}));
//server.use(jsonServer.bodyParser)

//server.listen(port);

//let server_start_time=0;

//var db = require('./db.json');//handle to the db file
//let result = db.posts.find(user => {
//    return user.userId == userId;
//})


//server.use((req, res, next) => {


//Trying express framework:
/*
server.get('/profile',(req, res,next) => {
    console.log('KOSTA in GET express function');
    next();
});
 */

//Trying express framework:
/*
server.put('/profile',(req, res,next) => {
    console.log('KOSTA in PUT express function');
    next();
});
 */

server.use(middlewares);
server.use((req, res,next) => {
    //Change to enable remote storage CHANGE_200920
    if (req.method === 'POST') {
        console.log('KOSTA in express function');
        getRequest('https://investcloud.herokuapp.com/profile', (data) => {
            putRequest(data, 'https://jsonblob.com/api/jsonBlob/25727a48-fb31-11ea-9b5c-1dd302ffc285',
                () => {
                    console.log('Created backup.');
                });
        });
        //req.body.createdAt = Date.now()
    }
    else {
        //getRequest('https://investcloud.herokuapp.com/profile', (data) => {
        //    putRequest(data, 'https://jsonblob.com/api/jsonBlob/25727a48-fb31-11ea-9b5c-1dd302ffc285',
         //       () => {
         //           console.log('Created backup. In else {} loop')
         //       });
        //});
    }
    // Continue to JSON Server router
    next()
});



server.use(router);
// Use default router
server.listen(port, () => {
    getRequest('https://jsonblob.com/api/jsonBlob/25727a48-fb31-11ea-9b5c-1dd302ffc285', (data) => {
        putRequest(data, 'https://investcloud.herokuapp.com/profile',
            () => {
                console.log('Restored from backup.')
            });
    });
});

// HTTP Request
    function getRequest(url, callback) {
        var xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                callback(JSON.parse(this.responseText));
            }
        };
        xmlhttp.open('GET', url, true);
        xmlhttp.send();
    }

    function putRequest(data, url, callback) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                callback(this.responseText);
            }
        };
        xmlhttp.open('PUT', url, true);
        xmlhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xmlhttp.send(JSON.stringify(data));
    }

/*
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3000;

server.use(middlewares);
server.use(router);

server.listen(port);
*/
