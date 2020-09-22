const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3000;
var XMLHttpRequest = require('xhr2');

var Restoring=false;


server.use(jsonServer.bodyParser)

//Using middlewares with express:
server.use(middlewares);


//Set the working urls:
const usr_backup_url = 'https://jsonblob.com/api/jsonBlob/25727a48-fb31-11ea-9b5c-1dd302ffc285';
const sim_param_backup_url = 'https://jsonblob.com/api/893223c1-fc27-11ea-a8f0-8decf7d8c81c';
const usr_data_url = 'https://investcloud.herokuapp.com/posts';
const sim_param_url = 'https://investcloud.herokuapp.com/comments';


//Catch POST events:
server.use( async (req, res,next) => {
    //Change to enable remote storage CHANGE_200920
    console.log('Creating backup...');
    //Dont perform archive if resotring:
    if(Restoring) next();

    //Making the backup data for user answers and sim data:
    if (req.method === 'POST') {
            if (req.req.baseUrl == usr_data_url) {
                //Get the data from in memory db:
                var data = await httpRequest('GET', usr_data_url, '');
                //Store backup at remote db:
                var responce = await httpRequest('PUT', usr_backup_url, data);
            }
            //If it's simulation params create a backup :
            if (req.req.baseUrl == sim_param_url) {
                //Get the data from in memory db:
                var data = await httpRequest('GET', sim_param_url, '');
                //Store backup at remote db:
                var responce = await httpRequest('PUT', sim_param_backup_url, data);
            }
        }
    next();
});



// Use default router
server.use(router);

//Start listen to port:
server.listen(port, async () => {

    //Perform Restore on start:
    console.log('Started restoration...');
    Restoring = true;//mark the restorations started
    //Fetch backup from remote archive:
    var data = await httpRequest('GET', usr_backup_url);
    //Push rows of data to app db:
    data.forEach(async function (row, index) {
        var res = await httpRequest('POST', usr_data_url, row);
    });
    //Fetch comments from remote archive:
    var comments_data = await httpRequest('GET', sim_param_backup_url);
    //Push it to the in-memory db:
    var res = await httpRequest('POST', sim_param_url, comments_data);
    Restoring = false;//finished restoring
    console.log('Finished restoration...');
})









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
});
*/



//Async function to retrieve and get data: GET,PUT,POST
function httpRequest(type, url, data) {
    return new Promise(resolve => {
        var xmlhttp = new XMLHttpRequest();
        if( (type=='POST' || type=='PUT' || type=='GET')) {
            xmlhttp.onreadystatechange = function () {
                let status_ = (type == 'POST' || type == 'PUT') ? 201 : 200;
                if (this.readyState == 4 && this.status == status_) {
                    resolve(JSON.parse(this.responseText));
                }
            };
            xmlhttp.open(type, url, true);
            xmlhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
            xmlhttp.send(type == 'POST' || type == 'PUT' ? JSON.stringify(data) : null);
        }
    });
}













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
        if (this.readyState == 4 && this.status == 201) {
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
        if (this.readyState == 4 && this.status == 201) {
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
*/






//--------------------------
/*
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