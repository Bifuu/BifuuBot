import React from 'react';
import { upload } from '../helpers/storage';

const Sounds = () => {
  const fileInput = React.createRef();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const file = fileInput.current.files[0];
    console.log(file);
    const url = await upload(file);
    console.log(url);
  };

  return (
    <div>
      <hr />
      <div>
        <form onSubmit={handleSubmit}>
          <label>
            Sound Name:
            <input type="text" name="soundName" />
          </label>
          <br />
          <label>
            Sound File:
            <input type="file" name="soundFile" id="" ref={fileInput} />
          </label>
          <button type="submit">Upload</button>
        </form>
      </div>
      <hr />
      <div>List of sounds go here.....</div>
    </div>
  );
};

export default Sounds;
