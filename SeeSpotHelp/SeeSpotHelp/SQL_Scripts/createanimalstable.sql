CREATE TABLE dbo.Animals
   (AnimalID int PRIMARY KEY NOT NULL,
    AnimalName varchar(25) NOT NULL,
    BirthDate datetime NULL,
    ArrivalDate datetime NULL,
    AnimalDescription text NULL)
GO