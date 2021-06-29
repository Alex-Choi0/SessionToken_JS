const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const app = express();

const PORT = 5000;

app.use(cookieParser()); // 클라이언트 쪽의 쿠키에 세션을 저장한다.
app.use(session({ // 세션을 셋팅한다.
    secret: "test1", 
    saveUninitialized: true, 
    resave: true, 
    cookie: { maxAge: 30000 } // session에 제한시간(ms)
}));


// 유저 데이터
// 실제로는 Data Base(MySQL)에 저장해야 합니다.
const userData = [
    {
        ID : "alex",
        Password : "1234",
        Email : "alex@mail.com"
    },
    {
        ID : "jhon",
        Password : "1234",
        Email : "jhon@mail.com"
    },
    {
        ID : "pull",
        Password : "1234",
        Email : "pull@mail.com"
    },
]

// request body를 json타입으로 읽기위해 필요함
app.use(express.json());

// 서버 동작을 확인하기 위한 파트
app.get('/', (req, res) => {
    
    res.status(200);
    res.send("<h1>Working Well</h1>")
})

// 사용자가 로그인에 성공시 사용자 정보를 표시한다.
app.get('/login', (req, res) => {
    console.log(req.session);
    if(!req.session.user){
        res.status(401);
        res.send("<h1>Need to Login</h1>")
    }

    else{
        return res.send(req.session.user)
    }

});

// 사용자가 로그아웃을 한다.
app.get('/logout', (req, res) => {
    console.log(req.session);
    req.session.destroy()
    return res.send("session has been deleted");

})


// POST 
// 사용자가 로그인을 시도한다.
app.post('/login', (req, res) => {
  console.log(req.body) // body확인 가능 부분

  for(let i = 0; i < userData.length; i++){
      console.log("enter For Loop : ", i);

      if(userData[i].ID === req.body.ID){ // DB에 user ID가 존재할시
        console.log("ID Exist");

          if(userData[i].Password === req.body.Password){ // 해당 user ID의 비밀번호가
            console.log("password is same");
            req.session.user = userData[i];
            req.session.save();
            console.log(req.session.user);
            return res.status(200).send("User logged in!");

          }

      } 
  }

    res.status(401);
    res.send("<h1>Wrong ID or Password</h1>");

})

app.listen(PORT, () => console.log(`Server at ${PORT}`));
