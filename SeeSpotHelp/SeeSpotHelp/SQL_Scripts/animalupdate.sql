USE [AnimalShelter]
GO
/****** Object:  StoredProcedure [dbo].[VolunteerGroup_Update]    Script Date: 2/15/2016 7:27:40 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   proc [dbo].[Animal_Update]
      @id varchar(25),
	  @name varchar(25),
      @type varchar(255),
      @breed varchar(255),
      @age varchar(255),
      @status int

as
  BEGIN
   UPDATE Animal
   SET  name = @name,
		type = @type,
		breed = @breed,
		age = @age,
		status = @status
		where id = @id
 END
      
Select * from Animal where id = @id
