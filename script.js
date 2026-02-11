"use strict";

// تغيير الصفحات
function showSection(id) {
    document.querySelectorAll(".section").forEach(sec => sec.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

// التطبيق
class MetroApp {

    constructor() {
        this.map = null;
        this.markers = [];
        this.routePolyline = null;

        this.stations = [
            {name:"عدلي منصور",lat:30.1472,lng:31.4214},
            {name:"الهايكستب",lat:30.1393,lng:31.4046},
            {name:"عمر بن الخطاب",lat:30.1311,lng:31.3902},
            {name:"قباء",lat:30.1232,lng:31.3770},
            {name:"النزهة",lat:30.1092,lng:31.3520},
            {name:"نادي الشمس",lat:30.1025,lng:31.3398},
            {name:"ألف مسكن",lat:30.0958,lng:31.3275},
            {name:"هليوبوليس",lat:30.0887,lng:31.3152},
            {name:"كلية البنات",lat:30.0815,lng:31.3028},
            {name:"الاستاد",lat:30.0742,lng:31.2906},
            {name:"المعرض",lat:30.0675,lng:31.2782},
            {name:"العباسية",lat:30.0610,lng:31.2660},
            {name:"عبده باشا",lat:30.0543,lng:31.2538},
            {name:"الجيش",lat:30.0475,lng:31.2415},
            {name:"باب الشعرية",lat:30.0410,lng:31.2292},
            {name:"العتبة",lat:30.0350,lng:31.2170},
            {name:"ناصر",lat:30.0290,lng:31.2050},
            {name:"ماسبروا",lat:30.0230,lng:31.1930},
            {name:"صفاء حجازي",lat:30.0170,lng:31.1810},
            {name:"الكيت كات",lat:30.0110,lng:31.1690},
            {name:"جامعة القاهرة",lat:30.0035,lng:31.2100}
        ];

        this.init();
    }

    init() {
        this.populateSelects();
        this.initMap();
        this.bindEvents();
    }

    populateSelects() {
        const fromSelect = document.getElementById("from");
        const toSelect = document.getElementById("to");
        this.stations.forEach((st, i) => {
            fromSelect.add(new Option(st.name, i));
            toSelect.add(new Option(st.name, i));
        });
    }

    calculatePrice(distance) {
        if (distance <= 9) return 8;
        if (distance <= 16) return 10;
        if (distance <= 23) return 15;
        return 20;
    }

    bookTrip() {
        const fromIndex = parseInt(document.getElementById("from").value);
        const toIndex = parseInt(document.getElementById("to").value);

        if (fromIndex === toIndex) {
            alert("اختر محطة مختلفة");
            return;
        }

        const distance = Math.abs(toIndex - fromIndex);
        const price = this.calculatePrice(distance);
        const time = distance * 2;

        this.drawRoute(fromIndex, toIndex);
        this.showTicket(fromIndex, toIndex, distance, price, time);
    }

    showTicket(from, to, distance, price, time) {
        const ticketBox = document.getElementById("ticket");
        const ticketInfo = document.getElementById("ticket-info");
        const lat = this.stations[to].lat;
        const lng = this.stations[to].lng;

        ticketInfo.innerHTML = 
            '<p>من: ${this.stations[from].name}</p>'
            '<p>إلى: ${this.stations[to].name}</p>'
            '<p>عدد المحطات: ${distance}</p>'
            '<p>الزمن: ${time} دقيقة</p>'
            '<p>السعر: ${price} جنيه</p>'
            '<button id="mapBtn">افتح الموقع في Google Maps</button>'
        ;

        ticketBox.style.display = "block";

        const btn = document.getElementById("mapBtn");
        btn.addEventListener("click", function() {
            window.open(
                "https://www.google.com/maps?q=${lat},${lng}", "_blank");
        });
    }

    initMap() {
        const mapOptions = {
            center: {lat:30.07, lng:31.30},
            zoom: 11
        };
        this.map = new google.maps.Map(document.getElementById("googleMap"), mapOptions);

        this.stations.forEach(st => {
            const marker = new google.maps.Marker({
                position: {lat: st.lat, lng: st.lng},
                map: this.map,
                title: st.name
            });

            const infoWindow = new google.maps.InfoWindow({
                content: st.name
            });
marker.addListener("click", () => {
                infoWindow.open(this.map, marker);
                this.map.setZoom(15);
                this.map.setCenter(marker.getPosition());
            });

            this.markers.push(marker);
        });
    }

    drawRoute(from, to) {
        if (this.routePolyline) this.routePolyline.setMap(null);

        const start = Math.min(from, to);
        const end = Math.max(from, to);

        const pathCoords = this.stations.slice(start, end+1).map(st => ({lat: st.lat, lng: st.lng}));

        this.routePolyline = new google.maps.Polyline({
            path: pathCoords,
            geodesic: true,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 5
        });

        this.routePolyline.setMap(this.map);
        this.map.fitBounds(new google.maps.LatLngBounds(
            pathCoords[0],
            pathCoords[pathCoords.length-1]
        ));
    }

    bindEvents() {
        document.getElementById("book-btn").addEventListener("click", () => this.bookTrip());
        document.getElementById("pay-btn").addEventListener("click", () => {
            const method = document.getElementById("payment").value;
            alert("تم اختيار الدفع عبر: " + method + "\nهذه ميزة تجريبية فقط.");
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new MetroApp();

    // FadeIn للصفحة الرئيسية
    const homeContent = document.querySelector(".home-content");
    setTimeout(() => homeContent.classList.add("visible"), 200);
});