alter   proc [dbo].[Volunteer_save]
      @Volunteerid varchar(25),
      @Volunteername varchar(25),
      @Volunteeremail varchar(255)

as

      
if NOT exists (select * from Volunteers where Volunteerid = @Volunteerid )
  --create new record
  BEGIN
   INSERT INTO Volunteers
      (VolunteerID, VolunteerName, volunteerEmail) 
   VALUES (@Volunteerid, @Volunteername, @Volunteeremail)
  END
ELSE
  --update existing record
  BEGIN
   UPDATE Volunteers
   SET  VolunteerName = @Volunteername,
		volunteerEmail = @Volunteeremail
		where volunteerID = @Volunteerid
 END
      
GO

