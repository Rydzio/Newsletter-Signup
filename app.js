// jshint esversion: 6
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us8.api.mailchimp.com/3.0/lists/b769837ceb";

  const options = {
    method: "POST",
    auth: "michal1:7f1adf4f8d7ef768481f7a5cc7c3187e-us8a"
  };

  const request = https.request(url, options, function(response) {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on('data', function(data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();

});

// After faliure and clicking the button it triggeres post request to take back to the previous page
app.post("/failure", function(req, res) {
  res.redirect("/");
});


app.listen(3000, function() {
  console.log("Server running on port 3000");
});

// API key
// 7f1adf4f8d7ef768481f7a5cc7c3187e-us8

// List ID
// b769837ceb