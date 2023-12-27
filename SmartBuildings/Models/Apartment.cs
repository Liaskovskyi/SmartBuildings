namespace SmartBuildings.Models
{
    public class Apartment
    {
        public int ApartmentID { get; set; }
        public double Area { get; set; }
        public int EntranceID { get; set; }
        public int OwnerID { get; set; }
        public ICollection<WaterMeter>? WaterMeters { get; set; }
        public ICollection<ElectricityMeter>? ElectricityMeters { get; set; }
        public ICollection<HeatingMeter>? HeatingMeters { get; set; }
        
        

    }

}
