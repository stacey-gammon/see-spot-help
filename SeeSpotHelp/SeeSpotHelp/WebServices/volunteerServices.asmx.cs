using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using Newtonsoft.Json;

namespace SeeSpotHelp.WebServices
{
    /// <summary>
    /// Summary description for volunteerServices
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class volunteerServices : System.Web.Services.WebService
    {

        [WebMethod]
        public string getAnimal(int anID)
        {

            StaceyAnimals.Animal sa = new StaceyAnimals.Animal("Data Source=BGADDIS-HP\\BRIANSQL;Initial Catalog=AnimalShelter;User Id=sa;password=kath1y11");
            sa.getAnimal(anID);
            string json = JsonConvert.SerializeObject(sa);
            
            return json;
        }

        [WebMethod]
        public string getVolunteer(string anID, string name, string email)
        {

            StaceyVolunteers.Volunteer vt = new StaceyVolunteers.Volunteer("Data Source=BGADDIS-HP\\BRIANSQL;Initial Catalog=AnimalShelter;User Id=sa;password=kath1y11", anID,name,email);
            vt.getVolunteer(anID);
            string json = JsonConvert.SerializeObject(vt);

            return json;
        }
    }
}
