const express = require("express");
var request = require("request");
const bodyParser = require('body-parser');
const app = express();
const port = 5000;

//Create an Github app beforehand and get these values
const clientId = '';
const clientSecret = '';

//Authenticate app with Github and retireve access code
app.get('/authenticate', (req, res) => {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${clientId}`);


});

const axios = require('axios');
let token = null;

//Exchange access code for access token
app.get('/oauth-callback', (req, res) => {
    const body = {
        client_id: clientId,
        client_secret: clientSecret,
        code: req.query.code
    };
    const opts = { headers: { accept: 'application/json' } };
    //Retrieve access token so we can then utilize it
    axios.post(`https://github.com/login/oauth/access_token`, body, opts);


}





//Using the User Auth code, we can make a POST request to Github's API and get the response
app.get("/checkSponsorship", (req, res) => {
    var headers = {



    };


    var options = {




    };

    async function callback(error, response, body){
        if(!error && response.statusCode == 200){


            res.send("Confirm / Reject");
        }



    }

    request(options, callback);





});




//For testing on Postman
app.listen(port, () => console.log(`Listening on port ${port}!`))




