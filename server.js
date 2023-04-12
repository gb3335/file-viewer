const express = require('express');
const cors = require("cors");
const jwt = require('jsonwebtoken');
const fs = require('fs');

const app = express();
var corsOptions = {
    origin: "http://localhost:3000"
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;

const db = require("./models");
const User = db.user;
db.sequelize.sync({force: true}).then(() => {
    console.log('Drop and Resync Db');
    initial();
});

function initial() {
    User.create({
        username: "user1",
        file: "user_1.pdf",
        password: "password1"
    });
   
    User.create({
        username: "user2",
        file: "user_2.pdf",
        password: "password2"
    });
}

// Secret key for JWT
const secretKey = 'mySecretKey';

// Function for checking user credentials
const checkUserCredentials = (username, password) => {
    // check if the user exists in the database using sequelize
    let user = User.findOne({where: {username: username, password: password}});
    if(user){
        return true;
    }else{
        return false;
    }
};

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to file-viewer app" });
});

// Endpoint for generating JWTs
app.post('/auth', (req, res) => {
  // Get user credentials from the request body
  const { username, password } = req.body;

  // Check if the user is authorized to access the requested PDF file
  // You can implement your own logic for this check
  const isAuthorized = checkUserCredentials(username, password);

  if (!isAuthorized) {
    return res.status(401).send('Unauthorized');
  }

  // Generate JWT
  const payload = { username: username, pdfName: 'user_1.pdf' };
  const options = { expiresIn: '1h' };
  const token = jwt.sign(payload, secretKey, options);

  // Return the JWT to the user
  res.send({ token });
});


// Endpoint for serving PDF files
app.get('/pdf', (req, res) => {
  // Get JWT from the request header
  const token = req.headers.authorization.split(' ')[1];

  // Verify JWT
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).send('Unauthorized');
    }

    // Read the corresponding PDF file from the server's file system
    const pdfName = decoded.pdfName;
    const filePath = `./pdfs/${pdfName}`;

    fs.readFile(filePath, (err, data) => {
      if (err) {
        return res.status(404).send('File not found');
      }

      // Send the PDF file to the user
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${pdfName}`);
      res.send(data);
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
