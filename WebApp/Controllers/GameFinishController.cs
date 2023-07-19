using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using MySqlConnector;
using System.Data;
using System.Xml.Linq;
using WebApp.Models;

namespace WebApp.Controllers
{
    [Route("api/gamefinish")]
    [ApiController]
    public class GameFinishController : ActionController
    {
        
        public GameFinishController(IConfiguration config):base(config)
        {

        }

        [AllowAnonymous]
        [HttpPost]
        public IActionResult GameFinish([FromBody(EmptyBodyBehavior = EmptyBodyBehavior.Allow)] Score newscore)
        {
            var udata = new UserData();


            udata = RetrieveFromDB<UserData>(() =>
            {
                return Update(newscore);
            });
            if (udata != null)
            {
                return Ok(udata);
            }

            return NotFound();

        }
        private UserData Update(Score newscore)
        {
            //UserData userData = new UserData();
            var userData = new UserData();
           
                
            var cmd = dbconnection.CreateCommand();
                
            //kachva xp
                
            //nov nai-dobar rez
            cmd.CommandText = @"UPDATE `users` SET `Experience` =@newxp WHERE `UserName`=@username AND `E-mail`=@email;";
                
            cmd.Parameters.AddWithValue("@username", newscore.user.username);
            cmd.Parameters.AddWithValue("@newxp", (newscore.score+ newscore.user.experience));
            cmd.Parameters.AddWithValue("@email", newscore.user.email);
            cmd.ExecuteNonQuery();

            cmd.CommandText = @"UPDATE `users` SET `HighestScore` =@newbest WHERE @newbest>`HighestScore` AND `UserName`=@username AND `E-mail`=@email;";
            cmd.Parameters.AddWithValue("@newbest", newscore.score);
                
            cmd.ExecuteNonQuery();

            //vzema updatenatiq
            cmd.CommandText = @"SELECT `UserName`, `E-mail`, `Experience`, `HighestScore` FROM `users` WHERE `users`.`UserName`=@username AND `users`.`E-mail`=@email";
                
            //cmd.Parameters.AddWithValue("@email", user.email);
                
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

                userData.unlockedclasses = newscore.user.unlockedclasses;
            }
                //puska go v klasaciqta
            cmd.CommandText = @"INSERT INTO `scoreboard` (`uid`, `cid`, `Score`) SELECT `users`.`uid`, `startingclasses`.`cid`, @score
                                                    FROM `users`, `startingclasses`
                                                    WHERE `users`.`Username`=@username
                                                    AND `startingclasses`.`ClassName`=@class
                                                    AND (SELECT COUNT(`Score`) FROM `scoreboard`)<100";
            //cmd.Parameters.AddWithValue("@username", gameRun.score.user.username);
            cmd.Parameters.AddWithValue("@class", newscore.classname);
            cmd.Parameters.AddWithValue("@score", newscore.score);
            cmd.ExecuteNonQuery();
            //ujas
            cmd.CommandText = @"UPDATE `scoreboard`, `users`, `startingclasses`
                                    SET `scoreboard`.`uid`=`users`.`uid`, `scoreboard`.`cid`=`startingclasses`.`cid`, `Score`=@score
	                                WHERE `users`.`uid` IN (SELECT `users`.`uid`
	                                FROM `users`
	                                WHERE `users`.`Username`=@username)
	                                AND `startingclasses`.`cid` IN (SELECT `startingclasses`.`cid`
	                                FROM `startingclasses`
	                                WHERE `startingclasses`.`ClassName`=@class)
	                                AND `scoreboard`.`Score` IN ( SELECT `Score` FROM
	                                (SELECT `Score` FROM `scoreboard` 
                                    WHERE 99< (SELECT COUNT(*) FROM `scoreboard`) 
                                    AND @score>(SELECT MIN(`Score`) FROM `scoreboard`)
                                    AND `Score`=(SELECT MIN(`Score`) FROM `scoreboard`))AS `lowest`)
	                                LIMIT 1";
            cmd.ExecuteNonQuery();

            
            return userData;
        }
    }
}
