const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3000;
var XMLHttpRequest = require('xhr2');

var AfterRestore=false;


server.use(jsonServer.bodyParser)
server.use(middlewares);

/*
server.use((req, res,next) => {

    //Change to enable remote storage CHANGE_200920
    console.log('Creating backup...');
    let post_url_usr = 'https://investcloud.herokuapp.com/posts';
    if ((req.method === 'POST') && (req.baseUrl=== post_url_usr) && (AfterRestore)) {
        console.log('Creating backup inside if...');
        getRequest(post_url_usr, (data) => {
            putRequest(data, 'https://jsonblob.com/api/jsonBlob/25727a48-fb31-11ea-9b5c-1dd302ffc285', () => {
                    console.log('Created usr answers backup.');
            });
        });
    }else{
        let comments_url = 'https://jsonblob.com/api/893223c1-fc27-11ea-a8f0-8decf7d8c81c';
        if(req.baseUrl === comments_url)
        {
            putRequest(data, 'https://jsonblob.com/api/jsonBlob/25727a48-fb31-11ea-9b5c-1dd302ffc285', () => {
                console.log('Created sim param backup.');});
        }
    }
    // Continue to JSON Server router
    next()
});
 */


server.use(router);
// Use default router
server.listen(port, () => {
    console.log('Started restoration...');
    /*
    //let data = await getRequest(url, (d) => {return d});
    getRequest('https://jsonblob.com/api/jsonBlob/25727a48-fb31-11ea-9b5c-1dd302ffc285', (data) => {
        data.forEach(function(row, index) {
            postRequest(row, 'https://investcloud.herokuapp.com/posts', () => {
                //console.log('Posting user num. '+index.toString());
                console.log("restoring row usr");

                let comments_url = 'https://jsonblob.com/api/893223c1-fc27-11ea-a8f0-8decf7d8c81c';
                //Restore the simulation settings:
                getRequest(comments_url, (data) => {
                    console.log('restoring sim params');
                    postRequest(data, 'https://investcloud.herokuapp.com/comments', () => {
                        console.log('Restored sim variables from backup.');
                        console.log('Restored user answeres from backup.');
                        AfterRestore=true;
                    });

                });
            });

        });
    });
     */
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




// HTTP Request
/*
Example usage:
async function a() {
    var data = await httpRequest('GET', 'https://investcloud.herokuapp.com/comments');
    //          /\
    //           |   Adding an "await" parameter to the start of the request stops all the code in the func
    console.log(data); // Therefore "data" will not be undefined.
    
    var post = httpRequest('POST', 'https://investcloud.herokuapp.com/comments', '{ 'a': 'b' }');
    //           ?
    //           | Without an await parameter, httpRequest will run in the background. The rest of the code will continue running
    console.log(post); // Therefore "post" will be undefined.
}
/*

function httpRequest(type, url, data) {
    return new Promise(resolve => {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                resolve(JSON.parse(this.responseText));
            }
        };
        xmlhttp.open(type, url, true);
        xmlhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xmlhttp.send(type == 'POST' || type == 'PUT' ? JSON.stringify(data) : null);
    }
}
*/

