import path from 'path';
import fs from 'fs';
import { firestore, storage } from 'firebase-admin';
import { ISoundData } from '../interfaces/ISoundData';
import { Collection, Message, StreamDispatcher } from 'discord.js';
import { ICachedSoundData } from '../interfaces/ICachedSoundData';
import { Readable } from 'stream';
import DiscordYTDLCore from 'discord-ytdl-core';

// const SoundService = (db: firestore.Firestore) => {
//   const soundsCollection = db.collection('sounds');

//   const onCollectionUpdate = snapshot => {

//   }

//   soundsCollection.onSnapshot(onCollectionUpdate);
// };

// export default SoundService;

export default class SoundService {
  private cache: Collection<string, ICachedSoundData>;
  private db: firestore.Firestore;
  private fireStorage: storage.Storage;
  private soundsCollection: firestore.CollectionReference<
    firestore.DocumentData
  >;
  private soundsFolder = path.resolve(__dirname, '..', 'sounds');
  private audioDispatcher: StreamDispatcher;

  constructor(database: firestore.Firestore, fireStorage: storage.Storage) {
    this.cache = new Collection<string, ICachedSoundData>();
    this.db = database;
    this.fireStorage = fireStorage;
    this.soundsCollection = this.db.collection(`sounds`);

    if (!fs.existsSync(this.soundsFolder)) {
      console.log(
        'Need to make a folder named sounds at: ' + this.soundsFolder
      );
      fs.mkdirSync(this.soundsFolder);
    }

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
          const localFilePath = path.join(this.soundsFolder, data.fileName);

          // check if file is on the local machine.
          if (!fs.existsSync(localFilePath)) {
            console.log(`Downloading ${data.fileName}`);

            await this.fireStorage
              .bucket()
              .file(data.storagePath)
              .download({ destination: localFilePath });
          } else {
            // console.log(`File ${data.fileName} already exists`);
          }
        }
      }
      if (change.type === 'removed') {
        console.log('removed: ', change.doc.data());
        this.cache.sweep((sound) => sound.id === data.id); // Delete data from cache
        const localFilePath = path.join(this.soundsFolder, data.fileName);
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
    return path.join(this.soundsFolder, this.cache.get(soundName).fileName);
  };

  GetAvailableSounds = () => {
    return Array.from(this.cache.keys());
  };

  SoundExists = (soundName: string) => {
    return this.cache.has(soundName);
  };

  PlaySound = async (soundName: string, message: Message, volume?: number) => {
    const ytRegex: RegExp = /(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)(?<id>[\w-_]+)(?<time>(?:\?|&)t=\d+)?/;
    const isYTUrl = ytRegex.exec(soundName);

    console.log(isYTUrl);

    if (!message.member.voice.channel)
      return message.channel.send(`You must be in a voice channel!`);
    if (!message.member.voice.channel.joinable)
      return message.channel.send(`I cannot join your current voice channel`);

    let audioStream;
    let type;

    if (isYTUrl) {
      let seek = 0;
      if (typeof isYTUrl.groups.time !== 'undefined')
        seek = parseInt(isYTUrl.groups.time.split('=')[1], 10);

      audioStream = await DiscordYTDLCore(soundName, {
        seek,
      });

      type = 'opus';
    } else {
      const soundPath = this.GetSoundPath(soundName);
      if (!soundPath)
        return message.channel.send(`The sound '${soundName}' does not exist.`);
      audioStream = fs.createReadStream(`${soundPath}`);
      type = 'ogg/opus';
    }

    const voiceConnection = await message.member.voice.channel.join();

    this.audioDispatcher = voiceConnection.play(audioStream, {
      volume: 0.5 * volume,
      type,
    });

    this.audioDispatcher.on('start', async () => {
      await message.delete();
    });
  };

  StopSound = () => {
    if (this.audioDispatcher) this.audioDispatcher.end();
  };
}
