using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace multi_user_todo_list.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DocumentController : ControllerBase
    {
        [HttpGet("{id}")]
        public async Task GetDocument(
            [FromRoute] string id,
            [FromServices] IDocumentService documentService
        )
        {
            var document = await documentService.GetDocumentById(id);
            if (document == null){
                HttpContext.Response.StatusCode = 404;
                await HttpContext.Response.Body.WriteAsync(
                    Encoding.UTF8.GetBytes("not found")
                );
                return;
            }
            var json = Newtonsoft.Json.JsonConvert.SerializeObject(document.commands);
            HttpContext.Response.ContentType = "application/json";
            HttpContext.Response.StatusCode = 200;
            await HttpContext.Response.Body.WriteAsync(
                Encoding.UTF8.GetBytes(json)
            );
        }
    }
}
