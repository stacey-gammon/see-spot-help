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

            AnimalsNS.Animal sa = new AnimalsNS.Animal(
                "connection string her e");
            sa.getAnimal(anID);
            string json = JsonConvert.SerializeObject(sa);
            
            return json;
        }

        [WebMethod]
        public SeeSpotHelp.WebServices.volunteerResult getVolunteer(string anID, string name, string email)
        {

            VolunteersNS.Volunteer vt = new VolunteersNS.Volunteer(
                "connection string here", anID,name,email);
            vt.getVolunteer(anID);
            string json = JsonConvert.SerializeObject(vt);
            SeeSpotHelp.WebServices.volunteerResult volunteerResult = new SeeSpotHelp.WebServices.volunteerResult();
            volunteerResult.result = true;
            volunteerResult.messages = new string[1];
            volunteerResult.messages[0] = json;
            volunteerResult.volunteerData = vt;
            return volunteerResult;
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

    public partial class volunteerResult : Result
    {
        public VolunteersNS.Volunteer volunteerData;
    }
}
