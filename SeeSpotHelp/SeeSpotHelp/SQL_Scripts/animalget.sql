create   proc [dbo].[Animal_Get]
      @animalid int

as

      select * from Animals where animalid = @animalid
      
GO
grant execute on Animal_Get TO db_spexecute
GO
