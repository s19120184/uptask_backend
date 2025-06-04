"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server"));
const colors_1 = __importDefault(require("colors"));
const port = process.env.PORT || 4000;
server_1.default.listen(port, () => {
    (colors_1.default.cyan.bold("Rest api server listening on port 4000 "));
});
//wT_452CTgiGtire
//mongodb+srv://root:<password>@cluster0.gnzkead.mongodb.net/
//# sourceMappingURL=index.js.map