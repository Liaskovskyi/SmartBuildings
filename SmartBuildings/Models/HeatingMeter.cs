using System.ComponentModel.DataAnnotations;

namespace SmartBuildings.Models
{
    public class HeatingMeter:IMeter
    {
        [Key]
        public double Heating { get; set; }
        
    }
}
