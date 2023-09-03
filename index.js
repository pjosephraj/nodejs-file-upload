const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

const PORT = 3001;

const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public/uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '_' + file.originalname);
  }
});
const upload = multer({storage});

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/health-check', (req, res) => {
  res.send('Health Check Successful');
});

app.get('/get-images', (req, res) => {
  const files = [];
  fs.readdirSync('./public/uploads').forEach(file => {
    files.unshift(`/uploads/${file}`);
  });
  res.json({
    files
  });
});

app.post('/upload', upload.single('image'), (req, res) => {
  res.json({
    message: 'File uploaded successfully',
    success: true
  });
}, (err, req, res) => {
  res.status(400).send({error: err.message});
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`App listening on Port: ${PORT}`);
});
