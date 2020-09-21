const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3000;
var XMLHttpRequest = require('xhr2');

server.use(jsonServer.bodyParser)
server.use(middlewares);

server.use((req, res,next) => {
    //Change to enable remote storage CHANGE_200920
    if (req.method === 'POST') {
        console.log('Creating backup...');
        getRequest('https://investcloud.herokuapp.com/posts', (data) => {
            putRequest(data, 'https://jsonblob.com/api/jsonBlob/25727a48-fb31-11ea-9b5c-1dd302ffc285', () => {
                    console.log('Created backup.');
            });
        });
    }
    // Continue to JSON Server router
    next()
});

server.use(router);
// Use default router
server.listen(port, () => {
    console.log('Started restoration...');
    //let data = await getRequest(url, (d) => {return d});
    getRequest('https://jsonblob.com/api/jsonBlob/25727a48-fb31-11ea-9b5c-1dd302ffc285', (data) => {
        data.forEach(function(row, index) {
            postRequest(row, 'https://investcloud.herokuapp.com/posts', () => {
                console.log('Posting user num. '+index);
                let comments_url = 'https://jsonblob.com/api/893223c1-fc27-11ea-a8f0-8decf7d8c81c';
                //Restore the simulation settings:
                getRequest(comments_url, (data) => {
                    postRequest(data, 'https://investcloud.herokuapp.com/posts', () => {
                        console.log('Restored sim variables from backup.');
                        console.log('Restored user answeres from backup.');
                    });

                });
            });

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

function postRequest(data, url, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            callback(this.responseText);
        }
    };
    xmlhttp.open('POST', url, true);
    xmlhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xmlhttp.send(JSON.stringify(data));
}