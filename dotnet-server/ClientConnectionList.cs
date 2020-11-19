
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace multi_user_todo_list
{
    public class ClientConnectionList 
    {
        private LinkedList<ClientConnection> _clients = new LinkedList<ClientConnection>();
        private SemaphoreSlim _guard = new SemaphoreSlim(1,1);

        internal async Task Add(ClientConnection client)
        {
            await GuardedOp(() => {
                _clients.AddFirst(client);
            });
            Console.WriteLine($"Client {client} connected");
        }

        internal async Task Remove(ClientConnection client)
        {
            await GuardedOp(() => {
                _clients.Remove(client);
            });
            Console.WriteLine($"Client {client} disconnected");
        }

        public IEnumerable<ClientConnection> AllOpenClients 
            => _clients.Where(c => c.Socket.State == System.Net.WebSockets.WebSocketState.Open);

        public IEnumerable<ClientConnection> AllClientsWatching(string document_id)
            => AllOpenClients.Where(c => c.WatchDocumentId == document_id);

        private async Task GuardedOp(Action op){
            try
            {
                await _guard.WaitAsync();
                op();   
            }
            finally
            {
                _guard.Release();
            }
        }
    }
}