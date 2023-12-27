namespace SmartBuildings.Models
{
    public class Device
    {
        public int Id { get; set; }
        public string? DeviceType { get; set; }
        public int ApartmentID { get; set; }
        public string? RoomName { get; set; }
        public bool Status { get; set; }

        public double Temperature { get; set; }
        public Apartment? Apartment{ get; set; }
    }
}
