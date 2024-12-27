import express, {Request, Response} from "express";
import {Server} from "socket.io";
import {createServer} from "http";
import cors from "cors";
import path from "path";
import {GameRepository} from "./database/game-repository";
import {UserController} from "./controllers/user-controller";
import {GameController} from "./controllers/round-controller";
import {GameCore} from "./core/game-core";
import fs from "fs";

const app = express();
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(cors());
app.use(express.json());

const gameRepository = new GameRepository();
const userController = new UserController();
const gameController = new GameController();

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
    transports: ["websocket", "polling"],
});

const game = io.of("/game");


app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, 'static/views/index.html'));
});

app.get("/user", (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, 'static/views/user-joiner.html'));
});

app.get("/user/card/:username", userController.getCard);
app.post("/user/card", userController.addUser);
app.post("/round", gameController.startNewRound);

game.on("connection", (socket) => {
    socket.on("start-game", async ({name}) => {
        if (!name) {
            const repository = new GameRepository()
            const users = repository.getUsers();
            const repo = new GameCore(name)
            const round = await repo.startGame(users);
            repository.saveNewGame(round);
            game.emit("game-started", {name});

            const numberOfSorted = gameRepository.getData()?.sortedNumbers ?? [];
            const sorted = numberOfSorted.length == 0 ? 0 : numberOfSorted[0];
            game.emit("sorted", {sorted: sorted?.sorted, voice: sorted?.voice, eventAt: new Date()});
        }
    })

    socket.on("marked-number", (data) => {
        const event = `marked-number-${data.username}`;
        const repository = new GameRepository();
        const database = repository.getData();
        const value = database.sortedNumbers.find((e: any) => e.sorted == data.number);
        if (!value) {
            socket.emit(event, {msg: "Number not found"});
        } else {
            fs.writeFileSync(`${data.username}.json`, JSON.stringify(value));
            socket.emit(event, value);
        }
    })

    socket.on('next-step', () => {
        const numberOfSorted = gameRepository.getData()?.sortedNumbers ?? [];
        const sorted = numberOfSorted.length == 0 ? 0 : numberOfSorted[1];
        game.emit("sorted", {sorted: sorted?.sorted, voice: sorted?.voice, eventAt: new Date()});
    });

    setInterval(() => {
        const repository = new GameRepository()
        const users = repository.getUsers();
        socket.emit("activated-users", {users})
    }, 1000)

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});


httpServer.listen(3000, () => {
    console.log("listening on *:3000");
});
