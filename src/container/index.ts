import "reflect-metadata";
import {Container} from 'inversify';
import {UserController} from '../controllers/user-controller';

import {GameRepository} from '../database/game-repository'
import {GameController} from "../controllers/round-controller";

const container = new Container();
container.bind<GameRepository>('GameRepository').to(GameRepository);
container.bind<GameController>(GameController).toSelf();
container.bind<UserController>(UserController).toSelf();

export {container};