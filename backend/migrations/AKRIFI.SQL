-- -----------------------------------------------------------------------------
--             G�n�ration d'une base de donn�es pour
--                           PostgreSQL
--                        (26/1/2026 9:11:01)
-- -----------------------------------------------------------------------------
--      Nom de la base : AKRIFI
--      Projet : 
--      Auteur : Elys�
--      Date de derni�re modification : 26/1/2026 9:09:58
-- -----------------------------------------------------------------------------

drop database AKRIFI;
-- -----------------------------------------------------------------------------
--       CREATION DE LA BASE 
-- -----------------------------------------------------------------------------

CREATE DATABASE AKRIFI;

-- -----------------------------------------------------------------------------
--       TABLE : MEMBRE
-- -----------------------------------------------------------------------------

CREATE TABLE MEMBRE
   (
    MEMBRE_ID char(32) NOT NULL  ,
    NOM_MEMBRE varchar(128) NOT NULL  ,
    PRENOM_MEMBRE varchar(128) NOT NULL  ,
    CONTACT char(13) NULL  
,   CONSTRAINT PK_MEMBRE PRIMARY KEY (MEMBRE_ID)
   );

-- -----------------------------------------------------------------------------
--       TABLE : ACTIVITES
-- -----------------------------------------------------------------------------

CREATE TABLE ACTIVITES
   (
    ACTIVITE_ID serial NOT NULL  ,
    NOM varchar(128) NOT NULL  ,
    DESCRIPTION text NULL  ,
    DATE_ACTIVITE date NOT NULL  
,   CONSTRAINT PK_ACTIVITES PRIMARY KEY (ACTIVITE_ID)
   );

-- -----------------------------------------------------------------------------
--       TABLE : BILLET
-- -----------------------------------------------------------------------------

CREATE TABLE BILLET
   (
    BILLET_ID char(32) NOT NULL  ,
    MEMBRE_ID char(32) NOT NULL  ,
    LOT_BILLET_ID char(32) NOT NULL  ,
    NUMERO int4 NOT NULL  ,
    STATUT char(32) NULL  ,
    PRIX_UNITAIRE int8 NOT NULL  
,   CONSTRAINT PK_BILLET PRIMARY KEY (BILLET_ID)
   );

-- -----------------------------------------------------------------------------
--       INDEX DE LA TABLE BILLET
-- -----------------------------------------------------------------------------

CREATE  INDEX I_FK_BILLET_MEMBRE
     ON BILLET (MEMBRE_ID)
    ;

CREATE  INDEX I_FK_BILLET_LOT_BILLET
     ON BILLET (LOT_BILLET_ID)
    ;

-- -----------------------------------------------------------------------------
--       TABLE : QUETE
-- -----------------------------------------------------------------------------

CREATE TABLE QUETE
   (
    QUETE_ID char(32) NOT NULL  ,
    DATE_QUETE date NOT NULL  ,
    NOM_DONNATEUR varchar(128) NOT NULL  ,
    MONTANT_QUETE int8 NOT NULL  ,
    PIECE_JUSTIFICATIF text NULL  
,   CONSTRAINT PK_QUETE PRIMARY KEY (QUETE_ID)
   );

-- -----------------------------------------------------------------------------
--       TABLE : DEPENSE
-- -----------------------------------------------------------------------------

CREATE TABLE DEPENSE
   (
    DEPENSE_ID char(32) NOT NULL  ,
    ACTIVITE_ID int4 NULL  ,
    NOM_DEPENSE char(32) NOT NULL  ,
    PIECE_JUSTIFICATIF text NULL  ,
    DATE_DEPENSE date NOT NULL  ,
    MONTANT int8 NULL  
,   CONSTRAINT PK_DEPENSE PRIMARY KEY (DEPENSE_ID)
   );

-- -----------------------------------------------------------------------------
--       INDEX DE LA TABLE DEPENSE
-- -----------------------------------------------------------------------------

CREATE  INDEX I_FK_DEPENSE_ACTIVITES
     ON DEPENSE (ACTIVITE_ID)
    ;

-- -----------------------------------------------------------------------------
--       TABLE : UTILISATEURS
-- -----------------------------------------------------------------------------

CREATE TABLE UTILISATEURS
   (
    UTILISATEURS_ID char(32) NOT NULL  ,
    NOM_UTILISATEUR char(32) NOT NULL  ,
    EMAIL varchar(128) NULL  ,
    MOT_DE_PASSE varchar(128) NOT NULL  
,   CONSTRAINT PK_UTILISATEURS PRIMARY KEY (UTILISATEURS_ID)
   );

-- -----------------------------------------------------------------------------
--       TABLE : LOT_BILLET
-- -----------------------------------------------------------------------------

CREATE TABLE LOT_BILLET
   (
    LOT_BILLET_ID char(32) NOT NULL  ,
    ACTIVITE_ID int4 NOT NULL  ,
    NOM_LOT_BILLET varchar(128) NOT NULL  ,
    DESCRIPTION text NULL  
,   CONSTRAINT PK_LOT_BILLET PRIMARY KEY (LOT_BILLET_ID)
   );




-- -----------------------------------------------------------------------------
--       TABLE : SANS_BILLET
-- -----------------------------------------------------------------------------

CREATE TABLE SANS_BILLET
   (
    SANS_BILLET_ID char(32) NOT NULL  ,
    MONTANT int8 NOT NULL  ,
    MEMBRE_ID char(32) NOT NULL  ,
    ACTIVITE_ID int4 NOT NULL  ,
    DATE_DON date NOT NULL,
    CONSTRAINT PK_SANS_BILLET PRIMARY KEY (SANS_BILLET_ID)
   );


-- -----------------------------------------------------------------------------
--       INDEX DE LA TABLE LOT_BILLET
-- -----------------------------------------------------------------------------

CREATE  INDEX I_FK_LOT_BILLET_ACTIVITES
     ON LOT_BILLET (ACTIVITE_ID)
    ;


-- -----------------------------------------------------------------------------
--       CREATION DES REFERENCES DE TABLE
-- -----------------------------------------------------------------------------


ALTER TABLE BILLET ADD 
     CONSTRAINT FK_BILLET_MEMBRE
          FOREIGN KEY (MEMBRE_ID)
               REFERENCES MEMBRE (MEMBRE_ID) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE BILLET ADD 
     CONSTRAINT FK_BILLET_LOT_BILLET
          FOREIGN KEY (LOT_BILLET_ID)
               REFERENCES LOT_BILLET (LOT_BILLET_ID) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE DEPENSE ADD 
     CONSTRAINT FK_DEPENSE_ACTIVITES
          FOREIGN KEY (ACTIVITE_ID)
               REFERENCES ACTIVITES (ACTIVITE_ID) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE LOT_BILLET ADD 
     CONSTRAINT FK_LOT_BILLET_ACTIVITES
          FOREIGN KEY (ACTIVITE_ID)
               REFERENCES ACTIVITES (ACTIVITE_ID) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE SANS_BILLET ADD 
     CONSTRAINT FK_SANS_BILLET_MEMBRE
          FOREIGN KEY (MEMBRE_ID)
               REFERENCES MEMBRE (MEMBRE_ID) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE SANS_BILLET ADD 
     CONSTRAINT FK_SANS_BILLET_ACTIVITES
          FOREIGN KEY (ACTIVITE_ID)
               REFERENCES ACTIVITES (ACTIVITE_ID) ON DELETE CASCADE ON UPDATE CASCADE;


-- -----------------------------------------------------------------------------
--                FIN DE GENERATION
-- -----------------------------------------------------------------------------