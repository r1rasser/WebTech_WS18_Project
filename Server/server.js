let cfg = require('./config.json') // used if connected to home network
//let cfg = require('./config.local.json'); // used if no internet connection
let express = require('express');
let cors = require('cors');
const app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
const webpush = require('web-push');

let clients = [];

app.use(express.static('public'));
app.use(cors());
const db = require("./db");

let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const appointmentsRoutes = require('./routes/appointments');
const memberRoutes = require('./routes/userData');
const newsRoutes = require('./routes/news');
const notificationsRoutes = require('./routes/notifications');

app.use("/member", memberRoutes); // More or less done
app.use("/appointments", appointmentsRoutes); // More or less done
app.use("/news", newsRoutes); // TODO
app.use('/notifications', notificationsRoutes);

app.use("/", (req, res) => {
    res.status(200);
    res.send("Welcome to orchestra server 1.0");
});

io.on('connection', (client) => {
    console.log('Client ' + client.id + ' connected');
    client.on('disconnect', () => {
        console.log('Client ' + client.id + ' disconnected');
    });
    client.on('update', (updated) => {
        if(updated === 'appointments'){
            client.broadcast.emit('appointmentUpdate','Appointments were updatet!');
        }
        if(updated === 'news'){

        }
    });
    client.on('markedAsRead', () => {
        console.log("Ok...")
        client.emit('badgeUpdate');
    })
});



db.initDb.then(() => {
    http.listen(cfg.server.port,cfg.server.host, () => {
        console.log("Listening on " + cfg.server.host + ":" + cfg.server.port + "...");
    });
}, () => {console.log("Failed to connect to DB!")});
