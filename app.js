const $=s=>document.querySelector(s),eur=n=>"€"+Math.round(n).toLocaleString("en-IE");
/* ---------- SAMPLE DATA (replace with real API calls later) ---------- */
const P=[
{id:1,a:"14 Sandymount Ave",area:"Dublin 4",ask:545000,avm:585000,arv:650000,reno:35000,beds:3,type:"Semi-detached",site:"0.04 ac",ber:"D1",days:41,lat:53.33,lng:-6.22},
{id:2,a:"7 Shandon Street",area:"Cork City",ask:285000,avm:320000,arv:395000,reno:40000,beds:3,type:"Terrace",site:"0.02 ac",ber:"E2",days:73,lat:51.90,lng:-8.48},
{id:3,a:"22 Salthill Road",area:"Galway",ask:360000,avm:372000,arv:405000,reno:25000,beds:4,type:"Semi-detached",site:"0.05 ac",ber:"D2",days:18,lat:53.26,lng:-9.07},
{id:4,a:"3 Castle Court",area:"Limerick",ask:195000,avm:230000,arv:285000,reno:30000,beds:3,type:"End of terrace",site:"0.03 ac",ber:"E1",days:96,lat:52.66,lng:-8.62},
{id:5,a:"41 Ferrybank",area:"Waterford",ask:210000,avm:228000,arv:262000,reno:22000,beds:3,type:"Semi-detached",site:"0.04 ac",ber:"D2",days:55,lat:52.26,lng:-7.10},
{id:6,a:"9 Michael Street",area:"Kilkenny",ask:330000,avm:335000,arv:350000,reno:20000,beds:3,type:"Terrace",site:"0.02 ac",ber:"C3",days:12,lat:52.65,lng:-7.25},
{id:7,a:"Knocknarea Lodge",area:"Sligo",ask:175000,avm:215000,arv:290000,reno:50000,beds:4,type:"Detached",site:"0.35 ac",ber:"F",days:140,lat:54.27,lng:-8.47},
{id:8,a:"18 Marine Drive",area:"Drogheda",ask:265000,avm:285000,arv:340000,reno:28000,beds:3,type:"Semi-detached",site:"0.04 ac",ber:"D1",days:33,lat:53.72,lng:-6.35},
{id:9,a:"5 Strand Road",area:"Tralee",ask:225000,avm:240000,arv:300000,reno:30000,beds:3,type:"Semi-detached",site:"0.06 ac",ber:"E2",days:84,lat:52.27,lng:-9.70},
{id:10,a:"12 Church Lane",area:"Athlone",ask:240000,avm:246000,arv:262000,reno:18000,beds:3,type:"Terrace",site:"0.03 ac",ber:"C2",days:9,lat:53.42,lng:-7.94}];
const calc=p=>{const costs=p.ask*.08,all=p.ask+p.reno+costs,profit=p.arv-all,roi=profit/all;
 return{costs,profit,roi,disc:(p.avm-p.ask)/p.avm,grade:roi>=.15?"Strong":roi>=.08?"Fair":"Pass"}};
P.forEach(p=>Object.assign(p,calc(p)));
const CALLS=[
{t:"09:02",who:"+353 87 ••• 4412",p:2,kind:"Availability check",min:1,res:"AI answered: still available, viewing slots shared by text.",tr:["Caller: Is the Shandon Street house still available?","AI: Yes, it is. Viewings are open Thursday and Saturday. Want a text link?","Caller: Yes please."]},
{t:"09:20",who:"+353 86 ••• 9071",p:1,kind:"Viewing request",min:3,res:"Booked Sat 11:30. Calendar updated.",tr:["Caller: I'd like to see Sandymount Avenue.","AI: Saturday 11:30 is free. Can I take your name and email?","Caller: Aoife Kelly, aoife@example.ie."]},
{t:"10:05",who:"+353 85 ••• 2230",p:4,kind:"Availability check",min:1,res:"AI answered: available, price €195,000.",tr:["Caller: Is Castle Court available?","AI: Yes, guide price €195,000."]},
{t:"10:41",who:"+353 89 ••• 5518",p:7,kind:"Serious buyer",min:9,res:"Cash buyer, wants to offer. Flagged for agent call-back.",tr:["Caller: I'm a cash buyer, interested in Knocknarea Lodge.","AI: Great. Would you like the agent to call you today?","Caller: Yes, I'm ready to offer €185,000."]},
{t:"11:15",who:"+353 83 ••• 1004",p:3,kind:"Availability check",min:1,res:"AI answered: available, BER D2 shared.",tr:["Caller: Is Salthill still going?","AI: Yes, it's available. BER is D2."]},
{t:"12:30",who:"Unknown",p:0,kind:"Spam",min:1,res:"Sales call. Blocked.",tr:["Caller: Hi, we offer solar panel financing...","AI: This line is for property enquiries. Goodbye."]},
{t:"13:48",who:"+353 87 ••• 7765",p:8,kind:"Viewing request",min:3,res:"Booked Fri 16:00.",tr:["Caller: Can I view Marine Drive this week?","AI: Friday 16:00 is free."]},
{t:"14:22",who:"+353 86 ••• 3391",p:5,kind:"Availability check",min:1,res:"AI answered: available.",tr:["Caller: Is Ferrybank available?","AI: Yes, it is."]}];
const FILES=[
{n:"scan_0392.pdf",kind:"Scanned PDF",to:"Contract for Sale",p:1,f:"Price €545,000 · Vendor M. Byrne · Closing 12 Dec"},
{n:"IMG_4471.heic",kind:"Phone photo",to:"BER Certificate",p:2,f:"Rating E2 · 312 kWh/m²/yr · Valid to 2033"},
{n:"title_deeds_final2.docx",kind:"Word",to:"Title Deeds",p:2,f:"Folio CK41233F · Freehold · No burdens"},
{n:"proof of funds.jpg",kind:"Image",to:"Proof of Funds",p:7,f:"AIB statement · €210,000 · Dated 3 Oct"},
{n:"mortgage_AIP.pdf",kind:"PDF",to:"Mortgage Approval",p:4,f:"Approved €160,000 · Expires 14 Jan"},
{n:"survey_notes.eml",kind:"Email",to:"Survey Report",p:3,f:"Damp in rear wall · Est. repair €6,500"},
{n:"costs.xlsx",kind:"Excel",to:"Renovation Quote",p:8,f:"Total €28,000 · 4 line items · Builder: Doyle Ltd"}];
const STAGES=["Lead","Viewing","Offer","Sale agreed","Closing"];
const REQ={buy:["ID and AML","Proof of funds","Mortgage approval","Title deeds","Contract","BER cert","Survey"],sell:["ID and AML","Title deeds","BER cert","Planning compliance","Contract","Tax clearance"]};
const DEALS=[
{p:7,side:"buy",st:0,miss:["Proof of funds","Mortgage approval","Survey","Contract","Title deeds"]},
{p:4,side:"buy",st:1,miss:["Survey","Contract","Title deeds"]},
{p:2,side:"buy",st:2,miss:["Contract","Survey"]},
{p:1,side:"buy",st:3,miss:["Survey"]},
{p:8,side:"sell",st:1,miss:["Planning compliance","Tax clearance","Contract"]},
{p:3,side:"sell",st:2,miss:["Tax clearance"]},
{p:6,side:"sell",st:4,miss:[]},
{p:10,side:"buy",st:4,miss:[]}];
const pn=id=>(P.find(x=>x.id==id)||{a:"General"}).a;
/* ---------- NAV ---------- */
$("#nav").onclick=e=>{const v=e.target.dataset.v;if(!v)return;
 document.querySelectorAll("nav button").forEach(b=>b.classList.toggle("on",b===e.target));
 document.querySelectorAll(".view").forEach(s=>s.classList.toggle("on",s.id===v))};
/* ---------- DEALS ---------- */
function deals(){const t=P.filter(p=>p.grade=="Strong").length,best=[...P].sort((a,b)=>b.profit-a.profit)[0];
$("#deals").innerHTML=`<h1>Deal finder</h1><p class="sub">On-market properties scored for arbitrage: worth, asking price, works and resale value.</p>
<div class="stats"><div class="stat blue"><b>${P.length}</b><span>properties tracked</span></div><div class="stat white"><b>${t}</b><span>strong deals</span></div>
<div class="stat"><b>${eur(best.profit)}</b><span>best profit: ${best.area}</span></div><div class="stat"><b>${Math.round(P.reduce((s,p)=>s+p.disc,0)/P.length*100)}%</b><span>avg. discount to value</span></div></div>
<div class="grid"><div class="box"><table><tr><th>Property</th><th>Asking</th><th>Worth</th><th>Profit</th><th>Deal</th></tr>
${P.map(p=>`<tr class="row" data-id="${p.id}"><td>${p.a}<br><small style="color:var(--mute)">${p.area}</small></td><td>${eur(p.ask)}</td><td>${eur(p.avm)}</td><td>${eur(p.profit)}</td><td><span class="tag ${p.grade}">${p.grade}</span></td></tr>`).join("")}</table></div>
<div class="box" id="detail"></div></div>`;
document.querySelectorAll("#deals .row").forEach(r=>r.onclick=()=>pick(+r.dataset.id));pick(best.id)}
function pick(id){const p=P.find(x=>x.id==id);
 document.querySelectorAll("#deals .row").forEach(r=>r.classList.toggle("sel",r.dataset.id==id));
 const comps=[1,2,3].map(i=>`<div class="kv"><span>${p.area} sale, ${["Aug","Jun","Mar"][i-1]} 2026</span><b>${eur(p.avm*(1+[.02,-.03,.01][i-1]))}</b></div>`).join("");
 $("#detail").innerHTML=`<h3>${p.a}, ${p.area}</h3><span class="tag ${p.grade}">${p.grade} deal</span>
<div class="kv" style="margin-top:12px"><span>Asking price</span><b>${eur(p.ask)}</b></div><div class="kv"><span>Estimated worth today</span><b>${eur(p.avm)}</b></div>
<div class="kv"><span>Works</span><b>${eur(p.reno)}</b></div><div class="kv"><span>Stamp duty, legal, fees (8%)</span><b>${eur(p.costs)}</b></div>
<div class="kv"><span>Can sell for after works</span><b>${eur(p.arv)}</b></div><div class="kv big"><span>Expected profit</span><b>${eur(p.profit)}</b></div>
<div class="kv"><span>Return on spend</span><b>${(p.roi*100).toFixed(1)}%</b></div>
<div class="bar"><i style="width:${Math.min(100,Math.max(4,p.roi*400))}%"></i></div>
<h3 style="margin-top:16px">Site and details</h3><div class="kv"><span>Type</span><b>${p.type}</b></div><div class="kv"><span>Bedrooms</span><b>${p.beds}</b></div>
<div class="kv"><span>Site size</span><b>${p.site}</b></div><div class="kv"><span>BER</span><b>${p.ber}</b></div><div class="kv"><span>Days on market</span><b>${p.days}</b></div>
<h3 style="margin-top:16px">Comparable sales</h3>${comps}`}
/* ---------- MAP ---------- */
const IE=[[-7.4,55.38],[-6.9,55.2],[-6.2,55.2],[-5.8,54.8],[-5.5,54.4],[-6.0,54.0],[-6.2,53.7],[-6.1,53.35],[-6.0,52.9],[-6.35,52.17],[-7.0,52.15],[-8.3,51.8],[-9.8,51.45],[-10.4,52.1],[-9.7,52.6],[-9.05,53.2],[-10.2,53.5],[-10.0,54.25],[-8.5,54.3],[-8.7,54.65],[-8.5,54.95],[-7.9,55.25]];
const X=g=>(g+10.8)*74,Y=l=>(55.5-l)*123;
function map(){const pts=IE.map(c=>X(c[0])+","+Y(c[1])).join(" ");
$("#map").innerHTML=`<h1>Map of Ireland</h1><p class="sub">Every tracked listing. Blue means strong deal, white means fair, grey means pass.</p>
<div class="mapwrap"><svg class="ie" viewBox="0 0 420 520"><polygon class="land" points="${pts}"/>
${P.map(p=>`<circle data-id="${p.id}" cx="${X(p.lng)}" cy="${Y(p.lat)}" r="7" fill="${p.grade=="Strong"?"#2f7bff":p.grade=="Fair"?"#fff":"#46556e"}"><title>${p.a}, ${p.area}</title></circle>`).join("")}</svg>
<div class="box" id="mapinfo"><h3>Select a pin</h3><p class="sub">Tap a pin to see price, worth and profit.</p></div></div>`;
document.querySelectorAll("#map circle").forEach(c=>c.onclick=()=>{const p=P.find(x=>x.id==c.dataset.id);
$("#mapinfo").innerHTML=`<h3>${p.a}, ${p.area}</h3><span class="tag ${p.grade}">${p.grade} deal</span>
<div class="kv" style="margin-top:12px"><span>Asking</span><b>${eur(p.ask)}</b></div><div class="kv"><span>Worth</span><b>${eur(p.avm)}</b></div>
<div class="kv"><span>Resale after works</span><b>${eur(p.arv)}</b></div><div class="kv big"><span>Profit</span><b>${eur(p.profit)}</b></div>
<p style="margin-top:12px"><button class="cta" onclick="goDeal(${p.id})">Open in deal finder</button></p>`})}
function goDeal(id){document.querySelector('[data-v=deals]').click();pick(id)}
/* ---------- CALLS ---------- */
let cf="All";
function calls(){const L=CALLS.filter(c=>cf=="All"||c.kind==cf),av=CALLS.filter(c=>c.kind=="Availability check"||c.kind=="Spam"),mins=av.reduce((s,c)=>s+c.min+2,0);
$("#calls").innerHTML=`<h1>AI call reports</h1><p class="sub">Your AI agent answers the phone. Only calls that need a person reach the agent.</p>
<div class="stats"><div class="stat blue"><b>${CALLS.length}</b><span>calls today</span></div><div class="stat white"><b>${av.length}</b><span>handled fully by AI</span></div>
<div class="stat"><b>${mins} min</b><span>agent time saved</span></div><div class="stat"><b>${CALLS.filter(c=>c.kind=="Viewing request").length}</b><span>viewings booked</span></div></div>
<div class="bar-row">${["All","Availability check","Viewing request","Serious buyer","Spam"].map(k=>`<button class="ghost ${k==cf?"on":""}" data-k="${k}">${k}</button>`).join("")}</div>
<div class="box">${L.map(c=>`<div class="call"><div class="top"><span><b>${c.t}</b> &nbsp; ${c.who} &nbsp; <span style="color:var(--mute)">${pn(c.p)}</span></span><span class="tag ${c.kind=="Serious buyer"?"Strong":c.kind=="Spam"?"Pass":"Fair"}">${c.kind}</span></div>
<div style="color:var(--mute)">${c.res}</div><div class="more">${c.tr.map(l=>`<p><em>${l.split(":")[0]}:</em>${l.slice(l.indexOf(":")+1)}</p>`).join("")}</div></div>`).join("")}</div>`;
document.querySelectorAll("#calls .ghost").forEach(b=>b.onclick=()=>{cf=b.dataset.k;calls()});
document.querySelectorAll(".call").forEach(c=>c.onclick=()=>c.classList.toggle("open"))}
/* ---------- DOCS ---------- */
let lib=[];
function docs(){$("#docs").innerHTML=`<h1>Documents</h1><p class="sub">Drop in files of any format. Each one is read, named, tagged to a deal and stored with its key details.</p>
<div class="drop">Sample inbox: 7 files in 7 different formats<br><br><button class="cta" id="conv">Convert and organise</button></div>
<div class="grid"><div class="box"><h3>Incoming files</h3>${FILES.map((f,i)=>`<div class="file" id="f${i}"><div class="l">${f.n}<small>${f.kind}</small></div><div class="arrow">→</div><div class="r">${f.to}<small>${pn(f.p)}</small></div></div>`).join("")}</div>
<div class="box"><h3>Document library</h3><input id="q" placeholder="Search by deal, type or detail"><div id="lib" style="margin-top:12px"></div></div></div>`;
$("#conv").onclick=()=>{lib=[];renderLib();FILES.forEach((f,i)=>setTimeout(()=>{$("#f"+i).classList.add("done");lib.push(f);renderLib()},500*(i+1)))};
$("#q").oninput=renderLib;renderLib()}
function renderLib(){const q=($("#q")||{value:""}).value.toLowerCase(),L=lib.filter(f=>(f.to+pn(f.p)+f.f).toLowerCase().includes(q));
$("#lib").innerHTML=L.length?L.map(f=>`<div class="kv" style="display:block"><b>${f.to}</b> <span class="tag Fair">${pn(f.p)}</span><br><span>${f.f}</span></div>`).join(""):`<p style="color:var(--mute)">${lib.length?"No matches.":"Nothing stored yet. Press Convert and organise."}</p>`}
/* ---------- PIPELINE ---------- */
let side="all";
function pipe(){const D=DEALS.filter(d=>side=="all"||d.side==side);
$("#pipe").innerHTML=`<h1>Deal pipeline</h1><p class="sub">Every deal by stage, with the documents still missing.</p>
<div class="bar-row">${["all","buy","sell"].map(s=>`<button class="ghost ${s==side?"on":""}" data-s="${s}">${{all:"All deals",buy:"Buying",sell:"Selling"}[s]}</button>`).join("")}</div>
<div class="cols">${STAGES.map((s,i)=>`<div class="col"><h4>${s}<span>${D.filter(d=>d.st==i).length}</span></h4>${D.filter(d=>d.st==i).map(d=>{const n=REQ[d.side].length,have=n-d.miss.length;
return`<div class="card"><b>${pn(d.p)}</b><span style="color:var(--mute)">${d.side=="buy"?"Buying":"Selling"}</span><div class="bar"><i style="width:${have/n*100}%"></i></div>
${d.miss.length?`${have}/${n} documents<br>${d.miss.map(m=>`<span class="miss">${m}</span>`).join("")}`:`<span class="ok">All ${n} documents received</span>`}</div>`}).join("")}</div>`).join("")}</div>`;
document.querySelectorAll("#pipe .ghost").forEach(b=>b.onclick=()=>{side=b.dataset.s;pipe()})}
/* ---------- MCP ---------- */
const TOOLS={
search_listings:{d:"Find on-market properties by county, price and BER",r:()=>({count:P.length,results:P.slice(0,3).map(p=>({address:p.a,area:p.area,ask:p.ask,beds:p.beds,ber:p.ber}))})},
evaluate_property:{d:"Worth, resale value, profit and deal grade",r:()=>{const p=P[0];return{address:p.a,asking:p.ask,estimated_worth:p.avm,resale_after_works:p.arv,works:p.reno,profit:Math.round(p.profit),roi:+(p.roi*100).toFixed(1),grade:p.grade}}},
get_comparable_sales:{d:"Recent sales nearby",r:()=>({area:"Dublin 4",comps:[{sold:"Aug 2026",price:597000},{sold:"Jun 2026",price:567000},{sold:"Mar 2026",price:591000}]})},
get_call_report:{d:"AI phone call summaries",r:()=>({calls:CALLS.length,handled_by_ai:5,serious_buyers:1,latest:CALLS[3].res})},
convert_document:{d:"Convert any file into an organised record",r:()=>({file:FILES[0].n,type:FILES[0].to,deal:pn(1),fields:FILES[0].f})},
get_deal_status:{d:"Stage and missing documents for a deal",r:()=>({deal:pn(4),stage:"Viewing",missing:DEALS[1].miss})}};
function mcp(){$("#mcp").innerHTML=`<h1>MCP tools</h1><p class="sub">The same data, exposed as tools an AI assistant can call. Press a tool to see a sample response.</p>
<div class="grid"><div class="box tools">${Object.keys(TOOLS).map(k=>`<button class="ghost" data-t="${k}">${k}<small>${TOOLS[k].d}</small></button>`).join("")}</div>
<div class="box"><h3>Response</h3><pre id="out">Pick a tool.</pre></div></div>`;
document.querySelectorAll("#mcp [data-t]").forEach(b=>b.onclick=()=>{$("#out").textContent=JSON.stringify(TOOLS[b.dataset.t].r(),null,2)})}
deals();map();calls();docs();pipe();mcp();
