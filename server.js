const express = require('express');

// Import the data file
const Data = require('./data/db')
let nextId = 10;

const server = express();

server.use(express.json());

// Create a post
server.post('/api/posts', (req, res) => {
  const newPost = req.body;
  newPost.id = nextId++;

  if (!newPost) {
    res.status(400).json({ message: "Please provide title and comments for the post." })
  } else {
      Data.insert(newPost)
      .then(post => {
        res.status(201).json(post)
      })
      .catch(error => {
        res.status(500).json({ error: "There was an error while saving the post to the database" })
      });
}});

// Create a comment FOR the post
server.post('/api/posts/:id/comments', (req, res) => {
  const newComment = req.body;
  const id = req.params.id;

  Data.insert(newComment)
    .then(comment => {
      res.status(201).json(comment)
    })
    .catch(error => {
      res.status(500).json({ error: "There was an error while saving the post to the database" })
    });
});

// Get all posts
server.get('/api/posts', (req, res) => {
  Data.find()
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(error => {
      res.status(500).json({ message: "Error getting the list of posts" })
    })
});

// Get a SPECIFIC post with (:id)
server.get('/api/posts/:id', (req, res) => {
  const id = req.params.id;

  Data.findById(id)
    .then(post => {
      res.status(200).json(post)
    })
    .catch(error => {
      res.status(500).json({ message: "Error getting this post" })
    });
});

// Get all comments
server.get('api/posts/:id/comments', (req, res) => {
  const postId = req.params.id;

  Data.findPostComments(postId)
    .then(comments => {
      res.status(200).json(comments)
    })
    .catch(error => {
      console.log(error);
    });
});

// Remove a SPECIFIC post
server.delete('api/posts/:id', (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.status(404).json({ message: "The post with the specified ID does not exist."})
  }

  Data.remove(id)
    .then(post => {
      res.status(200).json(post)
    })
    .catch(error => {
      res.status(500).json({ message: "Error deleting this post" })
    });
});

// Update a SPECIFIC post
server.put('api/posts/:id', (req, res) => {
  const id = req.params.id;

  Data.update(id, post)
    .then(post => {
      res.status(200).json(post)
    })
    .catch(error => {
      res.status(500).json({ message: "Error deleting this post" })
    });
});

module.exports = server;