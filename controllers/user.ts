import 'dotenv/config';
import { RequestHandler } from 'express';

import { StreamChat } from 'stream-chat';

const api_key = process.env.STREAM_API_KEY!;
const api_secret = process.env.STEAM_SECRET_KEY!;
const serverClient = StreamChat.getInstance(api_key, api_secret);
// Create User Token

export const create: RequestHandler = async (req: any, res) => {
  const { id } = req.body;

  try {
    const streamToken = serverClient.createToken('hsbahbsfsdbfhsvdfhvshvfhgs');
    console.log({ streamToken });

    return res.status(201).json({
      streamToken,
    });
  } catch (error: any) {
    console.log('Sign-in error', error);

    return res.status(500).json({ error: error?.message });
  }
};
