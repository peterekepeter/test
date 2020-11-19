import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SocketClientService } from './socket-client.service';
import { generateUniqueId } from './unique-id';

@Injectable({
    providedIn: 'root'
})
export class DocumentService {

    document_id = new BehaviorSubject<string>(this._get_document_id_from_url());

    constructor(private _socket_client : SocketClientService) { 
        this.document_id.subscribe(id => this._handle_document_change(id));
        window.onpopstate = (e) => {
            const id = this._get_document_id_from_url();
            if (id != this.document_id.value){
                this.document_id.next(id);
            }
        };
        if (this.document_id.value == null || this.document_id.value === ''){
            this.document_id.next(generateUniqueId());
        }
    }
    
    private _handle_document_change(document_id: string): void {
        this._set_document_id_to_url(document_id);
        this._socket_client.send(JSON.stringify({
            method: "WATCH",
            document_id
        }));
    }

    private _get_document_id_from_url(): any {
        let id = window.location.hash;
        if (id.startsWith('#')){
            id = id.substr(1);
        }
        return id;
    }

    private _set_document_id_to_url(id: string): any{
        window.location.hash = id;
    }
}
