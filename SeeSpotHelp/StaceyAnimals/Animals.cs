using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AnimalsNS
{
    public class Animals : Data.BaseObject
    {


        public Animals(string aconnectionstring)
        {
            ConnectionString = aconnectionstring;
        }

        public List<AnimalsNS.Animal> getAnimals()
        {

            List<AnimalsNS.Animal> myanimals = new List<AnimalsNS.Animal>();
            System.Data.DataTable dt;
            dt = Helpers.DBHelper.ExecuteProcedure(ConnectionString ,"animals_get");
            foreach (System.Data.DataRow element in dt.Rows)
            {
                Animal tempAnimal = new Animal(ConnectionString);
                tempAnimal.initFromDR(element);
                myanimals.Add(tempAnimal);
            }

            return myanimals;

        }
    }
}
