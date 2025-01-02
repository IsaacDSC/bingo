import fs from 'fs';
import path from 'path';

export const fileExists = (filePath: string): boolean => {
    return fs.existsSync(path.resolve(__dirname, filePath));
};

export const GetVoice = async (number: number) => {
    const filePath = `../static/sounds/${number}.mp3`;
    if (fileExists(filePath)) {
        return `/sounds/${number}.mp3`;
    } else {
        const dirPath = path.resolve(__dirname, '../static/sounds/others');
        try {
            const files = fs.readdirSync(dirPath);
            const randomNum = Math.floor(Math.random() * files.length);
            return `/sounds/others/${files[randomNum]}`;
        } catch (err) {
            throw new Error(`Error reading directory: ${err}`);
        }
    }
}
