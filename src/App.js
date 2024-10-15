import { useState } from "react";

const App = () => {

  const [image, setImage] = useState(null);

  const uploadImage = async (e) => {
    const formData = new FormData(); // Corrected "fromData" to "formData"
    formData.append('file', e.target.files[0]);
    setImage(e.target.files[0]);

    try {
      const options = {
        method: 'POST',
        body: formData
      };

      const response = await fetch('http://localhost:3000/upload', options);

      if (!response.ok) {
        throw new Error('Error uploading image');
      }

      const data = await response.json();
      console.log(data);

    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div className="app">
      {/* Display the uploaded image preview */}
      {image && <img src={URL.createObjectURL(image)} alt="Uploaded Preview" />}

      {/* File input */}
      <label htmlFor="files">Upload an Image</label>
      <input 
        onChange={uploadImage} 
        id="files" 
        accept="image/*" 
        type="file"
      />
    </div>
  );
}

export default App;
