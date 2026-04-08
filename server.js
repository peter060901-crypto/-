<!DOCTYPE html>
<html>
<body style="font-family:sans-serif; padding:20px; max-width:500px; margin:auto">

<h2>결 매칭</h2>

<!-- STEP 1 -->
<div id="step1">
  <input id="name" placeholder="이름" style="width:100%; padding:10px">

  <p>감정 속도</p>
  <select id="emotion"><option>빠름</option><option>보통</option><option>느림</option></select>

  <p>표현 방식</p>
  <select id="expression"><option>직접적</option><option>간접적</option><option>절제적</option></select>

  <p>에너지 흐름</p>
  <select id="energy"><option>안정적</option><option>변동적</option></select>

  <p>갈등 방식</p>
  <select id="conflict"><option>회피적</option><option>직면적</option></select>

  <br><br>
  <button onclick="register()">시작하기</button>
</div>

<!-- STEP 2 -->
<div id="menu" style="display:none">
  <h3>메뉴</h3>
  <button onclick="match()">매칭 보기</button>
  <button onclick="loadMatches()">내 연결 보기</button>
</div>

<!-- STEP 3 -->
<div id="result" style="display:none"></div>

<script>
function getData(){
  return {
    name:document.getElementById('name').value,
    emotion_speed:document.getElementById('emotion').value,
    expression_style:document.getElementById('expression').value,
    energy_flow:document.getElementById('energy').value,
    conflict_style:document.getElementById('conflict').value
  };
}

async function register(){
  await fetch('/register',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(getData())
  });

  show('menu');
}

async function match(){
  const res = await fetch('/match',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(getData())
  });

  const data = await res.json();

  let html='<h3>매칭 결과</h3>';
  data.forEach(u=>{
    html += `<div style="border:1px solid #ddd; padding:10px; margin-top:10px">
      ${u.name}<br>
      적합도: ${u.score}<br>
      <button onclick="like('${u.name}')">관심</button>
    </div>`;
  });

  html += '<br><button onclick="back()">뒤로</button>';

  document.getElementById('result').innerHTML = html;
  show('result');
}

async function like(name){
  await fetch('/like',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      from:document.getElementById('name').value,
      to:name
    })
  });

  alert("관심 표시 완료");
}

async function loadMatches(){
  const name = document.getElementById('name').value;
  const res = await fetch('/matches/'+name);
  const data = await res.json();

  let html='<h3>내 연결</h3>';

  if(data.length===0){
    html += "아직 연결 없음";
  } else {
    data.forEach(m=>{
      html += `<div style="border:1px solid #ddd; padding:10px; margin-top:10px">
        ${m.to}
      </div>`;
    });
  }

  html += '<br><button onclick="back()">뒤로</button>';

  document.getElementById('result').innerHTML = html;
  show('result');
}

function show(id){
  ['step1','menu','result'].forEach(s=>{
    document.getElementById(s).style.display='none';
  });
  document.getElementById(id).style.display='block';
}

function back(){
  show('menu');
}
</script>

</body>
</html>
