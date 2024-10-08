"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const ws_1 = __importDefault(require("ws"));
const body_parser_1 = __importDefault(require("body-parser"));
const crypto_1 = require("crypto");
// Create a new express app instance
const app = (0, express_1.default)();
// Parse JSON bodies
const jsonParser = body_parser_1.default.json();
// Create a new HTTP server
const server = http_1.default.createServer(app);
// Create a new WebSocket server
const wss = new ws_1.default.Server({ server });
app.post("/webhook", jsonParser, (req, res) => {
    // Broadcast the notification to all connected clients
    // In a real app, you would probably want to send to specific clients
    wss.clients.forEach((client) => {
        if (client.readyState === ws_1.default.OPEN) {
            client.send(JSON.stringify({
                id: (0, crypto_1.randomUUID)(), // Generate a random ID for the message
                type: "notification", // Give the message a type
                // Encode the data from the webhook into the message
                data: {
                    title: req.body.data.localizations[0].title,
                    slug: req.body.data.slug,
                    presentation: req.body.data.localizations[0].presentation,
                    imagePreviewByUrl: req.body.data.imagePreviewByUrl,
                    imagePreview: req.body.data.imagePreview,
                },
            }));
        }
    });
    res.sendStatus(200);
});
// Handle new WebSocket connections
wss.on("connection", (ws) => {
    // Acknowledge connection
    ws.send(JSON.stringify({ id: (0, crypto_1.randomUUID)(), type: "connection", data: null }));
});
const port = process.env.PORT || 8999;
// Start the server
server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
//# sourceMappingURL=index.js.map