import cloudinary from '@/cloud';
import organization, { Organization } from '@/models/organization';
import user from '@/models/user';
import worker, { WorkerDoc } from '@/models/worker';
import { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';

export const createWorker: RequestHandler = async (req, res) => {
  const { userId, skills, exp, gender, location, qualifications }: WorkerDoc =
    req.body;

  const isValidId = isValidObjectId(userId);
  if (!isValidId) {
    return res.status(401).json({ error: 'Unauthorized, User does not exist' });
  }
  const userExists = await user.findOne({ _id: userId });
  if (!userExists) {
    return res.status(401).json({ error: 'Unauthorized, User does not exist' });
  }

  try {
    const newWorker = await worker.create({
      gender,
      skills,
      exp,
      location,
      qualifications,
      userId,
    });

    // @ts-ignore
    userExists.worker = newWorker._id;
    await userExists.save();

    res.status(201).json({
      worker: newWorker,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const updateProfile: RequestHandler = async (req, res) => {
  const { userId, skills, exp, gender, location, qualifications } = req.body;

  const isValidId = isValidObjectId(userId);
  if (!isValidId) {
    return res.status(401).json({ error: 'Unauthorized, User does not exist' });
  }
  try {
    const workerToEdit = await worker.findOne({ _id: userId });
    if (!workerToEdit) {
      return res
        .status(401)
        .json({ error: 'Unauthorized, user does not exist' });
    }

    workerToEdit.qualifications = qualifications;
    workerToEdit.gender = gender;
    workerToEdit.skills = skills;
    workerToEdit.exp = exp;
    workerToEdit.location = location;

    await workerToEdit.save();

    return res.status(200).json({
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

export const deleteProfile: RequestHandler = async (req, res) => {
  const { id } = req.body;

  const isValidId = isValidObjectId(id);
  if (!isValidId) {
    return res.status(401).json({ error: 'Unauthorized, User does not exist' });
  }
  try {
    const workerToDelete = await worker.findOne({ _id: id });
    if (!workerToDelete) {
      return res
        .status(401)
        .json({ error: 'Unauthorized, user does not exist' });
    }

    await worker.findByIdAndDelete(workerToDelete._id);
    return res.status(200).json({
      message: 'Profile deleted successfully',
    });
  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

export const getAll: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const workers = await worker
      .find({
        bossId: { $ne: id },
      })
      .populate('userId', 'name email avatar');

    return res.status(200).json({ workers });
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

export const getProfile: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const isValidId = isValidObjectId(id);
  if (!isValidId) {
    return res.status(401).json({ error: 'Unauthorized, User does not exist' });
  }

  try {
    const profile = await worker
      .findOne({ _id: id })
      .populate('userId', 'name email avatar ')
      .populate('assignedWorkspace', 'role')
      .populate({
        path: 'bossId',
        populate: { path: 'organizations' },
      });

    if (profile) {
      return res.status(200).json({ profile });
    } else {
      console.log('no profile');

      return res.status(200).json({ error: ' User does not exist' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
export const getMyWorkers: RequestHandler = async (req, res) => {
  const { id } = req.params;
  console.log('🚀 ~ const getMyWorkers:RequestHandler= ~ id:', id);
  const isValidId = isValidObjectId(id);
  if (!isValidId) {
    return res.status(401).json({ error: 'Unauthorized, User does not exist' });
  }
  try {
    const profiles = await worker
      .find({ bossId: id })
      .populate('userId', 'name email avatar');

    return res.status(200).json({ workers: profiles });
  } catch (error) {
    console.log('error', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
