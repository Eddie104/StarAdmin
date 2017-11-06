import * as config from './config';
import * as utils from './utils';

export function login(account, password) {
	return `${config.HOST}/admin/login/${utils.myEncodeURIComponent(account)}/${utils.myEncodeURIComponent(password)}`;
}

export function getAccountData(page, count, source = null) {
	const url = `${config.HOST}/admin/getAccountData/${page}/${count}`;
	if (source === 'web' || source === 'android') {
		return `${url}/${source}`;
	}
	return url;
}

export function getUserData(page, count, source = null) {
	const url = `${config.HOST}/admin/getUserData/${page}/${count}`;
	if (source === 'web' || source === 'android') {
		return `${url}/${source}`;
	}
	return url;
}

export function getUserLoginData(page, count, source = null) {
	const url = `${config.HOST}/admin/getUserLoginData/${page}/${count}`;
	if (source === 'web' || source === 'android') {
		return `${url}/${source}`;
	}
	return url;	
}

export function getUserLevelData(uid, page, count) {
	return `${config.HOST}/admin/getUserLevelData/${uid}/${page}/${count}`;
}

export function getLevelData (page, count) {
	return `${config.HOST}/admin/getLevelData/${page}/${count}`;
}

export function getDollarRecord(page, count) {
	return `${config.HOST}/admin/getDollarRecord/${page}/${count}`;
}

export function getItemRecord(uid, page, count) {
	return `${config.HOST}/admin/getItemRecord/${uid}/${page}/${count}`;
}

export function getDiamondsRecord(uid, page, count) {
	return `${config.HOST}/admin/getDiamondsRecord/${uid}/${page}/${count}`;
}

export function getPay(uid, page, count) {
	return `${config.HOST}/admin/getPay/${uid}/${page}/${count}`;
}

export function getDollarCode(page, count) {
	return `${config.HOST}/admin/getDollarCode/${page}/${count}`;
}

export function createActivityNotice(content) {
	return `${config.HOST}/admin/createActivityNotice`;
}

export function getActivityNotice(page, count) {
	return `${config.HOST}/admin/getActivityNotice/${page}/${count}`;
}

// export function register(account, password, mail) {
// 	return `${config.HOST}/users/register/${account}/${password}/root/${encodeURIComponent(mail)}`;
// }

// export function login(account, password) {
// 	return `${config.HOST}/users/login/${account}/${password}`;
// }

// export function getUserData(accountID) {
// 	return `${config.HOST}/users/easy/getUserData/${accountID}`;
// }

// export function modifyRootUser() {
// 	return `${config.HOST}/root/modifyRootUser`;
// }

// export function getRootUsers(lastID, count) {
// 	return `${config.HOST}/root/getRootUsers/${lastID}/${count}`;
// }

// export function getAppStoreAccount() {
// 	return `${config.HOST}/games/getAppStoreAccount`;
// }

// export function getAppStoreAccountByID(id) {
// 	return `${config.HOST}/games/getAppStoreAccountByID/${id}`;
// }

// export function addAppStoreAccount() {
// 	return `${config.HOST}/games/addAppStoreAccount`;
// }

// export function getGameTemplate() {
// 	return `${config.HOST}/root/getGameTemplate`;
// }

// export function getBuildMac() {
// 	return `${config.BUILD_ADMIN_HOST}/getBuildMac`;
// }

// export function addBuildMac() {
// 	return `${config.BUILD_ADMIN_HOST}/addBuildMac`;
// }

// export function getBuildMacByID(id) {
// 	return `${config.BUILD_ADMIN_HOST}/getBuildMacByID/${id}`;
// }

// export function modifyBuildMac() {
// 	return `${config.BUILD_ADMIN_HOST}/modifyBuildMac`;
// }

// export function getGameSeries(uid, page, count, creator) {
// 	return `${config.HOST}/root/getGameSeries/${uid}/${page}/${count}/${creator}`;
// }

// export function addGameSeries() {
// 	return `${config.HOST}/root/addGameSeries`;
// }

// export function getGameSeriesByID(id) {
// 	return `${config.HOST}/root/getGameSeriesByID/${id}`;
// }

// export function getGames(uid, rootTemplate, rootSeries, creator) {
// 	return `${config.HOST}/root/getGames/${uid}/${rootTemplate}/${rootSeries}/${creator}`;
// }

// export function getAllGames(uid, page, count, creator) {
// 	return `${config.HOST}/root/getAllGames/${uid}/${page}/${count}/${creator}`;
// }

// export function checkGameNames() {
// 	return `${config.HOST}/games/checkGameNames`;
// }

// export function createGames() {
// 	return `${config.HOST}/root/createGames`;
// }

// export function getGame(uid, id) {
// 	return `${config.HOST}/root/getGame/${uid}/${id}`;
// }

// export function modifyGame() {
// 	return `${config.HOST}/root/modifyGame`;
// }

// export function getAppStoreAccountUsed(seriesID) {
// 	return `${config.HOST}/root/getAppStoreAccountUsed/${seriesID}`;
// }

// export function addTask() {
// 	return `${config.BUILD_ADMIN_HOST}/addTask`;
// }

// export function getTask(uid, templateID, seriesID, page, count, creator) {
// 	return `${config.BUILD_ADMIN_HOST}/getTask/${uid}/${templateID}/${seriesID}/${page}/${count}/${creator}`;
// }

// export function getWaitingTask() {
// 	return `${config.BUILD_ADMIN_HOST}/getWaitingTask`;
// }

// export function cancelTask(id) {
// 	return `${config.BUILD_ADMIN_HOST}/cancelTask/${id}`;
// }

// export function deleteGameSeries(uid, id) {
// 	return `${config.HOST}/root/deleteGameSeries/${uid}/${id}`;
// }

// export function getAllGamesData(uid, startDate, endDate, page, count) {
// 	return `${config.HOST}/root/getAllGamesData/${uid}/${startDate}/${endDate}/${page}/${count}`;
// }

// export function addIncome(uid, targetUID, yomob, chance, date) {
// 	return `${config.HOST}/root/addIncome/${uid}/${targetUID}/${yomob}/${chance}/${date}`;
// }

// export function getIncome(uid, targetUID, startDate, endDate, page, count) {
// 	return `${config.HOST}/root/getIncome/${uid}/${targetUID}/${startDate}/${endDate}/${page}/${count}`;
// }

// export function getTaoJinFarmIncome(ssid) {
// 	return `${config.HOST}/taoJinFarm/getTaoJinFarmIncome/${ssid}`;
// }