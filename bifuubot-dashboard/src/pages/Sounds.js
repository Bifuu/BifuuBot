import React, { useState, useEffect } from 'react';
import { Card, CardContent, IconButton } from '@material-ui/core';
import { DeleteIcon } from '@material-ui/icons/Delete';
import { upload } from '../helpers/storage';
import { db } from '../services/firebase';
import SoundCard from '../components/SoundCard';

const Sounds = () => {
  const [sounds, setSounds] = useState([]);
  const fileInput = React.createRef();
  const soundName = React.createRef();

  useEffect(() => {
    // const getSoundNames = async () => {
    //   const soundsFromDB = await db.collection(`sounds`).get();
    //   setSounds(soundsFromDB);
    // };
    // console.log('effect');
    // getSoundNames();
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
      const sound = <SoundCard data={doc.data()} />;
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
            <input type="text" ref={soundName} />
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
      <div>
        <ul>{renderListOfSounds()}</ul>
      </div>
    </div>
  );
};

export default Sounds;
