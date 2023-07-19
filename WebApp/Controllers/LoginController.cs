using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApp.Models;
using MySqlConnector;
using System.Data;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Text.Json.Serialization;

namespace WebApp.Controllers
{
    [Route("api/Login")]
    [ApiController]
    public class LoginController : ActionController
    {
        
        
        public LoginController(IConfiguration config):base(config)
        {
            
        }

        [AllowAnonymous]
        [HttpPost]
        public IActionResult Login([FromBody] User user)
        {
            //auth


            var udata = RetrieveFromDB<UserData>(()=>{return Authenticate(user);});

            if (udata != null)
            {
                var token = GenerateToken(udata);
                return Ok(token);
            }
            
            return NotFound();
        }

        private string GenerateToken(UserData user)
        {
            var sKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var cred = new SigningCredentials(sKey, SecurityAlgorithms.Aes128CbcHmacSha256);
            var claims = new[]{
                new Claim("username", user.username),
                new Claim("useremail", user.email)

            };
            var tkn = new JwtSecurityToken(null, null,
                claims, null, null, cred );

            return new JwtSecurityTokenHandler().WriteToken(tkn);

        }
        private UserData Authenticate(User user) 
        {
            var userData = new UserData();
            
            var cmd=dbconnection.CreateCommand();
            //cmd.CommandText = @"SELECT `users`.`UserName`, `users`.`E-mail`, `users`.`privateAcc`, `users`.`Experience`, `users`.`HighestScore`, `unlockedClasses`.`cid` FROM `users` LEFT JOIN `unlockedClasses` ON `users`.`uid`=`unlockedClasses`.`uid` AND `users`.`UserName`=@username AND `users`.`E-mail`=@email AND `users`.`Password`=@password ORDER BY `unlockedClasses`.`cid`";
               
            cmd.CommandText = @"SELECT `privateAcc`, `UserName`, `E-mail`, `Experience`, `HighestScore` FROM `users` WHERE `users`.`UserName`=@username AND `users`.`Password`=@password";
            cmd.Parameters.AddWithValue("@username", user.username);
            //cmd.Parameters.AddWithValue("@email", user.email);
            cmd.Parameters.AddWithValue("@password", user.password);
            cmd.ExecuteNonQuery();
            var adpt=new MySqlDataAdapter(cmd);
            var dt = new DataTable();
            adpt.Fill(dt);

            //Console.WriteLine(dt.Rows.Count);
            if (dt.Rows.Count > 0) //userData.token = GenerateToken(userData.username);
            {
                //noauth rn
                userData.username = dt.Rows[0]["Username"].ToString();

                   
                userData.email = dt.Rows[0]["E-mail"].ToString();
                userData.experience = int.Parse(dt.Rows[0]["Experience"].ToString());
                    
                userData.isPrivate = (sbyte)dt.Rows[0]["privateAcc"]==1;

                    
                userData.bestScore = int.Parse(dt.Rows[0]["HighestScore"].ToString());

                //klasovete
                cmd.CommandText = @"SELECT `unlockedclasses`.`cid` FROM `users` INNER JOIN `unlockedclasses` ON `users`.`uid`= `unlockedclasses`.`uid` AND `users`.`Username`=@username";

                var cadpt = new MySqlDataAdapter(cmd);
                var dtclass = new DataTable();
                cadpt.Fill(dtclass);
                userData.unlockedclasses = new int[dtclass.Rows.Count];
                for (int i = 0; i < dtclass.Rows.Count; i++)
                    userData.unlockedclasses[i] = int.Parse(dtclass.Rows[i]["cid"].ToString());


            }
            else return null;
            return userData;
        }
    }
}
