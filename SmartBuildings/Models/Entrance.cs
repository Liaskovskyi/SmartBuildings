namespace SmartBuildings.Models
{
    public class Entrance
    {
        public int EntranceID { get; set; }
        public int EntranceNumber { get; set; }
        public int FloorsCount { get; set; }
        public ICollection<Apartment>? Apartments { get; set; }
    }

}
