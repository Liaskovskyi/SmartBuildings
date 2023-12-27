using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SmartBuildings.Models;

namespace SmartBuildings.Controllers
{
    public class MetersController : Controller
    {

        private readonly ApplicationDbContext _context;

        public MetersController(ApplicationDbContext context)
        {
            _context = context;
        }

        public ActionResult Index()
        {
            return Ok();
        }

        public IActionResult GetElectricity(int id)
        {

            var apartment = _context.Apartments.SingleOrDefault(a => a.ApartmentID == id);

            var electricity = _context.ElectricityMeters;

            double calculateCurrentElectricity(double area)
            {
                double kwhMinute = 6 * area / 30 / 24 / 60;
                DateTime firstDayOfMonth = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
                int totalMinutesInMonth = (int)(DateTime.Now - firstDayOfMonth).TotalMinutes;
                double currentConsumption = kwhMinute * totalMinutesInMonth;
                return currentConsumption;
            }

            if (apartment != null)
            {

                var newData = new ElectricityMeter
                {
                    ApartmentID = id,
                    Electricity = calculateCurrentElectricity(apartment.Area),
                    InsertDateTime = DateTime.Now,
                };
                electricity.Add(newData);

                _context.SaveChanges();

                return Ok(new { success = true });
            }
            return BadRequest();

        }

        public IActionResult GetWater(int id)
        {

            var water = _context.WaterMeters;

            double calculateCurrentWater()
            {
                double litersMinute = 6000.0 / 30 / 24 / 60;
                DateTime firstDayOfMonth = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
                int totalMinutesInMonth = (int)(DateTime.Now - firstDayOfMonth).TotalMinutes;
                double currentConsumption = litersMinute * totalMinutesInMonth;
                return currentConsumption;
            }

            var newData = new WaterMeter
            {
                ApartmentID = id,
                Water = calculateCurrentWater(),
                InsertDateTime = DateTime.Now,
            };
            water.Add(newData);

            _context.SaveChanges();

            return Ok(new { success = true });

        }

        public IActionResult GetHeating(int id)
        {

            var apartment = _context.Apartments.SingleOrDefault(a => a.ApartmentID == id);

            var heating = _context.HeatingMeters;

            double calculateCurrentHeating(double area)
            {
                double kwhMinute = 18 * area / 30 / 24 / 60;
                DateTime firstDayOfMonth = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
                int totalMinutesInMonth = (int)(DateTime.Now - firstDayOfMonth).TotalMinutes;
                double currentConsumption = kwhMinute * totalMinutesInMonth;
                return currentConsumption;
            }

            if (apartment != null)
            {

                var newData = new HeatingMeter
                {
                    ApartmentID = id,
                    Heating = calculateCurrentHeating(apartment.Area),
                    InsertDateTime = DateTime.Now,
                };
                heating.Add(newData);

                _context.SaveChanges();

                return Ok(new { success = true });
            }
            return BadRequest();

        }

        [Route("meters/[action]/{id}/{meterType}")]
        public IActionResult GetMeterData(int id, string meterType)
        {
            IMeter? meter = null;

            switch (meterType.ToLower())
            {
                case "electricity":
                    meter = _context.ElectricityMeters
                        .Where(e => e.ApartmentID == id)
                        .AsEnumerable() 
                        .OrderBy(e => e.Electricity)
                        .LastOrDefault();
                    break;
                case "water":
                    meter = _context.WaterMeters
                        .Where(w => w.ApartmentID == id)
                        .AsEnumerable() 
                        .OrderByDescending(w => w.MeterID)
                        .LastOrDefault();
                    break;
                case "heat":
                    meter = _context.HeatingMeters
                        .Where(h => h.ApartmentID == id)
                        .AsEnumerable() 
                        .OrderByDescending(h => h.MeterID)
                        .LastOrDefault();
                    break;
                default:
                    break;
            }

            if (meter != null)
            {
                return Ok(meter);
            }

            return NotFound(new { success = false, error = "Meter not found" });
        }

    }
}
