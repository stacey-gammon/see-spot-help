using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VolunteerGroupsNS
{
    public class VolunteerGroup : Data.BaseObject
    {
        public enum Permissions
        {
            MEMBER,
            NONMEMBER,
            ADMIN,
            MEMBERSHIP_PENDING,
            MEMBERSHIP_DENIED
        };

        //Properties.
        public string id { get; set; }
        public string name { get; set; }
        public string shelter { get; set; }
        public string address { get; set; }
        public Dictionary<string, Permissions> userPermissionsMap { get; set; }

        #region "Constructors"

        // Static constructor to initialize the static member
        static VolunteerGroup()
        {
        }

        public VolunteerGroup() { }

        public VolunteerGroup(string aconnectionstring)
        {
            ConnectionString = aconnectionstring;
            id = "";
            name = "";
            shelter = "";
            address = "";
            userPermissionsMap = new Dictionary<string, Permissions>();
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
            userPermissionsMap = new Dictionary<string, Permissions>();
        }

        // Instance constructor that has the VolunteerGroup ID and is retrieved from Database.
        public VolunteerGroup(string aconnectionstring, string ID)
        {
            ConnectionString = aconnectionstring;
            getVolunteerGroup(ID);
            userPermissionsMap = new Dictionary<string, Permissions>();
        }

        public VolunteerGroup(System.Data.DataRow row)
        {
            ConnectionString = Helpers.DBHelper.BuildConnectionString("AnimalShelter");
            this.id = row["Id"].ToString();
            this.name = (string)row["name"];
            this.shelter = (string)row["sheltername"];
            this.address = (string)row["shelteraddress"];
            userPermissionsMap = new Dictionary<string, Permissions>();

            object[] myParams = {
                this.id, "volunteerGroupId"
            };
            var volunteerMemberData = Helpers.DBHelper.ExecuteProcedure(
                Helpers.DBHelper.BuildConnectionString(), "[VolunteeGroupPair_GetByGroup]", myParams);
            for (var i = 0; i < volunteerMemberData.Rows.Count; i++)
            {
                this.userPermissionsMap.Add(
                    (string)volunteerMemberData.Rows[i]["volunteerId"],
                    (Permissions)volunteerMemberData.Rows[i]["Permission"]);
            }
        }

        public static VolunteerGroup InsertVolunteerGroup(string adminId,
                                                          string name,
                                                          string shelterName,
                                                          string shelterAddress,
                                                          string city,
                                                          string state,
                                                          string zipCode)
        {
            object[] myParams = { adminId, "adminId",
                                  Permissions.ADMIN, "permission",
                                  name, "name",
                                  shelterName, "shelterName",
                                  shelterAddress, "shelterAddress",
                                  city, "shelterCity",
                                  state, "shelterState",
                                  zipCode, "shelterZip" };
            try {
                var volunteerGroupData = Helpers.DBHelper.ExecuteProcedure(
                    Helpers.DBHelper.BuildConnectionString(), "VolunteerGroup_Insert", myParams);
                if (volunteerGroupData.Rows.Count > 0)
                {
                    VolunteerGroup group = new VolunteerGroup(volunteerGroupData.Rows[0]);
                    return group;
                }
            } catch (Exception e)
            {
                System.Console.WriteLine(e.Message);
            }
            return null;
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

        }

        public void initFromDR(System.Data.DataRow dr)
        {
            this.id = (string)dr["id"];
            this.name = (string)dr["name"];
            this.shelter = (string)dr["shelterName"];
            this.address = (string)dr["shelterAddress"];
        }
    }
}
