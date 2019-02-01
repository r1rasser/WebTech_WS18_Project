const express = require('express');
const router = express.Router();
const tokenService = require("../check_auth");
const getDb = require("../db").getDb;

router.get("/getUserNews/:email",(req,res) => {
    const db = getDb();
    let token = req.headers.authorization;
    let email = req.params.email.toLowerCase();
    let s = JSON.stringify({"email":email});
    let legit = tokenService.verify(token,{issuer:'HKRS WebTechnologies',subject:s});
    if(legit){
        let sql = "select m.id, mt.name as type, m.text, m.link_to_sheets as link, c.name as comp, mm.read from message m, composition c, members_messages mm, msg_type mt where m.type_id=mt.id and mm.message_id=m.id and c.id=m.composition_id and mm.member_id =?";
        db.query(sql, [legit.id], (err,result) => {
            if(err){
                res.status(500).json({"message":"Something went wrong..."})
            } else {
                let news = {};
                for(let i = 0; i < result.length; i++){
                    news[result[i].id] = {
                        "type":result[i].type,
                        "text":result[i].text,
                        "comp":result[i].comp,
                        "link":result[i].link,
                        "read":result[i].read
                    }
                }
                res.status(200).json({"news":news});
            }
        })
    } else {
        res.status(401).json({"message":"not authorized"});
    }
})
router.get("/messageTypes",(req,res)=>{
    let db = getDb();
    let sql = "select name, id from msg_type";
    db.query(sql, (err,result)=>{
        if(err){
            res.status(500).json({"message":"something went wrong..."});
        } else {
            let types = {};
            for(let i = 0; i < result.length; i++){
                types[result[i].id] = result[i].name;
            }
            res.status(200).json({"types":types});
        }
    })
})
router.patch("/markAsRead",(req,res)=>{
    const db = getDb();
    let token = req.headers.authorization;
    let email = req.body.email.toLowerCase();
    let id = req.body.id;
    let s = JSON.stringify({"email":email});
    let legit = tokenService.verify(token,{issuer:'HKRS WebTechnologies',subject:s});
    if(legit){
        let sql = "update members_messages mm set mm.read=true where mm.message_id = ? and mm.member_id = ?";
        db.query(sql, [id,legit.id], (err,result) => {
            if(err){
                res.status(500).json({"message":"Something went wrong..."})
            } else {
                res.status(200).json({"message":"successfully set message to status read"});
            }
        })
    } else {
        res.status(401).json({"message":"not authorized"});
    }
})
router.get("/numUnread/:email",(req,res)=>{
    const db = getDb();
    let token = req.headers.authorization;
    let email = req.params.email.toLowerCase();
    let s = JSON.stringify({"email":email});
    let legit = tokenService.verify(token,{issuer:'HKRS WebTechnologies',subject:s});
    if(legit){
        let sql = "select count(mm.read) as unread from members_messages mm, message msg where mm.message_id = msg.id and mm.read=false and mm.member_id = ?";
        db.query(sql, [legit.id],(err,result) => {
            if(err){
                res.status(500).json({"message":"Something went wrong..."})
            } else {
                res.status(200).json({"unread":result[0].unread});
            }
        })
    } else {
        res.status(401).json({"message":"not authorized"});
    }
})

router.post("/addNews",(req,res) => {
    const db = getDb();
    let message = req.body.message;
    let sql = "insert into message(type_id, text, composition_id, link_to_sheets, member_id) values(?,?,?,?,?)";
    db.query(sql, [message.type,message.text,message.comp,message.link,message.from], (err,result) => {
        if(err){
            res.status(500).json({"message":"Something went wrong..."})
        } else {
            sql = "select distinct m.id from member m, instrument i, orchestral_instrument oi, composition c, instrumentation ins, instruments_in_orchestra iio, section s, message msg where msg.composition_id=c.id and c.id=ins.composition_id and oi.section_id=s.id and oi.id=ins.orchestral_instrument_id and iio.orchestral_instrument_id=ins.orchestral_instrument_id and iio.instrument_id = i.id and m.instrument_id = i.id and msg.id = (select max(mes.id) from message mes)";
            db.query(sql,(error,resultMem) => {
                if(error){
                    res.status(500).json({"message":"Something went wrong..."})
                } else {
                    sql = "insert into members_messages(member_message_id,read) values ";
                    let values = [];
                    for(let i = 0; i < resultMem.length; i++){
                        sql += "(?, (select max(mes.id) from message mes), false),";
                        values.push(resultMem[i].id);
                    }
                    sql = sql.substr(0,sql.length-1);
                    db.query(sql, values, (errorMM, resultMM) => {
                        if(error){
                            res.status(500).json({"message":"Something went wrong..."})
                        } else {
                            res.status(200).json({"message":"successfully inserted message"});
                        }
                    })
                }
            })
        }
    })
})
module.exports = router;