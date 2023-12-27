using System.ComponentModel.DataAnnotations;

namespace SmartBuildings.Models
{
    public class ElectricityMeter:IMeter
    {
        [Key]
        public double Electricity { get; set; }
       
    }
}
