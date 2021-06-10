//var express = require('express');
var bodyParser = require('body-parser');
//var mysql = require('mysql');
var path = require('path');
var http = require('http');
//var fs = require('fs');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var nodemailer = require('nodemailer');
//app.use(express.static("public"));
//app.use(express.static(__dirname + '/public'));
var url = "mongodb+srv://frost:frost@cluster0.awf2e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

var binary = require('mongodb').Binary;
var fileUpload = require('express-fileupload'); 
app.use(fileUpload());


var urlencodedParser = bodyParser.urlencoded({ extended: true })
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(express.static(__dirname + '/public'));
var name = "";
var name1 = "";
var otp = 0;
var otp1 = "";
var mailid = "";
var i = 0;
var count = 0;
var check = 0;
var str = "CB.EN.U4";


app.post('/SignUp', urlencodedParser, function (req, res) {
  if(req.body.password==req.body.confirmpassword){
    MongoClient.connect(url, function(err, db) {
      var dbo = db.db("mydb");
      name = req.body.username;
      name1 = name.toUpperCase();
      var query = {};
      var myquery = {};
      var newvalues = { $set: {MailID: req.body.email, Count:0} };
      var myobj = {};
      var myobj1 ={};
      check=0;
      for(i=0;i<Math.min(name1.length,str.length);i++){
        if(name1.charAt(i) == str.charAt(i)){
          count = count + 1;
        }
      }
      if(count == 8){
        myobj = { UserName: name1 };
        query = { UserName: name1, Password: req.body.password };
        myquery = { UserName: name1, Password: req.body.password };
        check = 0;
        count = 0;
      }
      else{
        myobj = {UserName: req.body.username};
        query = { UserName: req.body.username, Password: req.body.password };
        myquery = { UserName: req.body.username, Password: req.body.password };
        if(name=="QUERY MANAGER"){
          check=2;
        }
        else{
          check = 1;
        }
        count = 0;
      }
      if(check==0){
        dbo.collection("users").find(myobj).toArray(function(err, val) {
          myobj1 = {UserName: name1, MailID: req.body.email, FirstName: '', LastName: '', Phone: '', Address: '', HealthBio: '',Department: val[0].Department, Section:val[0].Section, Adviser:val[0].Adviser }
        });
      }
      else if(check==1){
        dbo.collection("users").find(myobj).toArray(function(err, val) {
          myobj1 = {UserName: req.body.username, MailID: req.body.email, FirstName: '', LastName: '', Phone: '', Address: '', HealthBio: '',Department: val[0].Department, Cader: val[0].Cader }
        });
      }
      else if(check==2){
        dbo.collection("users").find(myobj).toArray(function(err, val) {
          myobj1 = {UserName: req.body.username, MailID: req.body.email, FirstName: '', LastName: '', Phone: '', Address: '', HealthBio: '' }
        });
      }
      dbo.collection("users").find(query).toArray(function(err, result) {
        if(result[0]==null){
          res.render('SignUpIn',{n:4,count:0});
          db.close();
          res.end();
        }
        else{
          dbo.collection("users").updateOne(myquery, newvalues, function(err, rest) {
            console.log("1 document updated");
          });
          dbo.collection("profile").find(myobj).toArray(function(err, val) {
            if(val[0]==null){
              dbo.collection("profile").insertOne(myobj1, function(err, rest) {
                res.render('SignUpIn',{n:1,count:0});
                db.close();
                res.end();
              });
            }
            else{
              if(val[0].MailID.equals(req.body.email)){
                dbo.collection("profile").updateOne(myquery, newvalues, function(err, rest) {
                  console.log("1 document updated");
                });
              }
              res.render('SignUpIn',{n:1,count:0});
                db.close();
                res.end();
            }
          });
        }
      });
    });
  }
  else{
    res.render('SignUpIn',{n:4,count:0});
    res.end();
  }
});

app.post('/SignIn', urlencodedParser, function (req, res) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    name = req.body.username1
    name1 = name.toUpperCase();
    check=0
    for(i=0;i<Math.min(name1.length,str.length);i++){
      if(name1.charAt(i) == str.charAt(i)){
        count = count + 1;
      }
    }
    if(count == 8){
      var query = { UserName: name1, Password: req.body.password1 };
      check = 0;
      count = 0;
    }
    else{
      var query = { UserName: req.body.username1, Password: req.body.password1 };
      if(name1=="QUERY MANAGER"){
        check=2;
      }
      else{
        check = 1;
      }
      count = 0;
    }
    dbo.collection("users").find(query).toArray(function(err, result) {
      var newvalues1 = { $set: {Count: 0 } };
      if(result[0]!=null && result[0].Count<5 && check==0)
      {
        var myquery1 = { UserName: name1 }
        dbo.collection("users").updateOne(myquery1, newvalues1, function(err, val) {});
        res.render('home2',{n:name1,x:0});
        db.close();
      }
      else if(result[0]!=null && result[0].Count<5 && check==1){
        var myquery1 = { UserName: req.body.username1 }
        dbo.collection("users").updateOne(myquery1, newvalues1, function(err, val) {});
        res.render('home2_faculty',{n:req.body.username1,x:0});
        db.close();
      }
      else if(result[0]!=null && result[0].Count<5 && check==2){
        var myquery1 = { UserName: req.body.username1 }
        dbo.collection("users").updateOne(myquery1, newvalues1, function(err, val) {});
        res.render('home2_qm',{n:req.body.username1,x:0});
        db.close();
      }
      else
      { 
        var check1=1;
        if(check==0){
        var myquery = { UserName: name1 }
        dbo.collection("users").find(myquery).toArray(function(err, rest) {
          if(rest[0]!=null){
            check1=check1+rest[0].Count;
          if(rest[0].Count<5){
            var newvalues = { $set: {Count: check1 } };
            dbo.collection("users").updateOne(myquery, newvalues, function(err, val) {
              console.log("Count Updated");
              res.render('SignUpIn',{n:3,count:check1});
            });
          }
          else{
            var newvalues = { $set: {Count: check1 } };
            dbo.collection("users").updateOne(myquery, newvalues, function(err, val) {
              console.log("Count Updated");
              res.render('SignUpIn',{n:3,count:check1});
            });
          }
        }
        else{
          res.render('SignUpIn',{n:3,count:-1});
        }
        });
        }
        else{
          var myquery = { UserName: req.body.username }
        dbo.collection("users").find(myquery).toArray(function(err, rest) {
          if(rest[0]!=null){
            check1=check1+rest[0].Count;
            if(rest[0].Count<5){
              var newvalues = { $set: {Count: check1 } };
              dbo.collection("users").updateOne(myquery, newvalues, function(err, val) {
                console.log("Count Updated");
                res.render('SignUpIn',{n:3,count:check1});
              });
            }
            else{
              var newvalues = { $set: {Count: check1 } };
              dbo.collection("users").updateOne(myquery, newvalues, function(err, val) {
                console.log("Count Updated");
                res.render('SignUpIn',{n:3,count:check1});
              });
            }
          }
        else{
          res.render('SignUpIn',{n:3,count:-1});
        }
        });
        }
      }
    });
  });
});

app.post('/SignOut', urlencodedParser, function (req, res) {
  res.render('SignUpIn',{n:2,count:0});
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
  if(req.body.FromDate<req.body.ToDate){
  MongoClient.connect(url, function(err, db) {
    var dbo = db.db("mydb");
    var myobj = { UserName: name1, LeaveType: "OD", FromDate: req.body.FromDate, FromTime: req.body.FromTime, ToDate: req.body.ToDate, ToTime: req.body.ToTime,Faculty: req.body.faculty, EventType: req.body.EventType, ParticipationType: req.body.ParticipationType, Award: req.body.Award };
    dbo.collection("leave").insertOne(myobj, function(err, rest) {
      console.log("1 document inserted");
      res.render('home2',{n:name1,x:1});
      db.close();
      res.end();
    });
  })
}  
else{
  res.render('od');
}
})

app.post('/OL1', urlencodedParser, function (req, res) {
  if(req.body.FromDate<req.body.ToDate){
  MongoClient.connect(url, function(err, db) {
    var dbo = db.db("mydb");
    var myobj = { UserName: name1, LeaveType:"OL", FromDate: req.body.FromDate, FromTime: req.body.FromTime, ToDate: req.body.ToDate, ToTime: req.body.ToTime,Faculty: req.body.faculty, Reason: req.body.Reason };
    dbo.collection("leave").insertOne(myobj, function(err, rest) {
      console.log("1 document inserted");
      res.render('home2',{n:name1,x:1});
      db.close();
      res.end();
    });
  })
}  
  else{
    res.render('ol');
  }
})

app.post('/ML1', urlencodedParser, function (req, res) {
  if(req.body.FromDate<req.body.ToDate){
  MongoClient.connect(url, function(err, db) {
    var dbo = db.db("mydb");
    var myobj = { UserName: name1, LeaveType:"ML", FromDate: req.body.FromDate, FromTime: req.body.FromTime, ToDate: req.body.ToDate, ToTime: req.body.ToTime,Faculty: req.body.faculty, Type: req.body.Type, TreatmentDetails: req.body.TreatmentDetails };
    dbo.collection("leave").insertOne(myobj, function(err, rest) {
      console.log("1 document inserted");
    });
    var file = {UserName: name1, File: binary(req.files.myFile.data)}
    dbo.collection("files").insertOne(file, function(err, rest) {
      res.render('home2',{n:name1,x:1});
      db.close();
      res.end();
    });
  }) 
} 
else{
  res.render('ml');
}
})

app.post('/forgot', function (req, res) {
  res.render('otpsend');
})

app.post('/OTPSend', function (req, res) {
  otp = Math.floor(Math.random() * (999 - 101) + 101);
  otp1 = otp.toString();
  mailid=req.body.email;
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var query = { MailID: req.body.email };
    dbo.collection("users").find(query).toArray(function(err, result) {
      if(result[0]!=null)
      {
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'project18141@gmail.com',
            pass: 'admin141$'
          }
        });
        
        var mailOptions = {
          from: 'project18141@gmail.com',
          to: req.body.email,
          subject: 'OTP',
          text: otp1
        };
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      
        res.render('otpverify');
        db.close();
      }
      else
      {
        res.render('SignUpIn',{n:6,count:0});
      }
    });
  });

})

app.post('/OTPverify', function (req, res) {
  if(req.body.otp2 == otp1)
  {
    res.render('forgotchangepassword');
  }
  else
  {
    res.render('otpverify');
  }
})

app.post('/OTPconfirm', function (req, res) {
  if(req.body.confirmpassword == req.body.password)
  {
    MongoClient.connect(url, function(err, db) {
      var dbo = db.db("mydb");
      var myquery = { MailID: mailid };
      var newvalues = { $set: {Password: req.body.password } };
      dbo.collection("users").updateOne(myquery, newvalues, function(err, rest) {
        console.log("1 document updated");
        db.close();
        res.render('SignUpIn',{n:5,count:0});
        res.end();
      });
    });
  }
  else
  {
    res.render('SignUpIn',{n:7,count:0});
  }
})

app.post('/Leaves_applied', function (req, res) {
  MongoClient.connect(url, function(err, db) {
    var dbo = db.db("mydb");
    var myquery = { Faculty: name };
    dbo.collection("leave").find(myquery).toArray(function(err, result) {
      res.render('leaves_applied',{len:result.length,leaves:result})
    });
  });
})

app.post('/Leaves_approve', function (req, res) {
  MongoClient.connect(url, function(err, db) {
    var dbo = db.db("mydb");
    var myquery = { Faculty: name };
    if(req.body.LeaveType=='OD'){
      var myobj = { UserName: req.body.UserName, LeaveType: req.body.LeaveType , FromDate: req.body.FromDate, FromTime: req.body.FromTime, ToDate: req.body.ToDate, ToTime: req.body.ToTime, Faculty: name, EventType: req.body.EventType, ParticipationType: req.body.ParticipationType, Award: req.body.Award };
      dbo.collection("leave").find(myobj).toArray(function(err, result) {
        var myobj1={ UserName: result[0].UserName, LeaveType: result[0].LeaveType , FromDate: result[0].FromDate, FromTime: result[0].FromTime, ToDate: result[0].ToDate, ToTime: result[0].ToTime, Faculty: result[0].Faculty, EventType: result[0].EventType, ParticipationType: result[0].ParticipationType, Award: result[0].Award }
        dbo.collection("apleave").insertOne(myobj1, function(err, rest) {
        });
      });
      dbo.collection("leave").deleteOne(myobj, function(err, obj) {
        console.log("1 document deleted");
        dbo.collection("leave").find(myquery).toArray(function(err, val) {
          res.render('leaves_applied',{len:val.length,leaves:val});
          db.close();
          res.end();
        });
      });
    }
    else if(req.body.LeaveType=='OL'){
      var myobj = { UserName: req.body.UserName, LeaveType: req.body.LeaveType , FromDate: req.body.FromDate, FromTime: req.body.FromTime, ToDate: req.body.ToDate, ToTime: req.body.ToTime, Faculty: name, Reason: req.body.Reason };
      dbo.collection("leave").find(myobj).toArray(function(err, result) {
        var myobj1={ UserName: result[0].UserName, LeaveType: result[0].LeaveType , FromDate: result[0].FromDate, FromTime: result[0].FromTime, ToDate: result[0].ToDate, ToTime: result[0].ToTime, Faculty: result[0].Faculty, Reason: result[0].Reason }
        dbo.collection("apleave").insertOne(myobj1, function(err, rest) {
        });
      });
      dbo.collection("leave").deleteOne(myobj, function(err, obj) {
        console.log("1 document deleted");
        dbo.collection("leave").find(myquery).toArray(function(err, val) {
          res.render('leaves_applied',{len:val.length,leaves:val});
          db.close();
          res.end();
        });
      });
    }
    else if(req.body.LeaveType=='ML'){
      var myobj = { UserName: req.body.UserName, LeaveType: req.body.LeaveType , FromDate: req.body.FromDate, FromTime: req.body.FromTime, ToDate: req.body.ToDate, ToTime: req.body.ToTime, Faculty: name, Type: req.body.Type, TreatmentDetails: req.body.TreatmentDetails };
      dbo.collection("leave").find(myobj).toArray(function(err, result) {
        var myobj1={ UserName: result[0].UserName, LeaveType: result[0].LeaveType , FromDate: result[0].FromDate, FromTime: result[0].FromTime, ToDate: result[0].ToDate, ToTime: result[0].ToTime, Faculty: result[0].Faculty, Type: result[0].Type, TreatmentDetails: result[0].TreatmentDetails }
        dbo.collection("apleave").insertOne(myobj1, function(err, rest) {
        });
      });
      dbo.collection("leave").deleteOne(myobj, function(err, obj) {
        console.log("1 document deleted");
        dbo.collection("leave").find(myquery).toArray(function(err, val) {
          res.render('leaves_applied',{len:val.length,leaves:val});
          db.close();
          res.end();
        });
      });
    }
  });
});

app.post('/Leaveshome', function (req, res) {
  if(check==0){
    res.render('home2',{n:name1,x:0});
  }
  else if(check==1){
    res.render('home2_faculty',{n:name,x:0});
  }
  else{
    res.render('home2_qm',{n:name,x:0});
  }
});

app.post('/profile', function (req, res) {
  MongoClient.connect(url, function(err, db) {
    var dbo = db.db("mydb");
    var query = { UserName: name };
    if(check==0){
      query = { UserName: name1 };
    }
    dbo.collection("profile").find(query).toArray(function(err, result) {
      res.render('Profile',{profile:result,Check:check});
      db.close();
      res.end();
    });
  });
})

app.post('/profileChange', function (req, res) {
  MongoClient.connect(url, function(err, db) {
    var dbo = db.db("mydb");
    var query = { UserName: name };
    if(check==0){
      query = { UserName: name1 };
    }
    dbo.collection("profile").find(query).toArray(function(err, result) {
      res.render('Profile_edit',{details:result});
    });
  });
});

app.post('/searchUser', function (req, res) {
  res.render('searchuser');
});

app.post('/search', function (req, res) {
  MongoClient.connect(url, function(err, db) {
    var dbo = db.db("mydb");
    var str = req.body.mySearch;
    var c = 0;
    dbo.collection("profile").find({}).toArray(function(err, result) {
      for(var i=0;i<result.length;i++){
        var s = result[i].UserName;
        if(s.startsWith(str)){
          c=c+1;
        }
      }
      var arr = new Array(c);
      var arr1 = new Array(c);
      var a = 0;
      for(var i=0;i<result.length;i++){
        var s = result[i].UserName;
        if(s.startsWith(str)){
          arr[a]=s;
          arr1[a]=result[i].FirstName;
          a++
        }
      }
      res.render('searchuser',{suser1:arr,suser2:arr1,len:arr.length});
      db.close();
      res.end();
    });
  });
});

app.post('/profileView', function (req, res) {
  MongoClient.connect(url, function(err, db) {
    var dbo = db.db("mydb");
    var query = { UserName: req.body.UserName, FirstName:req.body.FirstName };
    dbo.collection("profile").find(query).toArray(function(err, result) {
      res.render('Profiledup',{profile:result});
      db.close();
      res.end();
    });
  });
});

app.post('/profileEdit', function (req, res) {
  MongoClient.connect(url, function(err, db) {
    var dbo = db.db("mydb");
    var myquery = { UserName: name };
    if(check==0){
      myquery = { UserName: name1 };
    }
    var newvalues = { $set: {  FirstName: req.body.firstname, LastName: req.body.lastname, Phone: req.body.phonenumber, Address: req.body.address, HealthBio: req.body.healthbio } };
    dbo.collection("profile").updateOne(myquery, newvalues, function(err, rest) {
      console.log("1 document updated");
      //db.close();
      //res.render('Profile');
      //res.end();
    });
    var query = { UserName: name };
    if(check==0){
      query = { UserName: name1 };
    }
    dbo.collection("profile").find(query).toArray(function(err, result) {
      var globalVariable={
        z: result
     };
     res.render('Profile',{profile:result});
     res.end();
    })
  })
})

app.post('/passwordChange', function (req, res) {
  if(req.body.newpassword==req.body.confirmpassword){
    MongoClient.connect(url, function(err, db) {
      var dbo = db.db("mydb"); 
      var myquery = { UserName: name };
      if(check==0){
        myquery = { UserName: name1 };
      }
      dbo.collection("users").find(myquery).toArray(function(err, result) {
        if(req.body.password==result[0].Password){
          var newvalues = { $set: {  Password: req.body.newpassword } };
          dbo.collection("users").updateOne(myquery, newvalues, function(err, rest) {
            console.log("1 document updated");
            if(check==0){
              res.render('home2',{n:name1,x:0});
            }
            else if(check==1){
              res.render('home2_faculty',{n:name,x:0});
            }
            else{
              res.render('home2_qm',{n:name,x:0});
            }
            db.close();
            res.end();
          });
        }
        else{
          dbo.collection("profile").find(myquery).toArray(function(err, result) {
            res.render('Profile_edit',{details:result});
            db.close();
            res.end();
          });
        }
      });
    });
  }
  else{
    dbo.collection("profile").find(myquery).toArray(function(err, result) {
      res.render('Profile_edit',{details:result});
    });
  }
});


app.post('/query_send', function (req, res) {
  MongoClient.connect(url, function(err, db) {
    var dbo = db.db("mydb");
    var myquery = { UserName: name };
    if(check==0)
    {
      myquery = { UserName: name1 };
    }
    var sample1={};
    dbo.collection("profile").find(myquery).toArray(function(err, result) {
      if(result[0]!=null){
        sample1={ FirstName:result[0].FirstName };
      }
    });
    dbo.collection("queries").find(myquery).toArray(function(err, result) {
      var change
      if(result[0]!=null){
        change = result[0].Message+'$'+req.body.querymessage;
        var newvalues = {};
        if(result[0].Flag==false){
          newvalues = { $set: {Message: change,Flag: true } };
        }
        else{
          newvalues = { $set: {Message: change } };
        }
        dbo.collection("queries").updateOne(myquery, newvalues, function(err, rest) {
          console.log("1 document inserted");
        });
        var s = change;
        var c = 0;
        for(var i=0;i<s.length;i++){
          if(s.charAt(i)=='$' || s.charAt(i)=='^'){
            c=c+1;
          }
        }
        var arr = new Array(c);
        var j = -1;
        for(var i=0;i<c;i++){
          arr[i]=''
        }
        var k="";
        for(var i=0;i<s.length;i++){
          if(s.charAt(i)=='$' || s.charAt(i)=='^'){
            var arr1 = {}
            if(s.charAt(i)=='$'){
              arr1={UserName:myquery.UserName,Message:""}
            }
            else{
              arr1={UserName:"QUERY MANAGER",Message:""}
            }
            j=j+1
            arr[j]=arr1
            k=""
            continue
          }
          k=k+s.charAt(i)
          arr[j].Message=k
        }
        res.render('queries_student',{Query:arr, len:arr.length});
        db.close();
        res.end();
      }
      else{ 
        var sample={ UserName:myquery.UserName, Message:"", FirstName:sample1.FirstName,Flag:false }
        console.log();
        dbo.collection("queries").insertOne(sample, function(err, rest) {
          console.log("1 document inserted");
        });
        res.render('queries_student',{len:0});
        db.close();
        res.end();
      }
        
      });
      var w = 0;
      for(var i=0;i<1000;i++){
        for(var j=0;j<1000;j++){}
      }
    });
  })

  app.post('/query_send1', function (req, res) {
    MongoClient.connect(url, function(err, db) {
      var dbo = db.db("mydb");
      var myquery = { UserName: name };
      if(check==0)
      {
        myquery = { UserName: name1 };
      }
      var sample1={};
      dbo.collection("profile").find(myquery).toArray(function(err, result) {
        if(result[0]!=null){
          sample1={ FirstName:result[0].FirstName };
        }
      });
      dbo.collection("queries").find(myquery).toArray(function(err, result) {
        if(result[0]!=null){
          var s = result[0].Message;
          var c = 0;
          for(var i=0;i<s.length;i++){
            if(s.charAt(i)=='$' || s.charAt(i)=='^'){
              c=c+1;
            }
          }
          var arr = new Array(c);
          var j = -1;
          for(var i=0;i<c;i++){
            arr[i]=''
          }
          var k="";
          for(var i=0;i<s.length;i++){
            if(s.charAt(i)=='$' || s.charAt(i)=='^'){
              var arr1 = {}
              if(s.charAt(i)=='$'){
                arr1={UserName:myquery.UserName,Message:""}
              }
              else{
                arr1={UserName:"QUERY MANAGER",Message:""}
              }
              j=j+1
              arr[j]=arr1
              k=""
              continue
            }
            k=k+s.charAt(i)
            arr[j].Message=k
          }
          res.render('queries_student',{Query:arr, len:arr.length});
          db.close();
          res.end();
        }
        else{ 
          var sample={ UserName:myquery.UserName, Message:"", FirstName:sample1.FirstName,Flag:false }
          console.log();
          dbo.collection("queries").insertOne(sample, function(err, rest) {
            console.log("1 document inserted");
          });
          res.render('queries_student',{len:0});
          db.close();
          res.end();
        }
          
        });
        var w = 0;
        for(var i=0;i<1000;i++){
          for(var j=0;j<1000;j++){}
        }
      });
    })

    app.post('/Leaves_applied_past_s', function (req, res) {
      MongoClient.connect(url, function(err, db) {
        var dbo = db.db("mydb");
        var myquery = { UserName: name1 };
        dbo.collection("apleave").find(myquery).toArray(function(err, result) {
          res.render('Leaves_applied_past_s',{len:result.length,leaves:result});
          db.close();
          res.end();
        });
      });
    });
    
    app.post('/Leaves_applied_present_s', function (req, res) {
      MongoClient.connect(url, function(err, db) {
        var dbo = db.db("mydb");
        var myquery = { UserName: name1 };
        dbo.collection("leave").find(myquery).toArray(function(err, result) {
          res.render('Leaves_applied_present_s',{len:result.length,leaves:result});
          db.close();
          res.end();
        });
      });
    });
    
    app.post('/Leaves_applied_present_s1', function (req, res) {
      MongoClient.connect(url, function(err, db) {
        var dbo = db.db("mydb");
        var myquery = { UserName: name1 };
        if(req.body.LeaveType=='OD'){
          var myobj = { UserName: req.body.UserName, LeaveType: req.body.LeaveType , FromDate: req.body.FromDate, FromTime: req.body.FromTime, ToDate: req.body.ToDate, ToTime: req.body.ToTime, Faculty: req.body.Faculty, EventType: req.body.EventType, ParticipationType: req.body.ParticipationType, Award: req.body.Award };
          dbo.collection("leave").deleteOne(myobj, function(err, obj) {
            console.log("1 document deleted");
            dbo.collection("leave").find(myquery).toArray(function(err, val) {
              res.render('Leaves_applied_present_s',{len:val.length,leaves:val});
              db.close();
              res.end();
            });
          });
        }
        else if(req.body.LeaveType=='OL'){
          var myobj = { UserName: req.body.UserName, LeaveType: req.body.LeaveType , FromDate: req.body.FromDate, FromTime: req.body.FromTime, ToDate: req.body.ToDate, ToTime: req.body.ToTime, Faculty: req.body.Faculty, Reason: req.body.Reason };
          dbo.collection("leave").deleteOne(myobj, function(err, obj) {
            console.log("1 document deleted");
            dbo.collection("leave").find(myquery).toArray(function(err, val) {
              res.render('Leaves_applied_present_s',{len:val.length,leaves:val});
              db.close();
              res.end();
            });
          });
        }
        else if(req.body.LeaveType=='ML'){
          var myobj = { UserName: req.body.UserName, LeaveType: req.body.LeaveType , FromDate: req.body.FromDate, FromTime: req.body.FromTime, ToDate: req.body.ToDate, ToTime: req.body.ToTime, Faculty: req.body.Faculty, Type: req.body.Type, TreatmentDetails: req.body.TreatmentDetails };
          dbo.collection("leave").deleteOne(myobj, function(err, obj) {
            console.log("1 document deleted");
            dbo.collection("leave").find(myquery).toArray(function(err, val) {
              res.render('Leaves_applied_present_s',{len:val.length,leaves:val});
              db.close();
              res.end();
            });
          });
        }
      });
    });

app.post('/querieslist', function (req, res) {
  MongoClient.connect(url, function(err, db) {
    var dbo = db.db("mydb");
    var myquery = { Flag: true };
    dbo.collection("queries").find(myquery).toArray(function(err, result) {
      res.render('queries_new_qm',{len:result.length,suser1:result});
    });
  });
});

app.post('/Queries_new_qm', function (req, res) {
  var myquery = { UserName: req.body.UserName };
  MongoClient.connect(url, function(err, db) {
    var dbo = db.db("mydb");
    var sample1={};
    dbo.collection("profile").find(myquery).toArray(function(err, result) {
      if(result[0]!=null){
        sample1={ FirstName:result[0].FirstName };
      }
    });
    dbo.collection("queries").find(myquery).toArray(function(err, result) {
      var change
      if(result[0]!=null){
        change = result[0].Message+'^'+req.body.querymessage;
        var newvalues = {};
        if(result[0].Flag==true){
          newvalues = { $set: {Message: change,Flag: false } };
        }
        else{
          newvalues = { $set: {Message: change } };
        }
        dbo.collection("queries").updateOne(myquery, newvalues, function(err, rest) {
          console.log("1 document inserted");
        });
        var s = change;
        var c = 0;
        for(var i=0;i<s.length;i++){
          if(s.charAt(i)=='$' || s.charAt(i)=='^'){
            c=c+1;
          }
        }
        var arr = new Array(c);
        var j = -1;
        for(var i=0;i<c;i++){
          arr[i]=''
        }
        var k="";
        for(var i=0;i<s.length;i++){
          if(s.charAt(i)=='$' || s.charAt(i)=='^'){
            var arr1 = {}
            if(s.charAt(i)=='$'){
              arr1={UserName:myquery.UserName,Message:""}
            }
            else{
              arr1={UserName:"QUERY MANAGER",Message:""}
            }
            j=j+1
            arr[j]=arr1
            k=""
            continue
          }
          k=k+s.charAt(i)
          arr[j].Message=k
        }
        res.render('queriesqm',{Query:arr, len:arr.length,UserName:myquery.UserName});
        db.close();
        res.end();
      }
      else{ 
        var sample={ UserName:myquery.UserName, Message:"", FirstName:sample1.FirstName,Flag:false }
        console.log();
        dbo.collection("queries").insertOne(sample, function(err, rest) {
          console.log("1 document inserted");
        });
        res.render('queriesqm',{len:0,UserName:myquery.UserName});
        db.close();
        res.end();
      }
        
      });
      var w = 0;
      for(var i=0;i<1000;i++){
        for(var j=0;j<1000;j++){}
      }
    });

});

app.post('/Queries_new_qm1', function (req, res) {
  var myquery = { UserName: req.body.UserName };
  MongoClient.connect(url, function(err, db) {
    var dbo = db.db("mydb");
    var newvalues = {};
    dbo.collection("queries").find(myquery).toArray(function(err, result) {
      if(result[0].Flag==true){
        newvalues = { $set: {Flag: false } };
      }
      dbo.collection("queries").updateOne(myquery, newvalues, function(err, rest) {
        console.log("1 document inserted");
      });
    });
    var sample1={};
    dbo.collection("profile").find(myquery).toArray(function(err, result) {
      if(result[0]!=null){
        sample1={ FirstName:result[0].FirstName };
      }
    });
    dbo.collection("queries").find(myquery).toArray(function(err, result) {
      if(result[0]!=null){
        var s = result[0].Message;
        var c = 0;
        for(var i=0;i<s.length;i++){
          if(s.charAt(i)=='$' || s.charAt(i)=='^'){
            c=c+1;
          }
        }
        var arr = new Array(c);
        var j = -1;
        for(var i=0;i<c;i++){
          arr[i]=''
        }
        var k="";
        for(var i=0;i<s.length;i++){
          if(s.charAt(i)=='$' || s.charAt(i)=='^'){
            var arr1 = {}
            if(s.charAt(i)=='$'){
              arr1={UserName:myquery.UserName,Message:""}
            }
            else{
              arr1={UserName:"QUERY MANAGER",Message:""}
            }
            j=j+1
            arr[j]=arr1
            k=""
            continue
          }
          k=k+s.charAt(i)
          arr[j].Message=k
        }
        res.render('queriesqm',{Query:arr, len:arr.length,UserName:myquery.UserName});
        db.close();
        res.end();
      }
      else{ 
        var sample={ UserName:myquery.UserName, Message:"", FirstName:sample1.FirstName,Flag:false }
        console.log();
        dbo.collection("queries").insertOne(sample, function(err, rest) {
          console.log("1 document inserted");
        });
        res.render('queriesqm',{len:0,UserName:myquery.UserName});
        db.close();
        res.end();
      }
        
      });
      var w = 0;
      for(var i=0;i<1000;i++){
        for(var j=0;j<1000;j++){}
      }
    });

});

var server = app.listen(8081, function () {});