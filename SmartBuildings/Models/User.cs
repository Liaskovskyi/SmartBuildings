namespace SmartBuildings.Models
{
    public class User
    {
        public int UserID { get; set; }
        public string? Login { get; set; }
        public string? Password { get; set; }
        public int OwnerID { get; set; }
        public Owner? Owner { get; set; }
    }


}
