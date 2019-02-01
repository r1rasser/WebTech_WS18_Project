const webpush = require('web-push');
const getDb = require('../db').getDb;
const express = require('express');
const router = express.Router();
let cfg = require('../config.json') // used if connected to home network
//let cfg = require('../config.local.json'); // used if no internet connection

webpush.setVapidDetails(
    'mailito:r1rasser@edu.aau.at',
    cfg.vapidKeys.publicKey,
    cfg.vapidKeys.privateKey
);

router.post('/sendNotifications',(req, res) => {
    let sql = "select distinct endpoint,expirationTime, p256dh,auth from subscribers"
    let db = getDb();
    db.query(sql,(err,result)=>{
    if(err){
        res.status(500).json({"message":"Sending subscriptions failed"})
    } else {    
        let USER_SUBSCRIPTIONS = [];
        for(let i = 0; i < result.length; i++){
            let subscription = {
                "endpoint":result[i].endpoint,
                "expirationTime":null,
                "keys":{
                    "p256dh":result[i].p256dh,
                    "auth":result[i].auth
                }
            };
            USER_SUBSCRIPTIONS.push(subscription);
        }
        console.log('Total subscriptions', USER_SUBSCRIPTIONS.length);
        // sample notification payload
        const notificationPayload = {
            "notification": {
                "title": "Angular News",
                "body": "Newsletter Available!",
                "icon": "assets/main-page-logo-small-hat.png",
                "vibrate": [100, 50, 100],
                "data": {
                    "dateOfArrival": Date.now(),
                    "primaryKey": 1
                },
                "actions": [{
                    "action": "explore",
                    "title": "Go to the site"
                }]
            }
        };
        Promise.all(USER_SUBSCRIPTIONS.map(sub => webpush.sendNotification(
            sub, JSON.stringify(notificationPayload) )))
            .then(() => res.status(200).json({message: 'Newsletter sent successfully.'}))
            .catch(err => {
                console.error("Error sending notification, reason: ", err);
                res.sendStatus(500);
            });
        }
    })
});

router.post('/subscribe',(req, res) => {
    let db = getDb();
    const sub = req.body;
    let sql = "insert into subscribers(endpoint,expirationTime,p256dh,auth) values('"+db.escape(sub.endpoint)+"','"+null+"','"+db.escape(sub.keys.p256dh)+"','"+db.escape(sub.keys.auth)+"')";
    db.query(sql,(err,result)=>{
        if(err){
            res.status(500).json({"message":"subscription failed..."});
        } else {
            console.log('Received Subscription on the server: ', sub);
            res.status(200).json({message: "Subscription added successfully."});
        }
    })
});

module.exports = router;