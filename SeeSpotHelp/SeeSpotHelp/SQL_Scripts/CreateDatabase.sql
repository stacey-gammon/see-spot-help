USE master ;
GO
CREATE DATABASE AnimalShelter
ON 
( NAME = AnimalShelter_dat,
    FILENAME = 'J:\staceyproject\DATAbase\AnimalShelterdat.mdf',
    SIZE = 10,
    MAXSIZE = 50,
    FILEGROWTH = 5 )
LOG ON
( NAME = AnimalShelter_log,
    FILENAME = 'J:\staceyproject\DATAbase\AnimalShelterlog.ldf',
    SIZE = 5MB,
    MAXSIZE = 25MB,
    FILEGROWTH = 5MB ) ;
GO