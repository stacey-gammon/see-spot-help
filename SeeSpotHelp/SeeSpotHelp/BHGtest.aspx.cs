using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Newtonsoft.Json;

namespace SeeSpotHelp
{
    public partial class BHGtest : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

            AnimalsNS.Animals sa = new AnimalsNS.Animals("Data Source=BGADDIS-HP\\BRIANSQL;Initial Catalog=AnimalShelter;User Id=sa;password=kath1y11");
            
            string json = JsonConvert.SerializeObject(sa.getAnimals());
            label1.Text = json;

        }
    }
}