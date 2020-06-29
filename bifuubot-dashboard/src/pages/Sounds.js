import React, { useState, useEffect } from 'react';
import { upload } from '../helpers/storage';
import { db } from '../services/firebase';

import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import bsCustomFileInput from 'bs-custom-file-input';
import SoundCard from '../components/SoundCard';

const Sounds = () => {
  const [sounds, setSounds] = useState([]);
  const [uploading, setUploading] = useState(null);
  const fileInput = React.createRef();
  const soundName = React.createRef();

  useEffect(() => {
    db.collection('sounds').onSnapshot((snapshot) => {
      setSounds(snapshot);
    });
    bsCustomFileInput.init();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(event);
    const file = fileInput.current.files[0];
    const name = soundName.current.value;
    event.currentTarget.reset();
    const uploadTask = upload(file, name);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // State changes
        let progress = snapshot.bytesTransferred / snapshot.totalBytes;
        setUploading(progress);
      },
      (error) => {
        // Error happens
        setUploading(null);
      },
      () => {
        // Upload Completes
        setUploading(null);
      }
    );
  };

  const showFormOrProgress = () => {
    if (uploading) {
      return <div>{`Uploading: ${uploading * 100}%`}</div>;
    } else {
      return (
        <div>
          <Form onSubmit={handleSubmit} inline>
            <Form.Row>
              <Col xs="auto">
                <Form.Control
                  placeholder="soundname"
                  ref={soundName}
                  required
                />
              </Col>
              <Col>
                <Form.File custom required>
                  <Form.File.Input name="soundFile" ref={fileInput} />
                  <Form.File.Label>Sound Name</Form.File.Label>
                </Form.File>
              </Col>
              <Col xs="auto">
                <Button type="submit">Upload</Button>
              </Col>
            </Form.Row>
          </Form>
        </div>
      );
    }
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
      {showFormOrProgress()}
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
