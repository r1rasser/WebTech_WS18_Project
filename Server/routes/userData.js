const express = require('express');
const router = express.Router();
const getDb = require("../db").getDb;
const tokenService = require("../check_auth");
const SHA = require('crypto-js');

router.patch('/updateUsername', (req, res) => {
    const db = getDb(); 
    let token = req.headers.authorization;
    let credentials = req.body.credentials;
    let email = credentials.email.toLowerCase();
    let password = credentials.password;
    let newUsername = credentials.newUsername;
    let s = JSON.stringify({"email":email});
    let legit = tokenService.verify(token,{issuer:'HKRS WebTechnologies',subject:s});
    if(legit){
        sql="update member set username=? where id=? and sha2(membernumber,512)=? and password=?";
        db.query(sql,[newUsername,legit.id,legit.membernumber,password],function(err,rowsAffected){
            if(err){
                res.status(500).json({"message":"somethig went wrong..."});
            } else {
                res.status(200).json({"message":"Succesful Username-update."});
            }
        });
    } else {
        res.status(401).json({"message":"Not authorized!"});
    }
});
router.get('/checkUsername/:typedUsername', (req,res) => {
    const db = getDb(); 
    let typedUsername = req.params.typedUsername;
    sql = "select (count(*)=0) as available from member where username=?";
    db.query(sql,[typedUsername],function(err,result){
        if(err){
            res.status(500).json({"message":"somethig went wrong..."});
        } else {
            res.status(200).json({"available":""+result[0].available});
        }
    });
});
router.get('/userData/:email', (req, res) => {
    const db = getDb(); 
    let token = req.headers.authorization;
    let email = req.params.email.toLowerCase();
    let s = JSON.stringify({"email":email});
    let legit = tokenService.verify(token,{issuer:'HKRS WebTechnologies',subject:s});
    if(legit){
        let sql = "select m.membernumber,m.firstname,m.lastname,m.dateOfBirth,m.username,m.email,m.phone,m.mobile,i.name as instrument,a.street,a.number,a.door,a.floor,a.ZIP,a.city,a.state from member m, instrument i, address a where m.id=? and sha2(m.membernumber,512)=? and m.instrument_id=i.id and m.address_id=a.id";
        db.query(sql,[legit.id,legit.membernumber],function(err,result){
            if(err){
                res.status(500).json({"message":"Something went wrong..."})
            } else {
                let data = {
                    "member":{
                        "membernumber":result[0].membernumber,
                        "firstname":result[0].firstname,
                        "lastname":result[0].lastname,
                        "dob":result[0].dateOfBirth,
                        "username":result[0].username,
                        "email":result[0].email,
                        "phone":result[0].phone,
                        "mobile":result[0].mobile,
                        "instrument":result[0].instrument
                    },
                    "address":{
                        "street":result[0].street,
                        "number":result[0].number,
                        "door":result[0].door,
                        "floor":result[0].floor,
                        "ZIP":result[0].ZIP,
                        "city":result[0].city,
                        "state":result[0].state
                    }
                }
                res.status(200).json({"message":"Ok","data":data});
            }
        });
    } else {
        res.status(401).json({"message":"Not authorized!"})
    }
});
router.patch('/updateUserData', (req,res) => {
    const db = getDb(); 
    let token = req.headers.authorization;
    let credentials = req.body.credentials;
    let email = credentials.email.toLowerCase();
    let password = credentials.password;
    let newEmail = credentials.newEmail;
    let newPhone = credentials.newPhone;
    let newMobile = credentials.newMobile;
    let s = JSON.stringify({"email":email});
    let legit = tokenService.verify(token,{issuer:'HKRS WebTechnologies',subject:s});
    if(legit){
        let sql = "update member set email=?, phone=?,mobile=? where id=? and sha2(membernumber,512)=? and password=?";
        db.query(sql,[newEmail,newPhone,newMobile,legit.id,legit.membernumber,password],(err,result,fields)=>{
            if(err){
                res.status(500).json({"message":"Something went wrong..."})
            } else {
                res.status(200).json({"message":"successful user data update!"})
            }
        });
    }else{
        res.status(401).json({"message":"Not authorized!"});
    }
})
router.post('/login', (req, res) => {
    const db = getDb();
    let credentials = req.body.credentials;
    let email = credentials.email.toLowerCase();
    let username = credentials.username.toLowerCase();
    let password = credentials.password;
    if(email === '' && username === ''){
        res.status(403).json({"message":"Login request denied, because neither email nor username are provided."});
    } else if(email === '' && username !== ''){
        let sql = "select id, cast(sha2(membernumber,512) as char) as memberSHA, email from member where username=? and password=?";
        db.query(sql,[username,password],function(err,result,fields){
            if(err){
                res.status(500).json({"message":"somethig went wrong..."});
            } else if(result.length === 0){
                res.status(401).json({"message":"Username or Password incorrect!"});
            } else {
                let payload = {
                    id:result[0].id+"",
                    membernumber:result[0].memberSHA+""
                };
                let s = JSON.stringify({"email":result[0].email});
                let token = getToken(payload, s);
                res.status(200).json({"message":"Login was successful!","token":JSON.stringify(token),"email":result[0].email,"username":username});
            }
        });
    } else if(email !== '' && username === ''){
        let sql = "select id, cast(sha2(membernumber,512) as char) as memberSHA, username from member where email=? and password=?";
        db.query(sql,[email,password],function(err,result,fields){
            if(err){
                res.status(500).json({"message":"somethig went wrong..."});
            } else if(result.length === 0){
                res.status(401).json({"message":"Email or Password incorrect!"});
            } else {
                let payload = {
                    id:result[0].id+"",
                    membernumber:result[0].memberSHA+""
                };
                let s = JSON.stringify({"email":email});
                let token = getToken(payload, s);
                res.status(200).json({"message":"Login was successful!","token":JSON.stringify(token),"email":email,"username":result[0].username});
            }
        });
    }
})
router.get("/getMemberFunctions/:member",(req,res)=>{
    const db = getDb();
    let email = req.params.member.toLowerCase();
    sql = "select f.name from member m, members_functions mf, functions f where (m.email=? OR m.username=?) and mf.member_id=m.id and mf.function_id=f.id";
    db.query(sql,[email,email],function(err,result,fields){
        if(err){
            res.status(500).json({"message":"somethig went wrong..."});
        } else if(result.length === 0){
            res.status(401).json({"message":"Email or Password incorrect!"});
        } else {
            let functions = {};
            for(let i = 0; i < result.length; i++){
                functions[i] = result[i].name;
            }
            res.status(200).json({"functions":functions});
        }
    });
})
router.patch('/updatePassword', (req, res) => {
    const db = getDb(); 
    let token = req.headers.authorization;
    let credentials = req.body.credentials;
    let email = credentials.email.toLowerCase();
    let oldPassword = credentials.oldPassword;
    let newPassword = credentials.newPassword;
    let s = JSON.stringify({"email":email});
    let legit = tokenService.verify(token,{issuer:'HKRS WebTechnologies',subject:s});
    if(legit){
        let sql = "select count(*) from member where password=? and email=?";
        db.query(sql,[oldPassword,email],function(err,result){
            if(err){
                res.status(500).json({"message":"somethig went wrong..."});
            }
            if(result.length == 0){
                res.status(404).json({"message":"No such member was found"});
            } else {
                return;
            }
        });
        sql="update member set password=? where id=? and sha2(membernumber,512)=?";
        db.query(sql,[newPassword,legit.id,legit.membernumber],function(err,rowsAffected){
            if(err){
                res.status(500).json({"message":"somethig went wrong..."});
            } else {
                res.status(200).json({"message":"Succesful Password-update."});
            }
        });
    } else {
        res.status(401).json({"message":"Not authorized!"});
    }
});
function getToken(payload, subj){
    let i = 'HKRS WebTechnologies';                    
    let signOptions = {
        issuer:i,
        subject:subj
    };
    return tokenService.sign(payload,signOptions);
}
module.exports = router;
