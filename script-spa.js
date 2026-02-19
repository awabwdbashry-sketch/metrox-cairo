/* Loader */
window.addEventListener("load",()=>{document.getElementById("loader").style.display="none";});

/* Navigation */
function showPage(id){
  document.querySelectorAll(".page").forEach(p=>p.style.display="none");
  document.getElementById("page-"+id).style.display="block";
  document.body.className=(id==="login")?"login-body":"pyramid-body";
  if(id==="map") setTimeout(()=>{if(window.metroMap) window.metroMap.invalidateSize();},200);
}

/* Toggle Menu */
const toggle=document.getElementById("menuToggle");
const menu=document.getElementById("menuOptions");
if(toggle){toggle.onclick=()=>{menu.style.display= menu.style.display==="flex" ? "none":"flex";}}

/* Dark Mode */
function toggleMode(){document.body.classList.toggle("light-mode");}

/* Lines and Stations (All Cairo Metro lines) */
const lines=[
  {name:"الخط الأول",color:"#E53935",stations:[
    {name:"حلوان",lat:29.849,lng:31.334},
    {name:"عين حلوان",lat:29.860,lng:31.330},
    {name:"المعصرة",lat:29.875,lng:31.300},
    {name:"وادي حوف",lat:29.885,lng:31.295},
    {name:"تلة الحسنة",lat:29.895,lng:31.290},
    {name:"السباك",lat:29.905,lng:31.285},
    {name:"النزهة الجديدة",lat:29.915,lng:31.280},
    {name:"النزهة",lat:29.925,lng:31.275},
    {name:"المطرية",lat:29.935,lng:31.270},
    {name:"الشهداء",lat:29.945,lng:31.265},
    {name:"العتبة",lat:29.955,lng:31.260},
    {name:"السادات",lat:29.965,lng:31.255},
    {name:"الأنفوشي",lat:29.975,lng:31.250},
    {name:"الدمرداش",lat:29.985,lng:31.245},
    {name:"غمرة",lat:29.995,lng:31.240},
    {name:"المرج الجديدة",lat:30.065,lng:31.205},
    {name:"المرج",lat:30.075,lng:31.200}
  ]},
  {name:"الخط الثاني",color:"#3F51B5",stations:[
    {name:"شبرا الخيمة",lat:30.120,lng:31.240},
    {name:"الخانكة",lat:30.110,lng:31.245},
    {name:"العباسية",lat:30.100,lng:31.250},
    {name:"المطرية",lat:30.090,lng:31.255},
    {name:"الشهداء",lat:30.080,lng:31.260},
    {name:"السادات",lat:30.070,lng:31.265},
    {name:"العتبة",lat:30.060,lng:31.270},
    {name:"الأنفوشي",lat:30.050,lng:31.275},
    {name:"الدمرداش",lat:30.040,lng:31.280},
    {name:"غمرة",lat:30.030,lng:31.285},
    {name:"المرج الجديدة",lat:29.970,lng:31.315},
    {name:"المرج",lat:29.960,lng:31.320}
  ]},
  {name:"الخط الثالث",color:"#4CAF50",stations:[
    {name:"العتبة",lat:30.052,lng:31.246},
    {name:"السادات",lat:30.044,lng:31.235},
    {name:"الأنفوشي",lat:30.036,lng:31.224},
    {name:"الدمرداش",lat:30.028,lng:31.213},
    {name:"غمرة",lat:30.020,lng:31.202},
    {name:"الشهداء",lat:30.012,lng:31.191},
    {name:"المرج الجديدة",lat:29.964,lng:31.125},
    {name:"المرج",lat:29.956,lng:31.114}
  ]}
];

/* Populate lineSelect */
const lineSelect=document.getElementById("lineSelect");
lines.forEach(line=>lineSelect.innerHTML+=`<option value="${line.name}">${line.name}</option>`);

/* Populate stations based on selected line */
function populateStations(){
  const lineName=lineSelect.value;
  const line=lines.find(l=>l.name===lineName);
  const from=document.getElementById("from");
  const to=document.getElementById("to");
  from.innerHTML=""; to.innerHTML="";
  line.stations.forEach(s=>{
    from.innerHTML+=`<option>${s.name}</option>`;
    to.innerHTML+=`<option>${s.name}</option>`;
  });
}
lineSelect.onchange=populateStations;
populateStations();

/* Ticket Generation */
function generateTicket(){
  let from=document.getElementById("from").value;
  let to=document.getElementById("to").value;
  let qty=parseInt(document.getElementById("qty").value);
  let line=lineSelect.value;
  let price=10*qty;

  document.getElementById("priceBox").innerHTML=
    `<h3>${line}: من ${from} إلى ${to}</h3><h3>السعر ${price} جنيه</h3>`;

  document.getElementById("qrcode").innerHTML="";
  new QRCode(document.getElementById("qrcode"), `MetroX ${line} ${from}-${to}`);
  JsBarcode("#barcode", `MetroX-${price}`, {format:"CODE128"});

  let payment=document.getElementById("paymentSelect").value;
  console.log("Payment method:", payment);
}

/* Map */
let metroMap;
if(document.getElementById("map")){
  metroMap=L.map("map").setView([30.0444,31.2357],11);
  window.metroMap=metroMap;
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(metroMap);

  let lineLayers={};

  lines.forEach(line=>{
    const coords=line.stations.map(s=>[s.lat,s.lng]);
    const poly=L.polyline(coords,{color:line.color,weight:6}).addTo(metroMap);
    lineLayers[line.name]=poly;

    line.stations.forEach(s=>{
      const marker=L.circleMarker([s.lat,s.lng],{
        radius:6,
        color:line.color,
        fillColor:line.color,
        fillOpacity:1
      }).addTo(metroMap);
      marker.bindTooltip(s.name,{permanent:true,className:'myTooltip'});
      marker.on('mouseover',()=>{marker.setStyle({radius:10});});
      marker.on('mouseout',()=>{marker.setStyle({radius:6});});
    });
  });

  document.getElementById("showAllLines").onclick=()=>{
    Object.values(lineLayers).forEach(layer=>layer.addTo(metroMap));
  };

  lineSelect.onchange=function(){
    const selected=lineSelect.value;
    Object.keys(lineLayers).forEach(name=>{
      if(name===selected) metroMap.addLayer(lineLayers[name]);
      else metroMap.removeLayer(lineLayers[name]);
    });
  };
}
