import connections from '@/models/connections';
import { RequestHandler } from 'express';
import { connection, isValidObjectId } from 'mongoose';

export const createConnection: RequestHandler = async (req, res) => {
  const { userId, workspace } = req.body;
  const isValidId = isValidObjectId(userId) && isValidObjectId(workspace);
  if (!isValidId) {
    return res.status(401).json({ error: 'Unauthorized, User does not exist' });
  }
  try {
    const newConnection = await connections.create({
      userId,
      workspace,
    });
    return res.status(201).json({ newConnection });
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

export const getConnections: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const isValidId = isValidObjectId(id);
  console.log('id', id, 'isValidId', isValidId);
  if (!isValidId) {
    return res.status(401).json({ error: 'Unauthorized, User does not exist' });
  }
  try {
    const allConnections = await connections
      .find({
        userId: { $eq: id },
      })
      .sort({ createdAt: 'ascending' })
      .populate('organizationId', 'organizationName avatar open')
      .populate('workspace', 'workspaceName workerId ');

    return res.status(200).json({ allConnections });
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
