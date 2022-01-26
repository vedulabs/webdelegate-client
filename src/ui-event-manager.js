import WebsocketClient from "./websocket-client";

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

    WebsocketClient.sendData({
        category: 'event',
        data: {
            type: 'resize',
            w: this.output_canvas.width,
            h: this.output_canvas.height
        }
    });
}

UIEventManager.onMouseMove = function(event) {
    WebsocketClient.sendData({
        category: 'event',
        data: {
            type: 'mousemove',
            x: event.clientX,
            y: event.clientY
        }
    });
}

UIEventManager.onMouseDown = function(event) {
    WebsocketClient.sendData({
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
    WebsocketClient.sendData({
        category: 'event',
        data: {
            type: 'mouseup',
            x: event.clientX,
            y: event.clientY
        }
    });
}

UIEventManager.onMouseWheel = function(event) {
    WebsocketClient.sendData({
        category: 'event',
        data: {
            type: 'wheel',
            delta: event.deltaY
        }
    });
}

UIEventManager.onKeyDown = function(event) {
    // console.log(event.code);
    WebsocketClient.sendData({
        category: 'event',
        data: {
            type: 'keydown',
            key: event.code
        }
    });
}

UIEventManager.onKeyUp = function(event) {
    WebsocketClient.sendData({
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
    WebsocketClient.sendData({
        category: 'command',
        data: {
            type: 'history',
            value: 'back'
        }
    });
}

UIEventManager.onContextMenu = (event) => event.preventDefault();

export default UIEventManager;