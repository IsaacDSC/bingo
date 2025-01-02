import "reflect-metadata";
import express from "express";
import {createServer} from "http";
import cors from "cors";
import path from "path";
import {GameRepository} from "./database/game-repository";
import {routes} from "./routes";
import {WebsocketController} from "./controllers/websocket/controller";

const app = express();
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(cors());
app.use(express.json());

const gameRepository = new GameRepository();

const httpServer = createServer(app);

const websocket = new WebsocketController(httpServer, gameRepository);
websocket.onEvents()

for (const [path, value] of Object.entries(routes())) {
    switch (value.method) {
        case "GET":
            app.get(path, (req, res) => value.controller(req, res));
            break;
        case "POST":
            app.post(path, (req, res) => value.controller(req, res));
            break;
        case "PUT":
            app.put(path, (req, res) => value.controller(req, res));
            break;
        case "DELETE":
            app.delete(path, (req, res) => value.controller(req, res));
            break;
        default:
            break;
    }
}

httpServer.listen(3000, () => {
    console.log("listening on *:3000");
});
