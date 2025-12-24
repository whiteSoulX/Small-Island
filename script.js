// 1. Scroll Animations (The "Reveal" Effect)
const observerOptions = {
    threshold: 0.2 // Trigger when 20% of the element is visible
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.scroll-trigger').forEach((el) => {
    observer.observe(el);
});

// 2. Map Configuration (Using your specific Slide Data)
const map = L.map('map').setView([20, 0], 2);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO'
}).addTo(map);

// Locations from Slide 4 (UK -> USA -> Australia)
const locations = [
    { name: "United Kingdom", coords: [51.5074, -0.1278], desc: "Origin: 5-7 Million Speakers" },
    { name: "USA (17th Century)", coords: [38.9072, -77.0369], desc: "Colonial Spread: 17th Century" },
    { name: "Australia (18th Century)", coords: [-35.2809, 149.1300], desc: "Further Spread: 18th Century" }
];

// Custom Plane Icon
const planeIcon = L.divIcon({
    className: 'plane-icon',
    html: '✈️',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
});

let marker = L.marker(locations[0].coords, {icon: planeIcon}).addTo(map)
    .bindPopup(`<b>${locations[0].name}</b><br>${locations[0].desc}`).openPopup();

// Draw Route Path
const pathCoords = locations.map(loc => loc.coords);
const polyline = L.polyline(pathCoords, {
    color: '#d4ac0d', // Gold color matches theme
    weight: 3,
    dashArray: '10, 10', 
    opacity: 0.8
}).addTo(map);

// 3. Flight Animation Logic
let currentStep = 0;
document.getElementById('start-btn').addEventListener('click', () => {
    const status = document.getElementById('map-status');
    const btn = document.getElementById('start-btn');
    
    if (currentStep < locations.length - 1) {
        currentStep++;
        const nextLoc = locations[currentStep];
        
        status.innerText = `Flying to ${nextLoc.name}...`;
        btn.disabled = true; // Prevent double clicking
        
        // Fly animation
        map.flyTo(nextLoc.coords, 4, {
            animate: true,
            duration: 2.5
        });

        // Wait for map movement, then update marker
        setTimeout(() => {
            marker.setLatLng(nextLoc.coords)
                  .bindPopup(`<b>${nextLoc.name}</b><br>${nextLoc.desc}`)
                  .openPopup();
            status.innerText = `Arrived: ${nextLoc.name}`;
            btn.disabled = false;
        }, 2500);
        
    } else {
        // Reset
        currentStep = 0;
        status.innerText = "Journey Reset. Ready for takeoff.";
        map.flyTo(locations[0].coords, 2, { duration: 1.5 });
        marker.setLatLng(locations[0].coords).closePopup();
    }
});