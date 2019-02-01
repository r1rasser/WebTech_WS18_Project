const express = require('express');
const router = express.Router();
const tokenService = require("../check_auth");
const getDb = require("../db").getDb;

router.get("/getCompositions",(req,res) => {
    const db = getDb();
    let sql = "select c.name as composition, c.id, comp.name from composition c, composer comp where c.composer_id = comp.id";
    db.query(sql, (err,result) => {
        if(err){
            res.status(500).json({"message":"Something went wrong..."})
        } else {
            let compositions = {};
            for(let i = 0; i < result.length; i++){
                compositions[result[i].id] = {
                    "composition":result[i].composition,
                    "composer":result[i].name
                }
            }
            res.status(200).json({"compositionData":compositions});
        }
    })
})
router.get("/getTypes",(req,res) => {
    const db = getDb();
    let sql = "select id, name from appointment_type";
    db.query(sql, (err,result) => {
        if(err){
            res.status(500).json({"message":"Something went wrong..."})
        } else {
            let types = {};
            for(let i = 0; i < result.length; i++){
                types[result[i].id] = {
                    "name":result[i].name
                }
            }
            res.status(200).json({"types":types});
        }
    })
})
router.post("/createAppointment",(req,res) => {
    let appointmentData = req.body.appointments;
    let compositions = appointmentData.program;
    const db = getDb();
    let sqlAppointment = "insert into appointment(type_id,start,end,comment) values (?,?,?,?)";
    db.query(sqlAppointment,[appointmentData.typeID,appointmentData.start,appointmentData.end,appointmentData.comment],(err,result) => {
        if(err){
            res.status(500).json({"message":"Something went wrong..."})
        } else {
            let sqlProgram = "insert into appointments_compositions(appointment_id,composition_id) values ";
            let values = [];
            Object.keys(compositions).forEach((key)=>{
                sqlProgram += "((select max(id) from appointment),?),";
                values.push(key);
            });
            sqlProgram = sqlProgram.substr(0,sqlProgram.length-1);
            db.query(sqlProgram,values, (errP,resultP)=>{
                if(err){
                    res.status(500).json({"message":"Something went wrong..."})
                } else {
                res.status(200).json({"message":"Successfully inserted new appointment..."})
                }
            });
        }
    })
})
router.get('/getUserAppointment/:email', (req, res) => {
    // TODO - fix comment bug
    const db = getDb(); 
    let token = req.headers.authorization;
    let email = req.params.email.toLowerCase();
    let s = JSON.stringify({"email":email});
    let legit = tokenService.verify(token,{issuer:'HKRS WebTechnologies',subject:s});
    if(legit){
        let sql = "select a.id, apt.name as type, s.name as register, a.start, a.end, a.comment, c.name as title, c.id as cID, comp.name as composer from member m, appointment a, appointments_compositions ac, appointment_type apt, instrument i, orchestral_instrument oi, composition c, instrumentation ins, instruments_in_orchestra iio, section s, composer comp where a.id=ac.appointment_id and a.type_id=apt.id and ac.composition_id=c.id and c.id=ins.composition_id and oi.section_id=s.id and oi.id=ins.orchestral_instrument_id and iio.orchestral_instrument_id=ins.orchestral_instrument_id and iio.instrument_id = i.id and sha2(m.membernumber,512)=? and m.id=? and m.instrument_id = i.id and comp.id=c.composer_id order by a.id";
        db.query(sql,[legit.membernumber,legit.id],function(err,result){
            if(err){
                res.status(500).json({"message":"Something went wrong..."})
            } else {
                let appointments = {};
                let k = 0;
                for(let i = 0; i < result.length; i++){
                    if(i == 0){
                        k = result[0].id;
                        appointments[result[i].id] = {
                            "type": result[i].type,
                            "start": result[i].start,
                            "end": result[i].end,
                            "comment":result[i].comment,
                            "program":{}
                        };
                        appointments[result[i].id].program[result[i].cID] = {
                            "title":result[i].title,
                            "composer":result[i].composer
                        };
                    } else {
                        if(result[i-1].start + '' == result[i].start + ''){
                            appointments[k].program[result[i].cID] = {
                                "title":result[i].title,
                                "composer":result[i].composer
                            };
                        } else {
                            k = result[i].id;
                            appointments[result[i].id] = {
                                "type": result[i].type,
                                "start": result[i].start,
                                "end": result[i].end,
                                "program":{}
                            };
                            appointments[result[i].id].program[result[i].cID] = {
                                "title":result[i].title,
                                "composer":result[i].composer
                            };
                        }
                    }
                }
                res.status(200).json({"message":"Ok","appointments":appointments});
            }
        });
    } else {
        res.status(401).json({"message":"Not authorized!"})
    }
});

module.exports = router;