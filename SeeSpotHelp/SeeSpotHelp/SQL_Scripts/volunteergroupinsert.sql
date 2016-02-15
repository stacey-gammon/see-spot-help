create proc [dbo].[VolunteerGroup_Insert]
      @id varchar(25),
      @name varchar(25),
      @shelterName varchar(255),
      @shelterAddress varchar(255),
      @shelterCity varchar(255),
      @shelterState varchar(255),
      @shelterZipCode varchar(255)
as
if NOT exists (select * from VolunteerGroup where id = @id )
  --create new record
  BEGIN
   INSERT INTO VolunteerGroup
      (id, name, shelterName, shelterAddress, shelterCity, shelterState, shelterZip) 
   VALUES (id, @name, @shelterName, @shelterAddres, @shelterCity, @shelterState, @shelterZipCode)
  END
GO
