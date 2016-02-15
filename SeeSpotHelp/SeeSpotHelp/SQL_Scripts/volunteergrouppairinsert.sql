create proc [dbo].[VolunteerGroupPair_Insert]
      @Volunteerid varchar(25),
      @volunteerGroupId varchar(25),
      @permission smallint

as
   INSERT INTO VolunteerGroupPair
      (volunteerId, volunteerGroupId, permission)
   VALUES (@volunteerId, @volunteerGroupId, @permission)
GO
grant execute on [VolunteerGroupPair_Insert] TO db_spexecute
GO
