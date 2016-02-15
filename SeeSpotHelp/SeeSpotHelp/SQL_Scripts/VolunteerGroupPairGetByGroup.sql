create proc [dbo].[VolunteeGroupPair_GetByGroup]
      @VolunteerGroupId varchar(25)

as

      select * from VolunteerGroupPair where @VolunteerGroupId = @VolunteerGroupId
      
GO
grant execute on [VolunteeGroupPair_GetByGroup] TO db_spexecute
GO
