using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StaceyAnimals
{
    public class Animals : StaceyData.BaseObject
    {

 
        public List<StaceyAnimals.Animal> getAnimals()
        {
            List<StaceyAnimals.Animal> myanimals = new List<StaceyAnimals.Animal>();
            System.Data.DataTable dt;
            dt = Helpers.DBHelper.ExecuteQuery("select * from animals");
            Animal tempAnimal = new Animal();
            foreach (System.Data.DataRow element in dt.Rows)
            {

                tempAnimal.ID = (int)element["AnimalID"];
                tempAnimal.Name = (string)element["AnimalName"];
                tempAnimal.Description = (string)element["AnimalDescription"];
                myanimals.Add(tempAnimal);
            }

            return myanimals;

        }
    }
}
