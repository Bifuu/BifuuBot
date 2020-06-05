import path from 'path';
import fs from 'fs';
import { firestore, storage } from 'firebase-admin';
import { ISoundData } from '../interfaces/ISoundData';
import { Collection } from 'discord.js';
import { ICachedSoundData } from '../interfaces/ICachedSoundData';

// const SoundService = (db: firestore.Firestore) => {
//   const soundsCollection = db.collection('sounds');

//   const onCollectionUpdate = snapshot => {

//   }

//   soundsCollection.onSnapshot(onCollectionUpdate);
// };

// export default SoundService;

export default class SoundService {
  cache: Collection<string, ICachedSoundData>;
  db: firestore.Firestore;
  fireStorage: storage.Storage;
  soundsCollection: firestore.CollectionReference<firestore.DocumentData>;

  constructor(database: firestore.Firestore, fireStorage: storage.Storage) {
    this.cache = new Collection<string, ICachedSoundData>();
    this.db = database;
    this.fireStorage = fireStorage;
    this.soundsCollection = this.db.collection(`sounds`);

    this.soundsCollection.onSnapshot(this.onDBCollectionUpdate);
  }

  private onDBCollectionUpdate = (
    snapshot: firestore.QuerySnapshot<firestore.DocumentData>
  ) => {
    snapshot.docs.forEach((doc) => {
      // console.log(doc.data());
    });
    console.log(`-----CHANGES BELOW------`);
    snapshot.docChanges().forEach(async (change) => {
      const data: ICachedSoundData = {
        ...(change.doc.data() as ICachedSoundData),
        id: change.doc.id,
      };
      const cached = this.cache.get(data.name);
      if (change.type === 'added') {
        if (!cached) {
          this.cache.set(data.name, data);
          // Does the file exist? if not download it
          const localFilePath = path.join(
            path.resolve('build/sounds/'),
            data.fileName
          );

          // check if file is on the local machine.
          if (!fs.existsSync(localFilePath)) {
            console.log('Attempting to download file');

            await this.fireStorage
              .bucket()
              .file(data.storagePath)
              .download({ destination: localFilePath });
          } else {
            console.log(`File ${data.fileName} already exists`);
          }
        }
      }
      if (change.type === 'removed') {
        console.log('removed: ', change.doc.data());
        this.cache.sweep((sound) => sound.id === data.id); // Delete data from cache
        const localFilePath = path.join(
          path.resolve('build/sounds/'),
          data.fileName
        );
        fs.unlinkSync(localFilePath); // Delete file from system
      }
      if (change.type === 'modified') {
        console.log('modified: ', change.doc.data());
        if (!cached) {
          // Name changed, we need to delete the old entry and make a new one!
          this.cache.sweep((sound) => sound.id === data.id); // Delete old data
        }
        this.cache.set(data.name, data);
      }
    });
  };

  GetSoundPath = (soundName: string) => {
    if (!this.SoundExists(soundName)) return false;
    return path.join(
      path.resolve('build/sounds/'),
      this.cache.get(soundName).fileName
    );
  };

  GetAvailableSounds = () => {
    return Array.from(this.cache.keys());
  };

  SoundExists = (soundName: string) => {
    return this.cache.has(soundName);
  };
}
