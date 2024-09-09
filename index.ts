import express from 'express';

import 'dotenv/config';
import { create } from './controllers/user';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('src/public'));

app.get('/', (req, res) => res.send('Express on Vercel'));
app.get('/home', (req, res) => {
  res.status(201).json({ message: 'Welcome to Auth ts file' });
});

app.post('/create-token', create);

const Port = process.env.PORT || 8989;
app.listen(Port, () => {
  console.log('Server running on port ' + Port);
});
