using System.Runtime.InteropServices;
using System.Runtime.Serialization;
using System.ComponentModel.DataAnnotations;

public enum StartingClass
{ 
    Normal=0,
    Tank,
    GlassCannon,
    Thief
}

namespace WebApp.Models
{
    public class User
    {
        public string username { get; set; } 
        public bool isPrivate { get; set; }
        public string email { get; set; }
        public string password { get; set; }

    }
    public class UserData 
    {
        public string username { get; set; }
        public string? email { get; set; }
        public bool isPrivate { get; set; }
        public int experience { get; set; }
        
        ////otdelen klas 
        
        public int[]? unlockedclasses { get; set; }
        public int bestScore { get; set; }

    }
    public class UserProfile
    {
        public string username { get; set; }
        public int experience { get; set; }
        //public bool isPrivate { get; set; }
        ////otdelen klas 
        public int rank { get; set; }
        public string[]? unlockedclasses { get; set; }
        public int bestScore { get; set; }

    }
    public class LoggedUser
    {
        public string token { get; set; }
        public string username { get; set; }
        public bool isPrivate { get; set; }
    }
}
