import { useState } from "react";

const App = () => {

  const [image, setImage] = useState(null);

  const uploadImage = async (e) => {
    const fromData = new FormData()
    fromData.append('file', e.target.files[0])
    setImage(e.target.files[0]);

    try {

      const options = {
        method: 'POST',
        body: fromData
      }

      const response = await fetch('http://localhost:3000/upload', options)

      const data = await response.json()
      console.log(data)

    } catch (error) {
      console.error(error);
    }

  }

  console.log(image);

  return (
    <div className="app">
      <img src={URL.createObjectURL(image)} alt="" />
      <label htmlFor="files">Upload an Image</label>
      <input onChange={uploadImage} id="files" accept="image/*" type="file"></input>
    </div>
  );
}

export default App;
