using System.Threading.Tasks;

namespace multi_user_todo_list
{
    public interface IDocumentStorageService
    {
        Task WriteDocument(DocumentModel document);
        Task<DocumentModel[]> ReadAllDocuments();
    }
}