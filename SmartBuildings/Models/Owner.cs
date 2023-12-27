﻿namespace SmartBuildings.Models
{
    public class Owner
    {
        public int OwnerID { get; set; }
        public string? FullName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string? PhoneNumber { get; set; }
        
        public ICollection<Apartment>? Apartments { get; set; }
    }


}
