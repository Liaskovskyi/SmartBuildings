using Microsoft.AspNetCore.Mvc;
using SmartBuildings.Models;
using System.Diagnostics;

namespace SmartBuildings.Controllers
{
    public class HomeController : Controller
    {
      

        public IActionResult Index()
        {

            return Ok();
        }


    }
}