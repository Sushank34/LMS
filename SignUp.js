var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
//app.use(express.static("public"));
//app.use(express.static(__dirname + '/public'));
var url = "mongodb+srv://frost:frost@cluster0.awf2e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";


var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(express.static(__dirname + '/public'));

app.post('/SignUp', urlencodedParser, function (req, res) {
if(req.body.password==req.body.confirmpassword)
{    
 MongoClient.connect(url, function(err, db) {
   //if (err) throw err;
   var dbo = db.db("mydb");
   var query = { UserName: req.body.username};
   var myobj = { UserName: req.body.username, MailID: req.body.email, Password: req.body.password };
   dbo.collection("customers").find(query).toArray(function(err, result) {
     if(result[0]==null){
      dbo.collection("customers").insertOne(myobj, function(err, res) {
        console.log("1 document inserted");
        res.render('SignUpIn',{n:1});
        db.close();
        res.end();
      });
     }
     else
     {
      res.render('SignUpIn',{n:4});
      res.end();
     }
     db.close();
    });
 });
 //res.render('SignUpIn',{n:1});
 //alert("SignUp Successful");
 //res.end();
}
else
{
    //alert("Invalid details");
    res.render('SignUpIn',{n:4});
    res.end();
}
});

app.post('/SignIn', urlencodedParser, function (req, res) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var query = { UserName: req.body.username, Password: req.body.password };
    dbo.collection("customers").find(query).toArray(function(err, result) {
      //if (err) throw err;
      //console.log(result);
      if(result[0]!=null)
      {
        res.render('home2',{n:req.body.username});
        db.close();
      }
      else
      {
        res.render('SignUpIn',{n:3});
      }
      //db.close();
    });
  });
});

app.post('/SignOut', urlencodedParser, function (req, res) {
  res.render('SignUpIn',{n:2});
  res.end();
})

var server = app.listen(8081, function () {});