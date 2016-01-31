using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SeeSpotHelp.Controllers
{
    public class HomeController : Controller
    {
        // GET: SeeSpotHelp
        public ActionResult Index()
        {
            return View();
        }
    }
}