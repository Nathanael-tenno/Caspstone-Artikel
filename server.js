const express = require("express");
const app = express();
const jwt = require('jsonwebtoken');
const axios = require('axios');
const multer = require("multer");
const admin = require('firebase-admin');
const { Firestore } = require("@google-cloud/firestore");



const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'capstone-389205.appspot.com' // Firebase Storage bucket URL
});

app.use(express.json()); // Parse JSON bodies

// Set up multer storage configuration
const storage = multer.memoryStorage(); // Store file in memory

//storage configuration
const upload = multer({ storage: storage });

// Endpoint untuk mengambil Articles berdasarkan ID
app.get('/articles', (req, res) => {
  // Mengakses Firestore dan mengambil semua Articles
  admin.firestore().collection('articles').get()
    .then((snapshot) => {
      if (snapshot.empty) {
        // Jika tidak ada Articles yang ditemukan
        res.status(404).json({ error: 'Tidak ada artikel yang ditemukan' });
      } else {
        const articles = [];
        snapshot.forEach((doc) => {
          const articleData = doc.data();
          const articleId = doc.id;
          const articleLink = articleData.link;
          const articleTitle = articleData.title;
          const articleGambar = articleData.Gambar;
          const articleTag = articleData.Tag;

          articles.push({
            id: articleId,
            title: articleTitle,
            link: articleLink,
            Gambar: articleGambar,
            Tag: articleTag
          });
        });

        // Mengirim semua Articles sebagai respons
        res.json(articles);
      }
    })
    .catch((error) => {
      // Jika terjadi kesalahan saat mengambil Articles
      res.status(500).json({ error: 'Terjadi kesalahan saat mengambil artikel' });
    });
});


app.listen(8000, () => {
  console.log(`Server running on port 8000`);
});
