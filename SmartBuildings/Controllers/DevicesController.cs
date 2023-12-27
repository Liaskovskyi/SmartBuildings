using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartBuildings.Models;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace SmartBuildings.Controllers
{
    public class DevicesController : Controller
    {

        private readonly ApplicationDbContext _context;

        public DevicesController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            return Ok();
        }

        public IActionResult GetSecurityStatus(int id)
        {
            var status = _context.Devices
            .Where(d => d.ApartmentID == id && d.DeviceType=="Security Device").Select(d => d.Status);

            if (status!=null)
            {
                
                return Ok(status);
            }

            return BadRequest();
        }


        public IActionResult GetLightsOnCount(int id)
        {
            var lightsOnCount = _context.Devices
            .Where(d => d.ApartmentID == id && d.DeviceType == "Light" && d.Status == true).Select(d => d.Status).Count();

            if (lightsOnCount != null)
            {

                return Ok(lightsOnCount);
            }

            return BadRequest();
        }

        public IActionResult GetAvgTemperature(int id)
        {
            var avgTemperature = _context.Devices
            .Where(d => d.ApartmentID == id && d.DeviceType == "Thermostat")
            .Select(d => (double?)d.Temperature) 
            .Average() ?? 0.0; 


            var roundedAvgTemperature = Math.Round((double)avgTemperature, 1);

            if (roundedAvgTemperature != null)
            {

                return Ok(roundedAvgTemperature);
            }

            return BadRequest();
        }

        public IActionResult GetDeviceTypes(int id)
        {
            var deviceTypes = _context.Devices
            .Where(d => d.ApartmentID == id).Select(d => d.DeviceType).Distinct().ToList();


            if (deviceTypes != null)
            {

                return Ok(deviceTypes);
            }

            return BadRequest();
        }

        public IActionResult GetRooms(int id)
        {
            var rooms = _context.Devices
            .Where(d => d.ApartmentID == id).Select(d => d.RoomName).Distinct().ToList();


            if (rooms != null)
            {

                return Ok(rooms);
            }

            return BadRequest();
        }

        public IActionResult GetDevices(int id)
        {
            var devices = _context.Devices
            .Where(d => d.ApartmentID == id).ToList();


            if (devices != null)
            {

                return Ok(devices);
            }

            return BadRequest();
        }

        [Route("devices/[action]/{id}/{deviceType}")]
        public IActionResult GetDevices(int id, string deviceType)
            {
            var devices = _context.Devices
                .Where(d => d.ApartmentID == id && d.DeviceType==deviceType.ToString())
                .ToList();

            if (devices != null)
            {
                return Json(devices);
            }

            return BadRequest();
        }

        [HttpPost]
        public IActionResult ToggleLight(int id)
        {
            var toggle = _context.Devices.Find(id);

            if (toggle != null)
            {
                toggle.Status = !toggle.Status;
                _context.SaveChanges();

                return Ok(new { success = true });
            }

            return NotFound(new { success = false, error = "Device not found" });
        }

        [HttpPost]
        public IActionResult SetTemperature(int id, [FromBody] Device request)
        {
            var temperature = _context.Devices.Find(id);

            if (temperature != null)
            {
                temperature.Temperature = request.Temperature;
                _context.SaveChanges();

                return Ok(new { success = true });
            }

            return NotFound(new { success = false, error = "Device not found" });
        }

        [HttpPost]
        public IActionResult AddDevice(int id, [FromBody] Device request)
        {
            var device = _context.Devices;

            if (device != null)
            {
                var newDevice = new Device
                {
                    DeviceType = request.DeviceType,
                    RoomName = request.RoomName,
                    ApartmentID = id
                };

                device.Add(newDevice);

                _context.SaveChanges();

                return Ok(new { success = true });
            }

            return NotFound(new { success = false, error = "Apartment not found" });
        }

        [HttpDelete]
        public IActionResult RemoveDevice(int id, [FromBody] int request)
        {
            var device = _context.Devices.Where(d=>d.ApartmentID==id && d.Id==request).FirstOrDefault();

            if (device != null)
            {
                _context.Devices.Remove(device);

                 _context.SaveChanges();

                return Ok(new { success = true });
            }

            return NotFound(new { success = false, error = "Apartment not found" });
        }

        [Route("devices/[action]/{resource}")]
        public bool GetBuildingStatus( string resource)
        {
            var status = _context.Devices.Where(d=> d.DeviceType==resource).Any(d=>d.Status==true);
     
             return status;
        }

        [Route("devices/[action]/{resource}/{entrance}")]
        public bool GetEntranceStatus(string resource, int entrance)
        {
            var status = _context.Devices.Where(d => d.DeviceType == resource && d.Apartment.EntranceID==entrance && d.ApartmentID==d.Apartment.ApartmentID).Any(d => d.Status == true);

            return status;
        }

        [Route("devices/[action]/{resource}/{apartment}")]
        public bool GetApartmentStatus(string resource, int apartment)
        {
            var status = _context.Devices.Where(d => d.DeviceType == resource && d.ApartmentID == apartment ).Any(d => d.Status == true);

            return status;
        }

        [HttpPost]
        [Route("devices/[action]/{resourceType}")]
        public IActionResult ToggleBuilding(string resourceType)
        {
            var devices = _context.Devices.Where(d => d.DeviceType == resourceType);

            if (devices != null)
            {
                bool currentStatus = GetBuildingStatus(resourceType);

                foreach (var device in devices)
                {
                    device.Status = !currentStatus;
                }
                _context.SaveChanges();

                return Ok(new { success = false });
            }

            return NotFound(new { success = false, error = "Resource not found" });
        }

        [HttpPost]
        [Route("devices/[action]/{resourceType}/{entrance}")]
        public IActionResult ToggleEntrance(string resourceType, int entrance)
        {
            var devices = _context.Devices.Where(d => d.DeviceType == resourceType && d.Apartment.EntranceID==entrance);

            if (devices != null)
            {

                bool currentStatus = GetEntranceStatus(resourceType, entrance);

                foreach (var device in devices)
                {
                    device.Status = !currentStatus;
                }
                _context.SaveChanges();

                return Ok(new { success = false });
            }

            return NotFound(new { success = false, error = "Resource not found" });
        }

        [HttpPost]
        [Route("devices/[action]/{resourceType}/{apartment}")]
        public IActionResult ToggleApartment(string resourceType, int apartment)
        {
            var devices = _context.Devices.Where(d => d.DeviceType == resourceType && d.ApartmentID == apartment);

            if (devices != null)
            {
                bool currentStatus = GetApartmentStatus(resourceType, apartment);

                foreach (var device in devices)
                {
                    device.Status = !currentStatus;
                }
                _context.SaveChanges();

                return Ok(new { success = false });
            }

            return NotFound(new { success = false, error = "Resource not found" });
        }

        
    }
}
