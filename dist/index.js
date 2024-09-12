"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const user_1 = require("./controllers/user");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static('src/public'));
app.get('/way', (req, res) => {
    res.status(201).json({ message: 'Welcome to Auth ts file' });
});
app.post('/create-token', user_1.create);
const Port = process.env.PORT || 8989;
app.listen(Port, () => {
    console.log('Server running on port ' + Port);
});
