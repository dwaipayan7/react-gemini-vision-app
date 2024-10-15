import { useState } from "react";

const App = () => {

  const [image, setImage] = useState(null);
  const [value, setValue] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  const surpriseOptions = [
    'Does the image have a whale?',
    'Does the image have anything red?',
    'Is the image about a superhero?',
  ];

  const surprise = () => {
    const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomValue);
  };

  const analyzeImage = async () => {
    if (!image) {
      setError("You must upload an image!");
      return;
    }

    setError(""); // Clear previous errors

    try {
      const options = {
        method: "POST",
        body: JSON.stringify({ message: value }),
        headers: { "Content-Type": "application/json" }
      };

      const response = await fetch('http://localhost:3000/gemini', options);

      if (!response.ok) {
        // Throw error if response is not okay
        const errorMessage = await response.text();
        throw new Error(`Server error: ${errorMessage}`);
      }

      const data = await response.text(); // Assuming the response is text
      setResponse(data);

    } catch (error) {
      console.error("Analyze Image Error:", error);
      setError("Error: Something went wrong. Please try again.");
    }
  };

  const clearAll = () => {
    setImage(null);
    setValue("");
    setResponse("");
    setError("");
  };

  const uploadImage = async (e) => {
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    setImage(e.target.files[0]);

    try {
      const options = {
        method: 'POST',
        body: formData
      };

      const response = await fetch('http://localhost:3000/upload', options);

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Image upload failed: ${errorMessage}`);
      }

      const data = await response.json();
      console.log("Uploaded image path:", data.filePath); // Log file path returned by the server

    } catch (error) {
      console.error('Upload failed:', error);
      setError("Error uploading image. Please try again.");
    }
  };

  return (
    <div className="app">
      <section className="search-section">
        <div className="image-container">
          {image && <img src={URL.createObjectURL(image)} alt="Uploaded Preview" />}
        </div>
        <p className="extra-info">
          <span>
            <label htmlFor="files">Upload an Image</label>
            <input
              onChange={uploadImage}
              id="files"
              accept="image/*"
              type="file"
            />
          </span>
          to ask questions about
        </p>
        <p>What do you want to know about the image?</p>

        <button className="surprise" onClick={surprise} disabled={response}>Surprise Me</button>

        <div className="input-container">
          <input
            value={value}
            placeholder="What is in the image..."
            onChange={e => setValue(e.target.value)}
          />
          
          {!response && (
            <>
              <button onClick={analyzeImage}>Ask Me</button>
              <button onClick={clearAll}>Clear</button>
            </>
          )}
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {response && <p>{response}</p>}
      </section>
    </div>
  );
};

export default App;
