import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Pusher from 'pusher';
import dbModel from './dbModel.js';

//app config
const app = express();
const port = process.env.PORT || 8080;
const pusher = new Pusher({
  appId: '1139823',
  key: 'fc06f27031d8e2061c9c',
  secret: 'ff0fff816728afdbf84e',
  cluster: 'us2',
  useTLS: true,
});

//middleware
app.use(express.json());
app.use(cors());

//DB config
const connection_url =
  'mongodb+srv://admin:flHIrxkQodPEviio@cluster0.4ynjw.mongodb.net/instaDB?retryWrites=true&w=majority';
mongoose.connect(connection_url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', () => {
  console.log('DB is connected');

  const changeStream = mongoose.connection.collection('posts').watch();

  changeStream.on('change', (change) => {
    if (change.operationType === 'insert') {
      const postDetails = change.fullDocument;
      console.log('Pusher push >> ', postDetails);
      pusher.trigger('posts', 'inserted', postDetails);
    } else {
      console.log('Error triggering Pusher');
    }
  });
});

//API routes
app.get('/', (req, res) => res.status(200).send('Hello world'));

app.post('/upload', (req, res) => {
  const body = req.body;

  dbModel.create(body, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.get('/sync', (req, res) => {
  dbModel.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

//listener
app.listen(port, () => console.log('Listening to PORT: ', port));
