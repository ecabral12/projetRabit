const express = require("express");
//const cors = require("cors");
const app = express();
const { sendMessage, consumeMessages } = require('./routes/messages.js'); // Import your messaging functions

//app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the application backend." });
});

const messagesRoutes = require('./routes/messages.js');

app.use("/api/messages",messagesRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

