import fs from "fs";
import {injectable} from 'inversify';
import {GameCore, User} from "../core/game-core";

@injectable()
export class GameRepository {
    private readonly fileName: string = "database.json";

    getData() {
        const data = fs.readFileSync(this.fileName, "utf8");
        return JSON.parse(data);
    }

    saveUser(user: User) {
        const file = "./tmp/users.json"
        let data = fs.readFileSync(file, "utf8")
        const users = !!data ? JSON.parse(data) : []

        if (users?.find((u: { username: string; }) => u.username == user.username)) {
            throw new Error("User already exists");
        }

        users.push(user);
        fs.writeFileSync(file, JSON.stringify(users));
        return user;
    }

    saveNewGame(game: GameCore) {
        fs.writeFileSync(this.fileName, game.toStringfy());
        return game;
    }

    getUsers(): User[] {
        const file = "./tmp/users.json"
        let data = fs.readFileSync(file, "utf8")
        const users = !!data ? JSON.parse(data) : []

        return users?.map(
            (user: { username: string; cardGamer: number[][] }) => {
                const u = new User(user.username)
                u.card = user.cardGamer ?? []
                return u
            }
        );

    }

    resetSorted() {
        fs.writeFileSync(`sorted.json`, JSON.stringify([]));
    }

    getLastIndexSorted() {
        const sortedData = fs.readFileSync(`sorted.json`, "utf8");
        const sorting = JSON.parse(sortedData);
        return sorting.length;
    }

    saveNumberSorted({sorted, voice}: { sorted: number, voice: string }) {
        const sortedData = fs.readFileSync(`sorted.json`, "utf8");
        const sorting = JSON.parse(sortedData);
        sorting.push({sorted, voice, eventAt: new Date()});
        fs.writeFileSync(`sorted.json`, JSON.stringify(sorting));
    }
}
