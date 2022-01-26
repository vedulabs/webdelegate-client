import WebsocketClient from './websocket-client';
import UIEventManager from './ui-event-manager';

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
        WebsocketClient.connect.apply(this, [everyNthFrame]);
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
        WebsocketClient.disconnect();
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
        UIEventManager.activate.apply(this);
    } catch (ex) {
        this.error(ex);
    }
}

WebdelegateClient.onDisconnected = function(event) {
    this.output_canvas_ctx.clearRect(0, 0, this.output_canvas.width, this.output_canvas.height);

    UIEventManager.deactivate.apply(this);

    console.info('WebdelegateClient is DISCONNECTED');
}

WebdelegateClient.onError = function(event) {
    console.warn('WebdelegateClient has encoutered a connection error');
}

export default WebdelegateClient;