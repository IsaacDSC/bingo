import {Request, Response} from "express";
import {inject, injectable} from 'inversify';

import {User} from "../core/game-core";
import {GameRepository} from "../database/game-repository";
import path from "path";


@injectable()
export class UserController {

    constructor(
        @inject('GameRepository') private gameRepository: GameRepository
    ) {
    }

    async index(req: Request, res: Response) {
        res.sendFile(path.resolve(__dirname, '../static/views/user-joiner.html'));
    }

    async addUser(req: Request, res: Response) {
        try {
            const {username} = req.body
            const user = new User(username);
            const card = this.gameRepository.saveUser(user);
            res.status(200).send({card});
        } catch (e) {
            console.log(e);
            res.status(500).send({message: e});
        }
    }

    async getCard(req: Request, res: Response) {
        const {username} = req.params;
        const data = this.gameRepository.getData()
        const card = data?.users?.find((user: { username: string }) => user.username === username);
        if (!card) {
            res.status(404).send({message: "User not found"});
            return
        }
        res.status(200).send(card);
    }

}
