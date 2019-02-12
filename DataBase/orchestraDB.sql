drop database if exists orchestra_DB;
create database if not exists orchestra_DB;

use orchestra_DB;
SET FOREIGN_KEY_CHECKS=0;

drop table if exists member;
CREATE TABLE `member` (
 `id` int(11) NOT NULL AUTO_INCREMENT unique,
 `membernumber` varchar(100) as (substring(sha(concat(`firstname`,',',`lastname`)),1,10)) stored,
 `firstname` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
 `lastname` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
 `dateOfBirth` datetime not null,
 `email` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
 `phone` varchar(100) collate utf8_unicode_ci,
 `mobile` varchar(100) collate utf8_unicode_ci,
 `username` varchar(100) collate utf8_unicode_ci,
 `password` varchar(512) COLLATE utf8_unicode_ci NOT NULL,
 `address_id` int(11) NOT NULL,
 `instrument_id` int(11) NOT NULL,
  FOREIGN KEY (address_id) references address(id),
  FOREIGN KEY (instrument_id) references instrument(id),
 PRIMARY KEY (`id`, `membernumber`)
) DEFAULT CHARACTER SET = utf8;
INSERT INTO `member` ( 
`firstname`, `lastname`,`dateOfBirth`, `email`,
`phone`,`mobile`,`password`,`address_id`,`instrument_id`) VALUES
('Max','Mustermann','1990-01-01 00:00:00','mmustermann@gmail.com','','+43 650 1234 123',sha2('123456789',512),1,24),
('Marina','Mustermann','1990-01-01 00:00:00','marina.m@gmx.de','','+43 650 1234 321',sha2('123456789',512),2,23);
update member m 
	set m.username='maxi123' 
	where m.id=1;
update member m 
	set m.username='marina' 
	where m.id=2;
drop table if exists address;
create table `address` (
`id` int(11) not null auto_increment unique,
`street` varchar(100) COLLATE utf8_unicode_ci not null,
`number` varchar(100) COLLATE utf8_unicode_ci not null,
`floor` varchar(100) COLLATE utf8_unicode_ci,
`door` varchar(100) COLLATE utf8_unicode_ci,
`ZIP` bigint(100) not null,
`city` varchar(100) COLLATE utf8_unicode_ci not null,
`state` varchar(100) COLLATE utf8_unicode_ci not null,
primary key(`id`)
) DEFAULT CHARACTER SET = utf8;
insert into `address` (
`street`,`number`,`floor`,`door`,`ZIP`,`city`,`state`) values 
('Musterstraße','1','EG','1',9020,'Klagenfurt am Wörthersee','AT'),
('Musterstraße','42','1.OG','7',9020,'Klagenfurt am Wörthersee','AT');

drop table if exists `orchestral_instrument`;
create table `orchestral_instrument` (
`id` int(11) not null auto_increment unique,
`name` varchar(100) COLLATE utf8_unicode_ci not null,
`section_id` int(11) not null,
primary key(`id`),
foreign key(`section_id`) references section(id)
);
insert into `orchestral_instrument` (`id`,`name`,`section_id`) values 
(1,'Piccolo',1),
(2,'Flöte 1',1),
(3,'Flöte 2',1),
(4,'Oboe 1',1),
(5,'Oboe 2',1),
(6,'Englischhorn',1),
(7,'Fagott',1),
(8,'Klarinette 1',1),
(9,'Klarinette 2',1),
(10,'Klarinette 3',1),
(11,'Bass-Klarinette',1),
(12,'Altsaxofon 1',1),
(13,'Altsaxofon 2',1),
(14,'Tenorsaxofon',1),
(15,'Baritionsaxofon',1),
(16,'Trompete 1',2),
(17,'Trompete 2',2),
(18,'Trompete 3',2),
(19,'Horn 1',2),
(20,'Horn 2',2),
(21,'Horn 3',2),
(22,'Horn 4',2),
(23,'Posaune 1',2),
(24,'Posaune 2',2),
(25,'Posaune 3',2),
(26,'Euphonium',2),
(27,'Tuba 1',2),
(28,'Tuba 2',2),
(29,'Percussion 1',3),
(30,'Percussion 2',3),
(31,'Percussion 3',3),
(32,'Mallets',3),
(33,'Pauken',3),
(34,'Violine 1',4),
(35,'Violine 2',4),
(36,'Violine 3',4),
(37,'Viola',4),
(38,'Violoncello',4),
(39,'Kontrabass',4),
(40,'Klavier',5),         
(41,'Keyboard',5),
(42,'Cembalo',5),
(43,'Harfe',6),
(44,'E-Gitarre',6),
(45,'E-Bass',6),
(46,'Vocals',6);

drop table if exists instrument;
create table `instrument` (
`id` int(11) not null auto_increment unique,
`name` varchar(100) COLLATE utf8_unicode_ci not null,
primary key(`id`)
);
insert into `instrument` (`id`,`name`)
values 
(1,'Piccolo-Flöte'),
(2,'Querflöte'),
(3,'Alt-Flöte'),
(4,'Cor Anglis Oboe'),
(5,'Oboe'),
(6,'Bass Oboe'),
(7,'Klarinette in b'),
(8,'Klarinette in C'),
(9,'Klarinette in A'),
(10,'Klarinette in es'),
(11,'Alt-Klarinette'),
(12,'Bass-Klarinette'),
(13,'Fagott'),
(14,'Kontrafagott'),
(15,'Horn in F'),
(16,'Horn in b'),
(17,'Trompete in b'),
(18,'Posaune'),
(19,'Bass-Posaune'),
(20,'Tuba'),
(21,'Percussion'),
(22,'Harfe'),
(23,'Violine'),
(24,'Viola'),
(25,'Violoncello'),
(26,'Kontrabass'),
(27,'Klassische Gitarre'),
(28,'Klavier'),
(29,'Pfeifenorgel'),
(30,'Harpsichord'),
(31,'Akkordeon'),
(32,'Claviharp'),
(33,'Cembalo'),
(34,'Sakralorgel'),
(35,'Sopran'),
(36,'Mezzosopran'),
(37,'Alt'),
(38,'Tenor'),
(39,'Bariton'),
(40,'Bass'),
(41,'E-Gitarre'),
(42,'E-Bass'),
(43,'Altsaxofon'),
(44,'Tenorsaxofon'),
(45,'Baritonsaxofon'),
(46,'Englischhorn'),
(47,'Euphonium'),
(48,'NONE');

drop table if exists `instruments_in_orchestra`;
create table `instruments_in_orchestra` (
`instrument_id` int(11) not null,
`orchestral_instrument_id` int(11) not null,
foreign key(`instrument_id`) references instrument(id),
foreign key(`orchestral_instrument_id`) references orchestral_instrument(id)
);
insert into `instruments_in_orchestra` (`instrument_id`, `orchestral_instrument_id`)
values (1,1),(2,2),(2,3),
(5,4),(5,5),
(7,8),(7,9),(7,10),
(8,8),(8,9),(8,10),
(9,8),(9,9),(9,10),
(12,11),
(13,7),
(15,19),(15,20),(15,21),(15,22),
(16,19),(16,20),(16,21),(16,22),
(17,16),(17,17),(17,18),
(18,23),(18,24),(18,25),
(20,27),(20,28),
(21,29),(21,30),(21,31),(21,32),(21,33),
(22,43),
(23,34),(23,35),(23,36),
(24,37),
(25,38),
(26,39),
(28,40),(28,41),(28,42),
(35,46),
(36,46),
(37,46),
(38,46),
(39,46),
(40,46),
(41,44),
(42,45),
(43,12),(43,13),
(44,14),
(45,15),
(46,6),
(47,26);

drop table if exists `section`;
create table `section`(
`id` int(11) not null auto_increment unique,
`name` varchar(100) COLLATE utf8_unicode_ci not null,
primary key(`id`)
);
insert into section (`name`)
values ('Holz'),('Blech'),('Percussion'),('Streicher'),('Keys'),('Andere');

drop table if exists `functions`;
create table `functions` (
`id` int(11) not null auto_increment unique,
`name` varchar(100) COLLATE utf8_unicode_ci not null,
primary key(`id`)
);
insert into `functions` (`name`)
values ('IT Consultant'),('MusikerIn'),('Obmann');

drop table if exists `members_functions`;
create table `members_functions`(
`member_id` int(11) not null,
`function_id` int(11) not null,
foreign key(`member_id`) references member(id),
foreign key(`function_id`) references functions(id)
);
insert into `members_functions` (`member_id`,`function_id`) values (1,1),(1,2),(2,2);

drop table if exists `appointment_type`;
create table `appointment_type`(
`id` int(11) not null auto_increment unique,
`name` varchar(100) COLLATE utf8_unicode_ci not null,
primary key(`id`)
);
insert into `appointment_type` (`name`) values ('Tutti-Probe'),('Register-Probe'),('Konzert');

drop table if exists `appointment`;
create table `appointment`(
`id` int(11) not null auto_increment unique,
`type_id` int(11) not null,
`start` datetime not null,
`end` datetime not null,
`comment` varchar(100),
primary key(`id`),
foreign key(`type_id`) references appointment_type(id)
);
insert into `appointment` (`type_id`,`start`,`end`,`comment`) values 
(1,'2019-01-07 19:00:00','2019-01-07 21:00:00','Test...'),
(1,'2019-01-12 09:30:00','2019-01-12 12:30:00','Test...'),
(1,'2019-01-14 19:00:00','2019-01-14 21:00:00','Test...'),
(1,'2019-01-21 19:00:00','2019-01-21 21:00:00','Test...'),
(1,'2019-01-28 19:00:00','2019-01-28 21:00:00','Test...'),
(2,'2019-03-10 11:00:00','2019-03-10 13:00:00','Test...'),
(2,'2019-03-17 15:00:00','2019-03-17 17:00:00','Test...');

drop table if exists `appointments_compositions`;
create table `appointments_compositions` (
`appointment_id` int(11) not null,
`composition_id` int(11) not null,
foreign key(`appointment_id`) references appointment(id),
foreign key(`composition_id`) references composition(id)
);
insert into `appointments_compositions`(`appointment_id`,`composition_id`) values 
(1,3),
(1,4),
(2,1),
(2,2),
(3,2),
(4,2);

drop table if exists `composition`;
create table `composition`(
`id` int(11) not null auto_increment unique,
`ismn` varchar(100) COLLATE utf8_unicode_ci,
`name` varchar(100) COLLATE utf8_unicode_ci not null,
`composer_id` int(11) COLLATE utf8_unicode_ci not null,
`arranger_id` int(11),
`publisher_id` int (11),
`era_id` int(11) not null,
`isSubjectToAKM` boolean not null,
primary key(`id`),
foreign key(`era_id`) references era(id),
foreign key(`composer_id`) references composer(id)/*,
foreign key(`arranger_id`) references arranger(id),
foreign key(`publisher_id`) references publisher(id)*/
);
insert into `composition` (`name`,`composer_id`,`era_id`,`isSubjectToAKM`) values 
('Doppel Violin Konzert in a Moll',1,1,false),
('Egmont Overture',2,2,false),
('Smooth',3,3,true);
update composition set arranger_id=1 where id=3;
update composition set publisher_id=1 where id=3;

drop table if exists `composer`;
create table `composer`(
`id` int(11) not null auto_increment unique,
`name` varchar(100) COLLATE utf8_unicode_ci not null,
primary key(`id`)
);
insert into `composer` (`name`) values 
('Antonio Vivaldi'),
('Ludwig van Beethoven'),
('Itaal Shur & Rob Thomas');

drop table if exists `arranger`;
create table `arranger`(
`id` int(11) not null auto_increment unique,
`name` varchar(100) COLLATE utf8_unicode_ci not null,
primary key(`id`)
);
insert into `arranger` (`name`) values 
('Jerry Brubaker');

drop table if exists `era`;
create table `era`(
`id` int(11) not null auto_increment unique,
`name` varchar(100) COLLATE utf8_unicode_ci not null,
`from` date not null,
`to` date not null,
primary key(`id`)
);
insert into `era` (`name`,`from`,`to`) values 
('Barock','1600-01-01','1750-01-01'),
('Klassik','1730-01-01','1820-01-01'),
('20.Jahrhundert','1900-01-01','2000-01-01');

drop table if exists `instrumentation`;
create table `instrumentation`(
`composition_id` int(11) not null,
`orchestral_instrument_id` int(11) not null,
foreign key(`composition_id`) references composition(id),
foreign key(`orchestral_instrument_id`) references orchestral_instrument(id)
);
insert into `instrumentation` (`composition_id`, `orchestral_instrument_id`) values 
(1,34),(1,35),(1,37),(1,38),(1,39),(1,42),
(2,1),(2,2),(2,3),(2,4),(2,8),(2,7),(2,19),(2,20),(2,16),(2,33),(2,34),(2,35),(2,37),(2,38),(2,39),
(3,2),(3,4),(3,8),(3,9),(3,7),(3,19),(3,16),(3,17),(3,23),(3,27),(3,32),(3,29),(3,30),(3,31),(3,34),(3,35),(3,37),(3,38),(3,39);

drop table if exists `soloist`;
create table `soloist`(
`member_id` int(11),
`name` varchar(100) collate utf8_unicode_ci,
`composition_id` int(11) not null,
`orchestral_instrument_id` int(11) not null,
primary key(`composition_id`,`orchestral_instrument_id`),
foreign key(`member_id`) references member(id),
foreign key(`composition_id`) references composition(id),
foreign key(`orchestral_instrument_id`) references orchestral_instrument(id)
);
insert into `soloist` (`name`,`composition_id`,`orchestral_instrument_id`) values ('M',1,34),('?',1,35);

drop table if exists `publisher`;
create table `publisher`(
`id` int(11) not null auto_increment unique,
`name` varchar(100) not null,
primary key(`id`)
);
insert into `publisher` (`name`) values ('Warner-Tamerlane-Publishing Corp.');

drop table if exists `msg_type`;
create table `msg_type`(
`id` int(11) not null auto_increment unique,
`name` varchar(100) collate utf8_unicode_ci not null,
primary key(`id`)
);
insert into msg_type(`name`)
values 
('Neue Noten'),
('Proben-Ausfall'),
('Vereins-Infos')
;

drop table if exists `message`;
create table `message`(
`id` int(11) not null auto_increment unique,
`type_id` int(11) not null,
`text` varchar(1000) collate utf8_unicode_ci not null,
`composition_id` int(11),
`link_to_sheets` varchar(100) collate utf8_unicode_ci,
`member_id` int(11),
primary key(`id`),
foreign key(`composition_id`) references composition(id),
foreign key(`type_id`) references msg_type(id),
foreign key(`member_id`) references member(id)
/*,
`section_id` int(11) not null,
foreign key(`section_id`) references section(id)*/
);
insert into message(`type_id`,`text`,`composition_id`,`link_to_sheets`)
values 
(1,'Es gibt neue Noten für das Stück',1,'some-link'),
(1,'Es gibt neue Noten für das Stück',2,'some-link'),
(1,'Es gibt neue Noten für das Stück',3,'some-link'),
(1,'Besser eingerichtete Stimmen',1,'some-link'),
(1,'Besser eingerichtete Stimmen',2,'some-link'),
(1,'Es gibt neue Noten für das Stück',3,'some-link'),
(1,'Es gibt neue Noten für das Stück',1,'some-link');


drop table if exists `members_messages`;
create table `members_messages`(
`message_id` int(11) not null,
`member_id` int(11) not null,
`read` boolean not null,
foreign key(`message_id`) references message(id),
foreign key(`member_id`) references member(id)
);
insert into members_messages(`message_id`,`member_id`,`read`)
values
(1,1,false),(1,2,false),
(2,1,false),(2,2,false),
(3,1,false),(3,2,false),
(4,1,false),(4,2,false),
(5,1,false),(5,2,false);

drop table if exists `subscribers`;
create table `subscribers`(
 `id` int(11) not null auto_increment,
  `endpoint` varchar(200) collate utf8_unicode_ci,
  `expirationTime` varchar(100),
  `p256dh`varchar(200) collate utf8_unicode_ci,
  `auth`varchar(200) collate utf8_unicode_ci,
  primary key(`id`)
);

