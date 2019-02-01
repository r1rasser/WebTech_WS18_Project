use orchestra_DB;
/**
*
* This SQL-Script is used to test the SQL-Queries for the Orchestra-Website-Server
*
*/
/* Get current DB-Size in kB */
select table_schema "Name",round(sum(data_length + index_length)/1024,1) "DB size in kB"
from information_schema.tables
where table_schema='orchestra_DB'
group by table_schema;

/**/
select distinct endpoint,expirationTime, p256dh,auth from subscribers;



/**/
select distinct m.id from member m, instrument i, orchestral_instrument oi, composition c, instrumentation ins, instruments_in_orchestra iio, section s, message msg where msg.composition_id=c.id and c.id=ins.composition_id and oi.section_id=s.id and oi.id=ins.orchestral_instrument_id and iio.orchestral_instrument_id=ins.orchestral_instrument_id and iio.instrument_id = i.id and m.instrument_id = i.id and msg.id = (select max(mes.id) from message mes);
/**/
select mt.name as type, m.text, m.link_to_sheets as link, mm.read from message m, members_messages mm, msg_type mt where m.type_id=mt.id and mm.message_id=m.id and mm.member_id = 1;
select m.* from message m, msg_type mt, members_messages mm, member mem where m.type_id=mt.id and mm.message_id=m.id and mm.member_id = mem.id and mem.email = 'rene.rasser.theviolinist@gmail.com';

select count(mm.read) as unread from members_messages mm, message msg where mm.message_id = msg.id and mm.read=false and mm.member_id = 1;

select m.firstname, count(mm.read) as `# unread` from member m, members_messages mm, message msg where mm.message_id = msg.id and mm.read=0 and mm.member_id = m.id group by m.id;
/**/
update members_messages mm set mm.read=true where mm.Member_id = 6 and mm.message_id = 1;
/**/
select a.id, apt.name as type, s.name as register, a.start, a.end, c.name as title, c.id as cID, comp.name as composer from member m, appointment a, appointments_compositions ac, appointment_type apt, instrument i, orchestral_instrument oi, composition c, instrumentation ins, instruments_in_orchestra iio, section s, composer comp where a.id=ac.appointment_id and a.type_id=apt.id and ac.composition_id=c.id and c.id=ins.composition_id and oi.section_id=s.id and oi.id=ins.orchestral_instrument_id and iio.orchestral_instrument_id=ins.orchestral_instrument_id and iio.instrument_id = i.id and m.username='r1rasser' and m.instrument_id = i.id and comp.id=c.composer_id order by a.start and a.id;

/* Test if member table is correct */
select * from member;

select * from appointments_compositions where appointment_id = (select max(id) from appointment);
/**/
insert into appointment(type_id,start,end) values(1,'2019-01-28 19:00:00','2019-01-28 21:00:00');
insert into appointments_compositions(appointment_id, composition_id) values(8,1);

/**/
select c.name, c.id, comp.name from composition c, composer comp where c.composer_id = comp.id;


select mt.name, m.text, c.name, m.link_to_sheets, mem.firstname, mem.lastname, mm.read 
from message m, msg_type mt, composition c, member mem, members_messages mm 
where mt.id=m.type_id and m.composition_id=c.id and mm.member_id = mem.id and mm.message_id=m.id and mem.id=1;

update members_messages mm set mm.read=true where mm.member_id=1 and mm.message_id=1;

select * from member where username='r1rasser';
/**/
select m.password, m.id, sha2(m.membernumber,512)
	from member m
    where m.email='rene.rasser.theviolinist@gmail.com';
    
select cast(sha2(m.membernumber,512) as char), m.id from member m where sha2(m.membernumber,512)=sha2('812a74b23b',512);

/* select user data */
select m.id, m.membernumber, m.firstname, m.lastname, m.dateOfBirth, m.email, m.phone, m.mobile, m.username, m.password, i.name as Instrument 
	from member m, instrument i 
    where m.instrument_id=i.id;

/* Member: Set Username */
select ((count(*)=0)) as available from member where username='r1rasser';
update member m 
	set m.username='r1rasser' 
	where m.id=1;

/* Member: Set new Password */
update member m 
	set m.password=sha2('myPassword',512) 
	where m.id=1;

/* Test f Address is correct */
select * 
	from address;
    
/* Test if Instrument is correct */
select * 
	from instrument;
    
/* Test if Orchestral_instrument is correct */
select * 
	from orchestral_instrument;
    
/* Test if instruments_in_orchestra is correct */
select i.id, i.name, oi.name, s.name 
	from instrument i, orchestral_instrument oi, instruments_in_orchestra iio, section s 
	where s.id = oi.section_id and iio.instrument_id = i.id and iio.orchestral_instrument_id = oi.id;
    
/* Test if section is correct */
select * 
	from section;
    
/* Test if members_functions is correct */
select * 
	from members_functions;
    
/**/
select f.name from member m, members_functions mf, functions f where m.email='rene.rasser.theviolinist@gmail.com' and mf.member_id=m.id and mf.function_id=f.id;
    
/* test if functions is correct */
select * 
	from functions;
    
/* test if composition works */
select * 
	from composition;

select m.firstname, f.name as functions from member m, functions f, members_functions mf where mf.member_id = m.id and mf.function_id=f.id;
    
/* test if composer works */
select * 
	from composer;
    
/* test if era works */
select * 
	from era;
    
/* Mapping Composition, Composer, Era */
select c.name, co.name as Komponist, e.name as Epoche 
	from composition c, composer co, era e 
    where c.composer_id = co.id and c.era_id = e.id;
    
/* Instrumentation */
select c.name as Stück, oi.name as Instrument 
	from composition c, orchestral_instrument oi, instrumentation ci 
	where ci.composition_id=c.id and ci.orchestral_instrument_id=oi.id;
    
/* test if appointment works */
select * 
	from appointment;
    
/* test if appointment_type works */
select * 
	from appointment_type;
    
/* test if appointments_compositions works */
select * 
	from appointments_compositions;
    
/* User specific Appointments - general test */
select m.firstname, m.lastname, i.name, c.name 
	from member m, instrument i, orchestral_instrument oi, composition c, instrumentation ins, instruments_in_orchestra iio 
	where c.id=ins.composition_id and oi.id=ins.orchestral_instrument_id and iio.orchestral_instrument_id=ins.orchestral_instrument_id
		and iio.instrument_id = i.id and m.instrument_id = i.id;
        
/* User specific Appointments - general test, distinct result */
select distinct apt.name as Termintyp, s.name as Register, a.start as von, a.end as bis, c.name as Stück 
	from member m, appointment a, appointments_compositions ac, appointment_type apt, instrument i, orchestral_instrument oi, composition c, 
		instrumentation ins, instruments_in_orchestra iio, section s 
	where a.id=ac.appointment_id and a.type_id=apt.id and ac.composition_id=c.id and c.id=ins.composition_id and oi.section_id=s.id 
		and oi.id=ins.orchestral_instrument_id and iio.orchestral_instrument_id=ins.orchestral_instrument_id and iio.instrument_id = i.id 
        and m.instrument_id = i.id;
        
/* User specific Appointments - appointment by instrument (here 24 = Viola) */
select distinct apt.name as Termintyp, s.name as Register, a.start as von, a.end as bis, c.name as Stück 
	from member m, appointment a, appointments_compositions ac, appointment_type apt, instrument i, orchestral_instrument oi, composition c, instrumentation ins, 
		instruments_in_orchestra iio, section s 
	where a.id=ac.appointment_id and a.type_id=apt.id and ac.composition_id=c.id and c.id=ins.composition_id and oi.section_id=s.id 
		and oi.id=ins.orchestral_instrument_id and iio.orchestral_instrument_id=ins.orchestral_instrument_id and iio.instrument_id = i.id 
        and m.instrument_id=24 and m.instrument_id = i.id;
        
/* User specific Appointments - appointment by user (here René Rasser) */
select distinct apt.name as Termintyp, s.name as Register, a.start as von, a.end as bis, c.name as Stück 
	from member m, appointment a, appointments_compositions ac, appointment_type apt, instrument i, orchestral_instrument oi, composition c, 
		instrumentation ins, instruments_in_orchestra iio, section s 
	where a.id=ac.appointment_id and a.type_id=apt.id and ac.composition_id=c.id and c.id=ins.composition_id and oi.section_id=s.id 
		and oi.id=ins.orchestral_instrument_id and iio.orchestral_instrument_id=ins.orchestral_instrument_id and iio.instrument_id = i.id 
        and m.firstname='René' and m.lastname='Rasser' and m.instrument_id = i.id		
        and a.start between 
			now()
            and
			date_add(now(), interval 1 month);
        
/* User specific Appointments - appointment by user (here Christian Lackner) */
select distinct apt.name as Termintyp, s.name as Register, a.start as von, a.end as bis, c.name as Stück 
	from member m, appointment a, appointments_compositions ac, appointment_type apt, instrument i, orchestral_instrument oi, composition c, 
		instrumentation ins, instruments_in_orchestra iio, section s 
	where a.id=ac.appointment_id and a.type_id=apt.id and ac.composition_id=c.id and c.id=ins.composition_id and oi.section_id=s.id 
		and oi.id=ins.orchestral_instrument_id and iio.orchestral_instrument_id=ins.orchestral_instrument_id and iio.instrument_id = i.id 
        and m.firstname='Christian' and m.lastname='Lackner' and m.instrument_id = i.id
		and a.start between 
			now()
            and
			date_add(now(), interval 1 month);
        
/* test mapping - address and member */
select a.street, a.number, a.ZIP, a.city, m.firstname, m.lastname 
	from address a, member m 
    where m.address_id = a.id;
    
/* test mapping instrument and member */
select m.firstname, m.lastname, i.name 
	from member m, instrument i 
    where m.instrument_id = i.id;
    
/* test mapping functions and member */
select m.firstname, m.lastname, f.name 
	from member m, functions f, members_functions mf 
    where m.id = mf.member_id and f.id = mf.function_id;
    
/* test mapping appointment and appointment_type */
select apt.name, a.start, a.end 
	from appointment_type apt, appointment a 
    where a.type_id = apt.id;
    
/* test mapping appointment, appointment_type and cmpositions */
select apt.name, a.start, a.end, c.name 
	from appointment_type apt, appointment a, appointments_compositions ac, composition c 
    where a.type_id = apt.id and a.id = ac.appointment_id and c.id = ac.composition_id;
    
/* test mapping composition and arranger */
select c.name, comp.name, arr.name from composition c, composer comp, arranger arr where c.composer_id=comp.id and c.arranger_id=arr.id;

/* test mapping composition and publisher */
select c.name, comp.name, p.name from composition c, composer comp, publisher p where c.composer_id=comp.id and c.publisher_id=p.id;

/* test mapping soloist and composition */
select s.name as SolistIn, oi.name as Instrument, c.name as Stück 
	from soloist s, orchestral_instrument oi, composition c 
	where s.orchestral_instrument_id=oi.id and s.composition_id=c.id;
    
/**/
select distinct apt.name as Termintyp, a.start as von, a.end as bis 
	from member m, appointment a, appointments_compositions ac, appointment_type apt, instrument i, orchestral_instrument oi, composition c, 
		instrumentation ins, instruments_in_orchestra iio 
	where a.id=ac.appointment_id and a.type_id=apt.id and ac.composition_id=c.id and c.id=ins.composition_id
		and oi.id=ins.orchestral_instrument_id and iio.orchestral_instrument_id=ins.orchestral_instrument_id 
        and iio.instrument_id = i.id and m.firstname='René' and m.lastname='Rasser' and m.instrument_id = i.id
        and a.start between 
			now()
            and
			date_add(now(), interval 1 month);
            
select c.name, comp.name from composition c, composer comp, appointments_compositions ac where ac.appointment_id=1 and ac.composition_id=c.id and c.composer_id=comp.id;
    
select c.id, c.name as title, comp.name from composition c, composer comp, appointments_compositions ac where ac.appointment_id=2 and ac.composition_id=c.id and c.composer_id=comp.id
    