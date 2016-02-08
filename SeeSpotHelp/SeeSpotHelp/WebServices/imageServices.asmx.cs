using System.Web.Services;
using Newtonsoft.Json;
using System.Web;
using System.IO;
using System;

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
            return "";
        }
    }
}
