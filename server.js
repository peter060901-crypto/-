const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

let users = [];
let likes = [];

function score(a,b){
  let s=0;
  s += a.emotion_speed===b.emotion_speed?2:1;
  s += a.expression_style===b.expression_style?2:1;
  s += a.energy_flow!==b.energy_flow?2:1;
  s += a.conflict_style===b.conflict_style?1:-1;
  return s;
}

// 등록
app.post('/register',(req,res)=>{
  users.push(req.body);
  res.json({ok:true});
});

// 전체 사용자
app.get('/users',(req,res)=>{
  res.json(users);
});

// 매칭
app.post('/match',(req,res)=>{
  const me = req.body;

  const result = users
    .filter(u => u.name !== me.name)
    .map(u=>({...u, score:score(me,u)}))
    .sort((a,b)=>b.score-a.score)
    .slice(0,10);

  res.json(result);
});

// 관심
app.post('/like',(req,res)=>{
  const {from,to} = req.body;
  likes.push({from,to});
  res.json({ok:true});
});

app.listen(3000, ()=>console.log("running"));
