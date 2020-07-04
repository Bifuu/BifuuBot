import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { storage, db } from '../services/firebase';

const SoundCard = (props) => {
  const [audio, setAudio] = useState(new Audio());
  const [playing, setPlaying] = useState(false);
  const [edit, setEdit] = useState(false);

  const editNameField = React.createRef();

  const updateName = async () => {
    if (editNameField.current.value === props.data.name) return setEdit(false);

    await db.collection('sounds').doc(props.id).update({
      name: editNameField.current.value,
    });

    setEdit(false);
  };

  const editField = () => {
    return (
      <div>
        <input type="text" ref={editNameField} defaultValue={props.data.name} />
        <button onClick={updateName}>Submit</button>
        <button onClick={() => setEdit(false)}>Cancel</button>
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
      <td>{props.data.uploadDate.toDate().toDateString()}</td>
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
