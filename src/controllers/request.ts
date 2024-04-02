import requests, { Request } from '@/models/requests';
import user from '@/models/user';
import { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';

export const createRequest: RequestHandler = async (req, res) => {
  const { from, to, responsibility, role, salary, workspaceId }: Request =
    req.body;
  const isValidId = isValidObjectId(from) && isValidObjectId(to);
  if (!isValidId) {
    return res.status(401).json({ error: 'Unauthorized, User does not exist' });
  }

  const userToSendToExists = await user.findById(to);
  if (!userToSendToExists) {
    return res.status(401).json({ error: 'Unauthorized, User does not exist' });
  }
  try {
    const newRequest = requests.create({
      from,
      to,
      responsibility,
      role,
      salary,
      workspaceId,
    });
    return res.status(201).json({ newRequest });
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
export const deleteRequest: RequestHandler = async (req, res) => {
  const { id } = req.body;

  const isValidId = isValidObjectId(id);
  if (!isValidId) {
    return res.status(401).json({ error: 'Unauthorized, User does not exist' });
  }
  try {
    await requests.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Request deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
export const getAll: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const isValidId = isValidObjectId(id);
  if (!isValidId) {
    return res.status(401).json({ error: 'Unauthorized, User does not exist' });
  }

  const requestsList = await requests
    .find({ from: id, status: 'pending' })
    .populate('to', 'name email avatar worker');
  return res.status(200).json({ requestsList });
};
export const getAllTo: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const isValidId = isValidObjectId(id);
  if (!isValidId) {
    return res.status(401).json({ error: 'Unauthorized, User does not exist' });
  }

  const requestsList = await requests.find({ to: id }).populate({
    path: 'from',
    populate: { path: 'organizations' },
  });
  return res.status(200).json({ requestsList });
};
export const getOne: RequestHandler = async (req, res) => {
  const { from, to } = req.body;

  console.log('from', from, 'to', to);
  const isValidId = isValidObjectId(from) && isValidObjectId(to);

  if (!isValidId) {
    return res.status(401).json({ error: 'Unauthorized, User does not exist' });
  }

  const requestExists = await requests.findOne({
    from,
    to,
  });

  if (!requestExists) {
    return res.status(200).json({ message: 'Request does not exist' });
  }
  console.log('requestExists', requestExists);

  return res.status(200).json({ requestExists });
};

export const getReq: RequestHandler = async (req, res) => {
  const { id } = req.body;

  const isValidId = isValidObjectId(id);
  if (!isValidId) {
    return res.status(401).json({ error: 'Unauthorized, User does not exist' });
  }

  const requestExists = await requests
    .findOne({
      _id: id,
    })
    .populate({
      path: 'from',
      populate: { path: 'organizations' },
    });

  if (!requestExists) {
    return res.status(200).json({ message: 'Request does not exist' });
  }
  console.log('requestExists', requestExists);

  return res.status(200).json({ requestExists });
};
