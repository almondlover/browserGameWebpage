namespace WebApp.Models
{
    public class ScoreBoard
    {
        public int maxSize { get; set; }
        public Score[] scores { get; set; }
}
    public class Score
    {
        public UserData? user { get; set; }
        public string classname { get; set; }
        public int score { get; set; }
        

    }
}
