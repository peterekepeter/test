
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace multi_user_todo_list
{
    public class ClientConnectionService
    {
        private ClientConnectionList clients = new ClientConnectionList();
        private IDocumentService _document;

        public ClientConnectionService(IDocumentService document){
            this._document = document;
        }

        internal async Task HandleNewConnection(WebSocket webSocket)
        {
            var client = new ClientConnection { Socket = webSocket };
            await clients.Add(client);
            try
            {
                await ReadLoop(client);
            }
            finally{
                await clients.Remove(client);
            }
        }

        private async Task ReceiveMessage(ClientConnection client, string utfString)
        {
            dynamic obj = Newtonsoft.Json.JsonConvert.DeserializeObject<ExpandoObject>(utfString);
            string method = obj.method;
            switch (method){
                case "WATCH":
                    client.WatchDocumentId = obj.document_id;
                    break;
                case "WRITE":
                    await _document.AppendCommand(obj.document_id, obj.command);
                    break;
                default:
                    Console.WriteLine($"Unknown method: {method} message: {utfString}");
                    break;
            }
        }

        private async Task ReadLoop(ClientConnection client)
        {
            var socket = client.Socket;
            var buffer = new byte[1024 * 4];
            WebSocketReceiveResult result;
            while (true)
            {
                result = await socket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

                if (result.CloseStatus.HasValue){
                    break;
                }

                string utfString = Encoding.UTF8.GetString(buffer, 0, buffer.FindJsonEnd());

                await ReceiveMessage(client, utfString);
                //await socket.SendAsync(new ArraySegment<byte>(buffer, 0, result.Count), result.MessageType, result.EndOfMessage, CancellationToken.None);
            }
            await socket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
        }
    }
}