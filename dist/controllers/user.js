"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
require("dotenv/config");
const stream_chat_1 = require("stream-chat");
const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STEAM_SECRET_KEY;
const serverClient = stream_chat_1.StreamChat.getInstance(api_key, api_secret);
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    try {
        const streamToken = serverClient.createToken(id);
        console.log({ streamToken });
        return res.status(201).json({
            streamToken,
        });
    }
    catch (error) {
        console.log('Sign-in error', error);
        return res.status(500).json({ error: error === null || error === void 0 ? void 0 : error.message });
    }
});
exports.create = create;
