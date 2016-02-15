using VolunteerGroupsNS;
using System.Collections.Generic;

namespace VolunteersNS
{
    public class Volunteer : Data.BaseObject
    {
        //Properties.
        public string id { get; set; }
        public string name { get; set; }
        public string email { get; set; }
        public List<VolunteerGroup> groups { get; set; }

       // private List<VolunteerGroup> groups = new List<VolunteerGroup>();
        // List<VolunteerGroup> getGroups() { return groups; }

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
            groups = new List<VolunteerGroup>();
        }

        public Volunteer(string aconnectionstring)
        {
            ConnectionString = aconnectionstring;
            id = "";
            name = "";
            email = "";
            groups = new List<VolunteerGroup>();
        }

        // Instance constructor that has three parameters.
        public Volunteer(string aconnectionstring, string ID, string name, string email)
        {
            ConnectionString = aconnectionstring;
            this.id = ID;
            this.name = name;
            this.email = email;
            groups = new List<VolunteerGroup>();
            GetVolunteer(ID);
        }

        // Instance constructor that has the Volunteer ID and is retrieved from Database.
        public Volunteer(string aconnectionstring, string ID)
        {
            ConnectionString = aconnectionstring;
            GetVolunteer(ID);
            groups = new List<VolunteerGroup>();
        }

        #endregion

        public void GetVolunteer(string myID)
        {
            object[] myparams = { myID, "Volunteerid" };

            var volunteerData = Helpers.DBHelper.ExecuteProcedure(
                ConnectionString, "Volunteer_get", myparams);

            if (volunteerData.Rows.Count > 0)
            {
                InitFromVolunteerData(volunteerData.Rows[0]);
                var groupData = Helpers.DBHelper.ExecuteProcedure(
                    ConnectionString,
                    "Volunteer_Get_Groups",
                    myparams);
                for (var i = 0; i < groupData.Rows.Count; i++)
                {
                    groups.Add(new VolunteerGroup(groupData.Rows[i]));
                }
            } else {
                // If volunteer does not yet exist in the database, insert them automatically.
                object[] mysaveparams = { myID, "Volunteerid",
                                          this.name, "Volunteername",
                                          this.email, "Volunteeremail" };
                Helpers.DBHelper.ExecuteProcedure(ConnectionString, "volunteer_save", mysaveparams);
            }
        }

        public void InitFromVolunteerData(System.Data.DataRow dr)
        {
            this.id = (string)dr["VolunteerID"];
            this.name = (string)dr["VolunteerName"];
            this.email = (string)dr["VolunteerEmail"];
        }
    }
}
