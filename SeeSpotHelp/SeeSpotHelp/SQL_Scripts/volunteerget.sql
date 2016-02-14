create   proc [dbo].[Volunteer_Get]
      @Volunteerid varchar(25)

as

      select * from Volunteers where Volunteerid = @Volunteerid
      
GO
grant execute on Volunteer_Get TO db_spexecute
GO
