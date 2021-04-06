var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
//app.use(express.static("public"));
//app.use(express.static(__dirname + '/public'));
var url = "mongodb link";


var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(express.static(__dirname + '/public'));
var name = "";

app.post('/SignUp', urlencodedParser, function (req, res) {
if(req.body.password==req.body.confirmpassword)
{    
 MongoClient.connect(url, function(err, db) {
   //if (err) throw err;
   var dbo = db.db("mydb");
   var query = { UserName: req.body.username };
   var myobj = { UserName: req.body.username, MailID: req.body.email, Password: req.body.password };
   dbo.collection("users").find(query).toArray(function(err, result) {
     //console.log(result[0]);
     if(result[0]==null){ 
       dbo.collection("users").insertOne(myobj, function(err, rest) {
         console.log("1 document inserted");
         res.render('SignUpIn',{n:1});
         db.close();
         res.end();
       });
      //if(p==1)
      //{
        //p=0;
        //res.render('SignUpIn',{n:1});
        //res.end();
      //}
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
    name = req.body.username
    var query = { UserName: req.body.username, Password: req.body.password };
    dbo.collection("users").find(query).toArray(function(err, result) {
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

app.post('/OD', urlencodedParser, function (req, res) {
  res.render('od');
  res.end();
})

app.post('/OL', urlencodedParser, function (req, res) {
  res.render('ol');
  res.end();
})

app.post('/ML', urlencodedParser, function (req, res) {
  res.render('ml');
  res.end();
})

app.post('/OD1', urlencodedParser, function (req, res) {
  MongoClient.connect(url, function(err, db) {
    //if (err) throw err;
    var dbo = db.db("mydb");
    var myobj = { Name: name, LeaveType: "OD", FromDate: req.body.FromDate, FromTime: req.body.FromTime, ToDate: req.body.ToDate, ToTime: req.body.ToTime, EventType: req.body.EventType, ParticipationType: req.body.ParticipationType, Award: req.body.Award };
    dbo.collection("leave").insertOne(myobj, function(err, rest) {
      console.log("1 document inserted");
      res.render('home2',{n:name});
      db.close();
      res.end();
    });
  })  
})

app.post('/OL1', urlencodedParser, function (req, res) {
  MongoClient.connect(url, function(err, db) {
    //if (err) throw err;
    var dbo = db.db("mydb");
    var myobj = { Name: name, LeaveType:"OL", FromDate: req.body.FromDate, FromTime: req.body.FromTime, ToDate: req.body.ToDate, ToTime: req.body.ToTime, Reason: req.body.Reason };
    dbo.collection("leave").insertOne(myobj, function(err, rest) {
      console.log("1 document inserted");
      res.render('home2',{n:name});
      db.close();
      res.end();
    });
  })  
})

app.post('/ML1', urlencodedParser, function (req, res) {
  MongoClient.connect(url, function(err, db) {
    //if (err) throw err;
    var dbo = db.db("mydb");
    var myobj = { Name: name, LeaveType:"ML", FromDate: req.body.FromDate, FromTime: req.body.FromTime, ToDate: req.body.ToDate, ToTime: req.body.ToTime, Type: req.body.Type, TreatmentDetails: req.body.TreatmentDetails };
    dbo.collection("leave").insertOne(myobj, function(err, rest) {
      console.log("1 document inserted");
      res.render('home2',{n:name});
      db.close();
      res.end();
    });
  })  
})


var server = app.listen(8081, function () {});