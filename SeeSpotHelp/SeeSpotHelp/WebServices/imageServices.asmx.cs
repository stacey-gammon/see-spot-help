using System.Web.Services;
using Newtonsoft.Json;
using System.Web;

namespace SeeSpotHelp.WebServices
{
    /// <summary>
    /// Saves posted images to server.
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class imageServices : System.Web.Services.WebService
    {
        [WebMethod]
        public string saveImageFile()
        {
            HttpContext postedContext = HttpContext.Current;
            HttpPostedFile postedFile = postedContext.Request.Files["file"];
            System.Console.WriteLine("Saving file " + postedFile.FileName);

            // TODO: Save file to a folder on the server. Figure out what to return.
            string filename = postedFile.FileName;
            int lastSlash = filename.LastIndexOf("\\");
            string trailingPath = filename.Substring(lastSlash + 1);
            string fullPath = Server.MapPath("..\\") + "\\images\\" + trailingPath;
            postedFile.SaveAs(fullPath);
            return "";
            //{ "Access to the path 'C:\\Users\\bgaddis\\Source\\Repos\\NewRepo\\SeeSpotHelp\\SeeSpotHelp\\WebServices\\cover.png' is denied."}
            //Could not find a part of the path 'C:\Users\bgaddis\Source\Repos\NewRepo\SeeSpotHelp\SeeSpotHelp\WebServices\images\cover.png'.
        }
    }
}
