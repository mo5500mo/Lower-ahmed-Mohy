(function() {
    var password = prompt("يرجى إدخال كلمة السر للدخول:");
    if (password !== "123") { 
      alert("كلمة السر غير صحيحة!");
      document.body.innerHTML = "<h1>غير مصرح لك بدخول هذه الصفحة</h1>";
      (window.location.href = "about:blank"); // أو توجيهه لصفحة أخرى
    }
  })();
  
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const iso=d=>d.toISOString().slice(0,10);
const addD=n=>{const d=new Date();d.setDate(d.getDate()+n);return iso(d)};
const today=iso(new Date());
const fmt=d=>d?new Date(d+"T00:00").toLocaleDateString("ar-EG",{weekday:"long",day:"numeric",month:"long",year:"numeric"}):"";
const days=d=>Math.round((new Date(d+"T00:00")-new Date(today+"T00:00"))/864e5);
const num=n=>Number(n||0).toLocaleString("ar-EG");
const KEY="lawyer-dash-v1";
let _u=0;const uid=()=>Date.now()*100+(_u++%100);
const TYPES=["مدني","جنائي","أسرة","تجاري","إداري","عمالي"],STAT=["متداولة","محجوزة للحكم","مؤجلة","منتهية"];
const EXPCATS=["رسوم قضائية","أتعاب خبير","إعلان ومحضرين","تصوير ومستندات","انتقالات","رسوم توثيق وشهر","رسوم طعن","أخرى"];
const seed=()=>({clients:[
{id:1,name:"أحمد محمود",phone:"01001234567",note:"عقد مقاولة متنازع عليه"},
{id:2,name:"منى عبد الله",phone:"01112345678",note:"قضية جنحة، حضور شخصي مطلوب"},
{id:3,name:"هالة السيد",phone:"01223456789",note:"نفقة وحضانة"}],
cases:[
{id:1,no:"٣٤٥٦ لسنة ٢٠٢٦ مدني كلي",clientId:1,type:"مدني",court:"محكمة شمال القاهرة",opp:"شركة النيل للمقاولات",status:"متداولة"},
{id:2,no:"٨٨٢ لسنة ٢٠٢٦ جنح",clientId:2,type:"جنائي",court:"محكمة جنح الجيزة",opp:"النيابة العامة",status:"محجوزة للحكم"},
{id:3,no:"١٢٠٧ لسنة ٢٠٢٥ أسرة",clientId:3,type:"أسرة",court:"محكمة الأسرة بإمبابة",opp:"طارق إبراهيم",status:"مؤجلة"}],
sessions:[
{id:1,caseId:1,date:addD(2),time:"٠٩:٣٠",note:"تقديم مذكرة الدفاع ومستندات الملكية"},
{id:2,caseId:2,date:addD(6),time:"١١:٠٠",note:"النطق بالحكم"},
{id:3,caseId:3,date:addD(15),time:"١٠:٠٠",note:"الرد على مذكرة الخصم"}],
tasks:[
{id:1,caseId:1,t:"كتابة مذكرة الدفاع في القضية المدنية",due:addD(1),pr:"عالية",done:false},
{id:2,caseId:2,t:"استخراج صورة رسمية من الحكم",due:addD(4),pr:"متوسطة",done:false},
{id:3,caseId:"",t:"مراجعة عقد وكالة جديد",due:addD(7),pr:"منخفضة",done:false}],
pays:[
{id:1,caseId:1,item:"أتعاب قضية مدنية",total:30000,paid:15000},
{id:2,caseId:2,item:"أتعاب قضية جنحة",total:12000,paid:12000},
{id:3,caseId:3,item:"أتعاب دعوى أسرة",total:10000,paid:4000}],
exps:[
{id:1,caseId:1,cat:"رسوم قضائية",amount:2500,date:addD(-20),note:"رسوم رفع الدعوى"},
{id:2,caseId:1,cat:"أتعاب خبير",amount:3000,date:addD(-8),note:""},
{id:3,caseId:2,cat:"انتقالات",amount:600,date:addD(-12),note:""},
{id:4,caseId:3,cat:"إعلان ومحضرين",amount:900,date:addD(-5),note:""}],
note:""});
function migrate(d){
 ["clients","cases","sessions","tasks","pays","exps"].forEach(k=>{if(!Array.isArray(d[k]))d[k]=[]});d.note=d.note||"";
 const cid=n=>{let c=d.clients.find(x=>x.name==n);if(!c){c={id:uid(),name:n,phone:"",note:""};d.clients.push(c)}return c.id};
 const cn=n=>(d.cases.find(c=>c.no==n)||{}).id||"";
 d.cases.forEach(c=>{if(c.clientId==null){c.clientId=cid(c.client||"غير محدد");delete c.client}});
 d.sessions.forEach(s=>{if(s.caseId==null)s.caseId=cn(s.no)});
 d.exps.forEach(e=>{if(e.caseId==null)e.caseId=cn(e.case)});
 d.tasks.forEach(t=>{if(t.caseId==null)t.caseId=""});
 d.pays.forEach(p=>{if(p.caseId==null&&p.clientId==null){const k=cid(p.client||"غير محدد"),c=d.cases.find(c=>c.clientId==k);if(c)p.caseId=c.id;else p.clientId=k}});
 return d}
let S;try{S=JSON.parse(localStorage.getItem(KEY))||seed()}catch(e){S=seed()}
S=migrate(S);
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const byId=(a,id)=>a.find(x=>x.id==id);
const cs=id=>byId(S.cases,id),cl=id=>byId(S.clients,id);
const cname=id=>(cl(id)||{}).name||"—";
const cOfRec=r=>r.caseId!==""&&r.caseId!=null?(cs(r.caseId)||{}).clientId:r.clientId;
const sum=(a,f)=>a.reduce((s,x)=>s+(+f(x)||0),0);
const cls=v=>v<0?"t-bad":"t-ok";
const lk=(t,id,x)=>`<a href="#" class="lk" data-open="${t}:${id}">${esc(x)}</a>`;
const caseLk=id=>{const c=cs(id);return c?lk("case",c.id,c.no):'<span class="t-mute">بدون قضية</span>'};
const cliLk=id=>cl(id)?lk("client",id,cname(id)):'<span class="t-mute">—</span>';
const sess=r=>cs(r.caseId)||{};
const nextS=cid=>S.sessions.filter(s=>s.caseId==cid&&days(s.date)>=0).sort((a,b)=>a.date.localeCompare(b.date))[0];
function fin(ps,xs){const f=sum(ps,p=>p.total),d=sum(ps,p=>p.paid),x=sum(xs,e=>e.amount);return{f,d,x,net:d-x,proj:f-x,m:f?Math.round((f-x)/f*100):null}}
const finCase=id=>fin(S.pays.filter(p=>p.caseId==id),S.exps.filter(e=>e.caseId==id));
const finCli=id=>fin(S.pays.filter(p=>cOfRec(p)==id),S.exps.filter(e=>cOfRec(e)==id));
const stag=s=>`<span class="tag ${{"متداولة":"t-ok","محجوزة للحكم":"t-warn","مؤجلة":"t-mute","منتهية":"t-mute"}[s]||""}">${esc(s)}</span>`;
const ptag=p=>`<span class="tag ${{"عالية":"t-bad","متوسطة":"t-warn","منخفضة":"t-mute"}[p]}">${esc(p)}</span>`;
const dleft=d=>{const n=days(d);return n<0?`<span class="t-bad">متأخر ${num(-n)} يوم</span>`:n==0?"اليوم":n==1?"غدًا":`بعد ${num(n)} يوم`};
const caseOpts=()=>S.cases.map(c=>[c.id,c.no+" — "+cname(c.clientId)]);
const E={
clients:{ttl:"الموكلون",add:"موكل جديد",f:[["name","الاسم"],["attorny","رقم التوكيل"],["phone","رقم الهاتف","tel"],["note","ملاحظات"]]},
cases:{ttl:"القضايا",add:"قضية جديدة",need:"أضف موكلًا أولًا من تاب الموكلون.",f:[["no","رقم القضية"],["clientId","الموكل","r",()=>S.clients.map(c=>[c.id,c.name])],["type","نوع القضية","s",TYPES],["court","المحكمة"],["opp","الخصم"],["status","الحالة","s",STAT]]},
sessions:{ttl:"الجلسات",add:"جلسة جديدة",need:"أضف قضية أولًا.",f:[["caseId","القضية","r",caseOpts],["date","التاريخ","date"],["time","الوقت","time"],["note","المطلوب في الجلسة"]]},
tasks:{ttl:"المهام",add:"مهمة جديدة",f:[["t","المهمة"],["caseId","القضية","r",caseOpts,"— بدون قضية —"],["due","الموعد","date"],["pr","الأولوية","s",["عالية","متوسطة","منخفضة"]]]},
pays:{ttl:"الأتعاب",add:"أتعاب جديدة",need:"أضف قضية أولًا.",f:[["caseId","القضية","r",caseOpts],["item","البند"],["total","إجمالي الأتعاب","number"],["paid","المدفوع","number"]]},
exps:{ttl:"المصاريف",add:"مصروف جديد",f:[["caseId","القضية","r",caseOpts,"مصاريف عامة للمكتب"],["cat","نوع المصروف","s",EXPCATS],["amount","التكلفة (جنيه)","number"],["date","التاريخ","date"],["note","ملاحظات"]]}};
const TABS=[["home","نظرة عامة"],["clients","الموكلون"],["cases","القضايا"],["sessions","الجلسات"],["tasks","المهام"],["pays","الأتعاب"],["exps","المصاريف"],["profit","الربحية"],["tools","أدوات المحامي"]];
let tab="home",q="",detail=null;
const COLS={
clients:[["الاسم",r=>lk("client",r.id,r.name)],["الهاتف",r=>`<a href="tel:${esc(r.phone)}" style="color:inherit">${esc(r.phone)}</a>`],["ملاحظات",r=>esc(r.note)],["رقم التوكيل",r=>esc(r.attorny)],["القضايا",r=>num(S.cases.filter(c=>c.clientId==r.id).length)],["أتعاب متبقية",r=>{const f=finCli(r.id);return `<b class="${f.f-f.d>0?"t-bad":"t-ok"}">${num(f.f-f.d)} ج</b>`}]],
cases:[["رقم القضية",r=>lk("case",r.id,r.no)],["الموكل",r=>cliLk(r.clientId)],["النوع",r=>esc(r.type)],["المحكمة",r=>esc(r.court)],["الخصم",r=>esc(r.opp)],["الحالة",r=>stag(r.status)],["الجلسة القادمة",r=>{const s=nextS(r.id);return s?fmt(s.date):"—"}]],
sessions:[["التاريخ",r=>`<b>${fmt(r.date)}</b> <small class="t-mute">${esc(r.time)}</small>`],["القضية",r=>caseLk(r.caseId),1],["الموكل",r=>cliLk(sess(r).clientId),1],["المحكمة",r=>esc(sess(r).court),1],["المطلوب",r=>esc(r.note)],["",r=>dleft(r.date)]],
tasks:[["",r=>`<input type="checkbox" style="width:auto" data-tg="${r.id}" ${r.done?"checked":""} aria-label="تم">`],["المهمة",r=>r.done?`<s class="t-mute">${esc(r.t)}</s>`:esc(r.t)],["القضية",r=>caseLk(r.caseId),1],["الموعد",r=>r.due?fmt(r.due):""],["الأولوية",r=>ptag(r.pr)],["",r=>r.done||!r.due?"":dleft(r.due)]],
pays:[["القضية",r=>caseLk(r.caseId),1],["الموكل",r=>cliLk(cOfRec(r)),1],["البند",r=>esc(r.item)],["الإجمالي",r=>num(r.total)+" ج"],["المدفوع",r=>num(r.paid)+" ج"],["المتبقي",r=>`<b class="${r.total-r.paid>0?"t-bad":"t-ok"}">${num(r.total-r.paid)} ج</b>`],["السداد",r=>`<div class="bar"><i style="width:${r.total?Math.min(100,r.paid/r.total*100):0}%"></i></div>`]],
exps:[["التاريخ",r=>fmt(r.date)],["البند",r=>`<b>${esc(r.cat)}</b>`],["القضية",r=>caseLk(r.caseId),1],["الموكل",r=>cliLk(cOfRec(r)),1],["التكلفة",r=>`<b class="t-bad">${num(r.amount)} ج</b>`],["ملاحظات",r=>esc(r.note)]]};
function tbl(k,rows,hide){
 const c=COLS[k].filter(x=>!(hide&&x[2]));
 if(!rows.length)return '<div class="empty">لا توجد بيانات.</div>';
 return `<table><thead><tr>${c.map(x=>`<th>${x[0]}</th>`).join("")}<th></th></tr></thead><tbody>${rows.map(r=>`<tr>${c.map(x=>`<td>${x[1](r)}</td>`).join("")}<td style="white-space:nowrap"><button class="btn sm" data-edit="${k}:${r.id}">تعديل</button> <button class="btn sm del" data-del="${k}:${r.id}">حذف</button></td></tr>`).join("")}</tbody></table>`}
const srt=(k,rows)=>{rows=[...rows];if(k=="sessions")rows.sort((a,b)=>a.date.localeCompare(b.date));if(k=="tasks")rows.sort((a,b)=>a.done-b.done||(a.due||"").localeCompare(b.due||""));if(k=="exps")rows.sort((a,b)=>(b.date||"").localeCompare(a.date||""));return rows};
function table(k){
 const rows=srt(k,S[k].filter(r=>!q||COLS[k].map(c=>c[1](r)).join(" ").replace(/<[^>]+>/g," ").includes(q)));
 const tot=k=="exps"?`<b style="align-self:center">إجمالي المصاريف: ${num(sum(S.exps,e=>e.amount))} ج</b>`:"";
 return `<div class="tools"><input type="search" id="q" placeholder="بحث..." value="${esc(q)}" aria-label="بحث">${tot}</div><div class="card tw">${tbl(k,rows)}</div>`}
const sec=(t,k,rows,pre,hide)=>`<div class="card tw" style="margin-bottom:16px"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px"><h3>${t}</h3><button class="btn sm pri" data-add="${k}" data-pre="${esc(JSON.stringify(pre))}">+ ${E[k].add}</button></div>${tbl(k,srt(k,rows),hide)}</div>`;
const statsH=f=>`<div class="stats"><div class="stat"><b>${num(f.f)} ج</b><span>إجمالي الأتعاب</span></div><div class="stat"><b>${num(f.d)} ج</b><span>المحصّل</span></div><div class="stat"><b class="${f.f-f.d>0?"t-bad":"t-ok"}">${num(f.f-f.d)} ج</b><span>المتبقي للتحصيل</span></div><div class="stat"><b class="t-bad">${num(f.x)} ج</b><span>المصاريف</span></div><div class="stat"><b class="${cls(f.net)}">${num(f.net)} ج</b><span>صافي الربح الفعلي</span></div><div class="stat"><b class="${cls(f.proj)}">${num(f.proj)} ج</b><span>الربح المتوقع</span></div></div>`;
function caseFile(id){
 const c=cs(id),f=finCase(id),w={caseId:id};
 return `<button class="btn" data-back>← رجوع</button><div class="hero" style="margin-top:12px"><div><h3>ملف القضية</h3><div class="big">${esc(c.no)}</div><div class="sub">الموكل: ${cliLk(c.clientId)} · ${esc(c.type)} · ${esc(c.court)}<br>الخصم: ${esc(c.opp)} · الحالة: ${esc(c.status)}</div></div><button class="btn" data-edit="cases:${id}">تعديل بيانات القضية</button></div>${statsH(f)}`
 +sec("الجلسات","sessions",S.sessions.filter(s=>s.caseId==id),w,1)+sec("المهام","tasks",S.tasks.filter(t=>t.caseId==id),w,1)+sec("الأتعاب","pays",S.pays.filter(p=>p.caseId==id),w,1)+sec("المصاريف","exps",S.exps.filter(e=>e.caseId==id),w,1)}
function clientFile(id){
 const c=cl(id),ids=S.cases.filter(x=>x.clientId==id).map(x=>x.id),inC=r=>ids.some(i=>i==r.caseId)||r.clientId==id;
 return `<button class="btn" data-back>← رجوع</button><div class="hero" style="margin-top:12px"><div><h3>ملف الموكل</h3><div class="big">${esc(c.name)}</div><div class="sub">${esc(c.phone)}<br>${esc(c.note)}</div></div><button class="btn" data-edit="clients:${id}">تعديل بيانات الموكل</button></div>${statsH(finCli(id))}`
 +sec("القضايا","cases",S.cases.filter(x=>x.clientId==id),{clientId:id})+sec("الجلسات","sessions",S.sessions.filter(inC),{})+sec("المهام","tasks",S.tasks.filter(inC),{})+sec("الأتعاب","pays",S.pays.filter(inC),{})+sec("المصاريف","exps",S.exps.filter(inC),{})}
function alerts(){
 const a=[];
 S.cases.filter(c=>c.status!="منتهية").forEach(c=>{const f=finCase(c.id);
  if(!nextS(c.id))a.push([c.id,"لا توجد جلسة قادمة"]);
  if(!f.f)a.push([c.id,"لم تُسجَّل أتعاب لها"]);else if(f.f-f.d>0)a.push([c.id,`متبقي ${num(f.f-f.d)} ج من الأتعاب`]);
  if(f.x>f.d&&f.x>0)a.push([c.id,"المصاريف أكبر من المحصّل"])});
 S.tasks.filter(t=>!t.done&&t.due&&days(t.due)<0).forEach(t=>a.push([t.caseId,"مهمة متأخرة: "+t.t]));
 return a}
function home(){
 const up=S.sessions.filter(s=>days(s.date)>=0).sort((a,b)=>a.date.localeCompare(b.date));
 const n=up[0],wk=up.filter(s=>days(s.date)<=7).length,open=S.tasks.filter(t=>!t.done),T=fin(S.pays,S.exps);
 const act=S.cases.filter(c=>c.status!="منتهية").length,al=alerts();
 const hero=n?`<div class="hero"><div><h3>أقرب جلسة</h3><div class="big">${esc(sess(n).no||"")}</div><div class="sub">${cliLk(sess(n).clientId)} · ${esc(sess(n).court||"")} · ${fmt(n.date)} · ${esc(n.time)}<br>${esc(n.note)}</div></div><div class="count">${days(n.date)==0?"اليوم":num(days(n.date))}<small>${days(n.date)==0?"موعد الجلسة":"يوم متبقي"}</small></div></div>`:`<div class="hero"><div><h3>أقرب جلسة</h3><div class="big">لا توجد جلسات قادمة</div></div></div>`;
 return hero+`<div class="stats"><div class="stat"><b>${num(act)}</b><span>قضايا قائمة</span></div><div class="stat"><b>${num(wk)}</b><span>جلسات خلال أسبوع</span></div><div class="stat"><b>${num(open.length)}</b><span>مهام معلقة</span></div><div class="stat"><b>${num(S.clients.length)}</b><span>موكل</span></div></div>
 <div class="grid"><div class="card"><h3>الجلسات القادمة</h3>${up.slice(0,5).map(s=>`<div class="row"><div>${caseLk(s.caseId)}<small>${cname(sess(s).clientId)} · ${fmt(s.date)}</small></div><div>${dleft(s.date)}</div></div>`).join("")||'<div class="empty">لا شيء</div>'}</div>
 <div class="card"><h3>مهام تحتاج متابعة</h3>${open.sort((a,b)=>(a.due||"").localeCompare(b.due||"")).slice(0,5).map(t=>`<div class="row"><div>${esc(t.t)}<small>${caseLk(t.caseId)} · ${ptag(t.pr)}</small></div><div>${t.due?dleft(t.due):""}</div></div>`).join("")||'<div class="empty">كل المهام منجزة</div>'}</div>
 <div class="card"><h3>تنبيهات ذكية</h3>${al.slice(0,7).map(x=>`<div class="row"><div>${caseLk(x[0])}<small>${esc(x[1])}</small></div></div>`).join("")||'<div class="empty">لا توجد تنبيهات</div>'}</div>
 <div class="card"><h3>القضايا حسب الحالة</h3>${STAT.map(s=>`<div class="row"><div>${stag(s)}</div><b>${num(S.cases.filter(c=>c.status==s).length)}</b></div>`).join("")}</div>
 <div class="card"><h3>ملاحظات سريعة</h3><textarea id="note" placeholder="اكتب أي ملاحظة تحتاجها...">${esc(S.note)}</textarea></div></div>`}
function profit(){
 const T=fin(S.pays,S.exps),pm=T.f?Math.round(T.proj/T.f*100):0;
 const mt=m=>m==null?"—":`<span class="tag ${m>=50?"t-ok":m>=20?"t-warn":"t-bad"}">${num(m)}٪</span>`;
 const bar=(x,f)=>`<div class="bar"><i style="width:${f?Math.min(100,x/f*100):(x?100:0)}%;background:var(--accent)"></i></div>`;
 const row=(n,f)=>`<tr><td><b>${n}</b></td><td>${num(f.f)} ج</td><td>${num(f.d)} ج</td><td class="t-bad">${num(f.x)} ج</td><td>${bar(f.x,f.f)}</td><td><b class="${cls(f.net)}">${num(f.net)} ج</b></td><td><b class="${cls(f.proj)}">${num(f.proj)} ج</b></td><td>${mt(f.m)}</td></tr>`;
 const head=a=>`<thead><tr><th>${a}</th><th>إجمالي الأتعاب</th><th>المحصّل</th><th>المصاريف</th><th>نسبة المصاريف</th><th>صافي الفعلي</th><th>الربح المتوقع</th><th>الهامش</th></tr></thead>`;
 const gen=S.exps.filter(e=>!cOfRec(e));
 const cats=EXPCATS.map(c=>[c,sum(S.exps.filter(e=>e.cat==c),e=>e.amount)]).filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1]);
 return `<div class="stats"><div class="stat"><b>${num(T.f)} ج</b><span>إجمالي الأتعاب</span></div><div class="stat"><b>${num(T.d)} ج</b><span>المحصّل فعليًا</span></div><div class="stat"><b class="t-bad">${num(T.x)} ج</b><span>إجمالي المصاريف</span></div><div class="stat"><b class="${cls(T.net)}">${num(T.net)} ج</b><span>صافي الربح الفعلي (المحصّل − المصاريف)</span></div><div class="stat"><b class="${cls(T.proj)}">${num(T.proj)} ج</b><span>الربح المتوقع (الإجمالي − المصاريف)</span></div><div class="stat"><b>${num(pm)}٪</b><span>هامش الربح المتوقع</span></div></div>
 ${T.x>T.d&&T.x>0?'<p class="t-bad">تنبيه: المصاريف أكبر من المبلغ المحصّل حتى الآن.</p>':""}
 <div class="card tw" style="margin-bottom:16px"><h3>الربحية لكل قضية</h3>${S.cases.length?`<table>${head("القضية")}<tbody>${S.cases.map(c=>row(caseLk(c.id)+' <small class="t-mute">'+esc(cname(c.clientId))+"</small>",finCase(c.id))).join("")}</tbody></table>`:'<div class="empty">لا توجد قضايا.</div>'}</div>
 <div class="card tw" style="margin-bottom:16px"><h3>الربحية لكل موكل</h3>${S.clients.length||gen.length?`<table>${head("الموكل")}<tbody>${S.clients.map(c=>row(cliLk(c.id),finCli(c.id))).join("")}${gen.length?row("مصاريف عامة للمكتب",fin([],gen)):""}</tbody></table>`:'<div class="empty">لا يوجد موكلون.</div>'}</div>
 <div class="card"><h3>المصاريف حسب النوع</h3>${cats.map(c=>`<div class="row"><div style="flex:1">${esc(c[0])}<div class="bar" style="margin-top:4px"><i style="width:${T.x?c[1]/T.x*100:0}%;background:var(--accent)"></i></div></div><b>${num(c[1])} ج</b></div>`).join("")||'<div class="empty">لا توجد مصاريف مسجلة.</div>'}</div>
 <p class="t-mute">الربح الفعلي = المحصّل ناقص المصاريف. الربح المتوقع = إجمالي الأتعاب المتفق عليها ناقص المصاريف.</p>`}
function openForm(k,rec,pre){
 const en=E[k];
 const opts=f=>{let o=f[2]=="r"?f[3]():f[3].map(x=>[x,x]);if(f[4])o=[["",f[4]],...o];return o};
 if(!rec&&en.f.some(f=>f[2]=="r"&&!f[4]&&!opts(f).length)){alert(en.need);return}
 const val=f=>rec?rec[f[0]]:(pre&&pre[f[0]]!=null?pre[f[0]]:(f[2]=="date"?today:""));
 $("#frm").innerHTML=`<h3>${rec?"تعديل: "+en.ttl:en.add}</h3>`+en.f.map((f,i)=>`<label for="f_${f[0]}">${f[1]}</label>`+(f[2]=="s"||f[2]=="r"?`<select id="f_${f[0]}">${opts(f).map(o=>`<option value="${esc(o[0])}" ${String(val(f))==String(o[0])?"selected":""}>${esc(o[1])}</option>`).join("")}</select>`:`<input id="f_${f[0]}" type="${f[2]||"text"}" value="${esc(val(f))}" ${i==0&&!f[2]?"required":""}>`)).join("")+`<div class="acts"><button class="btn pri" value="ok">${rec?"حفظ التعديل":"حفظ"}</button>${k=="exps"&&!rec?'<button class="btn" value="more">حفظ وإضافة بند آخر</button>':""}<button class="btn" value="x" formnovalidate>إلغاء</button></div>`;
 $("#dlg").showModal();
 $("#frm").onsubmit=ev=>{const v=ev.submitter&&ev.submitter.value;if(v=="ok"||v=="more"){const r=rec||{id:uid()};en.f.forEach(f=>{const x=$("#f_"+f[0]).value;r[f[0]]=f[2]=="number"?+x||0:f[2]=="r"?(x===""?"":+x):x});if(!rec){if(k=="tasks")r.done=false;S[k].push(r)}save();render();if(v=="more")setTimeout(()=>openForm(k,null,{caseId:r.caseId,date:r.date}),0)}};
}
function delRec(k,id){
 const deep=k=="cases"||k=="clients";
 if(!confirm(deep?"سيتم أيضًا حذف كل ما يرتبط به (القضايا والجلسات والمهام والأتعاب والمصاريف). هل تريد المتابعة؟":"هل تريد الحذف نهائيًا؟"))return;
 if(deep){
  const ids=k=="cases"?[+id]:S.cases.filter(c=>c.clientId==id).map(c=>c.id);
  ["sessions","tasks","pays","exps"].forEach(x=>S[x]=S[x].filter(r=>!ids.some(i=>i==r.caseId)&&!(k=="clients"&&r.clientId==id)));
  if(k=="clients")S.cases=S.cases.filter(c=>c.clientId!=id);
  if(detail&&detail.type==(k=="cases"?"case":"client")&&detail.id==id)detail=null;
 }
 S[k]=S[k].filter(r=>r.id!=id);save();render();
}
document.addEventListener("click",e=>{
 const t=e.target.closest("[data-tab]");if(t){tab=t.dataset.tab;detail=null;q="";render();return}
 const o=e.target.closest("[data-open]");if(o){e.preventDefault();const [ty,id]=o.dataset.open.split(":");detail={type:ty,id:+id};render();scrollTo(0,0);return}
 if(e.target.closest("[data-back]")){detail=null;render();return}
 const ed=e.target.closest("[data-edit]");if(ed){const [k,id]=ed.dataset.edit.split(":");openForm(k,byId(S[k],id));return}
 const ad=e.target.closest("[data-add]");if(ad){openForm(ad.dataset.add,null,JSON.parse(ad.dataset.pre||"{}"));return}
 const d=e.target.closest("[data-del]");if(d){const [k,id]=d.dataset.del.split(":");delRec(k,id)}
});
document.addEventListener("change",e=>{const g=e.target.dataset.tg;if(g){byId(S.tasks,g).done=e.target.checked;save();render()}});
$("#addbtn").onclick=()=>openForm(tab);
const DL=[["استئناف حكم مدني أو تجاري",40],["استئناف حكم جنحة",10],["المعارضة في حكم جنحة غيابي",10],["الطعن بالنقض",60],["استئناف حكم أحوال شخصية",40]];
function tools(){return `<div class="grid"><div class="card"><h3>حاسبة مواعيد الطعن</h3><div class="calc"><label for="dk">نوع الطعن</label><select id="dk">${DL.map((d,i)=>`<option value="${i}">${d[0]} (${d[1]} يوم)</option>`).join("")}</select><label for="dd">تاريخ صدور الحكم أو الإعلان</label><input type="date" id="dd" value="${today}"><div class="res" id="dr" aria-live="polite"></div><small class="t-mute">أداة مساعدة تقريبية، تحقق دائمًا من النص القانوني والعطلات الرسمية وبدء الميعاد.</small></div></div>
 <div class="card"><h3>حاسبة الأتعاب</h3><div class="calc"><label for="fa">قيمة الدعوى</label><input type="number" id="fa" placeholder="مثال: 200000"><label for="fp">نسبة الأتعاب %</label><input type="number" id="fp" value="10"><div class="res" id="fr" aria-live="polite"></div></div></div></div>`;}
function bindTools(){
 const dc=()=>{const [l,n]=DL[$("#dk").value],d=new Date($("#dd").value+"T00:00");if(isNaN(d)){$("#dr").textContent="";return}d.setDate(d.getDate()+n);const e=iso(d),r=days(e);$("#dr").innerHTML=`آخر ميعاد: <b>${fmt(e)}</b><br>${r<0?'<span class="t-bad">انتهى الميعاد</span>':"متبقي "+num(r)+" يوم"}`};
 const fc=()=>{const a=+$("#fa").value,p=+$("#fp").value;$("#fr").innerHTML=a?`الأتعاب المقترحة: <b>${num(a*p/100)} ج</b>`:"أدخل قيمة الدعوى"};
 ["#dk","#dd"].forEach(s=>$(s).oninput=dc);["#fa","#fp"].forEach(s=>$(s).oninput=fc);dc();fc();}
function render(){
 if(detail&&!(detail.type=="case"?cs(detail.id):cl(detail.id)))detail=null;
 $("#nav").innerHTML=TABS.map(t=>`<button data-tab="${t[0]}" aria-current="${t[0]==tab&&!detail}">${t[1]}</button>`).join("");
 $("#ttl").textContent=detail?(detail.type=="case"?"ملف القضية":"ملف الموكل"):E[tab]?E[tab].ttl:TABS.find(t=>t[0]==tab)[1];
 $("#dt").textContent=fmt(today);
 const ab=$("#addbtn"),show=E[tab]&&!detail;ab.hidden=!show;if(show)ab.textContent="+ "+E[tab].add;
 $("#view").innerHTML=detail?(detail.type=="case"?caseFile(detail.id):clientFile(detail.id)):tab=="home"?home():tab=="tools"?tools():tab=="profit"?profit():table(tab);
 if(!detail&&tab=="tools")bindTools();
 const n=$("#note");if(n)n.oninput=()=>{S.note=n.value;save()};
 const s=$("#q");if(s){s.oninput=()=>{q=s.value;const p=s.selectionStart;render();const x=$("#q");x.focus();x.setSelectionRange(p,p)}}
}
$("#exportbtn").onclick=()=>{
 const blob=new Blob([JSON.stringify(S,null,2)],{type:"application/json"});
 const a=document.createElement("a");a.href=URL.createObjectURL(blob);
 a.download="lawyer-data-"+today+".json";document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(a.href),1000);
};
$("#importbtn").onclick=()=>$("#importfile").click();
$("#importfile").onchange=e=>{
 const f=e.target.files[0];if(!f)return;
 const rd=new FileReader();
 rd.onload=()=>{
  try{
   const d=JSON.parse(rd.result);
   const ks=["cases","sessions","clients","tasks","pays"];
   if(!d||typeof d!="object"||ks.some(k=>!Array.isArray(d[k])))throw 0;
   if(!confirm("سيتم استبدال البيانات الحالية بالبيانات الموجودة في الملف. هل تريد المتابعة؟"))return;
   S=migrate({note:"",exps:[],...d});detail=null;save();render();alert("تم استيراد البيانات بنجاح.");
  }catch(err){alert("الملف غير صالح. اختر ملف JSON تم تصديره من هذه اللوحة.")}
 };
 rd.readAsText(f);e.target.value="";
};
const th=()=>{try{return localStorage.getItem("lawyer-theme")}catch(e){return null}};
const setTh=v=>{document.documentElement.dataset.theme=v;$("#theme").textContent=v=="dark"?"الوضع النهاري":"الوضع الليلي"};
setTh(th()||(matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light"));
$("#theme").onclick=()=>{const v=document.documentElement.dataset.theme=="dark"?"light":"dark";setTh(v);try{localStorage.setItem("lawyer-theme",v)}catch(e){}};
render();
