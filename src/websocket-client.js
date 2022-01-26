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

export default WebsocketClient;