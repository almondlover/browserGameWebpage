using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using System.Data;
using WebApp.Models;

namespace WebApp.Controllers
{
    [Route("api/scoreboard")]
    [ApiController]
    public class ScoreboardController : ActionController
    {
        
        public ScoreboardController(IConfiguration config):base(config)
        {
            
        }
        [AllowAnonymous]
        [HttpGet]
        public IActionResult Scoreboard()
        {
            //auth

            
            var scores = RetrieveFromDB<ScoreBoard>(() => { return GetScores(); });

            if (scores != null)
            {
                return Ok(scores);
            }
            return BadRequest();
        }
        private ScoreBoard GetScores()
        {
            var sboard = new ScoreBoard();

            
            var cmd = dbconnection.CreateCommand();
            //po-dobre class za klases che da ima infoto za tqh vmesto da se ekstrapolira v js
            //chonker query 😲
            cmd.CommandText = @"SELECT `users`.`privateAcc`, `users`.`Username`, `users`.`Experience`,`users`.`HighestScore`,`startingclasses`.`ClassName`, `scoreboard`.`Score`
                                FROM `users`
                                JOIN `scoreboard` ON `users`.`uid`=`scoreboard`.`uid`
                                JOIN `startingclasses` ON `scoreboard`.`cid`=`startingclasses`.`cid`
                                ORDER BY `scoreboard`.`Score` DESC";
            cmd.ExecuteNonQuery();
            var adpt = new MySqlDataAdapter(cmd);
            var dt = new DataTable();
            adpt.Fill(dt);

                
            if (dt.Rows.Count == 0) sboard = null;
                
            else
            {   
                sboard.scores = new Score[dt.Rows.Count];
                    
                    
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    sboard.scores[i] = new Score();
                    sboard.scores[i].user = new UserData();

                        
                    sboard.scores[i].user.username = dt.Rows[i]["Username"].ToString();
                        

                    sboard.scores[i].classname = dt.Rows[i]["ClassName"].ToString();
                    sboard.scores[i].score = int.Parse(dt.Rows[i]["Score"].ToString());

                    //ne pokazva uinfo ako e private; trq i da se zapazi che da se znae dali da se pokazva; osven ako ne se napr nullable int
                    if ((sbyte)dt.Rows[i]["privateAcc"] == 1) { sboard.scores[i].user.isPrivate=true;  continue; }
                    sboard.scores[i].user.experience = int.Parse(dt.Rows[i]["Experience"].ToString());
                    sboard.scores[i].user.bestScore = int.Parse(dt.Rows[i]["HighestScore"].ToString());
                }


            }
            return sboard;
        }
    }
}
