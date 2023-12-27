namespace SmartBuildings.Models
{
    public class IMeter
    {
        public int MeterID { get;}
        public int ApartmentID { get; set; }
        public DateTime InsertDateTime { get; set; }
        public Apartment? Apartment { get; set; }
    }
}
