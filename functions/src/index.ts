import * as functions from 'firebase-functions';
import { Storage } from '@google-cloud/storage';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import ffmpeg, { FfmpegCommand } from 'fluent-ffmpeg';
import ffmpeg_static from 'ffmpeg-static';
import serviceAccount from './config.json';
import admin from 'firebase-admin';
import * as discordAuth from './discord_auth';

const gcs = new Storage();
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: `https://${process.env.GCLOUD_PROJECT}.firebaseio.com`,
});

// Makes an ffmpeg command return a promise.
function promisifyCommand(command: FfmpegCommand) {
  return new Promise((resolve, reject) => {
    command.on('end', resolve).on('error', reject).run();
  });
}

export const generateOGG = functions.storage
  .object()
  .onFinalize(async (object) => {
    const fileBucket = object.bucket;
    const filePath = object.name as string;
    const contentType = object.contentType;

    if (!filePath.startsWith(`tempSounds/`)) {
      return null;
    }

    if (!contentType?.startsWith('audio/')) {
      // console.log(`This is not audio`);
      return null;
    }

    // Get file name
    const fileName = path.basename(filePath);
    const soundName = fileName.replace(/\.[^/.]+$/, '');

    if (fileName.endsWith(`_output.ogg`)) {
      // console.log(`Already converted audio`);
      return null;
    }

    const bucket = gcs.bucket(fileBucket);
    const tempFilePath = path.join(os.tmpdir(), fileName);

    const targetTempFileName = soundName + '.ogg';
    const targetTempFilePath = path.join(os.tmpdir(), targetTempFileName);
    const targetStorageFilePath = path.join('sounds', targetTempFileName);

    await bucket.file(filePath).download({ destination: tempFilePath });
    // console.log(`audio downloaded locally to ${tempFilePath}`);

    const command = ffmpeg(tempFilePath)
      .setFfmpegPath(ffmpeg_static)
      .noVideo()
      .audioCodec('libopus')
      .audioBitrate('128k')
      .output(targetTempFilePath);

    await promisifyCommand(command);
    // console.log(`Outtput audio created at ${targetTempFilePath}`);
    // Upload audio
    await bucket.upload(targetTempFilePath, {
      destination: targetStorageFilePath,
    });
    // console.log(`Output audip uploaded to ${targetStorageFilePath}`);

    // Delete old intial file to save space.
    await bucket.file(filePath).delete();

    //Clear up temp stuff
    fs.unlinkSync(tempFilePath);
    fs.unlinkSync(targetTempFilePath);

    await admin.firestore().collection(`sounds`).add({
      name: soundName,
      fileName: targetTempFileName,
      storagePath: targetStorageFilePath,
      volume: 1,
    });

    // await admin.database().ref(`sounds/${soundName}`).set({
    //   filename: targetTempFileName,
    //   path: targetStorageFilePath,
    //   volume: 1,
    // });

    // console.log(`Temp files removed.`, targetTempFilePath);
    return;
  });

// Discord stuff
export const DiscordAuth = discordAuth;
