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
var otp = 0;
var otp1 = "";
var mailid = "";
var i = 0;
var count = 0;
var check = 0;
var str = "CB.EN.U4";


/*app.post('/SignUp', urlencodedParser, function (req, res) {
if(req.body.password==req.body.confirmpassword)
{    
 MongoClient.connect(url, function(err, db) {
   //if (err) throw err;
   var dbo = db.db("mydb");
   var query = { UserName: req.body.username };
   var myobj = { UserName: req.body.username, MailID: req.body.email, Password: req.body.password };
   var myobj1 = {UserName: req.body.username, MailID: req.body.email, Phone: '', FirstName: '', LastName: '', Address: '', City: '', State: '', Country: '', Bio: '', PostalCode: '' }
   dbo.collection("users").find(query).toArray(function(err, result) {
     //console.log(result[0]);
     if(result[0]==null){ 
       dbo.collection("users").insertOne(myobj, function(err, rest) {
         console.log("1 document inserted");
         //res.render('SignUpIn',{n:1});
         //db.close();
         //res.end();
       });
       dbo.collection("profile").insertOne(myobj1, function(err, rest) {
        //console.log("1 document inserted");
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
});*/

app.post('/SignUp', urlencodedParser, function (req, res) {
  if(req.body.password==req.body.confirmpassword){
    MongoClient.connect(url, function(err, db) {
      var dbo = db.db("mydb");
      var query = { UserName: req.body.username, Password: req.body.password };
      var myquery = { UserName: req.body.username, Password: req.body.password };
      var newvalues = { $set: {MailID: req.body.email, Count:0} };
      var myobj = { UserName: req.body.username };
      var myobj1 ={};
      dbo.collection("users").find(myobj).toArray(function(err, val) {
        myobj1 = {UserName: req.body.username, MailID: req.body.email, FirstName: '', LastName: '', Phone: '', Address: '', HealthBio: '',Department: val[0].Department, Section:val[0].Section, Adviser:val[0].Adviser }
      });
      //var myobj1 = {UserName: req.body.username, MailID: req.body.email, FirstName: '', LastName: '', Phone: '', Address: '', HealthBio: '' }
      dbo.collection("users").find(query).toArray(function(err, result) {
        if(result[0]==null){
          res.render('SignUpIn',{n:4});
          db.close();
          res.end();
        }
        else{
          dbo.collection("users").updateOne(myquery, newvalues, function(err, rest) {
            console.log("1 document updated");
            //res.render('SignUpIn',{n:1});
            //db.close();
            //res.end();
          });
          dbo.collection("profile").find(myobj).toArray(function(err, val) {
            if(val[0]==null){
              dbo.collection("profile").insertOne(myobj1, function(err, rest) {
                res.render('SignUpIn',{n:1});
                db.close();
                res.end();
              });
            }
            else{
              res.render('SignUpIn',{n:1});
                db.close();
                res.end();
            }
          });
          //dbo.collection("profile").insertOne(myobj1, function(err, rest) {
            //res.render('SignUpIn',{n:1});
            //db.close();
            //res.end();
          //});
        }
      });
    });
  }
  else{
    res.render('SignUpIn',{n:4});
    res.end();
  }
});

app.post('/SignIn', urlencodedParser, function (req, res) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    name = req.body.username1
    name.toUpperCase;
    for(i=0;i<Math.min(name.length,str.length);i++){
      if(name.charAt(i).toUpperCase == str.charAt(i).toUpperCase){
        count = count + 1;
      }
    }
    console.log(count);
    if(count == 8){
      check = 0;
      count = 0;
    }
    else{
      if(name=="QUERY MANAGER"){
        check=2;
      }
      else{
        check = 1;
      }
      count = 0;
    }
    var query = { UserName: req.body.username1, Password: req.body.password1 };
    //var myquery = { UserName: req.body.username1 };
    //var newvalues = { $set: {Count: req.body.password } };
    dbo.collection("users").find(query).toArray(function(err, result) {
      //if (err) throw err;
      //console.log(result);
      if(result[0]!=null && result[0].Count<5 && check==0)
      {
        //var myquery = { UserName: req.body.username1 }
        //var newvalues = { $set: {Count: '0' } };
        //dbo.collection("users").updateOne(myquery, newvalues, function(err, val) {});
        res.render('home2',{n:req.body.username1,x:0});
        db.close();
      }
      else if(result[0]!=null && result[0].Count<5 && check==1){
        res.render('home2_faculty',{n:req.body.username1,x:0});
        db.close();
      }
      else if(result[0]!=null && result[0].Count<5 && check==2){
        res.render('home2_qm',{n:req.body.username1,x:0});
        db.close();
      }
      else
      { 
        var check1=1;
        var myquery = { UserName: req.body.username1 }
        dbo.collection("users").find(myquery).toArray(function(err, rest) {
          check1=check1+rest[0].Count;
          if(rest[0].Count<5){
            var newvalues = { $set: {Count: check1 } };
            dbo.collection("users").updateOne(myquery, newvalues, function(err, val) {
              console.log("Count Updated");
              res.render('SignUpIn',{n:3,count:check1});
            });
          }
        });
        //res.render('SignUpIn',{n:3});
      }
      //db.close();
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
    //if (err) throw err;
    var dbo = db.db("mydb");
    var myobj = { Name: name, LeaveType: "OD", FromDate: req.body.FromDate, FromTime: req.body.FromTime, ToDate: req.body.ToDate, ToTime: req.body.ToTime,Faculty: req.body.faculty, EventType: req.body.EventType, ParticipationType: req.body.ParticipationType, Award: req.body.Award };
    dbo.collection("leave").insertOne(myobj, function(err, rest) {
      console.log("1 document inserted");
      res.render('home2',{n:name,x:1});
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
    //if (err) throw err;
    var dbo = db.db("mydb");
    var myobj = { Name: name, LeaveType:"OL", FromDate: req.body.FromDate, FromTime: req.body.FromTime, ToDate: req.body.ToDate, ToTime: req.body.ToTime,Faculty: req.body.faculty, Reason: req.body.Reason };
    dbo.collection("leave").insertOne(myobj, function(err, rest) {
      console.log("1 document inserted");
      res.render('home2',{n:name,x:1});
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
    //if (err) throw err;
    var dbo = db.db("mydb");
    var myobj = { Name: name, LeaveType:"ML", FromDate: req.body.FromDate, FromTime: req.body.FromTime, ToDate: req.body.ToDate, ToTime: req.body.ToTime,Faculty: req.body.faculty, Type: req.body.Type, TreatmentDetails: req.body.TreatmentDetails };
    dbo.collection("leave").insertOne(myobj, function(err, rest) {
      console.log("1 document inserted");
      //res.render('home2',{n:name,x:1});
      //db.close();
      //res.end();
    });
    var file = {Name: name, File: binary(req.files.myFile.data)}
    dbo.collection("files").insertOne(file, function(err, rest) {
      res.render('home2',{n:name,x:1});
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
        res.render('SignUpIn',{n:6});
      }
      //db.close();
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
        res.render('SignUpIn',{n:5});
        res.end();
      });
    });
  }
  else
  {
    res.render('SignUpIn',{n:7});
  }
})

app.post('/Leaves_applied', function (req, res) {
  MongoClient.connect(url, function(err, db) {
    var dbo = db.db("mydb");
    var myquery = { Faculty: name };
    dbo.collection("leave").find(myquery).toArray(function(err, result) {
      //console.log(result[0]._id);
      res.render('leaves_applied',{len:result.length,leaves:result})
      //console.log("length of data:"+result.length);
    });
  });
})

app.post('/Leaves_approve', function (req, res) {
  MongoClient.connect(url, function(err, db) {
    var dbo = db.db("mydb");
    var myquery = { Faculty: name };
    var myobj = { Name: req.body.Name, FromDate: req.body.FromDate, FromTime: req.body.FromTime, ToDate: req.body.ToDate, ToTime: req.body.ToTime, Faculty: name, EventType: req.body.EventType, ParticipationType: req.body.ParticipationType };
    dbo.collection("leave").find(myobj).toArray(function(err, result) {
      console.log(result[0]);
      console.log(myobj);
      var myobj1={ Name: result[0].Name, FromDate: result[0].FromDate, FromTime: result[0].FromTime, ToDate: result[0].ToDate, ToTime: result[0].ToTime, Faculty: result[0].Faculty, EventType: result[0].EventType, ParticipationType: result[0].ParticipationType, Award: result[0].Award }
      dbo.collection("apleave").insertOne(myobj1, function(err, rest) {
        //db.close();
        //res.end();
      });
    });
    dbo.collection("leave").deleteOne(myobj, function(err, obj) {
      //if (err) throw err;
      console.log("1 document deleted");
      dbo.collection("leave").find(myquery).toArray(function(err, val) {
        res.render('leaves_applied',{len:val.length,leaves:val});
        db.close();
        res.end();
      });
    });
  });
});

app.post('/Leaveshome', function (req, res) {
  res.render('home2',{n:name,x:0});
});

app.post('/profile', function (req, res) {
  MongoClient.connect(url, function(err, db) {
    var dbo = db.db("mydb");
    var query = { UserName: name };
    dbo.collection("profile").find(query).toArray(function(err, result) {
      res.render('Profile',{profile:result});
      db.close();
      res.end();
    });
  });
})

app.post('/profileChange', function (req, res) {
  res.render('Profile_edit');
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
    var newvalues = { $set: {  FirstName: req.body.firstname, LastName: req.body.lastname, Phone: req.body.phonenumber, Address: req.body.address, HealthBio: req.body.healthbio } };
    dbo.collection("profile").updateOne(myquery, newvalues, function(err, rest) {
      console.log("1 document updated");
      //db.close();
      //res.render('Profile');
      //res.end();
    });
    var query = { UserName: name };
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
      dbo.collection("users").find(myquery).toArray(function(err, result) {
        if(req.body.password==result[0].Password){
          var newvalues = { $set: {  Password: req.body.newpassword } };
          dbo.collection("users").updateOne(myquery, newvalues, function(err, rest) {
            console.log("1 document updated");
            res.render('home2',{n:name,x:0});
            db.close();
            res.end();
          });
        }
        else{
          res.render('Profile_edit');
          db.close();
          res.end();
        }
      });
    });
  }
  else{
    res.render('Profile_edit');
  }
});

/*app.post('/Querypage', function (req, res) {
  var arr =new Array(1);
  arr[0]=0;
  res.render('queries_student',{Query:arr, len:0});
});*/

app.post('/query_send', function (req, res) {
  MongoClient.connect(url, function(err, db) {
    var dbo = db.db("mydb");
    var myquery = { UserName: name };
    dbo.collection("queries").find(myquery).toArray(function(err, result) {
      if(result[0]!=null){
        var change = result[0].Message+'$'+req.body.querymessage;
        var newvalues = { $set: {Message: change } };
        dbo.collection("queries").updateOne(myquery, newvalues, function(err, rest) {
          console.log("1 document inserted");
        });
      }
      else{
        var myobj = { UserName: name, Message: req.body.querymessage };
        dbo.collection("queries").insertOne(myobj, function(err, rest) {
          dbo.collection("userquery").insertOne(myquery, function(err, rest) {
            console.log("1 document inserted");
          });
        });
      }
      var w = 0;
      for(var i=0;i<1000;i++){
        for(var j=0;j<1000;j++){}
      }
      dbo.collection("queries").find(myquery).toArray(function(err, result) {
        var s = result[0].Message;
        var c = 0;
        for(var i=0;i<s.length;i++){
          if(s.charAt(i)=='$'){
            c=c+1;
          }
        }
        c=c+1;
        var arr = new Array(c);
        var j = 0;
        for(var i=0;i<c;i++){
          arr[i]=''
        }
        for(var i=0;i<s.length;i++){
          if(s.charAt(i)=='$'){
            j=j+1
            continue
          }
          arr[j]=arr[j]+s.charAt(i)
        }
        res.render('queries_student',{Query:arr, len:arr.length});
        db.close();
        res.end();
      })
    
    });
    //var myobj = { UserName: name, Message: req.body.querymessage };
    //dbo.collection("queries").insertOne(myobj, function(err, rest) {
      //console.log("1 document inserted");
      //db.close();
      //res.end();
    //});
    //var myquery = { UserName: name };
    /*dbo.collection("queries").find(myquery).toArray(function(err, result) {
      console.log(result[0]);
      res.render('queries_student',{Query:result, len:result.length});
      db.close();
      res.end();
    })*/
  })
})

app.post('/Leaves_applied_past_s', function (req, res) {
  MongoClient.connect(url, function(err, db) {
    var dbo = db.db("mydb");
    var myquery = { UserName: name };
    dbo.collection("apleave").find(myquery).toArray(function(err, result) {
      res.render('Leaves_applied_past_s',{len:result.length});
      db.close();
      res.end();
    });
  });
});

app.post('/Leaves_applied_present_s', function (req, res) {
  MongoClient.connect(url, function(err, db) {
    var dbo = db.db("mydb");
    var myquery = { UserName: name };
    dbo.collection("leave").find(myquery).toArray(function(err, result) {
      res.render('Leaves_applied_present_s',{len:result.length});
      db.close();
      res.end();
    });
  });
});

var server = app.listen(8081, function () {});