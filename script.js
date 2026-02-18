/* ===== Loader ===== */
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if(loader) loader.style.display = "none";
});

/* ===== Toast Notification ===== */
function showToast(msg){
  const t = document.getElementById("toast");
  if(!t) return;
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(()=> t.classList.remove("show"), 3000);
}

/* ===== Dark/Light Mode ===== */
const toggleBtn = document.getElementById("toggleMode");
if(toggleBtn) toggleBtn.onclick = ()=> {
  document.body.classList.toggle("light-mode");
  // Update background images based on mode
  if(document.body.classList.contains("light-mode")){
    document.body.className = document.body.className.replace(/pyramid-body|login-body/g, "light-mode-body");
  } else {
    // Restore original body class
    if(window.location.pathname.includes("home.html") || window.location.pathname.includes("tickets.html") || window.location.pathname.includes("map.html")){
      document.body.className = document.body.className.replace(/light-mode-body/g, "pyramid-body");
    } else if(window.location.pathname.includes("index.html")){
      document.body.className = document.body.className.replace(/light-mode-body/g, "login-body");
    }
  }
};

/* ===== Language Switch ===== */
const langSelect = document.getElementById("langSelect");
if(langSelect) langSelect.onchange = ()=> changeLang(langSelect.value);

function changeLang(lang){
  const translations = {
    ar:{
      hero:"مترو القاهرة",
      desc:"تجربة تنقل ذكية وسريعة",
      ticket:"حجز تذكرة",
      homeBtn:"الرئيسية",
      mapBtn:"الخريطة",
      ticketBtn:"حجز التذاكر"
    },
    en:{
      hero:"Cairo Metro",
      desc:"Smart & fast",
      ticket:"Book Ticket",
      homeBtn:"Home",
      mapBtn:"Map",
      ticketBtn:"Tickets"
    }
  };
  const t = translations[lang] || translations.ar;
  
  if(document.getElementById("heroTitle")) document.getElementById("heroTitle").textContent = t.hero;
  if(document.getElementById("heroDesc")) document.getElementById("heroDesc").textContent = t.desc;
  if(document.getElementById("ticketTitle")) document.getElementById("ticketTitle").textContent = t.ticket;

  // تحديث أزرار القائمة
  const navButtons = document.querySelectorAll(".top-nav button");
  navButtons.forEach(btn=>{
    const key = btn.getAttribute("data-text");
    if(key=="الرئيسية" || key=="Home") btn.textContent = t.homeBtn;
    else if(key=="الخريطة" || key=="Map") btn.textContent = t.mapBtn;
    else if(key=="حجز التذاكر" || key=="Tickets") btn.textContent = t.ticketBtn;
  });
}

/* ===== Metro Lines & Stations ===== */
const stationsAll = {
  1:[
    {name:"حلوان",lat:29.849,lng:31.334},{name:"المعادي",lat:29.960,lng:31.257},
    {name:"دار السلام",lat:29.987,lng:31.242},{name:"السيدة زينب",lat:30.034,lng:31.235},
    {name:"السادات",lat:30.044,lng:31.235},{name:"الشهداء",lat:30.061,lng:31.246},
    {name:"حمامات القبة",lat:30.088,lng:31.287},{name:"المطرية",lat:30.121,lng:31.313},
    {name:"المرج الجديدة",lat:30.152,lng:31.335}
  ],
  2:[
    {name:"المنيب",lat:29.981,lng:31.212},{name:"الجيزة",lat:30.010,lng:31.207},
    {name:"الدقي",lat:30.038,lng:31.210},{name:"السادات",lat:30.044,lng:31.235},
    {name:"العتبة",lat:30.052,lng:31.246},{name:"شبرا الخيمة",lat:30.122,lng:31.244}
  ],
  3:[
    {name:"عدلي منصور",lat:30.146,lng:31.421},{name:"هليوبوليس",lat:30.098,lng:31.320},
    {name:"العتبة",lat:30.052,lng:31.246},{name:"ناصر",lat:30.053,lng:31.238},
    {name:"الكيت كات",lat:30.066,lng:31.213},{name:"جامعة القاهرة",lat:30.027,lng:31.207}
  ]
};
const lineColors = {1:"red",2:"blue",3:"green"};

/* ===== Populate Ticket Stations ===== */
function populateStations(line){
  const from = document.getElementById("from");
  const to = document.getElementById("to");
  if(!from || !to) return;
  from.innerHTML=""; to.innerHTML="";
  let list=[];
  if(line=="1") list = stationsAll[1].map(s=>s.name);
  else if(line=="2") list = stationsAll[2].map(s=>s.name);
  else if(line=="3") list = stationsAll[3].map(s=>s.name);
  else list = [...stationsAll[1],...stationsAll[2],...stationsAll[3]].map(s=>s.name);
  list.forEach(st=>{
    from.innerHTML += `<option>${st}</option>`;
    to.innerHTML += `<option>${st}</option>`;
  });
}
if(document.getElementById("lineSelectTicket")) populateStations("all");
const lineSelectTicket = document.getElementById("lineSelectTicket");
if(lineSelectTicket){
  lineSelectTicket.onchange = ()=> populateStations(lineSelectTicket.value);
}
/* ===== Payment Options ثابتة ===== */
const wallets = ["Fawry","Bee","Vodafone Cash","Etisalat Cash","Meeza","Visa/MasterCard"];

function generatePaymentOptions(){
  const container = document.getElementById("wallets");
  if(!container) return;
  container.innerHTML = "";
  wallets.forEach(w => {
    const btn = document.createElement("button");
    btn.className = "main-btn wallet-btn";
    btn.textContent = w;
    btn.onclick = ()=> showToast(`اخترت الدفع عبر: ${w}`);
    container.appendChild(btn);
  });
}

// نفذ فور تحميل الصفحة
window.addEventListener("DOMContentLoaded", ()=>{
  generatePaymentOptions();  // تظهر المحافظ بمجرد فتح الصفحة
});

/* ===== Ticket & QR + Barcode ===== */
function calculateStations(from,to){
  for(let key in stationsAll){
    let line=stationsAll[key].map(s=>s.name);
    let s=line.indexOf(from), e=line.indexOf(to);
    if(s!==-1 && e!==-1) return Math.abs(e-s);
  }
  return 10; // تحويل بين الخطوط
}
function calculatePrice(stations){
  if(stations<=9) return 8;
  if(stations<=16) return 10;
  return 15;
}
function generateTicket(){
  let from = document.getElementById("from").value;
  let to = document.getElementById("to").value;
  let qty = parseInt(document.getElementById("qty").value);
  
  if(!from || !to || qty<=0){
    showToast("يرجى اختيار المحطات وعدد التذاكر");
    return;
  }
  
  let stations = calculateStations(from,to);
  let price = calculatePrice(stations)*qty;

  document.getElementById("priceBox").innerHTML = `
    <div class="ticket-card">
      <h3>من: ${from}</h3>
      <h3>إلى: ${to}</h3>
      <h3>عدد المحطات: ${stations}</h3>
      <h3>السعر الكلي: ${price} جنيه</h3>
    </div>`;

  document.getElementById("qrcode").innerHTML="";
  new QRCode(document.getElementById("qrcode"),{
    text:`MetroX | ${from}-${to} | ${price} EGP`,
    width:150,height:150
  });

  JsBarcode("#barcode", `MetroX|${from}-${to}|${price}EGP`, {format:"CODE128", lineColor:"#000", width:2, height:40});
  generatePaymentOptions();
  showToast("تم إنشاء التذكرة بنجاح!");
}

/* ===== Leaflet Map ===== */
if(document.getElementById("map")){
  const map = L.map("map").setView([30.0444,31.2357], 11);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap"}).addTo(map);

  function drawLine(key){
    stationsAll[key].forEach(st=>{
      L.circleMarker([st.lat, st.lng], {radius:6, color:lineColors[key], fillColor:lineColors[key], fillOpacity:1})
      .addTo(map).bindTooltip(st.name,{permanent:true});
    });
    const coords=stationsAll[key].map(st=>[st.lat,st.lng]);
    L.polyline(coords,{color:lineColors[key],weight:5}).addTo(map);
  }

  const lineSelect = document.getElementById("lineSelect");
  if(lineSelect){
    lineSelect.onchange=(e)=>{
      map.eachLayer(l=>{
        if(l instanceof L.Polyline || l instanceof L.CircleMarker) map.removeLayer(l);
      });
      if(e.target.value==="all"){
        ["1","2","3"].forEach(l=>drawLine(l));
      } else drawLine(e.target.value);
    };
  }
  ["1","2","3"].forEach(l=>drawLine(l));
}
