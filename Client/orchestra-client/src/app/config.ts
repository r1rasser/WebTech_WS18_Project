export const config_local = {
  "serverHost": "localhost",
  "serverPort": 3000,
  "memberRouteMain": "member",
  "memberRoutes":{
    "updUsername":"updateUsername",
    "usernameAvailability":"checkUsername",
    "userData":"userData",
    "updUserData":"updateUserData",
    "login":"login",
    "memberFunctions":"getMemberFunctions",
    "updPassword":"updatePassword"
  },
  "appointmentsRouteMain":"appointments",
  "appointmentRoutes":{
    "getComp":"getCompositions",
    "getTypes":"getTypes",
    "createAppointment":"createAppointment",
    "getUserApps":"getUserAppointment"
  },
  "newsRouteMain":"news",
  "newsRoutes":{
    "getMemberNews":"getUserNews",
    "getUnread":"numUnread",
    "markAsRead":"markAsRead"
  },
  "notificationsMain":"notifications",
  "notificationsRoutes":{
    "subscribe":"subscribe",
    "sendAll":"sendNotifications"
  }
}
export const config_network = {
  "serverHost": "127.0.0.1",
  "serverPort": 3000,
  "memberRouteMain": "member",
  "memberRoutes":{
    "updUsername":"updateUsername",
    "usernameAvailability":"checkUsername",
    "userData":"userData",
    "updUserData":"updateUserData",
    "login":"login",
    "memberFunctions":"getMemberFunctions",
    "updPassword":"updatePassword"
  },
  "appointmentsRouteMain":"appointments",
  "appointmentRoutes":{
    "getComp":"getCompositions",
    "getTypes":"getTypes",
    "createAppointment":"createAppointment",
    "getUserApps":"getUserAppointment"
  },
  "newsRouteMain":"news",
  "newsRoutes":{
    "getMemberNews":"getUserNews",
    "getUnread":"numUnread",
    "markAsRead":"markAsRead"
  },
  "notificationsMain":"notifications",
  "notificationsRoutes":{
    "subscribe":"subscribe",
    "sendAll":"sendNotifications"
  }
}