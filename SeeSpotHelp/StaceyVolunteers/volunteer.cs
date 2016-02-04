using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StaceyVolunteers
{
    public class Volunteer : StaceyData.BaseObject
    {
        //Properties.
        public string id { get; set; }
        public string name { get; set; }
        public string email { get; set; }

        #region "Constructors"

        // Static constructor to initialize the static member
        static Volunteer()
        {
        }

        public Volunteer(string aconnectionstring)
        {
            ConnectionString = aconnectionstring;
            id = "";
            name = "Default Name";
            email = "default@email.com";
        }

        // Instance constructor that has three parameters.
        public Volunteer(string aconnectionstring, string name, string email)
        {
            ConnectionString = aconnectionstring;
            //this.ID = GetNextID();
            this.name = name;
            this.email = email;
        }

        // Instance constructor that has the Volunteer ID and is retrieved from Database.
        public Volunteer(string aconnectionstring, string ID)
        {
            ConnectionString = aconnectionstring;
            getVolunteer(ID);
        }

        #endregion

        public void getVolunteer(string myID)
        {
            System.Data.DataTable dt;
            object[] myparams = { myID, "Volunteerid" };

            dt = Helpers.DBHelper.ExecuteProcedure(ConnectionString, "Volunteer_get", myparams);

            if (dt.Rows.Count > 0)
            {
                initFromDR(dt.Rows[0]);
            }

        }

        public void initFromDR(System.Data.DataRow dr)
        {
            this.id = (string)dr["VolunteerID"];
            this.name = (string)dr["VolunteerName"];
            this.email = (string)dr["VolunteerEmail"];

        }
    }
}
