using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using System.Data;
using System.Security.Claims;
using WebApp.Models;

namespace WebApp.Controllers
{
    
    [ApiController]
    public class AccountUpdateController : AuthenticationController
    {
        
        public AccountUpdateController(IConfiguration config, IHttpContextAccessor httpContextAccessor):base(config, httpContextAccessor)
        {
            
        }

        [Authorize]
        [HttpPut]
        [Route("api/classunlock/{classId:int}")]
        public IActionResult ClassUnlock(/*[FromBody] UserData user,*/ int classId)
        {
            var udata = new UserData();


            udata = RetrieveFromDB<UserData>(() =>
            {
                return Update(classId);
            });
            if (udata != null)
            {
                return Ok(udata);
            }

            return BadRequest();

        }
        [Authorize]
        [HttpPut]
        [Route("api/privacy")]
        public IActionResult Privacy(/*[FromBody] UserData user*/)
        {
            var udata = new UserData();


            udata = RetrieveFromDB<UserData>(() =>
            {
                return TogglePrivacy();
            });
            if (udata != null)
            {
                return Ok(udata);
            }

            return BadRequest();

        }
        private UserData TogglePrivacy()
        {
            //UserData userData = new UserData();
            var userData = new UserData();
            
            var cmd = dbconnection.CreateCommand();
            string username = _httpContextAccessor.HttpContext?.User.FindFirstValue("username");
            string email = _httpContextAccessor.HttpContext?.User.FindFirstValue("useremail");
            if (username == null || email == null) return null;

            cmd.CommandText = @"SELECT `UserName`, `E-mail`, `Experience`, `HighestScore` FROM `users` WHERE `users`.`UserName`=@username AND `users`.`E-mail`=@email";

            cmd.Parameters.AddWithValue("@username", username);
            cmd.Parameters.AddWithValue("@email", email);

            var adpt = new MySqlDataAdapter(cmd);
            var dt = new DataTable();
            adpt.Fill(dt);

            //Console.WriteLine(dt.Rows.Count);
            if (dt.Rows.Count > 0)
            {
                //noauth rn
                userData.username = dt.Rows[0]["Username"].ToString();
                userData.email = dt.Rows[0]["E-mail"].ToString();
                userData.experience = int.Parse(dt.Rows[0]["Experience"].ToString());
                //userData.isPrivate = dt.Rows[0]["privateAcc"].Equals("true");
                userData.bestScore = int.Parse(dt.Rows[0]["HighestScore"].ToString());


            }

            else return null; 

            //to vsashtnost trq se napravi tuk validaciq sashto :skull:
            cmd.CommandText = @"UPDATE `users` SET `privateAcc`=(`privateAcc`+1)%2 WHERE `Username`=@username";
            //cmd.Parameters.AddWithValue("@username", gameRun.score.user.username);
                
            //cmd.Parameters.AddWithValue("@username", user.username);
            cmd.ExecuteNonQuery();

            cmd.CommandText = @"SELECT `privateAcc` FROM `users` WHERE `Username`=@username";

            adpt = new MySqlDataAdapter(cmd);
            dt = new DataTable();
            adpt.Fill(dt);

            userData.isPrivate = (sbyte)dt.Rows[0]["privateAcc"]==1;
            //ujas


            
            return userData;
        }
        private UserData Update(int classId)
        {
            //UserData userData = new UserData();
            var userData = new UserData();
            
            var cmd = dbconnection.CreateCommand();
            string username = _httpContextAccessor.HttpContext?.User.FindFirstValue("username");
            string email = _httpContextAccessor.HttpContext?.User.FindFirstValue("useremail");
            if (username == null || email == null) return null;

            cmd.CommandText = @"SELECT `UserName`, `E-mail`, `Experience`, `HighestScore` FROM `users` WHERE `users`.`UserName`=@username AND `users`.`E-mail`=@email";

            cmd.Parameters.AddWithValue("@username", username);
            cmd.Parameters.AddWithValue("@email", email);

            var adpt = new MySqlDataAdapter(cmd);
            var dt = new DataTable();
            adpt.Fill(dt);

            //Console.WriteLine(dt.Rows.Count);
            if (dt.Rows.Count > 0)
            {
                //noauth rn
                userData.username = dt.Rows[0]["Username"].ToString();
                userData.email = dt.Rows[0]["E-mail"].ToString();
                userData.experience = int.Parse(dt.Rows[0]["Experience"].ToString());
                //userData.isPrivate = dt.Rows[0]["privateAcc"].Equals("true");
                userData.bestScore = int.Parse(dt.Rows[0]["HighestScore"].ToString());

                    
            }

            else return null; 

            //to vsashtnost trq se napravi tuk validaciq sashto :skull:
            cmd.CommandText = @"INSERT INTO `unlockedclasses` (`uid`, `cid`) SELECT `users`.`uid`, `startingclasses`.`cid`
                                                    FROM `users`, `startingclasses`
                                                    WHERE `users`.`Username`=@username
                                                    AND `startingclasses`.`cid`=@classid";
            //cmd.Parameters.AddWithValue("@username", gameRun.score.user.username);
            cmd.Parameters.AddWithValue("@classid", classId);
            //cmd.Parameters.AddWithValue("@username", user.username);
            cmd.ExecuteNonQuery();

            cmd.CommandText = @"SELECT `unlockedclasses`.`cid` FROM `users` INNER JOIN `unlockedclasses` ON `users`.`uid`= `unlockedclasses`.`uid`  AND `users`.`Username`=@username";

            adpt = new MySqlDataAdapter(cmd);
            dt = new DataTable();
            adpt.Fill(dt);
            userData.unlockedclasses = new int[dt.Rows.Count];
            for (int i = 0; i < dt.Rows.Count; i++)
                userData.unlockedclasses[i] = int.Parse(dt.Rows[i]["cid"].ToString());
            //ujas


            
            return userData;
        }
    }
}
