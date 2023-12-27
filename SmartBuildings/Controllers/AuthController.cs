using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartBuildings.Models;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace SmartBuildings.Controllers
{
    public class AuthController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        
        public IActionResult Login([FromBody] User loginPass)
        {
            var admin = _context.Users.FirstOrDefault(u => u.Login == loginPass.Login && u.Password == loginPass.Password);
            if (admin!=null && admin.Login=="admin")
            {
                
                var apartments = _context.Apartments.Select(a => a.ApartmentID).ToList();
                return Ok(new { isAdmin = true });
            }
            var user = _context.Users
             .Include(u => u.Owner)
             .Include(u => u.Owner.Apartments)
             .FirstOrDefault(u => u.Login == loginPass.Login && u.Password == loginPass.Password);

            if (user == null)
            {
              
                return Unauthorized();
            }
            return Ok(user);
        }
       
    }

    
       
}
