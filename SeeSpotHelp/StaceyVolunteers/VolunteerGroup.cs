using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VolunteerGroupsNS
{
    class VolunteerGroup : Data.BaseObject
    {

        //Properties.
        public string id { get; set; }
        public string name { get; set; }
        public string shelter { get; set; }
        public string address { get; set; }

        #region "Constructors"

        // Static constructor to initialize the static member
        static VolunteerGroup()
        {
        }

        public VolunteerGroup(string aconnectionstring)
        {
            ConnectionString = aconnectionstring;
            id = "";
            name = "";
            shelter = "";
            address = "";
        }

        // Instance constructor that has three parameters.
        public VolunteerGroup(string aconnectionstring, string ID, string name, string shelter, string address)
        {
            ConnectionString = aconnectionstring;
            this.id = ID;
            this.name = name;
            this.shelter = shelter;
            this.address = address;
            getVolunteerGroup(ID);
        }

        // Instance constructor that has the VolunteerGroup ID and is retrieved from Database.
        public VolunteerGroup(string aconnectionstring, string ID)
        {
            ConnectionString = aconnectionstring;
            getVolunteerGroup(ID);
        }

        public static VolunteerGroup LoadFromDatabaseRow(System.Data.DataRow row)
        {
            return new VolunteerGroup(
                Helpers.DBHelper.BuildConnectionString("AnimalShelter"),
                (string)row["Id"],
                (string)row["name"],
                (string)row["sheltername"],
                (string)row["shelteraddress"]);
        }

        #endregion

        public void getVolunteerGroup(string myID)
        {
            System.Data.DataTable dt;
            object[] myparams = { myID, "VolunteerGroupid" };

            dt = Helpers.DBHelper.ExecuteProcedure(ConnectionString, "VolunteerGroup_get", myparams);

            if (dt.Rows.Count > 0)
            {
                initFromDR(dt.Rows[0]);
            }
            else
            {
                object[] mysaveparams = { myID, "VolunteerGroupid", this.name, "VolunteerGroupname", this.shelter, "VolunteerGroupeShelter", this.address, "VolunteerGroupeAddress" };

                Helpers.DBHelper.ExecuteProcedure(ConnectionString, "VolunteerGroup_save", mysaveparams);

            }

        }

        public void initFromDR(System.Data.DataRow dr)
        {
            this.id = (string)dr["VolunteerGroupID"];
            this.name = (string)dr["VolunteerGroupName"];
            this.shelter = (string)dr["VolunteerGroupShelter"];
            this.address = (string)dr["VolunteerGroupAddress"];

        }
    }
}
