// exports.isPhone = function (phone) {
// 	return RegExp(/^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57]|17[0-9])[0-9]{8}$/).test(phone);
// };

// exports.isEmail = function (mail) {
// 	return RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/).test(mail);
// };

export function isTalkingDataID (id) {
	return RegExp(/^[A-Z0-9]{32}$/).test(id);
};

export function isYomobAppID (id) {
	return RegExp(/^[A-Za-z0-9]{20}$/).test(id);
};

export function isYomobAdsID (id) {
	return RegExp(/^[A-Za-z0-9]{19}$/).test(id);
};

// exports.isChanceID = function (id) {
// 	return RegExp(/^\d{9}-[A-Z0-9]{6}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{9}$/).test(id);
// };

export function isChanceID(id) {
	return RegExp(/^\d{9}-[A-Z0-9]{6}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{9}$/).test(id);
}