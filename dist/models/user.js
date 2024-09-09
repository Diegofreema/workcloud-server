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
const bcrypt_1 = require("bcrypt");
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    avatar: {
        type: Object,
        url: String,
        public_id: String,
    },
    tokens: [String],
    following: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Organization',
        },
    ],
    posts: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Post',
        },
    ],
    organizations: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Organization',
    },
    streamToken: {
        type: String,
    },
    workspaces: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Workspace',
        },
    ],
    dateOfBirth: {
        type: String,
    },
    worker: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Worker',
    },
    phoneNumber: {
        type: String,
    },
}, {
    timestamps: true,
});
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified('password')) {
            this.password = yield (0, bcrypt_1.hash)(this.password, 10);
        }
        next();
    });
});
userSchema.methods.comparePassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield (0, bcrypt_1.compare)(password, this.password);
        return result;
    });
};
exports.default = (0, mongoose_1.model)('User', userSchema);