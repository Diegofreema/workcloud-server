import cloudinary from '@/cloud';
import organization, { Organization } from '@/models/organization';
import user from '@/models/user';
import { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';

export const createOrgs: RequestHandler = async (req, res) => {
  const {
    organizationName,
    avatar,
    startDay,
    endDay,
    websiteUrl,
    location,
    ownerId,
    email,
    description,
    category,
    password,
    startTime,
    endTime,
  } = req.body;

  const isValidId = isValidObjectId(ownerId);
  if (!isValidId) {
    return res.status(401).json({ error: 'Unauthorized, User does not exist' });
  }
  const userExists = await user.findOne({ _id: ownerId });
  if (!userExists) {
    return res.status(401).json({ error: 'Unauthorized, User does not exist' });
  }

  const organizationExists = await organization.findOne({
    email,
  });

  if (organizationExists) {
    return res.status(400).json({
      error: 'Organization email already exists, Please use a different email',
    });
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    avatar as string,
    {
      width: 200,
      height: 200,
      crop: 'thumb',
      gravity: 'faces',
    }
  );
  try {
    const newOrganization = await organization.create({
      organizationName,
      avatar: {
        url: secure_url,
        public_id: public_id,
      },
      startDay,
      endDay,
      websiteUrl,
      location,
      ownerId,
      email,
      description,
      category,
      endTime,
      startTime,
    });

    // @ts-ignore
    userExists.organizations = newOrganization._id;
    await userExists.save();

    res.status(201).json({
      message: 'Organization created successfully',
      orgsId: newOrganization._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const updateOrganization: RequestHandler = async (req, res) => {
  const {
    id,
    organizationName,
    avatar,
    startDay,
    endDay,
    websiteUrl,
    location,
    email,
    description,
    category,
  } = req.body;

  const isValidId = isValidObjectId(id);
  if (!isValidId) {
    return res.status(401).json({ error: 'Unauthorized, User does not exist' });
  }
  try {
    const orgsExist = await organization.findOne({ _id: id });
    if (!orgsExist) {
      return res
        .status(401)
        .json({ error: 'Unauthorized, Organization does not exist' });
    }
    console.log('orgsExist', orgsExist);
    if (orgsExist.avatar.public_id) {
      await cloudinary.uploader.destroy(orgsExist.avatar.public_id);
    }

    const { secure_url, public_id } = await cloudinary.uploader.upload(avatar, {
      width: 200,
      height: 200,
      crop: 'thumb',
      gravity: 'faces',
    });

    await organization.findByIdAndUpdate(id, {
      organizationName,
      avatar: {
        url: secure_url,
        public_id: public_id,
      },
      startDay,
      endDay,
      websiteUrl,
      location,
      email,
      description,
      category,
    });

    return res.status(200).json({
      message: 'Organization updated successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

export const deleteOrganization: RequestHandler = async (req, res) => {
  const { id } = req.body;

  const isValidId = isValidObjectId(id);
  if (!isValidId) {
    return res.status(401).json({ error: 'Unauthorized, User does not exist' });
  }
  try {
    const orgsExist = await organization.findOne({ _id: id });
    if (!orgsExist) {
      return res
        .status(401)
        .json({ error: 'Unauthorized, Organization does not exist' });
    }

    await organization.findByIdAndDelete(id);
    return res.status(200).json({
      message: 'Organization deleted successfully',
    });
  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

export const getOrganizations: RequestHandler = async (req, res) => {
  try {
    const organizations = await organization.find();
    const formattedOrganizations = organizations.map((org) => ({
      avatar: org.avatar.url,
      ...org._doc,
    }));
    return res.status(200).json({ formattedOrganizations });
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
export const getOtherOrganizations: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const isValidId = isValidObjectId(id);
  if (!isValidId) {
    return res.status(401).json({ error: 'Unauthorized, User does not exist' });
  }
  try {
    const organizations = await organization.find({
      ownerId: { $ne: id },
    });
    const formattedOrganizations = organizations.map((org) => ({
      ...org._doc,
      avatar: org.avatar.url,
    }));
    return res.status(200).json({ formattedOrganizations });
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

export const getOrganization: RequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const isValidId = isValidObjectId(id);
    console.log('id', id, 'isValidId', isValidId);
    if (!isValidId) {
      return res
        .status(401)
        .json({ error: 'Unauthorized, User does not exist' });
    }
    const org = await organization
      .findOne({ ownerId: id })
      .populate('ownerId', 'name');

    if (org) {
      return res.status(200).json({ ...org._doc, avatar: org.avatar.url });
    } else {
      console.log('no org');
      return res.json(null);
    }
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
