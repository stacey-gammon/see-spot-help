using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StaceyAnimals
{
    public class Animal : StaceyData.BaseObject
        
    {
        // Static field currentID stores the job ID of the last WorkItem that
        // has been created.
        private static int currentID;

        //Properties.
        public int ID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        protected TimeSpan jobLength { get; set; }

        // Default constructor. If a derived class does not invoke a base-
        // class constructor explicitly, the default constructor is called
        // implicitly. 
        public Animal()
        {
            ID = 0;
            Name = "Default title";
            Description = "Default description.";
            jobLength = new TimeSpan();
        }

        // Instance constructor that has three parameters.
        public Animal(string name, string desc, TimeSpan joblen)
        {
            //this.ID = GetNextID();
            this.Name = name;
            this.Description = desc;
            this.jobLength = joblen;
        }

        // Instance constructor that has the animal ID and is retrieved from Database.
        public Animal(int ID, string aconnectionstring)
        {
            ConnectionString = aconnectionstring;
            getAnimal(ID);
        }

        public void getAnimal(int id)
        {
            System.Data.DataTable dt;
            dt = Helpers.DBHelper.ExecuteQuery("select * from animals where AnimalID = '" + id + "'");

            foreach (System.Data.DataRow  element in dt.Rows)
            {
                this.ID = (int)element["AnimalID"];
                this.Name = (string)element["AnimalName"];
                this.Description = (string)element["AnimalDescription"];
            }

        }
        // Static constructor to initialize the static member, currentID. This
        // constructor is called one time, automatically, before any instance
        // of WorkItem or ChangeRequest is created, or currentID is referenced.
        static Animal()
        {
            currentID = 0;
        }
    }
}
