const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const posts = {};

// Function to handle different event types
const handleEvents = (type, data) => {
  try {
    if (type === "PostCreated") {
      const { id, title } = data;

      posts[id] = {
        id,
        title,
        comments: [],
      };
    } else if (type === "CommentCreated") {
      const { id, content, postId, status } = data;
      const post = posts[postId];

      if (post) {
        post.comments.push({ id, content, status });
      } else {
        console.warn(`Post with ID ${postId} not found for CommentCreated event`);
      }
    } else if (type === "CommentUpdated") {
      const { id, content, postId, status } = data;
      const post = posts[postId];

      if (post) {
        const comment = post.comments.find((comment) => comment.id === id);
        if (comment) {
          comment.status = status;
          comment.content = content;
        } else {
          console.warn(`Comment with ID ${id} not found for CommentUpdated event`);
        }
      } else {
        console.warn(`Post with ID ${postId} not found for CommentUpdated event`);
      }
    }
  } catch (err) {
    console.error(`Error handling event type "${type}":`, err.message);
  }
};

// Endpoint to retrieve all posts
app.get("/posts", (req, res) => {
  res.send(posts);
});

// Endpoint to process new events
app.post("/events", (req, res) => {
  try {
    const { type, data } = req.body;
    handleEvents(type, data);
    console.log("Query service Post and comment data:", posts);
    res.status(200).send({});
  } catch (err) {
    console.error("Error processing event:", err.message);
    res.status(500).send({ error: "Error processing event" });
  }
});

// Start the service and process historical events
app.listen(4002, async () => {
  try {
    console.log('1')
    const res = await axios.get("http://localhost:4005/events");
    console.log('1')

    const events = res.data;
    console.log('1')


    for (const event of events) {
      console.log("Processing older event:", event.type);
      handleEvents(event.type, event.data);
    }
  } catch (err) {
    console.error("Error fetching historical events:", err.message);
  }
  console.log("Listening on 4002 query service...");
});
