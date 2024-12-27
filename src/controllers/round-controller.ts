import {Request, Response} from 'express';
import {GameCore} from "../core/game-core";
import {GameRepository} from "../database/game-repository";

export class GameController {
    async startNewRound(req: Request, res: Response) {
        const {roundName} = req.body;
        const repository = new GameRepository()
        const users = repository.getUsers();
        const repo = new GameCore(roundName)
        const round = await repo.startGame(users);
        const card = repository.saveNewGame(round);
        res.status(200).json(card.toStruct());
    }
}