CREATE TABLE dbo.Animal
   (Id int PRIMARY KEY NOT NULL,
    Name varchar(64) NOT NULL,
    BirthYear int,
    Type varchar(64),
    Breed varchar(64),
    Status int,
    GroupId string,
    ArrivalDate datetime NULL,
    AnimalDescription text NULL)
GO