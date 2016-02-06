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
        public SeeSpotHelp.WebServices.Result getVolunteer(string anID, string name, string email)
        {

            StaceyVolunteers.Volunteer vt = new StaceyVolunteers.Volunteer("Data Source=BGADDIS-HP\\BRIANSQL;Initial Catalog=AnimalShelter;User Id=sa;password=kath1y11", anID,name,email);
            vt.getVolunteer(anID);
            string json = JsonConvert.SerializeObject(vt);
            SeeSpotHelp.WebServices.Result result = new SeeSpotHelp.WebServices.Result();
            result.result = true;
            result.messages = new string[1];
            result.messages[0] = json;

            return result;
        }
    }

public partial class Result
    {

        //Private messageField As String


        private string[] messagesField;

        private System.Nullable<bool> resultField;

        private bool resultFieldSpecified;
        ///<remarks/>
        [System.Xml.Serialization.XmlElementAttribute(IsNullable = true)]
        public string[] messages
        {
            get { return this.messagesField; }
            set { this.messagesField = value; }
        }
        ///<remarks/>
        [System.Xml.Serialization.XmlElementAttribute(IsNullable = true)]
        public System.Nullable<bool> result
        {
            get { return this.resultField; }
            set { this.resultField = value; }
        }

        ///<remarks/>
        [System.Xml.Serialization.XmlIgnoreAttribute()]
        public bool resultSpecified
        {
            get { return this.resultFieldSpecified; }
            set { this.resultFieldSpecified = value; }
        }
    }

}
