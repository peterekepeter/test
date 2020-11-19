using System.Threading.Tasks;

namespace multi_user_todo_list
{
    public interface IDocumentService
    {
        Task<dynamic> AppendCommand(string documentId, dynamic command);

        Task<DocumentModel> GetDocumentById(string documentId);
    }
}