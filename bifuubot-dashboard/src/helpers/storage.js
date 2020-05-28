import { storage } from '../services/firebase';
import firebase from 'firebase';

export const upload = async (file) => {
  console.log('Upload');
  let storageRef = storage.ref();
  console.log(`ref:`, storageRef);

  let metadata = {
    contentType: 'audio/mpeg',
  };

  let uploadTask = await storageRef
    .child(`tempSounds/${file.name}`)
    .put(file, metadata);

  return uploadTask.ref.getDownloadURL();

  // uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, {
  //   error: (e) => {
  //     console.log(e);
  //   },
  //   complete: () => {
  //     uploadTask.snapshot.ref.getDownloadURL().then((url) => {
  //       console.log(`URL:`, url);
  //       return url;
  //     });
  //   },
  // });
};
