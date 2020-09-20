const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3000;

server.use(middlewares);
server.use(router);
//server.listen(port);

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  //Change to enable remote storage CHANGE_200920
  if (req.method === 'POST' || req.method === 'PUT') {
    getRequest('https://investcloud.herokuapp.com/db', (data) => {
      putRequest(data, 'https://jsonblob.com/api/jsonBlob/25727a48-fb31-11ea-9b5c-1dd302ffc285', () => { console.log('Created backup.') })
    });
    
  //req.body.createdAt = Date.now()
  }
  // Continue to JSON Server router
  next()
});


// Use default router
server.listen(port, () => {
  getRequest('https://jsonblob.com/api/jsonBlob/25727a48-fb31-11ea-9b5c-1dd302ffc285', (data) => {
    putRequest(data, 'https://investcloud.herokuapp.com/db',
        () => { console.log('Restored from backup.') })
});



// HTTP Request
function getRequest(url, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(JSON.parse(this.responseText));
        }
    };
    xmlhttp.open('GET', url, true); 
    xmlhttp.send();
}

function putRequest(data, url, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
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
