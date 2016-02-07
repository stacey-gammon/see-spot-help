using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AnimalsNS
{
    public class Animal : Data.BaseObject
        
    {
 
        //Properties.
        public int id { get; set; }
        public string name { get; set; }
        public string type { get; set; }
        public string breed { get; set; }
        public int age { get; set; }
        public string volunteerGroup { get; set; }
        public StatusEnum status { get; set; }
        public string photo { get; set; }
        public string description { get; set; }

        public enum StatusEnum 
    {
        ADOPTABLE = 0,  // Animal is currently up for adoption.
        RESCUEONLY = 1,  // Animal can be adopted to rescue groups only.
        MEDICAL = 2,  // Animal is not up for adoption due to medical reasons.
        ADOPTED = 3,  // Animal has been adopted, YAY!
        PTS = 4,  // Animal has been put to sleep. :*(
        NLL = 5,  // Animal is No Longer Living due to other reasons.  Can be
        // used instead of PTS if people would prefer not to specify,
        // or if animal died of other causes.
        OTHER = 6 // In case I'm missing any other circumstances...
    }

    #region "Constructors"

    // Static constructor to initialize the static member
    static Animal()
        {
        }

        public Animal(string aconnectionstring)
        {
            ConnectionString = aconnectionstring;
            id = 0;
            name = "Default title";
            description = "Default description.";
        }

        // Instance constructor that has three parameters.
        public Animal(string aconnectionstring, string name, string desc)
        {
            ConnectionString = aconnectionstring;
            //this.ID = GetNextID();
            this.name = name;
            this.description = desc;
        }

        // Instance constructor that has the animal ID and is retrieved from Database.
        public Animal(string aconnectionstring, int ID)
        {
            ConnectionString = aconnectionstring;
            getAnimal(ID);
        }

        #endregion

        public void getAnimal(int myID)
        {
            System.Data.DataTable dt;
            object[] myparams = { myID.ToString(), "animalid" };

            dt = Helpers.DBHelper.ExecuteProcedure(ConnectionString, "animal_get",myparams);

            if (dt.Rows.Count > 0)
            {
                initFromDR(dt.Rows[0]);
            } 

        }

        public void initFromDR(System.Data.DataRow dr)
        {
            this.id = (int)dr["AnimalID"];
            this.name = (string)dr["AnimalName"];
            this.description = (string)dr["AnimalDescription"];

        }
    }
}
