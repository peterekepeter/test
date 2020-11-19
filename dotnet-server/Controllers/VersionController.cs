using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace multi_user_todo_list.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class VersionController : ControllerBase
    {
        [HttpGet]
        public string GetVersion()
        {
            return typeof(VersionController).Assembly.GetName().Version.ToString();
        }
    }
}
