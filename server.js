const PORT = 3000;
const express = require('express');
const cors = require('cors');
const app = express();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Google Generative AI
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(cors());
app.use(express.json());

// Serve static files from the "public" directory
app.use('/public', express.static(path.join(__dirname, 'public')));

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public'); // Store files in the "public" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Rename the file with a timestamp
  }
});

const upload = multer({ storage: storage }).single('file');

// File upload route
app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json({ message: 'File upload failed', error: err });
    }
    // If upload is successful, send the file path as a response
    const filePath = req.file ? `/public/${req.file.filename}` : null;
    return res.status(200).json({ message: 'File uploaded successfully', filePath: filePath });
  });
});

// Gemini content generation route
app.post('/gemini', async (req, res) => {
  try {
    const { filePath, message } = req.body; // Get filePath and message from the request body

    if (!filePath) {
      return res.status(400).json({ message: 'File path is required' });
    }

    // Function to convert file to generative part
    function fileToGenerativePart(path, mimeType) {
      return {
        inLineData: {
          data: Buffer.from(fs.readFileSync(path)).toString("base64"),
          mimeType
        }
      };
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    // Generate content based on the prompt and the uploaded image
    const result = await model.generateContent([message, fileToGenerativePart(path.join(__dirname, filePath), "image/jpeg")]);

    const response = await result.response;
    const text = response.text();

    res.send(text);

    console.log(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating content', error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Running on PORT ${PORT}`);
});
