using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartBuildings.Models;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace SmartBuildings.Controllers
{
    public class ApartmentController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ApartmentController(ApplicationDbContext context)
        {
            _context = context;
        }

       

        [HttpGet]
        public IActionResult GetFullName(int id)
        {
            var owner = _context.Owners
                .Include(o => o.Apartments) 
                .FirstOrDefault(o => o.Apartments.Any(a => a.ApartmentID == id));

            if (owner != null)
            {
                return Ok(Json(owner.FullName));
            }

            return NotFound("Owner not found");
        }

        public IActionResult GetEntrances()
        {
            var entrances = _context.Entrances.Select(e=>e.EntranceID).ToList();
                

            if (entrances != null)
            {
                return Ok(entrances);
            }

            return BadRequest();
        }

        public IActionResult GetApartments()
        {
            var apartments = _context.Apartments.Select(a => a.ApartmentID).ToList();


            if (apartments != null)
            {
                return Ok(apartments);
            }

            return BadRequest();
        }

        public IActionResult GetAvailableApartments()
        {
            var apartments = _context.Apartments.Where(a => a.OwnerID==7).Select(a=>a.ApartmentID).ToList();


            if (apartments != null)
            {
                return Ok(apartments);
            }

            return BadRequest();
        }

        [HttpPost]
        [Route("apartment/[action]/{apt}")]
        public IActionResult AddNewOwner(int apt, [FromBody] Owner newOwner)
        {
            var owners = _context.Owners;
            var users = _context.Users;
            if (newOwner != null)
            {

                var NewOwner = new Owner()
                {
                    OwnerID = _context.Owners.Count() + 1,
                    FullName = newOwner.FullName,
                    DateOfBirth = newOwner.DateOfBirth,
                    PhoneNumber = newOwner.PhoneNumber
                };
                owners.Add(NewOwner);

                var NewUser = new User()
                {
                    UserID = _context.Users.Count() + 1,
                    Login = "owner" +( _context.Owners.Count() + 1),
                    Password = "owner" + (_context.Owners.Count() + 1) + "password",
                    OwnerID = _context.Users.Count() + 1
                };
                users.Add(NewUser);
                _context.SaveChanges();
                _context.Apartments.FirstOrDefault(a=>a.ApartmentID==apt).OwnerID = _context.Owners.FirstOrDefault(o=>o.FullName==newOwner.FullName).OwnerID;
                _context.SaveChanges();
                return Ok(new {success=true, NewUser});
            }

            return BadRequest();
        }

        public IActionResult GetOwners()
        {
            var owners = _context.Owners.Where(o=>o.OwnerID!=7).ToList();


            if (owners != null)
            {
                return Ok(owners);
            }

            return BadRequest();
        }


        [HttpPost]
        public IActionResult UpdateOwner([FromBody] Owner updatedOwner)
        {
            var owner = _context.Owners.FirstOrDefault(o=>o.OwnerID==updatedOwner.OwnerID);

            if (updatedOwner != null && owner != null)
            {
                owner.FullName = updatedOwner.FullName;
                owner.DateOfBirth = updatedOwner.DateOfBirth;
                owner.PhoneNumber = updatedOwner.PhoneNumber;

                _context.SaveChanges();
                return Ok(new { success = true });
            }

            return BadRequest();
        }

        [HttpDelete]
        [Route("apartment/[action]/{ownerId}")]
        public IActionResult DeleteOwner(int ownerId)
        {

            var apartment = _context.Apartments.FirstOrDefault(o=>o.OwnerID==ownerId);

            var owner = _context.Owners.FirstOrDefault(o => o.OwnerID == ownerId);

            var user = _context.Users.FirstOrDefault(o => o.OwnerID == ownerId);

            if ( owner != null && apartment != null)
            {
                apartment.OwnerID = 7;
                _context.Users.Remove(user);
               _context.Owners.Remove(owner);

                _context.SaveChanges();
                return Ok(new { success = true });
            }

            return BadRequest();
        }
    }


}
