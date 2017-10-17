function _deepcopy(source) {
	let result = source instanceof Array ? [] : {};
	let t = null;
	for (let key in source) {
		t = typeof(source[key]);
		if (key === "reply") {
			console.log(t);
		}
		result[key] = t === "object" ? _deepcopy(source[key]): source[key];
	}
	return result; 
}

/**
 * 深度复制
 * @param  {[type]} source [description]
 * @return {[type]}        [description]
 */
export function deepcopy(source) {
	return _deepcopy(source);
}

export function getItemFromArray(arr, key, val) {
	for (let i = 0; i < arr.length; i++) {
		if(arr[i][key] === val) return arr[i];
	}
	return null;
}

export function dateFormat(date, fmt) {
	const o = {
		"M+": date.getMonth() + 1,
		"d+": date.getDate(),
		"h+": date.getHours(),
		"m+": date.getMinutes(),
		"s+": date.getSeconds(),
		"q+": Math.floor((date.getMonth() + 3) / 3),
		"S": date.getMilliseconds()
	};
	if(/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	for(let k in o) {
		if(new RegExp("("+ k +")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
		}
	}
	return fmt;
}

export function yesterday() {
	const now = new Date().getTime();
	return new Date(now - 86400000);
}

export function isPhone(phone) {
	return RegExp(/^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57]|17[0-9])[0-9]{8}$/).test(phone);
}

export function isEmail(mail) {
	return RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/).test(mail);
}

let userInfo = localStorage.getItem('userInfo');
userInfo = JSON.parse(userInfo);

export function getUserInfo() {
	return userInfo;
}

export function isAdmin() {
	return parseInt(userInfo.adminType, 10) > 0;
}

export function isMe() {
	return userInfo.name === '鸿杰';
}

export function toDecimal2(x) {
	let f = parseFloat(x);
	if (isNaN(f)) {
 		return '0.00';
	}
	f = Math.round(x * 100) / 100;
	let s = f.toString();
	let rs = s.indexOf('.');
	if (rs < 0) {
 		rs = s.length;
 		s += '.';
	}
	while (s.length <= rs + 2) {
 		s += '0';
	}
	return s;
}

export function myEncodeURIComponent(str) {
	return encodeURIComponent(str.replace(/%/g, '`'));
};