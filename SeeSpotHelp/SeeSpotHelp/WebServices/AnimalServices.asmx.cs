using System.Web.Services;
using Newtonsoft.Json;
using AnimalsNS;

namespace SeeSpotHelp.WebServices
{
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class AnimalServices : WebService
    {
        [WebMethod]
        public AnimalResult insert(string name,
                                   string type,
                                   string breed,
                                   string age,
                                   int status,
                                   string groupId)
        {
            Animal animal = Animal.InsertAnimal(
                name, type, breed, age, status, groupId);
            AnimalResult animalResult = new AnimalResult();
            animalResult.result = true;
            animalResult.messages = new string[1];
            animalResult.messages[0] = JsonConvert.SerializeObject(animal);
            animalResult.animal = animal;
            return animalResult;
        }

        [WebMethod]
        public AnimalResult update(string animalId,
                                   string name,
                                   string type,
                                   string breed,
                                   string age,
                                   int status,
                                   string groupId)
        {
            Animal animal = Animal.UpdateAnimal(
                animalId, name, type, breed, age, status, groupId);
            AnimalResult animalResult = new AnimalResult();
            animalResult.result = true;
            animalResult.messages = new string[1];
            animalResult.messages[0] = JsonConvert.SerializeObject(animal);
            animalResult.animal = animal;
            return animalResult;
        }
    }

    public partial class AnimalResult : Result
    {
        public Animal animal;
    }
}
