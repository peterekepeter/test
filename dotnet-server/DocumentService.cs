using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace multi_user_todo_list
{

    public class DocumentService : IDocumentService
    {
        private ConcurrentDictionary<string, DocumentRef> Store;
        private Task InitTask = null;
        private int InitCounter = 0;
        private IDocumentStorageService _storage;

        public DocumentService(IDocumentStorageService storage)
        {
            this._storage = storage;
        }

        class DocumentRef
        {
            public bool Dirty = false;
            public DocumentModel Document;
            public SemaphoreSlim Guard = new SemaphoreSlim(1, 1);
        }

        public async Task<DocumentModel> GetDocumentById(string documentId)
        {
            await LazyInitialize();
            if (Store.ContainsKey(documentId))
            {
                return Store[documentId].Document;
            }
            return null; // not found
        }

        public async Task AppendCommand(string documentId, dynamic _command)
        {
            dynamic command = _command;
            await LazyInitialize();
            await ModifyDocument(documentId, doc =>
            {
                doc.maxOrder++;
                command.order = doc.maxOrder;
                doc.commands.Add(command);
            });
            WriteChangesToStorage();
        }

        private async Task ModifyDocument(string id, Action<DocumentModel> modify)
        {
            var r = Store.GetOrAdd(id, _ => new DocumentRef { Document = new DocumentModel { documentId = id } });
            try
            {
                await r.Guard.WaitAsync();
                modify(r.Document);
                r.Document.modified = DateTime.UtcNow;
                r.Dirty = true;
            }
            finally
            {
                r.Guard.Release();
            }
        }

        private async void WriteChangesToStorage()
        {
            var keys = Store.Keys;
            foreach (var key in keys)
            {
                var r = Store[key];
                if (!r.Dirty)
                {
                    continue;
                }
                try
                {
                    await r.Guard.WaitAsync();
                    if (r.Dirty)
                    {
                        Optimize(r.Document);
                        await WriteDocumentToStorage(r.Document);
                        r.Dirty = false;
                    }
                }
                finally
                {
                    r.Guard.Release();
                }
            }
        }

        private void Optimize(DocumentModel document)
        {
            // maybe todo
        }

        private async Task LazyInitialize()
        {
            if (Interlocked.Increment(ref InitCounter) != 1)
            {
                while (InitTask == null)
                {
                    await Task.Yield();
                }
            }
            if (InitTask != null)
            {
                await InitTask;
            }
            var task = Task.Run(async () => Store = new ConcurrentDictionary<string, DocumentRef>(
                    (await _storage.ReadAllDocuments()
                ).Select(o => KeyValuePair.Create(o.documentId, new DocumentRef
                {
                    Document = o
                })))
            );
            InitTask = task;
            await task;
        }

        private async Task WriteDocumentToStorage(DocumentModel document)
        {
            await _storage.WriteDocument(document);
        }

    }
}