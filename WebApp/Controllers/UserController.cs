using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using System.Data;
using System.Diagnostics.CodeAnalysis;
using System.Net;
using System.Runtime.InteropServices;
using System.Runtime.Serialization;
using System.Security.Claims;
using System.Web.Http;
using WebApp.Models;
using AllowAnonymousAttribute = Microsoft.AspNetCore.Authorization.AllowAnonymousAttribute;
using AuthorizeAttribute = System.Web.Http.AuthorizeAttribute;
using FromBodyAttribute = Microsoft.AspNetCore.Mvc.FromBodyAttribute;
using HttpGetAttribute = Microsoft.AspNetCore.Mvc.HttpGetAttribute;
using HttpPostAttribute = Microsoft.AspNetCore.Mvc.HttpPostAttribute;
using RouteAttribute = Microsoft.AspNetCore.Mvc.RouteAttribute;

namespace WebApp.Controllers
{
    
    [ApiController]
    public class UserController : AuthenticationController
    {
        
        public UserController(IConfiguration config, IHttpContextAccessor httpContextAccessor) : base(config, httpContextAccessor)
        {
            
        }
        //[AllowAnonymous]
        [Authorize]
        [HttpGet]
        [Route("api/users/profile")]
        public IActionResult ProfileView([FromUri] string? requestedName /*[FromBody] UserData? current=null*/ )
        {
            //auth
            string current = _httpContextAccessor.HttpContext?.User.FindFirstValue("username");
            bool own = false;
            if (requestedName == null)
            {
                if (current == null) {
                    

                    return NotFound(/*"/account.html"*/); 
                }
                /*trq proverka*/
                //return Ok(current);
                requestedName = current;
                own = true;
            }
            own = current!=null&&requestedName == current;
            var uprofile = RetrieveFromDB<UserProfile>(() =>
            {
                return GetProfile(requestedName, own);
            });

            if (uprofile != null)
            {
                return Ok(uprofile);
            }
            return BadRequest();
        }
        private UserProfile GetProfile(string username, bool ownsAccount)
        {
            var uprofile = new UserProfile();

            var cmd = dbconnection.CreateCommand();
            //po-dobre class za klases che da ima infoto za tqh vmesto da se ekstrapolira v js

            cmd.CommandText = @"SELECT `UserName`, `E-mail`, `Experience`, `HighestScore`, `privateAcc` FROM `users` WHERE `users`.`UserName`=@username";

            cmd.Parameters.AddWithValue("@username", username);


            var adpt = new MySqlDataAdapter(cmd);
            var dt = new DataTable();
            adpt.Fill(dt);

            if (dt.Rows.Count == 0) return null;
            //trq se opravi za sobstveniq acc
            if ((sbyte)dt.Rows[0]["privateAcc"]==1&&!ownsAccount) return null;

            uprofile.username = dt.Rows[0]["Username"].ToString();

            uprofile.experience = int.Parse(dt.Rows[0]["Experience"].ToString());
            //userData.isPrivate = dt.Rows[0]["privateAcc"].Equals("true");
            uprofile.bestScore = int.Parse(dt.Rows[0]["HighestScore"].ToString());

            cmd.CommandText = @"SELECT `startingclasses`.`ClassName` FROM `users` INNER JOIN `unlockedclasses` ON `users`.`uid`= `unlockedclasses`.`uid` INNER JOIN `startingclasses` ON `startingclasses`.`cid`=`unlockedclasses`.`cid` AND `users`.`Username`=@username";

            adpt = new MySqlDataAdapter(cmd);
            dt = new DataTable();
            adpt.Fill(dt);
            uprofile.unlockedclasses = new string[dt.Rows.Count];
            for (int i = 0; i < dt.Rows.Count; i++)
                uprofile.unlockedclasses[i] = dt.Rows[i]["ClassName"].ToString();

            //sashto taka i rank??
            //da ei tuka e brat 👇
            cmd.CommandText = @"SELECT `users`.`Username` FROM `users` INNER JOIN `scoreboard` ON `users`.`uid`= `scoreboard`.`uid` ORDER BY `scoreboard`.`Score` DESC";
            adpt = new MySqlDataAdapter(cmd);
            dt = new DataTable();
            adpt.Fill(dt);

            for (int i = 0; i < dt.Rows.Count; i++)
                if (username == dt.Rows[i]["Username"].ToString()) { uprofile.rank = i + 1; break; };

            
            return uprofile;
        }
        [Authorize]
        [HttpGet]
        [Route("api/users/current")]
        public IActionResult CurrentUser()
        {
            //auth
            var uname = _httpContextAccessor.HttpContext?.User.FindFirstValue("username");
            if (uname==null) return BadRequest();
            var current = RetrieveFromDB<UserData>(() =>
            {
                return GetCurrent(uname);
            });

            if (current != null)
            {
                return Ok(current);
            }
            return BadRequest();
        }
        private UserData GetCurrent(string username)
        {
            var udata = new UserData();

            
            var cmd = dbconnection.CreateCommand();
            //po-dobre class za klases che da ima infoto za tqh vmesto da se ekstrapolira v js

            cmd.CommandText = @"SELECT `UserName`, `E-mail`, `Experience`, `HighestScore`, `privateAcc` FROM `users` WHERE `users`.`UserName`=@username";

            cmd.Parameters.AddWithValue("@username", username);


            var adpt = new MySqlDataAdapter(cmd);
            var dt = new DataTable();
            adpt.Fill(dt);

            if (dt.Rows.Count == 0) return null;
            //trq se opravi za sobstveniq acc


            udata.username = dt.Rows[0]["Username"].ToString();
            udata.email = dt.Rows[0]["E-mail"].ToString();
            udata.experience = int.Parse(dt.Rows[0]["Experience"].ToString());
            udata.isPrivate = (sbyte)dt.Rows[0]["privateAcc"]==1;
            udata.bestScore = int.Parse(dt.Rows[0]["HighestScore"].ToString());

            cmd.CommandText = @"SELECT `unlockedclasses`.`cid` FROM `users` INNER JOIN `unlockedclasses` ON `users`.`uid`= `unlockedclasses`.`uid` AND `users`.`Username`=@username";

            adpt = new MySqlDataAdapter(cmd);
            dt = new DataTable();
            adpt.Fill(dt);
            udata.unlockedclasses = new int[dt.Rows.Count];
            for (int i = 0; i < dt.Rows.Count; i++)
                udata.unlockedclasses[i] = int.Parse(dt.Rows[i]["cid"].ToString());

                

            
            return udata;
        }
    }
}
