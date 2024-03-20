const express = require("express");
const app = express();
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
let cors = require("cors");
app.use(cors());

const dbPath = path.join(__dirname, "user_db.db");

let db = null;
app.use(express.json());

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

//To check weather user exists or not

app.post("/CheckUser", async (request, response) => {
  const { username, password } = request.body;
  const query = `select * from user where username='${username}' and password='${password}';`;
  const row = await db.all(query);
  const length = row.length;
  if (length > 0) {
    response.send({ status: 200 });
  } else {
    response.send({ status: 404 });
  }
});

app.get("/user", async (request, response) => {
  const query = `select * from user`;
  const data = await db.all(query);
  response.send(data);
});

// ... (previous code) module.exports = app; // Export the Express app
