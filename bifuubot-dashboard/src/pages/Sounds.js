import React, { useState, useEffect } from 'react';
import { upload } from '../helpers/storage';
import { db } from '../services/firebase';

import Table from 'react-bootstrap/Table';
import SoundCard from '../components/SoundCard';

const Sounds = () => {
  const [sounds, setSounds] = useState([]);
  const fileInput = React.createRef();
  const soundName = React.createRef();

  useEffect(() => {
    db.collection('sounds').onSnapshot((snapshot) => {
      setSounds(snapshot);
    });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(event);
    const file = fileInput.current.files[0];
    const name = soundName.current.value;
    event.currentTarget.reset();

    const uploadTask = await upload(file, name);
    //console.log(uploadTask);
  };

  const renderListOfSounds = () => {
    let list = [];
    sounds.forEach((doc) => {
      const sound = <SoundCard data={doc.data()} key={doc.id} id={doc.id} />;
      list.push(sound);
    });

    return list;
  };

  return (
    <div>
      <hr />
      <div>
        <form onSubmit={handleSubmit}>
          <label>
            Sound Name:
            <input type="text" ref={soundName} required />
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
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{renderListOfSounds()}</tbody>
      </Table>
    </div>
  );
};

export default Sounds;
