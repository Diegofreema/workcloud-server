import express from 'express';

import 'dotenv/config';
import './db';

import authRouter from './routers/auth';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('src/public'));

app.use('/auth', authRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const Port = process.env.PORT || 8989;
app.listen(Port, () => {
  console.log('Server running on port ' + Port);
});
