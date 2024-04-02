import express from 'express';

import 'dotenv/config';
import './db';

import authRouter from './routers/auth';
import organizationRouter from './routers/organization';
import workerRouter from './routers/worker';
import connectionsRouter from './routers/connection';
import requestHandler from './routers/request';
import workspaceRouter from './routers/workspace';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('src/public'));
app.use('/auth', authRouter);
app.use('/organization', organizationRouter);
app.use('/worker', workerRouter);
app.use('/connections', connectionsRouter);
app.use('/request', requestHandler);
app.use('/workspace', workspaceRouter);

const Port = process.env.PORT || 8989;
app.listen(Port, () => {
  console.log('Server running on port ' + Port);
});
