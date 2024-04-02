import user from '@/models/user';
import workspace, { WorkspaceDoc } from '@/models/workspace';
import { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import requests from '@/models/requests';
import worker from '@/models/worker';

export const createWorkspace: RequestHandler = async (req, res) => {
  const { ownerId, role } = req.body;

  const isValidId = isValidObjectId(ownerId);

  if (!isValidId) return res.status(403).json({ error: 'Unauthorized' });
  try {
    const updateUser = await user.findOne({ _id: ownerId });
    if (!updateUser) return res.status(403).json({ error: 'Unauthorized' });
    const newWorkspace = await workspace.create({
      ownerId,
      role,
    });
    // @ts-ignore
    updateUser?.workspaces?.push(newWorkspace._id);
    await updateUser.save();
    return res.status(201).json({ message: 'Workspaces created successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
export const deleteWorkspace: RequestHandler = async (req, res) => {
  const { id } = req.body;
  try {
    const isValidId = isValidObjectId(id);
    if (!isValidId) {
      return res.status(404).json({ error: 'Unauthorized' });
    }

    await workspace.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Workspace deleted successfully' });
  } catch (error) {
    return res.status(404).json({ error: 'Internal Server Error' });
  }
};
export const getPersonal: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const isValid = isValidObjectId(id);

  try {
    if (!isValid) {
      return res.status(404).json({ error: 'Unauthorized' });
    }

    const works = await workspace.find({ ownerId: id });
    res.status(200).json({ works });
  } catch (error) {
    console.log('', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAllWorkspaces: RequestHandler = async (req, res) => {
  try {
    const workspaces = await workspace.find();
    return res.status(200).json({ workspaces: workspaces });
  } catch (error) {
    return res.status(500).json({ error: 'internal server error' });
  }
};
export const getOne: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const isValid = isValidObjectId(id);
  if (!isValid) {
    return res.status(404).json({ error: 'Unauthorize' });
  }
  try {
    const wks = await workspace.findOne({ _id: id });
    if (!wks) {
      return res.status(404).json({ error: 'Not found' });
    }

    return res.status(200).json({ wks: wks });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const assignWorkspace: RequestHandler = async (req, res) => {
  const { workspaceId, id, salary, responsibilities, requestId, bossId, role } =
    req.body;
  const isValid = isValidObjectId(id) && isValidObjectId(workspaceId);
  console.log(workspaceId);

  if (!isValid) {
    return res.status(404).json({ error: 'Unauthorize' });
  }
  try {
    const wks = await workspace.findOne({ _id: workspaceId });
    if (!wks) {
      console.log('dccasxAC');

      return res.status(404).json({ error: 'Not found' });
    }
    const rq = await requests.findOne({ _id: requestId });
    if (!rq) {
      return res.status(404).json({ error: 'Not found' });
    }
    const workerr = await user.findOne({ _id: id });

    const wrker = await worker.findOne({ _id: workerr?.worker });
    if (!wrker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    wrker.bossId = bossId;
    wrker.role = role;
    rq.status = 'accepted';
    wks.workerId = id as any;
    wks.salary = salary as any;
    wks.responsibility = responsibilities as any;
    wrker.assignedWorkspace = workspaceId;
    await wks.save();
    await rq.save();
    await wrker.save();
    return res.status(200).json({ message: 'Added to workspace' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
