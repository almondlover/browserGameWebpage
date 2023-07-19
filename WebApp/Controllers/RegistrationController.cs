using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using System.Collections.Generic;
using System.Data;
using WebApp.Models;

namespace WebApp.Controllers
{
    [Route("api/registration")]
    [ApiController]
    public class RegistrationController : ActionController
    {
        
        public RegistrationController(IConfiguration config):base(config)
        {
           
        }
        [AllowAnonymous]
        [HttpPost]
        public IActionResult Registration([FromBody] User user)
        {
            //auth

            var udata = RetrieveFromDB<UserData>(() => { return Authenticate(user); });

            if (udata != null)
                return Ok();

            return BadRequest();
        }
        private UserData Authenticate(User user)
        {
            UserData userData = new UserData();
            
            var cmd = dbconnection.CreateCommand();
                
            cmd.CommandText = @"SELECT * FROM `users` WHERE`users`.`UserName`=@username OR `users`.`E-mail`=@email;";
            cmd.Parameters.AddWithValue("@username", user.username);
            cmd.Parameters.AddWithValue("@email", user.email);
            //
            var adpt = new MySqlDataAdapter(cmd);
            var dt = new DataTable();
            adpt.Fill(dt);

            if (dt.Rows.Count > 0) userData = null;
            else
            { 
                cmd.CommandText= @"INSERT INTO `users` (`UserName`, `E-mail`, `Password`, `privateAcc`) VALUES(@username, @email, @password, @private); ";
                cmd.Parameters.AddWithValue("@password", user.password);
                cmd.Parameters.AddWithValue("@private", user.isPrivate);
                userData.username = user.username;
                userData.email = user.email;

                cmd.ExecuteNonQuery();
            }
                
            
            return userData;
        }
    }
}
