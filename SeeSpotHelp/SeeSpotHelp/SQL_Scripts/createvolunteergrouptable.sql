CREATE TABLE dbo.VolunteerGroup
   (Id int IDENTITY(1,1) NOT NULL,
    Name varchar(100) NOT NULL,
    ShelterName varchar(100) NOT NULL,
    ShelterAddress varchar(100),
    ShelterCity varchar(100),
    ShelterState varchar(100),
    ShelterZip varchar(100))
GO
