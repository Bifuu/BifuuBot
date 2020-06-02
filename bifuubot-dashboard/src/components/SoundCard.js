import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';

import { storage, db } from '../services/firebase';

const SoundCard = (props) => {
  const [audio, setAudio] = useState(new Audio());
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
    getAudioURL();
  }, [props.data]);

  return (
    <Card>
      <div>
        {edit ? editField() : props.data.name}
        <button
          onClick={() => {
            audio.play();
          }}
        >
          Play
        </button>
      </div>
      <button
        onClick={() => {
          setEdit(!edit);
        }}
      >
        edit
      </button>
      <button
        onClick={() => {
          db.collection('sounds').doc(props.id).delete();
          storage.ref(props.data.storagePath).delete();
        }}
      >
        Delete
      </button>
      <hr />
    </Card>
  );
};

SoundCard.propTypes = {
  data: PropTypes.object.isRequired,
};

export default SoundCard;
