using System.ComponentModel.DataAnnotations;

namespace SmartBuildings.Models
{
    public class WaterMeter:IMeter
    {
        [Key]
        public double Water { get; set; }
    }
}
