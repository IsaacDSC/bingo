import {Request, Response} from "express";
import {User} from "../core/game-core";
import {GameRepository} from "../database/game-repository";

export class UserController {
    async addUser(req: Request, res: Response) {
        try {
            const {username} = req.body
            const user = new User(username);
            const card = new GameRepository().saveUser(user);
            res.status(200).send({card});
        } catch (e) {
            console.log(e);
            res.status(500).send({message: e});
        }
    }

    async getCard(req: Request, res: Response) {
        const {username} = req.params;
        const data = new GameRepository().getData()
        const card = data?.users?.find((user: { username: string }) => user.username === username);
        if (!card) {
            res.status(404).send({message: "User not found"});
            return
        }
        res.status(200).send(card);
    }

}
