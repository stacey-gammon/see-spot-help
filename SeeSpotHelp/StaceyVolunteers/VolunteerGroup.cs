using System;
using System.Collections.Generic;

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
        public string city { get; set; }
        public string state { get; set; }
        public string zipCode { get; set; }
        public Dictionary<string, Permissions> userPermissionsMap { get; set; }

        #region "Constructors"

        // Static constructor to initialize the static member
        static VolunteerGroup() { }

        public VolunteerGroup() { }

        // Instance constructor that has three parameters.
        public VolunteerGroup(string aconnectionstring,
                              string ID,
                              string name,
                              string shelter,
                              string address,
                              string city,
                              string state,
                              string zip)
        {
            ConnectionString = aconnectionstring;
            this.id = ID;
            this.name = name;
            this.shelter = shelter;
            this.address = address;
            this.city = city;
            this.state = state;
            this.zipCode = zip;
            userPermissionsMap = new Dictionary<string, Permissions>();
        }

        public VolunteerGroup(System.Data.DataRow row)
        {
            ConnectionString = Helpers.DBHelper.BuildConnectionString("AnimalShelter");
            this.id = row["Id"].ToString();
            this.name = (string)row["name"];
            this.shelter = (string)row["sheltername"];
            this.address = (string)row["shelteraddress"];
            this.city = (string)row["sheltercity"];
            this.state = (string)row["shelterstate"];
            this.zipCode = (string)row["shelterzip"];
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

        public static VolunteerGroup UpdateVolunteerGroup(string groupId,
                                                          string name,
                                                          string shelterName,
                                                          string shelterAddress,
                                                          string city,
                                                          string state,
                                                          string zipCode)
        {
            object[] myParams = { groupId, "id",
                                  name, "name",
                                  shelterName, "shelterName",
                                  shelterAddress, "shelterAddress",
                                  city, "shelterCity",
                                  state, "shelterState",
                                  zipCode, "shelterZip" };
            try {
                var volunteerGroupData = Helpers.DBHelper.ExecuteProcedure(
                    Helpers.DBHelper.BuildConnectionString(), "VolunteerGroup_Update", myParams);
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
    }
}
