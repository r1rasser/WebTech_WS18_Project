/**
 * Service for Authentification
 */
const fs   = require('fs');
const jwt   = require('jsonwebtoken');

let privateKEY  = fs.readFileSync('./private.key', 'utf8');
let publicKEY  = fs.readFileSync('./public.key', 'utf8');  
module.exports = {
    sign: (payload, $Options) => {
        let signOptions = {
            issuer:  $Options.issuer,
            subject:  $Options.subject,
            expiresIn:  "30d",    // 30 days validity
            algorithm:  "RS256"    
        };
        return jwt.sign(payload, privateKEY, signOptions);
    },
    verify: (token, $Option) => {
        let verifyOptions = {
            issuer:  $Option.issuer,
            subject:  $Option.subject,
            expiresIn:  "30d",
            algorithm:  ["RS256"]
        };
        try{
            return jwt.verify(token, publicKEY, verifyOptions);
        }catch (err){
            return false;
        }
    },
    decode: (token) => {
        return jwt.decode(token, {complete: true});
        //returns null if token is invalid
    }
}