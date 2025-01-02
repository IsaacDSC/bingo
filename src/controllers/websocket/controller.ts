import {GameRepository} from "../../database/game-repository";
import {GameCore} from "../../core/game-core";
import {Server} from "socket.io";


export class WebsocketController {
    io: any;
    socket: any;

    constructor(private readonly httpServer: any, private readonly gameRepository: GameRepository) {
        const io = new Server(httpServer, {
            cors: {
                origin: "*",
            },
            transports: ["websocket", "polling"],
        });
        this.io = io.of("/game");
    }

    onEvents() {
        this.io.on("connection", (socket: any) => {
            this.socket = socket;

            socket.on("start-game", async (data: any) => {
                await this.startGame(data)
            })

            socket.on("marked-number", async (data: any) => {
                await this.markedNumber(data)
            })

            socket.on("next-step", async () => {
                await this.nextStep()
            })

            socket.on("disconnect", async () => {
                this.disconnect()
            })

            this.activatedUsers();

        })

        return this
    }

    private broadcast(event: string, input?: any) {
        this.io.emit(event, input);
    }

    private emit(event: string, input?: any) {
        this.socket.emit(event, input);
    }

    private activatedUsers() {
        setInterval(() => {
            const users = this.gameRepository.getUsers();
            // socket.emit("activated-users", {users})
            this.emit("activated-users", {users});
        },1000)
    }

    private async startGame(data: any) {
        if (!data?.name || data.name != undefined) {
            const users = this.gameRepository.getUsers();
            const gameCore = new GameCore(data.name)
            const round = await gameCore.startGame(users);
            this.gameRepository.saveNewGame(round);
            this.gameRepository.resetSorted()
            this.broadcast("game-started", {name: data.name});

            const numberOfSorted = this.gameRepository.getData()?.sortedNumbers ?? [];
            const sorted = numberOfSorted.length == 0 ? 0 : numberOfSorted[0];
            this.broadcast("sorted", {sorted: sorted?.sorted, voice: sorted?.voice, eventAt: new Date()});

        }
    }

    private async markedNumber(data: any) {
        const event = `marked-number-${data.username}`;
        const database = this.gameRepository.getData();
        const value = database.sortedNumbers.find((e: any) => e.sorted == data.number);
        if (!value) {
            // socket.emit(event, {msg: "Number not found"});
            this.emit(event, {msg: "Number not found"});
        } else {
            // fs.writeFileSync(`${data.username}.json`, JSON.stringify(value));
            this.emit(event, value);
        }
    }

    private async nextStep() {
        const numbersFromSorting = this.gameRepository.getData()?.sortedNumbers ?? [];
        const lastIndexSorted = this.gameRepository.getLastIndexSorted()
        if (lastIndexSorted == 0) {
            this.gameRepository.saveNumberSorted(numbersFromSorting[0]);
            const sorted = numbersFromSorting[1]
            this.gameRepository.saveNumberSorted(sorted);
            // game.emit("sorted", {sorted: sorted?.sorted, voice: sorted?.voice, eventAt: new Date()});
            this.broadcast("sorted", {sorted: sorted?.sorted, voice: sorted?.voice, eventAt: new Date()});
        } else {
            const sorted = numbersFromSorting[lastIndexSorted + 1]
            this.gameRepository.saveNumberSorted(sorted);
            // game.emit("sorted", {sorted: sorted?.sorted, voice: sorted?.voice, eventAt: new Date()});
            this.broadcast("sorted", {sorted: sorted?.sorted, voice: sorted?.voice, eventAt: new Date()});
        }
    }

    private disconnect() {
        console.log("user disconnected");
    }

}

