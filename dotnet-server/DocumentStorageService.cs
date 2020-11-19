
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace multi_user_todo_list
{
    public class DocumentStorageService : IDocumentStorageService
    {

        private string _dirPath = "data";
        public async Task<DocumentModel[]> ReadAllDocuments()
        {
            if (!Directory.Exists(_dirPath)){
                return new DocumentModel[0];
            }
            var reads = Directory.GetFiles(_dirPath)
                .Where(f => f.EndsWith(".json"))   
                .Select(async f => {
                    var text = await File.ReadAllTextAsync(f);
                    return Newtonsoft.Json.JsonConvert.DeserializeObject<DocumentModel>(text);
                }).ToArray();
            return await Task.WhenAll(reads);
        }

        public async Task WriteDocument(DocumentModel document)
        {
            if (!Directory.Exists(_dirPath)){
                Directory.CreateDirectory(_dirPath);
            }
            var path = Path.Join(this._dirPath, document.documentId + ".json");
            var json = Newtonsoft.Json.JsonConvert.SerializeObject(document);
            await File.WriteAllTextAsync(path, json);
        }
    }
}