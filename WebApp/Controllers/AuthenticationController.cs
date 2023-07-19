using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebApp.Controllers
{

    [ApiController]
    public class AuthenticationController : ActionController
    {
        protected IHttpContextAccessor _httpContextAccessor;
        public AuthenticationController(IConfiguration config, IHttpContextAccessor httpContextAccessor):base(config)
        {
            
            this._httpContextAccessor = httpContextAccessor;
        }
    }
}
