var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');

app.use(bodyParser.json({ type: 'application/json' }))

var con = mysql.createConnection({
    host: "db4free.net",
    user: "rootuuu",
    password: "passw0rd",
    database: "movieee"
});


// var con = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "movieee"
// });

con.connect();

var sql = "CREATE TABLE IF NOT EXISTS users (username VARCHAR(255), password VARCHAR(255), email VARCHAR(255), name VARCHAR(255), likedMovie VARCHAR(255), dislikedMovie VARCHAR(255))";
con.query(sql, function (err, result) {
  if (err) throw err;
  console.log("DB setup completed!");
});

app.get('/main', function (req, res) {
  // console.log(req.query.username);
  //  res.session.email = "myemail"
   res.sendfile('./public/html/main.html');
})

app.get('/signup', function (req, res) {
   res.sendfile('./public/html/signup.html');
})

app.get('/login', function (req, res) {
   res.sendfile('./public/html/login.html');
})

app.get('/public/js/app.js', function (req, res) {
   res.sendfile('./public/js/app.js');
})


app.post('/logindb', function (req, res) {
  password = req.body.password;
  email = req.body.email;

  sqlQuery = "SELECT username FROM users WHERE email = '" + email + "' AND password = '" + password + "'";
  con.query(sqlQuery, function(err,result) {
    
   if (err) {
    console.log("error ocurred",err);
    res.send({
      "code":400,
      "failed":"error ocurred"
    })
    }else{
      console.log('The solution is: ', result.length);
      if(result.length==1){
        res.send({
          "code":200,
          "username":result[0]["username"]
            });
      }
      else{
       res.send({
          "code":401,
          "username":"invalid user"
            }); 
      }
    }

  });

})

app.post('/signupdb', function (req, res) {
  username = req.body.username;
  password = req.body.password;
  email = req.body.email;
  namee = req.body.namee;

  sqlQuery = "INSERT INTO users(username,email,password,name,likedMovie,dislikedMovie) value ('" + username + "','" + email + "','" + password +"','" + namee + "','','')";
  con.query(sqlQuery, function (err, result) {
   
     if (err) {
      console.log("error ocurred",err);
      res.send({
        "code":400,
        "failed":"error ocurred"
      })
    }else{
      console.log('The solution is: ', result);
      res.send({
        "code":200,
        "success":"user registered sucessfully"
          });
    }

    });
  })


app.get('/userdetails', function (req, res) {
  username = req.query.username;
  // console.log(username)
  sqlQuery =" SELECT * FROM users WHERE username='" + username + "'";
  con.query(sqlQuery, function (err, result) {
      result = result[0]
      var username = result["username"]
      var email = result["email"]
      var likedMovieCount = result["likedMovie"].split(" ").length-1;
      var dislikedMovieCount = result["dislikedMovie"].split(" ").length-1;
      res.send({
        "username" : username,
        "email" : email,
       "likedMovieCount":likedMovieCount,
       "dislikedMovieCount":dislikedMovieCount
      });
  })  
})


app.get('/getPref', function (req, res) {
  username = req.query.username;
  // console.log(username)
  sqlQuery =" SELECT likedMovie,dislikedMovie FROM users WHERE username='" + username + "'";
  con.query(sqlQuery, function (err, result) {
      var likedMovie=(result[0]["likedMovie"])
      var dislikedMovie=(result[0]["dislikedMovie"])
      res.send({
       "likedMovie":likedMovie,
       "dislikedMovie":dislikedMovie
      });
  })  
})


app.post('/likeDislikeOperation', function (req, res) {
// console.log(req.body)
  var id = req.body.id;
  var addORremove = req.body.addORremove;
  var op = req.body.op;
  var username = req.body.user;

  sqlQuery ="SELECT likedMovie,dislikedMovie FROM users WHERE username='" + username + "'";
  con.query(sqlQuery, function (err, result) {

      var likedMovie=(result[0]["likedMovie"])
      var dislikedMovie=(result[0]["dislikedMovie"])
      
      if(op=="like" && addORremove=="add"){
          likedMovie += " " + id
          if(dislikedMovie!=null){
            if(dislikedMovie.indexOf(id)!=-1){
              dislikedMovie = dislikedMovie.replace(" "+id,"");

            }
          }
      }else if(op=="dislike" && addORremove=="add"){
          dislikedMovie += " " + id
          if(likedMovie!=null){
            if(likedMovie.indexOf(id)!=-1){
              likedMovie = likedMovie.replace(" "+id,"");
            }
          }
      }else if(op=="like"){
        if(likedMovie!=null){
            if(likedMovie.indexOf(id)!=-1){
              likedMovie = likedMovie.replace(" "+id,"");
            }
          }
      }else{
        if(dislikedMovie!=null){
            if(dislikedMovie.indexOf(id)!=-1){
              dislikedMovie = dislikedMovie.replace(" "+id,"");
            }
          }
      }
// likedMovie = "";
// dislikedMovie = "";
      sqlQuery = "UPDATE users SET likedMovie = '" + likedMovie+"',dislikedMovie = '" + dislikedMovie + "' WHERE username='" + username + "'";
      // console.log(sqlQuery)
      resp = "success"
      con.query(sqlQuery, function (err, result) {
        if (err)
          resp = "failed"
        else
          console.log("values inserted");
        res.write(resp);
        res.end();
      })
    })
})

app.listen(8081);