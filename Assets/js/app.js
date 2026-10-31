const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const iso=d=>d.toISOString().slice(0,10);
const addD=n=>{const d=new Date();d.setDate(d.getDate()+n);return iso(d)};
const today=iso(new Date());
const fmt=d=>d?new Date(d+"T00:00").toLocaleDateString("ar-EG",{weekday:"long",day:"numeric",month:"long",year:"numeric"}):"";
const days=d=>Math.round((new Date(d+"T00:00")-new Date(today+"T00:00"))/864e5);
const num=n=>Number(n||0).toLocaleString("ar-EG");
const KEY="lawyer-dash-v1";
const seed=()=>({cases:[
{id:1,no:"٣٤٥٦ لسنة ٢٠٢٦ مدني كلي",client:"أحمد محمود",type:"مدني",court:"محكمة شمال القاهرة",opp:"شركة النيل للمقاولات",status:"متداولة"},
{id:2,no:"٨٨٢ لسنة ٢٠٢٦ جنح",client:"منى عبد الله",type:"جنائي",court:"محكمة جنح الجيزة",opp:"النيابة العامة",status:"محجوزة للحكم"},
{id:3,no:"١٢٠٧ لسنة ٢٠٢٥ أسرة",client:"هالة السيد",type:"أسرة",court:"محكمة الأسرة بإمبابة",opp:"طارق إبراهيم",status:"مؤجلة"}],
sessions:[
{id:1,date:addD(2),time:"٠٩:٣٠",no:"٣٤٥٦ لسنة ٢٠٢٦ مدني كلي",court:"محكمة شمال القاهرة",note:"تقديم مذكرة الدفاع ومستندات الملكية"},
{id:2,date:addD(6),time:"١١:٠٠",no:"٨٨٢ لسنة ٢٠٢٦ جنح",court:"محكمة جنح الجيزة",note:"النطق بالحكم"},
{id:3,date:addD(15),time:"١٠:٠٠",no:"١٢٠٧ لسنة ٢٠٢٥ أسرة",court:"محكمة الأسرة بإمبابة",note:"الرد على مذكرة الخصم"}],
clients:[
{id:1,name:"أحمد محمود",phone:"01001234567",note:"عقد مقاولة متنازع عليه"},
{id:2,name:"منى عبد الله",phone:"01112345678",note:"قضية جنحة، حضور شخصي مطلوب"},
{id:3,name:"هالة السيد",phone:"01223456789",note:"نفقة وحضانة"}],
tasks:[
{id:1,t:"كتابة مذكرة الدفاع في القضية المدنية",due:addD(1),pr:"عالية",done:false},
{id:2,t:"استخراج صورة رسمية من الحكم",due:addD(4),pr:"متوسطة",done:false},
{id:3,t:"مراجعة عقد وكالة جديد",due:addD(7),pr:"منخفضة",done:false}],
pays:[
{id:1,client:"أحمد محمود",item:"أتعاب قضية مدنية",total:30000,paid:15000},
{id:2,client:"منى عبد الله",item:"أتعاب قضية جنحة",total:12000,paid:12000},
{id:3,client:"هالة السيد",item:"أتعاب دعوى أسرة",total:10000,paid:4000}],
note:""});
let S;try{S=JSON.parse(localStorage.getItem(KEY))||seed()}catch(e){S=seed()}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const TYPES=["مدني","جنائي","أسرة","تجاري","إداري","عمالي"],STAT=["متداولة","محجوزة للحكم","مؤجلة","منتهية"];
const E={
cases:{ttl:"القضايا",add:"قضية جديدة",f:[["no","رقم القضية"],["client","اسم الموكل"],["type","نوع القضية","s",TYPES],["court","المحكمة"],["opp","الخصم"],["status","الحالة","s",STAT]]},
sessions:{ttl:"الجلسات",add:"جلسة جديدة",f:[["date","التاريخ","date"],["time","الوقت","time"],["no","رقم القضية"],["court","المحكمة"],["note","المطلوب في الجلسة"]]},
clients:{ttl:"الموكلون",add:"موكل جديد",f:[["name","الاسم"],["phone","رقم الهاتف","tel"],["note","ملاحظات"]]},
tasks:{ttl:"المهام",add:"مهمة جديدة",f:[["t","المهمة"],["due","الموعد","date"],["pr","الأولوية","s",["عالية","متوسطة","منخفضة"]]]},
pays:{ttl:"الأتعاب والمدفوعات",add:"بند مالي جديد",f:[["client","الموكل"],["item","البند"],["total","إجمالي الأتعاب","number"],["paid","المدفوع","number"]]}};
const TABS=[["home","نظرة عامة"],["cases","القضايا"],["sessions","الجلسات"],["clients","الموكلون"],["tasks","المهام"],["pays","الأتعاب"],["tools","أدوات المحامي"]];
let tab="home",q="";
const stag=s=>`<span class="tag ${{"متداولة":"t-ok","محجوزة للحكم":"t-warn","مؤجلة":"t-mute","منتهية":"t-mute"}[s]||""}">${esc(s)}</span>`;
const ptag=p=>`<span class="tag ${{"عالية":"t-bad","متوسطة":"t-warn","منخفضة":"t-mute"}[p]}">${esc(p)}</span>`;
const dleft=d=>{const n=days(d);return n<0?`<span class="t-bad">متأخر ${num(-n)} يوم</span>`:n==0?"اليوم":n==1?"غدًا":`بعد ${num(n)} يوم`};
const del=(k,id)=>`<button class="btn sm del" data-del="${k}:${id}" aria-label="حذف">حذف</button>`;
const COLS={
cases:[["رقم القضية",r=>`<b>${esc(r.no)}</b>`],["الموكل",r=>esc(r.client)],["النوع",r=>esc(r.type)],["المحكمة",r=>esc(r.court)],["الخصم",r=>esc(r.opp)],["الحالة",r=>stag(r.status)]],
sessions:[["التاريخ",r=>`<b>${fmt(r.date)}</b><small class="t-mute"> ${esc(r.time)}</small>`],["القضية",r=>esc(r.no)],["المحكمة",r=>esc(r.court)],["المطلوب",r=>esc(r.note)],["",r=>dleft(r.date)]],
clients:[["الاسم",r=>`<b>${esc(r.name)}</b>`],["الهاتف",r=>`<a href="tel:${esc(r.phone)}" style="color:inherit">${esc(r.phone)}</a>`],["ملاحظات",r=>esc(r.note)]],
tasks:[["",r=>`<input type="checkbox" style="width:auto" data-tg="${r.id}" ${r.done?"checked":""} aria-label="تم">`],["المهمة",r=>r.done?`<s class="t-mute">${esc(r.t)}</s>`:esc(r.t)],["الموعد",r=>r.due?fmt(r.due):""],["الأولوية",r=>ptag(r.pr)],["",r=>r.done||!r.due?"":dleft(r.due)]],
pays:[["الموكل",r=>`<b>${esc(r.client)}</b>`],["البند",r=>esc(r.item)],["الإجمالي",r=>num(r.total)+" ج"],["المدفوع",r=>num(r.paid)+" ج"],["المتبقي",r=>`<b class="${r.total-r.paid>0?"t-bad":"t-ok"}">${num(r.total-r.paid)} ج</b>`],["السداد",r=>`<div class="bar"><i style="width:${r.total?Math.min(100,r.paid/r.total*100):0}%"></i></div>`]]};
function table(k){
 let rows=S[k].filter(r=>!q||JSON.stringify(r).includes(q));
 if(k=="sessions")rows.sort((a,b)=>a.date.localeCompare(b.date));
 if(k=="tasks")rows.sort((a,b)=>a.done-b.done||(a.due||"").localeCompare(b.due||""));
 const c=COLS[k];
 return `<div class="tools"><input type="search" id="q" placeholder="بحث..." value="${esc(q)}" aria-label="بحث"></div><div class="card tw">`+(rows.length?`<table><thead><tr>${c.map(x=>`<th>${x[0]}</th>`).join("")}<th></th></tr></thead><tbody>${rows.map(r=>`<tr>${c.map(x=>`<td>${x[1](r)}</td>`).join("")}<td style="white-space:nowrap"><button class="btn sm" data-edit="${k}:${r.id}">تعديل</button> ${del(k,r.id)}</td></tr>`).join("")}</tbody></table>`:`<div class="empty">لا توجد بيانات. اضغط على «${E[k].add}» للبدء.</div>`)+`</div>`;}
function home(){
 const up=S.sessions.filter(s=>days(s.date)>=0).sort((a,b)=>a.date.localeCompare(b.date));
 const n=up[0],wk=up.filter(s=>days(s.date)<=7).length;
 const open=S.tasks.filter(t=>!t.done),rem=S.pays.reduce((a,p)=>a+p.total-p.paid,0);
 const act=S.cases.filter(c=>c.status!="منتهية").length;
 const hero=n?`<div class="hero"><div><h3>أقرب جلسة</h3><div class="big">${esc(n.no)}</div><div class="sub">${esc(n.court)} · ${fmt(n.date)} · ${esc(n.time)}<br>${esc(n.note)}</div></div><div class="count">${days(n.date)==0?"اليوم":num(days(n.date))}<small>${days(n.date)==0?"موعد الجلسة":"يوم متبقي"}</small></div></div>`:`<div class="hero"><div><h3>أقرب جلسة</h3><div class="big">لا توجد جلسات قادمة</div></div></div>`;
 return hero+`<div class="stats"><div class="stat"><b>${num(act)}</b><span>قضايا قائمة</span></div><div class="stat"><b>${num(wk)}</b><span>جلسات خلال أسبوع</span></div><div class="stat"><b>${num(open.length)}</b><span>مهام معلقة</span></div><div class="stat"><b>${num(S.clients.length)}</b><span>موكل</span></div><div class="stat"><b class="${rem?"t-bad":"t-ok"}">${num(rem)} ج</b><span>أتعاب متبقية</span></div></div>
 <div class="grid"><div class="card"><h3>الجلسات القادمة</h3>${up.slice(0,5).map(s=>`<div class="row"><div>${esc(s.no)}<small>${fmt(s.date)} · ${esc(s.court)}</small></div><div>${dleft(s.date)}</div></div>`).join("")||'<div class="empty">لا شيء</div>'}</div>
 <div class="card"><h3>مهام تحتاج متابعة</h3>${open.sort((a,b)=>(a.due||"").localeCompare(b.due||"")).slice(0,5).map(t=>`<div class="row"><div>${esc(t.t)}<small>${ptag(t.pr)}</small></div><div>${t.due?dleft(t.due):""}</div></div>`).join("")||'<div class="empty">كل المهام منجزة</div>'}</div>
 <div class="card"><h3>القضايا حسب الحالة</h3>${STAT.map(s=>`<div class="row"><div>${stag(s)}</div><b>${num(S.cases.filter(c=>c.status==s).length)}</b></div>`).join("")}</div>
 <div class="card"><h3>ملاحظات سريعة</h3><textarea id="note" placeholder="اكتب أي ملاحظة تحتاجها...">${esc(S.note)}</textarea></div></div>`;}
const DL=[["استئناف حكم مدني أو تجاري",40],["استئناف حكم جنحة",10],["المعارضة في حكم جنحة غيابي",10],["الطعن بالنقض",60],["استئناف حكم أحوال شخصية",40]];
function tools(){return `<div class="grid"><div class="card"><h3>حاسبة مواعيد الطعن</h3><div class="calc"><label for="dk">نوع الطعن</label><select id="dk">${DL.map((d,i)=>`<option value="${i}">${d[0]} (${d[1]} يوم)</option>`).join("")}</select><label for="dd">تاريخ صدور الحكم أو الإعلان</label><input type="date" id="dd" value="${today}"><div class="res" id="dr" aria-live="polite"></div><small class="t-mute">أداة مساعدة تقريبية، تحقق دائمًا من النص القانوني والعطلات الرسمية وبدء الميعاد.</small></div></div>
 <div class="card"><h3>حاسبة الأتعاب</h3><div class="calc"><label for="fa">قيمة الدعوى</label><input type="number" id="fa" placeholder="مثال: 200000"><label for="fp">نسبة الأتعاب %</label><input type="number" id="fp" value="10"><div class="res" id="fr" aria-live="polite"></div></div></div></div>`;}
function bindTools(){
 const dc=()=>{const [l,n]=DL[$("#dk").value],d=new Date($("#dd").value+"T00:00");if(isNaN(d)){$("#dr").textContent="";return}d.setDate(d.getDate()+n);const e=iso(d),r=days(e);$("#dr").innerHTML=`آخر ميعاد: <b>${fmt(e)}</b><br>${r<0?'<span class="t-bad">انتهى الميعاد</span>':"متبقي "+num(r)+" يوم"}`};
 const fc=()=>{const a=+$("#fa").value,p=+$("#fp").value;$("#fr").innerHTML=a?`الأتعاب المقترحة: <b>${num(a*p/100)} ج</b>`:"أدخل قيمة الدعوى"};
 ["#dk","#dd"].forEach(s=>$(s).oninput=dc);["#fa","#fp"].forEach(s=>$(s).oninput=fc);dc();fc();}
function render(){
 $("#nav").innerHTML=TABS.map(t=>`<button data-tab="${t[0]}" aria-current="${t[0]==tab}">${t[1]}</button>`).join("");
 $("#ttl").textContent=tab=="home"?"نظرة عامة":tab=="tools"?"أدوات المحامي":E[tab].ttl;
 $("#dt").textContent=fmt(today);
 const ab=$("#addbtn");ab.hidden=!E[tab];if(E[tab])ab.textContent="+ "+E[tab].add;
 $("#view").innerHTML=tab=="home"?home():tab=="tools"?tools():table(tab);
 if(tab=="tools")bindTools();
 const n=$("#note");if(n)n.oninput=()=>{S.note=n.value;save()};
 const s=$("#q");if(s){s.oninput=()=>{q=s.value;const p=s.selectionStart;render();const x=$("#q");x.focus();x.setSelectionRange(p,p)}}
}
document.addEventListener("click",e=>{
 const t=e.target.closest("[data-tab]");if(t){tab=t.dataset.tab;q="";render();return}
 const ed=e.target.closest("[data-edit]");if(ed){const [k,id]=ed.dataset.edit.split(":");openForm(k,S[k].find(r=>r.id==id));return}
 const d=e.target.closest("[data-del]");if(d){const [k,id]=d.dataset.del.split(":");if(confirm("هل تريد الحذف نهائيًا؟")){S[k]=S[k].filter(r=>r.id!=id);save();render()}return}
});
document.addEventListener("change",e=>{const g=e.target.dataset.tg;if(g){const t=S.tasks.find(x=>x.id==g);t.done=e.target.checked;save();render()}});
function openForm(k,rec){
 const en=E[k];
 const val=f=>rec?rec[f[0]]:(f[2]=="date"&&k!="cases"?today:"");
 $("#frm").innerHTML=`<h3>${rec?"تعديل: "+en.ttl:en.add}</h3>`+en.f.map(f=>`<label for="f_${f[0]}">${f[1]}</label>`+(f[2]=="s"?`<select id="f_${f[0]}">${f[3].map(o=>`<option ${val(f)==o?"selected":""}>${o}</option>`).join("")}</select>`:`<input id="f_${f[0]}" type="${f[2]||"text"}" value="${esc(val(f))}">`)).join("")+`<div class="acts"><button class="btn pri" value="ok">${rec?"حفظ التعديل":"حفظ"}</button><button class="btn" value="x" formnovalidate>إلغاء</button></div>`;
 $("#dlg").showModal();
 $("#frm").onsubmit=ev=>{if(ev.submitter&&ev.submitter.value=="ok"){const r=rec||{id:Date.now()};en.f.forEach(f=>{const v=$("#f_"+f[0]).value;r[f[0]]=f[2]=="number"?+v||0:v});if(!rec){if(k=="tasks")r.done=false;S[k].push(r)}save();render()}};
}
$("#addbtn").onclick=()=>openForm(tab);
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
   S={...seed(),...d};save();render();alert("تم استيراد البيانات بنجاح.");
  }catch(err){alert("الملف غير صالح. اختر ملف JSON تم تصديره من هذه اللوحة.")}
 };
 rd.readAsText(f);e.target.value="";
};
const th=()=>{try{return localStorage.getItem("lawyer-theme")}catch(e){return null}};
const setTh=v=>{document.documentElement.dataset.theme=v;$("#theme").textContent=v=="dark"?"الوضع النهاري":"الوضع الليلي"};
setTh(th()||(matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light"));
$("#theme").onclick=()=>{const v=document.documentElement.dataset.theme=="dark"?"light":"dark";setTh(v);try{localStorage.setItem("lawyer-theme",v)}catch(e){}};
render();
