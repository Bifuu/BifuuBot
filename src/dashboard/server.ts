// TODO: Clean this mess up!
import express from 'express';
import multer from 'multer';
import ffmpeg from 'fluent-ffmpeg';
import pathToFFmpeg from 'ffmpeg-static';
import path from 'path';
import fs from 'fs';

const app: express.Application = express();
ffmpeg.setFfmpegPath(pathToFFmpeg);
const port: number = 3030;

const storage: multer.StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve('build/sounds'));
  },
  filename: (req, file, cb) => {
    cb(null, req.body.soundName + 'O.ogg');
  },
});

const convert = (input, output, callback) => {
  ffmpeg(input)
    .audioCodec('libopus')
    .audioBitrate('128k')
    .output(output)
    .on('end', () => {
      console.log('conversion ended');
      callback(null);
    })
    .on('error', (err) => {
      console.log('error: ', err.code, err.msg);
      callback(err);
    })
    .run();
};

const upload = multer({ storage });

app.get(`/`, (req, res) => {
  res.sendFile(path.resolve('www/index.html'));
});

app.post(`/soundFile`, upload.single('soundFile'), (req, res) => {
  convert(
    req.file.path,
    path.join(path.resolve('build/sounds'), req.body.soundName + '.ogg'),
    (err) => {
      if (!err) {
        console.log('converted');
        fs.unlinkSync(req.file.path);
      } else console.log(err);
    }
  );
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Dashboard listening at port ${port}`);
});
