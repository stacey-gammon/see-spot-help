using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AnimalsNS
{
    public class Animal : Data.BaseObject
        
    {
 
        //Properties.
        public string id { get; set; }
        public string name { get; set; }
        public string type { get; set; }
        public string breed { get; set; }
        public string age { get; set; }
        public string groupId { get; set; }
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
        static Animal() { }
        public Animal() { }

        public Animal(string aconnectionstring)
        {
            ConnectionString = aconnectionstring;
        }

        // Instance constructor that has the animal ID and is retrieved from Database.
        public Animal(string aconnectionstring, int ID)
        {
            ConnectionString = aconnectionstring;
           // getAnimal(ID);
        }

        public Animal(System.Data.DataRow row)
        {
            this.id = row["Id"].ToString();
            this.name = (string)row["name"];
            this.type = (string)row["type"];
            this.breed = (string)row["breed"];
            this.age = (string)row["age"];
            this.status = (StatusEnum)row["status"];
            this.groupId = (string)row["groupId"];
        }

        #endregion

        public static Animal InsertAnimal(string name,
                                          string type,
                                          string breed,
                                          string age,
                                          int status,
                                          string groupId)
        {
            object[] myParams = { name, "name",
                                  type, "type",
                                  breed, "breed",
                                  age, "age",
                                  status, "status",
                                  groupId, "groupId" };
            try
            {
                var animalData = Helpers.DBHelper.ExecuteProcedure(
                    Helpers.DBHelper.BuildConnectionString(), "Animal_Insert", myParams);
                if (animalData.Rows.Count > 0)
                {
                    return new Animal(animalData.Rows[0]);
                }
            }
            catch (Exception e)
            {
                System.Console.WriteLine(e.Message);
            }
            return null;
        }

        public static Animal UpdateAnimal(string animalId,
                                          string name,
                                          string type,
                                          string breed,
                                          string age,
                                          int status,
                                          string groupId)
        {
            object[] myParams = { animalId, "id",
                                  name, "name",
                                  type, "type",
                                  breed, "breed",
                                  age, "age",
                                  status, "status" };
            try
            {
                var animalData = Helpers.DBHelper.ExecuteProcedure(
                    Helpers.DBHelper.BuildConnectionString(), "Animal_Update", myParams);
                if (animalData.Rows.Count > 0)
                {
                    return new Animal(animalData.Rows[0]);
                }
            }
            catch (Exception e)
            {
                System.Console.WriteLine(e.Message);
            }
            return null;
        }

        //public void getAnimal(int myID)
        //{
        //    System.Data.DataTable dt;
        //    object[] myparams = { myID.ToString(), "animalid" };

        //    dt = Helpers.DBHelper.ExecuteProcedure(ConnectionString, "animal_get",myparams);

        //    if (dt.Rows.Count > 0)
        //    {
        //        initFromDR(dt.Rows[0]);
        //    } 

        //}

        //public void initFromDR(System.Data.DataRow dr)
        //{
        //    this.id = (int)dr["id"];
        //    this.name = (string)dr["name"];
        //    this.description = (string)dr["animaldescription"];

        //}
    }
}
