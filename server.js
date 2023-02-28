//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require("mongoose");

var homeStartingContent = "Welcome to my daily blog, where I share my thoughts, experiences, and insights on a wide range of topics that matter to me and hopefully to you too. Whether you're here to learn something new, gain a fresh perspective, or simply enjoy some good writing, you've come to the right place. As someone who is passionate about staying informed and engaged with the world around me, I believe that daily reflection and exploration are essential to personal growth and well-being. That's why I started this blog - to create a space where I can share my ideas and connect with others who share similar interests. On this website, you'll find a diverse range of content spanning a variety of topics such as travel, food, lifestyle, self-improvement, and more. I believe that life is about balance, and so I strive to provide a mix of light-hearted and informative pieces that can appeal to readers of all ages and backgrounds. Through my daily blog, I hope to inspire you to embrace new experiences, challenge your assumptions, and seek out meaningful connections with others. Whether you're looking for practical tips, thought-provoking insights, or just a good story to read, I invite you to join me on this journey of discovery and growth. So, take a look around, explore the different categories, and don't forget to leave a comment or two. I'm excited to hear your thoughts and ideas, and I can't wait to see where this journey takes us!";

const aboutContent = "Welcome to my About page! My name is Soumya Agrawal, and I am the creator and author of this daily blog. I've always had a passion for writing, storytelling, and sharing my thoughts and experiences with others. Over the years, I've pursued a career in journalism, worked as a freelance writer and editor, and even dabbled in fiction writing. However, it wasn't until I started this blog that I truly found my voice and my purpose. Through daily writing and reflection, I've been able to explore a wide range of topics that interest me, challenge my own assumptions, and connect with readers from all around the world. My goal with this blog is to create a space where I can share my ideas and insights on a variety of topics that matter to me and hopefully to you too. From travel and food to personal development and current events, I believe that there is always something new to learn and discover. In addition to my passion for writing, I'm also an avid traveler, foodie, and lifelong learner. I love exploring new places, trying new foods, and meeting new people. I believe that these experiences are what make life rich and fulfilling, and I hope to inspire others to seek out their own adventures and discoveries. I'm so grateful to have the opportunity to share my daily musings with you, and I'm excited to see where this journey takes us. Whether you're a long-time reader or a new visitor, I invite you to join me on this journey of self-discovery and growth. Thank you for stopping by!";

const contactContent = "Email: somya2002agrawal@gmail.com";

const app = express();

app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').__express);
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-soumya:admin123@cluster0.bfjryer.mongodb.net/blogDB", {useNewUrlParser:true});

const blogSchema = {
  title: String,
  content: String
};

const Blog = mongoose.model("Blog", blogSchema);

app.get("/", async function(req, res){
  await Blog.find()
    .then((blogs) => {
      res.render("home", {content: homeStartingContent, posts:blogs});
    })
    .catch((err) => {
      console.log(err)
    });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", async (req, res) => {
  let newTitle = req.body.postTitle;
  let newBody = req.body.postContent;
  
  const newPost = new Blog({
    title: newTitle,
    content: newBody
  });
  
  await newPost.save();
  res.redirect("/");
});

app.get("/posts/:blogID", async function(req,res){
  await Blog.findOne({_id: req.params.blogID})
  .then((blog) => {
    res.render("post", {
      title: blog.title,
      content: blog.content
    });
  }) 
  .catch((err) => {
    console.log(err);
  })
});

app.get("/about", (req, res) => {
  res.render("about", {content: aboutContent});
});

app.get("/contact", (req, res) => {
  res.render("contact", {content: contactContent});
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});