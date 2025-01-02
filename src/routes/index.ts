import {Request, Response} from 'express'
import {container} from "../container";
import {GameController} from "../controllers/round-controller";
import {UserController} from "../controllers/user-controller";

export const routes = () => {
    const gameController = container.get<GameController>(GameController);
    const userController = container.get<UserController>(UserController);
    return {
        "/user": {
            "controller": (req: Request, res: Response) => userController.index(req, res),
            "method": "GET"
        },
        "/user/card/:username": {
            "controller": (req: Request, res: Response) => userController.getCard(req, res),
            "method": "GET"
        },
        "/user/card": {
            "controller": (req: Request, res: Response) => userController.addUser(req, res),
            "method": "POST"
        },
        "/": {
            "controller": (req: Request, res: Response) => gameController.index(req, res),
            "method": "GET"
        },
        "/round": {
            "controller": (req: Request, res: Response) => gameController.startNewRound(req, res),
            "method": "POST"
        }
    }
}
