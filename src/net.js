// /**
//  * 发送post请求
//  * @param	{[string]}	 url						 api
//  * @param	{[json]}		 data						数据
//  * @param	{[function]} successCallback 成功的回调
//  * @param	{[function]} errorCallback	 失败的回调
//  */
// export function post (url, data, successCallback, errorCallback = null) {
// 	if (!isConnected) {
// 		utils.toast('网络链接已断开');
// 		errorCallback && errorCallback('net is not Connected');
// 		return;
// 	}
// 	timeout(fetch(url, {
// 		method: 'POST',
// 		headers: {
// 			'Accept': 'application/json',
// 			'Content-Type': 'application/json'
// 			// 'Accept': "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
// 			// 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
// 		},
// 		body: JSON.stringify(data)
// 	}), TIME_OUT)
// 		.then((response) => response.text())
// 		.then((responseText) => {
// 			successCallback(JSON.parse(responseText));
// 		})
// 		.catch(e => errorCallback && errorCallback(e));
// }

/**
 * 发送get请求
 * @param	{[string]}	 url						 api
 * @param	{[function]} successCallback 成功时的回调
 * @param	{[function]} errorCallback	 错误时的回调
 */
export function get (url, successCallback, errorCallback = null) {
	fetch(url).then(response => response.text()).then(responseText => {
		successCallback(JSON.parse(responseText));
	}).catch(e => {
		errorCallback && errorCallback(e);
	});
}

export function post (url, data, successCallback, errorCallback = null, headers = null) {
	headers = headers || {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
		// 'Accept': "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
		// 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
	};
	fetch(url, {
		method: 'POST',
		headers,
		body: JSON.stringify(data)
	}).then(response => response.text()).then(responseText => {
		successCallback(JSON.parse(responseText));
	}).catch(e => {
		errorCallback && errorCallback(e);
	});
}