import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICommand } from './commands/ICommand';


@Injectable({
    providedIn: 'root'
})
export class SocketClientService {

    receive = new Subject<ICommand>();

    async send(arg0: string) {
        console.log('connect');
        await this.connect();
        console.log('sending');
        this._connection.send(arg0);
    }

    private _connection: Connection;
    private _connect_promise: Promise<void> = null;

    constructor() {
    }

    connect() {
        if (this._connect_promise) {
            return this._connect_promise;
        }
        if (this._connection && this._connection.opened) {
            return;
        }
        // const port = document.location.port ? (":" + document.location.port) : "";
        // const url = scheme + "://" + document.location.hostname + port + "/ws" ;
        const scheme = document.location.protocol === "https:" ? "wss" : "ws";
        const host = environment.backend_host || location.host;
        const path = "ws";
        const url = `${scheme}://${host}/${path}`;
        this._connect_promise = new Promise((resolve, reject) => {
            let complete = false;
            this._connection = new Connection(url,
                received_message => this.receive.next(received_message),
                () => {
                    if (complete) {
                        return;
                    }
                    if (this._connection.opened) {
                        this._connect_promise = null;
                        complete = true;
                        resolve();
                    }
                    if (this._connection.closed) {
                        this._connect_promise = null;
                        complete = true;
                        reject(this._connection.closed_reason);
                    }
                }
            );
        });
        return this._connect_promise;
    }
}

class Connection {

    opened = false;
    closed = false;
    connection_error = false;
    closed_code = 0;
    closed_reason = '';
    ready_state = '';

    private _socket: WebSocket;

    constructor(
        url: string,
        private _on_receive: (any) => void,
        private _on_state_change: () => void) {
        const socket = new WebSocket(url);
        console.log('creating websocket');
        this._socket = socket;
        socket.onopen = () => {
            this.opened = true;
            this._update_state();
        }
        socket.onclose = (event) => {
            this.opened = false;
            this.closed = true;
            this.closed_code = event.code;
            this.closed_reason = event.reason;
            this._update_state();
        }
        socket.onerror = (event) => {
            this.connection_error = true;
            this._update_state();
        }
        socket.onmessage = (event) => {
            this._update_state();
            this._receive(JSON.parse(event.data));
        }
    }

    close() {
        this._socket.close(1000, "Closing from client");
        this._on_receive = null;
    }

    send(data: string) {
        console.log("SEND", data);
        this._socket.send(data);
    }

    private _receive(data: any) {
        console.log("RECEIVE", data);
        if (this._on_receive) {
            this._on_receive(data);
        }
    }

    private _update_state() {
        this.ready_state = get_ready_state(this._socket);
        if (this._on_state_change) {
            this._on_state_change();
        }
    }

}

function get_ready_state(socket: WebSocket) {
    switch (socket.readyState) {
        case WebSocket.CLOSED: return 'Closed';
        case WebSocket.CLOSING: return "Closing...";
        case WebSocket.CONNECTING: return "Connecting...";
        case WebSocket.OPEN: return "Open";
        default: return "Unknown WebSocket State: " + socket.readyState;
    }
}