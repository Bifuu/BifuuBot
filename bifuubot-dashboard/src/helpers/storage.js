import { storage } from '../services/firebase';

export const upload = (file, soundName) => {
  console.log('Upload');
  let storageRef = storage.ref();
  console.log(`ref:`, storageRef);

  let metadata = {
    contentType: 'audio/mpeg',
  };

  let uploadTask = storageRef
    .child(`tempSounds/${soundName}`)
    .put(file, metadata);

  return uploadTask;
};
