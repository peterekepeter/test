import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICommand } from './commands/ICommand';
import { DocumentService } from './document.service';
import { SocketClientService } from './socket-client.service';

@Injectable({
    providedIn: 'root'
})
export class TaskSyncService {

    private list: ICommand[] = [];
    historyChanged = new Subject<ICommand[]>();
    message_stream = new Subject<ICommand>();

    constructor(private _socket_client: SocketClientService,
        private _document: DocumentService) {
        _document.document_id.subscribe(document_id => {
            this.load_from_server(document_id);
        });
        _socket_client.receive.subscribe(message => {
            this.message_stream.next(message);
        })
    }

    add(cmd: ICommand) {
        this._socket_client.send(JSON.stringify({
            method: "WRITE",
            document_id: this._document.document_id.value,
            command: cmd
        }));
    }
    
    async load_from_server(document_id: string) {
        try
        {
            const host = environment.backend_host || location.host;
            const request = await fetch(`${location.protocol}//${host}/document/${encodeURIComponent(document_id)}`);
            if (request.status !== 200){
                return;
            }
            const result = await request.json() as ICommand[];
            this.list = result;
            this.historyChanged.next(this.list);
        }
        catch (e){
            console.error("failed to load doc");
            this.list = [];
        }
    }
}
