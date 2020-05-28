import * as functions from 'firebase-functions';
import { Storage } from '@google-cloud/storage';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import ffmpeg, { FfmpegCommand } from 'fluent-ffmpeg';
import ffmpeg_static from 'ffmpeg-static';

const gcs = new Storage();

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

    if (fileName.endsWith(`_output.ogg`)) {
      // console.log(`Already converted audio`);
      return null;
    }

    const bucket = gcs.bucket(fileBucket);
    const tempFilePath = path.join(os.tmpdir(), fileName);

    const targetTempFileName = fileName.replace(/\.[^/.]+$/, '') + '.ogg';
    const targetTempFilePath = path.join(os.tmpdir(), targetTempFileName);
    const targetStorageFilePath = path.join('sounds', targetTempFileName);

    await bucket.file(filePath).download({ destination: tempFilePath });
    // console.log(`audio downloaded locally to ${tempFilePath}`);

    const command = ffmpeg(tempFilePath)
      .setFfmpegPath(ffmpeg_static)
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

    // console.log(`Temp files removed.`, targetTempFilePath);
    return;
  });
