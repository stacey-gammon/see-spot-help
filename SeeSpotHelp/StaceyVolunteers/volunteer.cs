using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VolunteersNS
{
    public class Volunteer : Data.BaseObject
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

        public Volunteer()
        {
            id = "";
            name = "";
            email = "";
        }

        public Volunteer(string aconnectionstring)
        {
            ConnectionString = aconnectionstring;
            id = "";
            name = "";
            email = "";
        }

        // Instance constructor that has three parameters.
        public Volunteer(string aconnectionstring, string ID, string name, string email)
        {
            ConnectionString = aconnectionstring;
            this.id = ID;
            this.name = name;
            this.email = email;
            getVolunteer(ID);
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
            else
            {
                object[] mysaveparams = { myID, "Volunteerid", this.name, "Volunteername", this.email, "Volunteeremail" };

                Helpers.DBHelper.ExecuteProcedure(ConnectionString, "volunteer_save", mysaveparams);

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
