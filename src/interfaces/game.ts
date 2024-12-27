import {GameCore, User} from "../core/game-core";

export interface IGameRepository {
    getData(): any

    saveUser(user: User): any

    saveNewGame(game: GameCore): any

    getUsers(): User[]

}
