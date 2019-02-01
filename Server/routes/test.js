const fs = require('fs');
const jwt = require('jsonwebtoken');

let publicKey = fs.readFileSync('../public.key','utf8');
console.log(jwt.verify(
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJtZW1iZXJudW1iZXIiOiJ1bmRlZmluZWQiLCJpYXQiOjE1NDU5OTE2NTYsImV4cCI6MTU0NTk5NTI1NiwiaXNzIjoiSEtSUyBXZWJUZWNobm9sb2dpZXMiLCJzdWIiOiJ7XCJlbWFpbFwiOlwicmVuZS5yYXNzZXIudGhldmlvbGluaXN0QGdtYWlsLmNvbVwiLFwidXNlcm5hbWVcIjpcInIxcmFzc2VyXCJ9In0.lmiiHNlSaW-Mp9u4rbqcFzuBST2eXm5e9NB9DMzlW8nayWPOZv6tznIaXihwh1KfvTToVo7iykuKBKueT74VWRWRjMNuWLeKSC5jMNQHaFAgZWL8grKgh0sO6ny9PxCodX3NWtn0Vdh2UBmAibdiTu6YrRQWZbZCNdysOkanbbkXhiSONUGyiDyJjeiXW7fHSecnfzkvWuCpSXs4dkZsUuXq7o3HVSQULABtdZ2fMKjpKh53A1RRFX6yzUD8Jotnr8dsA6pbnRy3N6RdMfMfF8SqGmdwWUBtW5lKHJ53ftXSr_hWxOtui2KvKPWcEvEzjuJkzwAqZQnBvHmPCLjXHg",
    publicKey,{
        issuer:'WebTechnologies',
        subject:JSON.stringify({
            "email":"rene.rasser.theviolinist@gmail.com",
            "username":"r1rasser"
        }),
        expiresIn:"1h",
        algorithm:["RS256"]
    }));