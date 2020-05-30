import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Card, CardContent, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Edit from '@material-ui/icons/Edit';

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
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardContent className={classes.content}>
        {props.data.name}
        <IconButton>
          <PlayArrowIcon />
        </IconButton>
      </CardContent>
      <div className={classes.controls}></div>
      <IconButton>
        <Edit />
      </IconButton>
      <IconButton>
        <DeleteIcon />
      </IconButton>
    </Card>
  );
};

SoundCard.propTypes = {
  name: PropTypes.object.isRequired,
};

export default SoundCard;
