/*
 * (C) Copyright 2014-2015 Kurento (http://kurento.org/)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

const memberToken = ('r+M6eklnxVXnHbGjS22p1Mvu4DWwahzuhZQHXiH94ZFRqx1hxmE7sSkkmaG8Qb+oYTE=');
const streamerToken = ('vTMBtZlEmtYLG2WA4O78GpUZYkqWjXTHSeBm8WM8vQOT3Y8eqfo2n/MR+TTTBdgVcXE=');

var qs = (function (a) {
	if (a == "") return {};
	var b = {};
	for (var i = 0; i < a.length; ++i) {
		var p = a[i].split('=', 2);
		if (p.length == 1)
			b[p[0]] = "";
		else
			b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
	}
	return b;
})(window.location.search.substr(1).split('&'));

var ws;
var video;
var mvideo;
var webRtcPeer;

window.onload = function () {
	console = new Console();
	video = document.getElementById('video');
	mvideo = document.getElementById('mvideo');

	document.getElementById('call').addEventListener('click', function () { presenter(); });
	document.getElementById('viewer').addEventListener('click', function () { viewer(); });
	document.getElementById('terminate').addEventListener('click', function () { stop(); });
	document.getElementById('send').addEventListener('click', function () {
		sendMessage({
			type: 'message',
			message: new Date().toISOString()
		});
	});
}

function isOneToOne() {
	return document.getElementById('o2o').checked;
}

window.onbeforeunload = function () {
	ws.close();
}

function connect(token, callback) {
	ws = new WebSocket('wss://turn.vndlive.com:443/rtc');
	ws.onopen = () => {
		sendMessage({
			type: 'token',
			live: qs.id || document.getElementById('txtID').value ||1,
			token: token
		});
	};

	ws.onmessage = function (message) {
		var parsedMessage = JSON.parse(message.data);
		console.info('Received message: ' + message.data);

		switch (parsedMessage.type) {
			case 'ready':
				callback();
				break;
			case 'rtc/presenterResponse':
				presenterResponse(parsedMessage);
				break;
			case 'rtc/viewerResponse':
				viewerResponse(parsedMessage);
				break;
			case 'rtc/stopCommunication':
				dispose();
				break;
			case 'rtc/iceCandidate':
				webRtcPeer.addIceCandidate(parsedMessage.candidate)
				break;
			case 'message':
				console.log('message: ' + parsedMessage.message);
				break;
			case 'live/closed':
				console.log('live room has been closed');
				break;
			default:
				console.error('Unrecognized message', parsedMessage);
		}
	}
}


function presenterResponse(message) {
	if (message.response != 'accepted') {
		var errorMsg = message.message ? message.message : 'Unknow error';
		console.warn('Call not accepted for the following reason: ' + errorMsg);
		dispose();
	} else {
		webRtcPeer.processAnswer(message.sdpAnswer);
	}
}

function viewerResponse(message) {
	if (message.response != 'accepted') {
		var errorMsg = message.message ? message.message : 'Unknow error';
		console.warn('Call not accepted for the following reason: ' + errorMsg);
		dispose();
	} else {
		webRtcPeer.processAnswer(message.sdpAnswer);
	}
}

function presenter() {
	const constraints = {
		audio: {
			deviceId: undefined 
		},
		video: {
				width: 640,
				// facingMode: { exact: "user" }, //預設使用前鏡頭
				facingMode: { exact: "environment" }, //預設使用後鏡頭
		}
	};
	if (!webRtcPeer) {
		showSpinner(video);
		if (isOneToOne()) {
			connect(document.getElementById('txtSToken').value ||streamerToken, () => webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv({
				remoteVideo: video,
				localVideo: mvideo,
				onicecandidate: onIceCandidate
			}, function (error) {
				if (error) return onError(error);

				this.generateOffer(onOfferPresenter);
			}));
		} else {
			connect(document.getElementById('txtSToken').value ||streamerToken, () => webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendonly({
				localVideo: video,
				onicecandidate: onIceCandidate,
				mediaConstraints: constraints,
			}, function (error) {
				if (error) return onError(error);

				this.generateOffer(onOfferPresenter);
			}));
		}
	}
}

function onOfferPresenter(error, offerSdp) {
	if (error) return onError(error);

	var message = {
		type: 'streamer',
		sdpOffer: offerSdp,
		webRTCID: qs.rtcid || document.getElementById('txtRtcID').value || '82a1966c-8e48-49d4-9b19-64e6adfe5be1'
	};
	sendMessage(message);
}

function viewer() {
	if (!webRtcPeer) {
		showSpinner(video);

		if (isOneToOne()) {
			connect(document.getElementById('txtMToken').value || memberToken, () => webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv({
				remoteVideo: video,
				localVideo: mvideo,
				onicecandidate: onIceCandidate
			}, function (error) {
				if (error) return onError(error);

				this.generateOffer(onOfferViewer);
			}));
		} else {
			connect(document.getElementById('txtMToken').value || memberToken, () => webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly({
				remoteVideo: video,
				onicecandidate: onIceCandidate
			}, function (error) {
				if (error) return onError(error);

				this.generateOffer(onOfferViewer);
			}));
		}
	}
}

function onOfferViewer(error, offerSdp) {
	if (error) return onError(error)

	var message = {
		type: 'member',
		sdpOffer: offerSdp,
		webRTCID: qs.rtcid || document.getElementById('txtRtcID').value || '82a1966c-8e48-49d4-9b19-64e6adfe5be1'
	}
	sendMessage(message);
}

function onIceCandidate(candidate) {
	console.log('Local candidate' + JSON.stringify(candidate));

	var message = {
		type: 'rtc/onIceCandidate',
		candidate: candidate
	}
	sendMessage(message);
}

function stop() {
	if (webRtcPeer) {
		var message = {
			type: 'rtc/stop'
		}
		sendMessage(message);
		dispose();
	}
}

function dispose() {
	if (webRtcPeer) {
		webRtcPeer.dispose();
		webRtcPeer = null;
	}
	hideSpinner(video);
	if (ws) {
		ws.close();
		ws = null;
	}
}

function sendMessage(message) {
	var jsonMessage = JSON.stringify(message);
	console.log('Sending message: ' + jsonMessage);
	ws.send(jsonMessage);
}

function showSpinner() {
	return;
	for (var i = 0; i < arguments.length; i++) {
		arguments[i].poster = './img/transparent-1px.png';
		arguments[i].style.background = 'center transparent url("./img/spinner.gif") no-repeat';
	}
}

function hideSpinner() {
	return;
	for (var i = 0; i < arguments.length; i++) {
		arguments[i].src = '';
		arguments[i].poster = './img/webrtc.png';
		arguments[i].style.background = '';
	}
}

/**
 * Lightbox utility (to display media pipeline image in a modal dialog)
 */
$(document).delegate('*[data-toggle="lightbox"]', 'click', function (event) {
	event.preventDefault();
	$(this).ekkoLightbox();
});
