/* ============================================================
   KATY — THEN AND NOW  |  Main JavaScript
   ============================================================
   Table of Contents:
    1. Mobile Method
    2. Before-After Sliders
    3. Carousels
    4. Population Chart
   ============================================================ */


/* 1. Mobile Method */
function toggleMobile() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('open');
}


/* 2. Before-After Sliders 
    Each slider has:
    .slider-wrapper which is the outer container (used for popup animal hover)
    .before-after-container which holds both images and the handle
    .before-image which clips the "before" image; width is adjusted on drag
    .slider-handle which is the draggable gold bar
Pass the wrapper element's ID to initSlider() to activate it.
*/

function initSlider(wrapperId) {
    const wrapper = document.getElementById(wrapperId);
    if (!wrapper) return;

    const container = wrapper.querySelector('.before-after-container');
    const beforeImage = container.querySelector('.before-image');
    const handle = container.querySelector('.slider-handle');
    let isDragging = false;

    const afterImg = container.querySelector('.after-img');
    afterImg.addEventListener('load', () => {
        beforeImage.style.height = container.offsetHeight + 'px';
    });

    /* Mouse Events */
    handle.addEventListener('mousedown', (e) => {
        isDragging = true;
        e.preventDefault();
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const rect = container.getBoundingClientRect();
        let x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        beforeImage.style.width = x + 'px';
        handle.style.left = x + 'px';
    });

    /* Touch Events */
    handle.addEventListener('touchstart', (e) => {
        isDragging = true;
        e.preventDefault();
    }, {passive: false});

    window.addEventListener('touchend', () => {
        isDragging = false;
    });

    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        let x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
        beforeImage.style.width = x + 'px';
        handle.style.left = x + 'px';
    }, {passive: false});
}

/* 
    List every slider wrapper ID here to initialize them.
    Add a new entry whenever you add a new before-after slider to the HTML.

    Naming convetion used:
        ba-[location]-[number]   e.g. ba-hotel-1, ba-hotel-2
*/
const SLIDER_IDS = [
    'ba-hotel',
    'ba-stewart',
    'ba-clardy',
    'ba-depot',
    'ba-elementary',
    'ba-avenue',
    'ba-ricemill',
];

SLIDER_IDS.forEach(initSlider);


/* 3. Carousels
    Each carousel has:
    .carousel-outer which is the outer container used for popup animal hover
    .carousel-container which are the flex row of images; moved via translateX
    .carousel-image which are the individual slides
    .prev / .next buttons for navigation
Pass the outer container's ID to initCarousel() to activate it.
*/

function initCarousel(outerId) {
    const outer = document.getElementById(outerId);
    if (!outer) return;
    
    const track = outer.querySelector('.carousel-container');
    const slides = track.querySelectorAll('.carousel-image');
    const prev = outer.querySelector('.prev');
    const next = outer.querySelector('.next');
    let idx = 0;

    function goTo(n) {
        idx = (n + slides.length) % slides.length;
        track.style.transform = `translateX(-${idx * 100}%)`;
    }

    prev.addEventListener('click', () => goTo(idx - 1));
    next.addEventListener('click', () => goTo(idx + 1));
}

/* 
    List every carousel outer ID here to initialize them.
    Add a new entry whenever you add a new carousel to the HTML. 
*/
const CAROUSEL_IDS = [
    'carousel-katyhistory',
    'carousel-ricefields',
    'carousel-oilfields',
    'carousel-astroworld',
];

CAROUSEL_IDS.forEach(initCarousel);


/* 4. Population Chart
    This katy population chart is implemented using Chart.js, which 
    is imported via CDN in the HTML. The chart is rendered on a 
    canvas element with ID 'populationChart'. The data and configuration 
    for the chart are defined in the renderPopulationChart() function.
*/

/* Census API Key */
const CENSUS_API_KEY = 'b15f8086d20cdd03f67b1ec273b7db4c0e31600d';


/* Historical Data (pre-1990)
    Verified estimates for Katy, TX from local records and the
    Texas State Historical Association. The Census API does not
    have reliable Katy city data before 1990 as Katy was largely
    unincorporated.
*/
const HISTORICAL_DATA = [
    { year: 1900, population: 200 },
    { year: 1910, population: 450 },
    { year: 1920, population: 850 },
    { year: 1930, population: 1200 },
    { year: 1940, population: 1500 },
    { year: 1950, population: 2000 },
    { year: 1960, population: 3500 },
    { year: 1970, population: 5660 },
    { year: 1980, population: 7600 },
];


/* Fetch Census Data
    Pulls Katy city population from the Census API for:
        - 1990, 2000, 2010, 2020 (Decennial Census)
        - 2023 (ACS 1-year estimate — updates automatically each year)

    Katy, TX FIPS codes:
        - State: 48 (Texas)
        - Place: 38632 (Katy city)
*/
async function fetchCensusData() {
    const results = [];

    const decennialYears = [
        { year: 1990, dataset: 'dec/sf1', variable: 'P001001' },
        { year: 2000, dataset: 'dec/sf1', variable: 'P001001' },
        { year: 2010, dataset: 'dec/sf1', variable: 'P001001' },
        { year: 2020, dataset: 'dec/dhc', variable: 'P1_001N' },
    ];

    for (const entry of decennialYears) {
        try {
            const url = `https://api.census.gov/data/${entry.year}/${entry.dataset}` +
                        `?get=${entry.variable}&for=place:38632&in=state:48` +
                        `&key=${CENSUS_API_KEY}`;
            const res  = await fetch(url);
            const data = await res.json();
            const pop  = parseInt(data[1][0]);
            if (!isNaN(pop)) results.push({ year: entry.year, population: pop });
        } catch (e) {
            console.warn(`Could not fetch ${entry.year} Census data:`, e);
        }
    }

    /* ACS 1-year estimate — most recent available */
    try {
        const acsYear = new Date().getFullYear() - 2;
        const acsUrl  = `https://api.census.gov/data/${acsYear}/acs/acs5` +
                        `?get=B01003_001E&for=place:38632&in=state:48` +
                        `&key=${CENSUS_API_KEY}`;
        const acsRes  = await fetch(acsUrl);
        const acsData = await acsRes.json();
        const acsPop  = parseInt(acsData[1][0]);
        if (!isNaN(acsPop)) results.push({ year: acsYear, population: acsPop });
    } catch (e) {
        console.warn('Could not fetch ACS estimate:', e);
    }

    return results;
}


/* Helper Functions */

/* Format numbers — e.g. 25000 → "25,000" */
function formatNumber(n) {
    return n.toLocaleString('en-US');
}

/* Find the decade with the largest population increase */
function findPeakDecade(allData) {
    let maxIncrease = 0;
    let peakDecade  = '';
    for (let i = 1; i < allData.length; i++) {
        const increase = allData[i].population - allData[i - 1].population;
        if (increase > maxIncrease) {
            maxIncrease = increase;
            peakDecade  = `${allData[i - 1].year}s`;
        }
    }
    return peakDecade;
}


/* Build Chart */
function buildChart(allData) {
    const labels = allData.map(d => d.year);
    const values = allData.map(d => d.population);

    const ctx = document.getElementById('populationChart').getContext('2d');

    Chart.defaults.font.family = "'Montserrat', sans-serif";

    new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Katy, TX Population',
                data: values,
                borderColor: '#DAA520',
                backgroundColor: 'rgba(218, 165, 32, 0.08)',
                borderWidth: 3,
                pointBackgroundColor: '#493b31',
                pointBorderColor: '#DAA520',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 9,
                fill: true,
                tension: 0.35,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#493b31',
                        font: { size: 13, weight: '600' },
                        boxWidth: 16,
                    }
                },
                tooltip: {
                    backgroundColor: '#3a2e24',
                    titleColor: '#DAA520',
                    bodyColor: '#e8d5b7',
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: ctx => ` Population: ${formatNumber(ctx.parsed.y)}`
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Year',
                        color: '#493b31',
                        font: { size: 12, weight: '600' }
                    },
                    ticks: { color: '#6b5344' },
                    grid:  { color: 'rgba(201, 168, 124, 0.2)' }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Population',
                        color: '#493b31',
                        font: { size: 12, weight: '600' }
                    },
                    ticks: {
                        color: '#6b5344',
                        callback: value => formatNumber(value)
                    },
                    grid: { color: 'rgba(201, 168, 124, 0.2)' },
                    beginAtZero: true,
                }
            }
        }
    });
}


/* Update Stat Cards */
function updateStats(allData) {
    const earliest = allData[0];
    const latest = allData[allData.length - 1];
    const increase = latest.population - earliest.population;
    const pct = Math.round((increase / earliest.population) * 100);

    document.getElementById('stat-earliest').textContent = formatNumber(earliest.population);
    document.getElementById('stat-peak').textContent = findPeakDecade(allData);
    document.getElementById('stat-latest').textContent = formatNumber(latest.population);
    document.getElementById('stat-increase').textContent = `+${pct.toLocaleString()}%`;

    document.getElementById('chartStats').style.display = 'grid';
}


/* Init — runs on page load */
async function init() {
    const loading = document.getElementById('chartLoading');
    const error   = document.getElementById('chartError');

    try {
        const censusData = await fetchCensusData();

        /* Merge historical + Census, sort by year, remove duplicates */
        const combined = [...HISTORICAL_DATA, ...censusData]
            .sort((a, b) => a.year - b.year)
            .filter((d, i, arr) => i === 0 || d.year !== arr[i - 1].year);

        loading.style.display = 'none';
        if (censusData.length === 0) error.style.display = 'block';

        buildChart(combined);
        updateStats(combined);

    } catch (e) {
        /* Fall back to historical data only if everything fails */
        loading.style.display = 'none';
        error.style.display   = 'block';
        buildChart(HISTORICAL_DATA);
        updateStats(HISTORICAL_DATA);
        console.error('Chart init error:', e);
    }
}

init();