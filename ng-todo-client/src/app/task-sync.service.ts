import { Injectable } from '@angular/core';
import { EventEmitter } from 'protractor';
import { Observable, Subject } from 'rxjs';
import { ICommand } from './commands/ICommand';
import { DocumentService } from './document.service';
import { SocketClientService } from './socket-client.service';

@Injectable({
    providedIn: 'root'
})
export class TaskSyncService {

    private list: ICommand[] = [];
    historyChanged = new Subject<ICommand[]>();
    private static STORAGE_KEY = "CMD_LIST";

    constructor(private _socket_client: SocketClientService,
        private _document: DocumentService) {
        setTimeout(() => this.loadFromLocalStorage(), 0);
    }

    add(cmd: ICommand) {
        this.list.push(cmd);
        this.storeInLocalStorage();
        this._socket_client.send(JSON.stringify({
            method: "WRITE",
            document_id: this._document.document_id.value,
            command: cmd
        }));
    }

    storeInLocalStorage() {
        const str = JSON.stringify(this.list);
        localStorage.setItem(TaskSyncService.STORAGE_KEY, str);
    }

    loadFromLocalStorage() {
        const str = localStorage.getItem(TaskSyncService.STORAGE_KEY);
        if (!str) {
            return;
        }
        this.list = JSON.parse(str);
        if (this.list.length == 0) {
            return 0;
        }
        this.historyChanged.next(this.list);
    }
}
