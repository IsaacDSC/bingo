import {Request, Response} from 'express';
import {GameCore} from "../core/game-core";
import {GameRepository} from "../database/game-repository";
import {inject, injectable} from "inversify";
import path from "path";

@injectable()
export class GameController {
    constructor(@inject('GameRepository') private gameRepository: GameRepository) {
    }

    async index(req: Request, res: Response) {
        res.sendFile(path.resolve(__dirname, '../static/views/index.html'));
    }

    async startNewRound(req: Request, res: Response) {
        const {roundName} = req.body;
        const users = this.gameRepository.getUsers();
        const repo = new GameCore(roundName)
        const round = await repo.startGame(users);
        const card = this.gameRepository.saveNewGame(round);
        res.status(200).json(card.toStruct());
    }
}