//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model('Article', articleSchema);

app.route('/articles')
  .get((req, res) => {
    Article.find((err, results) => {
      // console.log(results);
      if (!err) {
        res.send(results);
      } else {
        res.send(err);
      }
    });
  })
  .post((req, res) => {
    const t = req.body.title;
    const c = req.body.content;
    const art = new Article({
      title: t,
      content: c
    });
    art.save((err) => {
      if (!err) {
        res.send("200 OK");
      } else {
        res.send(err);
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (!err) {
        res.send("200 OK");
      } else {
        res.send(err);
      }
    });
  });


app.route('/articles/:articlename')
  .get((req, res) => {
    Article.findOne(
      { title: req.params.articlename },
      (err, results) => {
        // console.log(results);
        if (results) {
          res.send(results);
        } else {
          res.send("no doc with the name");
        }
      });
  })
  .put((req, res) => {
    const t = req.body.title;
    const c = req.body.content;
    console.log(t);
    Article.update(
      { title: req.params.articlename },
      {
        title: t,
        content: c
      },
      { overwrite: true },
      (err) => {
        if (!err) {
          res.send("200 OK");
        } else {
          res.send(err);
        }
      });
  })
  .patch((req, res) => {
    Article.update(
      { title: req.params.articlename },
      { $set: req.body },
      (err) => {
        if (!err) {
          res.send("200 OK");
        } else {
          res.send(err);
        }
      });
  })
  .delete((req, res) => {
    Article.findOneAndDelete(
      { title: req.params.articlename },
      (err) => {
        if (!err) {
          res.send("200 OK");
        } else {
          res.send(err);
        }
      });
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
