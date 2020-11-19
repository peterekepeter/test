using System.Net.WebSockets;

namespace multi_user_todo_list
{
    public class ClientConnection
    {
        public WebSocket Socket;

        public string WatchDocumentId { get; internal set; }
    }
}