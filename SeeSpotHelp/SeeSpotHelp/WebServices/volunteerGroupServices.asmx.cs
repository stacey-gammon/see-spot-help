using System.Web.Services;
using Newtonsoft.Json;
using VolunteerGroupsNS;

namespace SeeSpotHelp.WebServices
{
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class VolunteerGroupServices : WebService
    {
        [WebMethod]
        public VolunteerGroupResult insert(string adminId,
                                           string name,
                                           string shelterName,
                                           string shelterAddress,
                                           string shelterCity,
                                           string shelterState,
                                           string shelterZip)
        {
            // TODO: Need to put this in a transaction so we can rollback if anything
            // goes wrong.  Or a stored procedure I guess would work too.
            VolunteerGroup group = VolunteerGroup.InsertVolunteerGroup(
                adminId, name, shelterName, shelterAddress, shelterCity, shelterState, shelterZip);
            VolunteerGroupResult volunteerResult = new VolunteerGroupResult();
            volunteerResult.result = true;
            volunteerResult.messages = new string[1];
            volunteerResult.messages[0] = JsonConvert.SerializeObject(group);
            volunteerResult.volunteerGroup = group;
            return volunteerResult;
        }

        [WebMethod]
        public VolunteerGroupResult update(string groupId,
                                           string name,
                                           string shelterName,
                                           string shelterAddress,
                                           string shelterCity,
                                           string shelterState,
                                           string shelterZip)
        {
            VolunteerGroup group = VolunteerGroup.UpdateVolunteerGroup(
                groupId, name, shelterName, shelterAddress, shelterCity, shelterState, shelterZip);
            VolunteerGroupResult volunteerResult = new VolunteerGroupResult();
            volunteerResult.result = true;
            volunteerResult.messages = new string[1];
            volunteerResult.messages[0] = JsonConvert.SerializeObject(group);
            volunteerResult.volunteerGroup = group;
            return volunteerResult;
        }
    }

    public partial class VolunteerGroupResult : Result
    {
        public VolunteerGroupsNS.VolunteerGroup volunteerGroup;
    }
}
