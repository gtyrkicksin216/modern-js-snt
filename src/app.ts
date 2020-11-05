import Axios, { AxiosInstance } from 'axios';
import chalk from 'chalk';

interface CoindeskResponse {
	bpi: { [key: string]: number },
	disclaimer: string;
	time: {
		updated: string;
		udpatedISO: string;
	}
}

const todaysDate = new Date();
const yesterdaysDate = new Date(todaysDate);
yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);
const today = todaysDate;
const yesterday = yesterdaysDate;

function getDateQueryString (date: Date): string {
	return `${date.getFullYear()}-${date.getMonth()}-${date.getDay() < 10 ? '0' + date.getDay().toString() : date.getDay()}`
}


const endpoint: string = `https://api.coindesk.com/v1/bpi/historical/close.json?start=${getDateQueryString(yesterday)}&end=${getDateQueryString(today)}`;

async function getPriceChange (): Promise<void> {
	console.log(getDateQueryString(yesterday), getDateQueryString(today));
	Axios.get(endpoint)
		.then(res => {
			const { bpi } = res.data as CoindeskResponse;
			getPriceDifference(bpi[getDateQueryString(today)], bpi[getDateQueryString(yesterday)]);
		})
		.catch(err => console.error(err));
}

function getPriceDifference (todaysPrice: number, yesterdaysPrice: number): void {
	const difference = parseFloat((todaysPrice - yesterdaysPrice).toFixed(4));
	const isNegative = !(difference === Math.abs(difference));

	console.log(`
	${chalk.yellowBright('Yesteray\'s Price:')}           ${chalk.yellowBright(yesterdaysPrice)}
	${chalk.magentaBright('Today\'s Price:')}              ${chalk.magentaBright(todaysPrice)}
	======================================
	${isNegative ? chalk.bold.red('Down:  ') : chalk.bold.green('Up:    ')}                     ${isNegative ? chalk.bold.red(difference) : chalk.bold.green(difference)}
	`);
}

getPriceChange();
