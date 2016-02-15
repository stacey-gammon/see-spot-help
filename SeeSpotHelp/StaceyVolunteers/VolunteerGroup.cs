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

        public static VolunteerGroup InsertVolunteerGroup(string adminId,
                                                          string name,
                                                          string shelterName,
                                                          string shelterAddress,
                                                          string city,
                                                          string state,
                                                          string zipCode)
        {
            object[] myParams = { name, "name",
                                  shelterName, "shelterName",
                                  shelterAddress, "shelterAddress",
                                  city, "shelterCity",
                                  state, "shelterState",
                                  zipCode, "shelterZip" };
            var volunteerGroupData = Helpers.DBHelper.ExecuteProcedure(
                Helpers.DBHelper.BuildConnectionString(), "VolunteerGroup_Insert", myParams);
            if (volunteerGroupData.Rows.Count > 0)
            {
                VolunteerGroup group = VolunteerGroup.LoadFromDatabaseRow(volunteerGroupData.Rows[0]);

                // Now need to hook the user up as an admin. This should all be in a transaction so if any
                // errors occur, it's an all or nothing operation and we aren't stuck with a shelter without
                // an admin.
                // TODO: Make sure adminId is a valid user id.
                object[] groupPairParams = { adminId, "volunteerId",
                                             group.id, "volunteerGroupId",
                                             Permissions.ADMIN, "permission"};
                Helpers.DBHelper.ExecuteProcedure(
                    Helpers.DBHelper.BuildConnectionString(), "VolunteerGroupPair_Insert", groupPairParams);
                return group;
            } else {
                return null;
            }
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
            this.id = (string)dr["id"];
            this.name = (string)dr["name"];
            this.shelter = (string)dr["shelterName"];
            this.address = (string)dr["shelterAddress"];
        }
    }
}
