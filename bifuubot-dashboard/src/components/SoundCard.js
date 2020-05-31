import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Card, CardContent, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Edit from '@material-ui/icons/Edit';

import { storage, db } from '../services/firebase';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    maxWidth: '50%',
    marginBottom: '3px',
  },
  content: {
    flex: '1 0 auto',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

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

  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent className={classes.content}>
        {edit ? editField() : props.data.name}
        <IconButton
          onClick={() => {
            audio.play();
          }}
        >
          <PlayArrowIcon />
        </IconButton>
      </CardContent>
      <div className={classes.controls}></div>
      <IconButton
        onClick={() => {
          setEdit(!edit);
        }}
      >
        <Edit />
      </IconButton>
      <IconButton
        onClick={() => {
          db.collection('sounds').doc(props.id).delete();
          storage.ref(props.data.storagePath).delete();
        }}
      >
        <DeleteIcon />
      </IconButton>
    </Card>
  );
};

SoundCard.propTypes = {
  data: PropTypes.object.isRequired,
};

export default SoundCard;
