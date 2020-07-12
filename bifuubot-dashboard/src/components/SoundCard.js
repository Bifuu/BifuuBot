import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { storage, db } from '../services/firebase';

const SoundCard = (props) => {
  const [audio, setAudio] = useState(new Audio());
  const [playing, setPlaying] = useState(false);
  const [edit, setEdit] = useState(false);
  const [volume, setVolume] = useState(100);

  const editNameField = React.createRef();

  const updateName = async () => {
    // if (editNameField.current.value === props.data.name) return setEdit(false);

    await db
      .collection('sounds')
      .doc(props.id)
      .update({
        name: editNameField.current.value,
        volume: volume / 100,
      });

    setEdit(false);
  };

  const cancelEdit = () => {
    setEdit(false);
    setVolume(props.data.volume * 100);
  };

  const editField = () => {
    return (
      <div>
        <input type="text" ref={editNameField} defaultValue={props.data.name} />
        Default Volume:
        <input
          type="range"
          min={1}
          max={100}
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
        />
        {volume}%<button onClick={updateName}>Submit</button>
        <button onClick={cancelEdit}>Cancel</button>
      </div>
    );
  };

  useEffect(() => {
    const getAudioURL = async () => {
      const url = await storage.ref(props.data.storagePath).getDownloadURL();
      setAudio(new Audio(url));
    };
    if (props.data.storagePath) {
      getAudioURL();
    }
    setVolume(props.data.volume * 100);
  }, [props.data]);

  return (
    <tr>
      <td>
        <button
          onClick={() => {
            if (playing) {
              audio.pause();
              setPlaying(false);
            } else {
              audio.play();
              setPlaying(true);
            }
          }}
        >
          {playing ? 'Pause' : 'Play'}
        </button>
        {edit ? editField() : props.data.name}
      </td>
      <td>{props.data.uploadDate?.toDate().toDateString()}</td>
      <td>{props.data.uploadedBy}</td>
      <td>
        <button
          onClick={() => {
            setEdit(!edit);
          }}
        >
          Edit
        </button>
        <button
          onClick={() => {
            db.collection('sounds').doc(props.id).delete();
            if (props.data.storagePath)
              storage.ref(props.data.storagePath).delete();
          }}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

SoundCard.propTypes = {
  data: PropTypes.object.isRequired,
};

export default SoundCard;
