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
  const fileInput = React.createRef();
  const soundName = React.createRef();

  useEffect(() => {
    db.collection('sounds').onSnapshot((snapshot) => {
      setSounds(snapshot);
    });
    bsCustomFileInput.init();
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
      <div>
        <Form onSubmit={handleSubmit} inline>
          <Form.Row>
            <Col xs="auto">
              <Form.Control placeholder="soundname" ref={soundName} required />
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
