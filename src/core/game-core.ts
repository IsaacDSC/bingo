import {GetVoice} from "../utils/voices";

export class User {
    username: string
    card: number[][]

    constructor(name: string) {
        this.username = name
        this.card = []
    }

}

export class GameCore {
    private playName: string
    private users: User[]
    private sortedNumbers: { sorted: number, voice: string }[]
    private startedAt: Date | null

    constructor(playName: string = 'Bingo') {
        this.playName = playName
        this.users = []
        this.sortedNumbers = []
        this.startedAt = new Date();
    }

    private readonly maxLimit = 100;
    private readonly maxSortedNumbers = 71;

    private sortNumber(): number {
        const number = Math.floor(Math.random() * this.maxLimit);
        const alreadySorted = this.sortedNumbers.find(e => e.sorted == number);
        if (alreadySorted || number <= 0) {
            return this.sortNumber();
        }
        return number;
    }

    private generateRow = (max: number) => {
        const row = [];
        for (let i = 0; i < max; i++) {
            row.push(Math.floor(Math.random() * this.maxLimit));
        }
        return row;
    }

    private generateCard(): number[][] {
        const card = [];

        const max = 5;

        card.push(this.generateRow(max))

        card.push(this.generateRow(max))

        const medium = this.generateRow(max).map((e, index) => index == 2 ? 0 : e)
        card.push(medium)

        card.push(this.generateRow(max))

        card.push(this.generateRow(max))

        return card;
    }

    async startGame(users: User[]): Promise<GameCore> {
        for (let i = 0; i < this.maxSortedNumbers; i++) {
            const number = this.sortNumber();
            const voice = await GetVoice(number) ?? '';
            this.sortedNumbers.push({voice, sorted: number});
        }

        for (let user of users) {
            user.card = this.generateCard();
        }

        this.users = users;
        this.startedAt = new Date();
        return this;
    }

    toStruct(): any {
        return {
            playName: this.playName,
            users: this.users,
            sortedNumbers: this.sortedNumbers,
            startedAt: this.startedAt
        };
    }

    toStringfy(): string {
        return JSON.stringify({
            playName: this.playName,
            users: this.users,
            sortedNumbers: this.sortedNumbers,
            startedAt: this.startedAt
        });
    }

}


