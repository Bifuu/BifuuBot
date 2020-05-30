import { storage } from '../services/firebase';

export const upload = async (file, soundName) => {
  console.log('Upload');
  let storageRef = storage.ref();
  console.log(`ref:`, storageRef);

  let metadata = {
    contentType: 'audio/mpeg',
  };

  let uploadTask = await storageRef
    .child(`tempSounds/${soundName}`)
    .put(file, metadata);

  return uploadTask;
};
