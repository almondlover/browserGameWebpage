using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using System.Data;
using WebApp.Models;

namespace WebApp.Controllers
{

    [ApiController]
    public class ActionController : ControllerBase
    {
        protected delegate T ModelDelegate<T>();

        protected IConfiguration _config;
        public MySqlConnection dbconnection;
        public ActionController(IConfiguration config)
        {
            this._config = config;
        }
        protected T RetrieveFromDB<T>(ModelDelegate<T> actionDel)where T:class, new()
        {
            var data = new T();
            dbconnection = new MySqlConnection(_config["ConnectionStrings:DefaultConnection"]);

            using (dbconnection)
            {
                dbconnection.Open();
                data =actionDel();
            }
            return data;
        }

    }
}
