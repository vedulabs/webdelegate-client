(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["WebdelegateClient"] = factory();
	else
		root["WebdelegateClient"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/ui-event-manager.js":
/*!*********************************!*\
  !*** ./src/ui-event-manager.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _websocket_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./websocket-client */ "./src/websocket-client.js");


const UIEventManager = {
    activated: false,
}

UIEventManager.activate = function() {
    if (UIEventManager.activated) {
        throw 'UIEventManager already activated!';
    }

    UIEventManager.onWindowResize = UIEventManager.onWindowResize.bind(this);

    window.addEventListener('resize', UIEventManager.onWindowResize);
    this.output_canvas.addEventListener('mousemove', UIEventManager.onMouseMove);
    this.output_canvas.addEventListener('mousedown', UIEventManager.onMouseDown);
    this.output_canvas.addEventListener('mouseup', UIEventManager.onMouseUp);
    this.output_canvas.addEventListener('mouseout', UIEventManager.onMouseUp);
    this.output_canvas.addEventListener('wheel', UIEventManager.onMouseWheel);

    window.addEventListener('keydown', UIEventManager.onKeyDown);
    window.addEventListener('keyup', UIEventManager.onKeyUp);

    this.output_canvas.addEventListener('contextmenu', UIEventManager.onContextMenu);

    window.addEventListener('popstate', UIEventManager.onPopState);

    UIEventManager.activated = true;
}

UIEventManager.deactivate = function() {
    window.removeEventListener('resize', UIEventManager.onWindowResize);
    this.output_canvas.removeEventListener('mousemove', UIEventManager.onMouseMove);
    this.output_canvas.removeEventListener('mousedown', UIEventManager.onMouseDown);
    this.output_canvas.removeEventListener('mouseup', UIEventManager.onMouseUp);
    this.output_canvas.removeEventListener('wheel', UIEventManager.onMouseWheel);

    window.removeEventListener('keydown', UIEventManager.onKeyDown);
    window.removeEventListener('keyup', UIEventManager.onKeyUp);

    this.output_canvas.removeEventListener('contextmenu', UIEventManager.onContextMenu);

    window.removeEventListener('popstate', UIEventManager.onPopState);

    UIEventManager.activated = false;
}

UIEventManager.onWindowResize = function(event) {
    this.output_canvas.width = this.output_canvas.clientWidth;
    this.output_canvas.height = this.output_canvas.clientHeight;

    _websocket_client__WEBPACK_IMPORTED_MODULE_0__["default"].sendData({
        category: 'event',
        data: {
            type: 'resize',
            w: this.output_canvas.width,
            h: this.output_canvas.height
        }
    });
}

UIEventManager.onMouseMove = function(event) {
    _websocket_client__WEBPACK_IMPORTED_MODULE_0__["default"].sendData({
        category: 'event',
        data: {
            type: 'mousemove',
            x: event.clientX,
            y: event.clientY
        }
    });
}

UIEventManager.onMouseDown = function(event) {
    _websocket_client__WEBPACK_IMPORTED_MODULE_0__["default"].sendData({
        category: 'event',
        data: {
            type: 'mousedown',
            button: event.button,
            x: event.clientX,
            y: event.clientY
        }
    });
}

UIEventManager.onMouseUp = function(event) {
    _websocket_client__WEBPACK_IMPORTED_MODULE_0__["default"].sendData({
        category: 'event',
        data: {
            type: 'mouseup',
            x: event.clientX,
            y: event.clientY
        }
    });
}

UIEventManager.onMouseWheel = function(event) {
    _websocket_client__WEBPACK_IMPORTED_MODULE_0__["default"].sendData({
        category: 'event',
        data: {
            type: 'wheel',
            delta: event.deltaY
        }
    });
}

UIEventManager.onKeyDown = function(event) {
    // console.log(event.code);
    _websocket_client__WEBPACK_IMPORTED_MODULE_0__["default"].sendData({
        category: 'event',
        data: {
            type: 'keydown',
            key: event.code
        }
    });
}

UIEventManager.onKeyUp = function(event) {
    _websocket_client__WEBPACK_IMPORTED_MODULE_0__["default"].sendData({
        category: 'event',
        data: {
            type: 'keyup',
            key: event.code
        }
    });
}

UIEventManager.onPopState = function (event) {
    event.preventDefault();
    history.pushState(null, document.title, location.href);
    _websocket_client__WEBPACK_IMPORTED_MODULE_0__["default"].sendData({
        category: 'command',
        data: {
            type: 'history',
            value: 'back'
        }
    });
}

UIEventManager.onContextMenu = (event) => event.preventDefault();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (UIEventManager);

/***/ }),

/***/ "./src/websocket-client.js":
/*!*********************************!*\
  !*** ./src/websocket-client.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const WebsocketClient = {
    protocol: 'vedulabs-ssr',
    ws: null,
}

WebsocketClient.connect = function(
    everyNthFrame,
) {
    if (WebsocketClient.ws) {
        throw 'WebsocketClient already connected';
    }

    let connectURL = `${this.server_url}?target_url=${btoa(this.target_url)}&target_width=${this.output_canvas.clientWidth}&target_height=${this.output_canvas.clientHeight}`;

    if (everyNthFrame) {
        connectURL += `&every_nth_frame=${everyNthFrame}`;
    }

    WebsocketClient.ws = new WebSocket(connectURL, this.protocol);

    WebsocketClient.ws.onopen = event => this.onConnected.apply(this, [event]);
    WebsocketClient.ws.onmessage = event => this.onDataRecevied.apply(this, [event]);
    WebsocketClient.ws.onclose = event => this.onDisconnected.apply(this, [event]);
    WebsocketClient.ws.onerror = event => this.onError.apply(this, [event]);
}

WebsocketClient.disconnect = function() {
    if (WebsocketClient.ws) {
        WebsocketClient.ws.close();

        WebsocketClient.ws = null;
    } else {
        throw 'WebdelegateClient is not connected'
    }
}

WebsocketClient.sendData = function(data) {
    if (WebsocketClient.ws) {
        WebsocketClient.ws.send(JSON.stringify(data));
    } else {
        throw 'WebdelegateClient is disconnected'
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (WebsocketClient);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _websocket_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./websocket-client */ "./src/websocket-client.js");
/* harmony import */ var _ui_event_manager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui-event-manager */ "./src/ui-event-manager.js");



const outputImage = new Image();

const capturedOutMedia = document.createElement('video');
const mediaSource = new MediaSource();

const WebdelegateClient = {
    server_url: null,
    target_url: null,
    output_canvas: null,

    error: (error_message) => {
        console.error(`WebdelegateClient: ${error_message}`)
    }
}

WebdelegateClient.start = function({
    server_url,
    target_url,
    output_canvas,
    everyNthFrame,
} = {}) {
    if (!server_url) {
        this.error('Server URL is not defined!');
        return;
    }
    if (!target_url) {
        this.error('Target URL is not defined!');
        return;
    }
    if (!output_canvas) {
        this.error('Output canvas DOM element is not defined!');
        return;
    }

    this.server_url = server_url;
    this.target_url = target_url;
    this.output_canvas = output_canvas;
    this.output_canvas_ctx = this.output_canvas.getContext('2d');

    try {
        _websocket_client__WEBPACK_IMPORTED_MODULE_0__["default"].connect.apply(this, [everyNthFrame]);
    } catch (ex) {
        this.error(ex);
    }

    // capturedOutMedia.autoplay = true;
    // Object.assign(capturedOutMedia.style, {
    //     width: `${500}px`,
    //     height: `${500}px`,
    //     backgroundColor: 'yellow',
    //     position: 'absolute',
    //     top: 0,
    //     left: 0,
    // });
    // document.body.appendChild(capturedOutMedia);

    capturedOutMedia.src = URL.createObjectURL(mediaSource);
    capturedOutMedia.setAttribute('autoplay', true);
    // capturedOutMedia.setAttribute('preload', 'auto');
    mediaSource.addEventListener('sourceopen', () => {
        URL.revokeObjectURL(capturedOutMedia.src);
        // this.capturedOutMediaSourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8", opus');
        this.capturedOutMediaSourceBuffer = mediaSource.addSourceBuffer('audio/webm; codecs=opus');
        // this.capturedOutMediaSourceBuffer = mediaSource.addSourceBuffer('audio/opus; codecs="opus"');

        // this.capturedOutMediaSourceBuffer.addEventListener('updateend', function (_) {
        //     console.log('updateend')
        // });

        this.capturedOutMediaSourceBuffer.mode = 'sequence';
    });

    // console.log(this);
}

WebdelegateClient.stop = function() {
    try {
        _websocket_client__WEBPACK_IMPORTED_MODULE_0__["default"].disconnect();
    } catch (ex) {
        this.error(ex);
    }
}

WebdelegateClient.onDataRecevied = async function(event) {
    // console.log(`${Date.now()}: DATA RECEVIED`);

    if (event.data.arrayBuffer) {
        const buffer = await event.data.arrayBuffer();
    
        if(!this.capturedOutMediaSourceBuffer.updating) {
            this.capturedOutMediaSourceBuffer.appendBuffer(buffer);

            if (capturedOutMedia.paused) {
                capturedOutMedia.play(0).catch(e => {});
            }
        }
    } else {
        const data = JSON.parse(event.data);
        if (data.frame) {
            outputImage.src = `data:image/jpeg;base64,${data.frame}`;
            return;
        }
        if (data.cursor) {
            this.output_canvas.style.cursor = data.cursor;
        }
    }


    // mediaQueue.push(event.data);
    // const reader = new FileReader();
    // reader.onload = (e) => { 
    //     this.capturedOutMediaSourceBuffer.appendBuffer(new Uint8Array(e.target.result));

    //     reader.onload = null;
    // }
    // reader.readAsArrayBuffer(mediaQueue.shift());
}

WebdelegateClient.onConnected = function(event) {
    console.log(`WebdelegateClient connected to ${event.target.url}`);

    outputImage.onload = () => {
        this.output_canvas.width = this.output_canvas.clientWidth;
        this.output_canvas.height = this.output_canvas.clientHeight;
        this.output_canvas_ctx.clearRect(0, 0, this.output_canvas.width, this.output_canvas.height);
        this.output_canvas_ctx.drawImage(outputImage, 0, 0);
    };
    outputImage.onload.bind(this);

    try {
        _ui_event_manager__WEBPACK_IMPORTED_MODULE_1__["default"].activate.apply(this);
    } catch (ex) {
        this.error(ex);
    }
}

WebdelegateClient.onDisconnected = function(event) {
    this.output_canvas_ctx.clearRect(0, 0, this.output_canvas.width, this.output_canvas.height);

    _ui_event_manager__WEBPACK_IMPORTED_MODULE_1__["default"].deactivate.apply(this);

    console.info('WebdelegateClient is DISCONNECTED');
}

WebdelegateClient.onError = function(event) {
    console.warn('WebdelegateClient has encoutered a connection error');
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (WebdelegateClient);
})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=index.js.map