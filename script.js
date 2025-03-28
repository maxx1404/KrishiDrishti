const hydroData = {
    systemCapacity: {
        nft: {
            lettuce: 4, basil: 4, spinach: 4, kale: 2,
            strawberry: 2, tomato: 1, pepper: 1, cucumber: 1
        },
        dwc: {
            lettuce: 4, basil: 4, spinach: 4, kale: 2,
            strawberry: 2, tomato: 1, pepper: 1, cucumber: 1
        },
        ebb: {
            lettuce: 4, basil: 4, spinach: 4, kale: 2,
            strawberry: 2, tomato: 1, pepper: 1, cucumber: 1
        },
        aeroponics: {
            lettuce: 6, basil: 6, spinach: 6, kale: 3,
            strawberry: 3, tomato: 1.5, pepper: 1.5, cucumber: 1.5
        }
    },
    nutrients: {
        lettuce: { ec: 1.4, ph: 6.0, npk: "8-15-36" },
        basil: { ec: 1.6, ph: 5.8, npk: "10-15-30" },
        spinach: { ec: 1.8, ph: 6.2, npk: "12-10-26" },
        kale: { ec: 2.0, ph: 6.0, npk: "14-8-28" },
        strawberry: { ec: 1.8, ph: 5.8, npk: "8-12-32" },
        tomato: { ec: 2.5, ph: 5.8, npk: "15-10-30" },
        pepper: { ec: 2.5, ph: 5.8, npk: "12-8-30" },
        cucumber: { ec: 2.2, ph: 5.8, npk: "10-10-30" }
    },
    systemSizes: {
        small: { length: 4, width: 8 },
        medium: { length: 8, width: 16 },
        large: { length: 16, width: 32 }
    }
};

// Initialize AR when tab is opened
function initAR() {
    const arContainer = document.getElementById('arContainer');
    const permissionHelp = document.getElementById('permissionHelp');
    
    // Clear previous content
    arContainer.innerHTML = '<div class="loading-ar">Loading AR visualization...</div>';
    permissionHelp.style.display = 'none';
    
    // Create new iframe
    const iframe = document.createElement('iframe');
    iframe.src = "https://mywebar.com/p/Project_3_t7zd22rulz";
    iframe.frameBorder = "0";
    iframe.scrolling = "yes";
    iframe.seamless = "seamless";
    iframe.className = "ar-iframe";
    iframe.allow = "camera;gyroscope;accelerometer;magnetometer;xr-spatial-tracking;microphone";
    
    // Add event listeners for permission issues
    iframe.onload = function() {
        // Check if camera access was denied
        setTimeout(() => {
            if (!iframe.contentWindow || iframe.contentDocument.hidden) {
                showPermissionHelp();
            } else {
                arContainer.removeChild(arContainer.querySelector('.loading-ar'));
            }
        }, 2000);
    };
    
    iframe.onerror = function() {
        showPermissionHelp();
    };
    
    arContainer.appendChild(iframe);
}

function showPermissionHelp() {
    const arContainer = document.getElementById('arContainer');
    const loading = arContainer.querySelector('.loading-ar');
    if (loading) arContainer.removeChild(loading);
    
    const iframe = arContainer.querySelector('iframe');
    if (iframe) arContainer.removeChild(iframe);
    
    const permissionHelp = document.getElementById('permissionHelp');
    permissionHelp.style.display = 'block';
}

function openTab(tabName) {
    // Hide all tab contents
    const tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active');
    }
    
    // Remove active class from all tabs
    const tabs = document.getElementsByClassName('tab');
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
    }
    
    // Show the selected tab and mark its button as active
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`.tab[onclick="openTab('${tabName}')"]`).classList.add('active');
    
    // Initialize AR if opening AR tab
    if (tabName === 'ar') {
        initAR();
    }
}

// Toggle custom size fields
document.getElementById('systemSize').addEventListener('change', function() {
    const customGroup = document.getElementById('customSizeGroup');
    customGroup.style.display = this.value === 'custom' ? 'block' : 'none';
});

document.getElementById('hydroForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    // Get inputs
    const systemSize = document.getElementById('systemSize').value;
    const systemType = document.getElementById('systemType').value;
    const environment = document.getElementById('environment').value;
    const selectedCrops = Array.from(document.querySelectorAll('input[name="crop"]:checked'))
                              .map(cb => cb.value);

    // Validate inputs
    if (!systemSize || !systemType || !environment || selectedCrops.length === 0) {
        alert('Please fill all required fields');
        return;
    }

    // Calculate system area
    let length, width;
    if (systemSize === 'custom') {
        length = parseFloat(document.getElementById('customLength').value);
        width = parseFloat(document.getElementById('customWidth').value);
        if (!length || !width) {
            alert('Please enter custom dimensions');
            return;
        }
    } else {
        length = hydroData.systemSizes[systemSize].length;
        width = hydroData.systemSizes[systemSize].width;
    }
    const area = length * width;

    // Generate results
    resultDiv.innerHTML = `
        <h2>🌿 Your Hydroponic Farming Plan</h2>
        <div class="metric">
            <span>System Type</span>
            <span>${systemType.toUpperCase()} (${environment})</span>
        </div>
        <div class="metric">
            <span>System Size</span>
            <span>${length}ft × ${width}ft (${area} sq.ft)</span>
        </div>
        
        <h3 style="margin-top: 2rem;">Recommended Crop Setup</h3>
        <div class="system-grid">
            ${selectedCrops.map(crop => {
                const capacity = hydroData.systemCapacity[systemType][crop];
                const totalPlants = Math.floor(area * capacity / selectedCrops.length);
                
                return `
                <div class="system-card">
                    <h3><span class="icon">🌱</span> ${crop.charAt(0).toUpperCase() + crop.slice(1)}</h3>
                    <div class="metric">
                        <span>Plants Recommended</span>
                        <span>${totalPlants}</span>
                    </div>
                    <div class="metric">
                        <span>Spacing</span>
                        <span>${(12/Math.sqrt(capacity)).toFixed(1)}" apart</span>
                    </div>
                    <div class="nutrient-info">
                        <div class="metric">
                            <span>Nutrient EC</span>
                            <span>${hydroData.nutrients[crop].ec} mS/cm</span>
                        </div>
                        <div class="metric">
                            <span>pH Level</span>
                            <span>${hydroData.nutrients[crop].ph}</span>
                        </div>
                        <div class="metric">
                            <span>NPK Ratio</span>
                            <span>${hydroData.nutrients[crop].npk}</span>
                        </div>
                    </div>
                </div>
                `;
            }).join('')}
        </div>
        
        <div style="margin-top: 2rem; background: #f0f3bd; padding: 1rem; border-radius: 8px;">
            <h3>System Requirements</h3>
            <p>Based on your ${systemType.toUpperCase()} system:</p>
            <ul>
                <li>Water pump: ${calculatePumpSize(area, systemType)}</li>
                <li>Nutrient reservoir: ${calculateReservoirSize(area)} gallons</li>
                <li>Lighting: ${calculateLighting(area, environment)}</li>
            </ul>
        </div>
        
        <div style="margin-top: 2rem; text-align: center;">
            <button onclick="openTab('ar')">View in AR</button>
        </div>
    `;

    function calculatePumpSize(area, systemType) {
        if (systemType === 'aeroponics') return 'High-pressure pump (80-100 PSI)';
        const gph = Math.ceil(area * 0.5);
        return `${gph} GPH submersible pump`;
    }

    function calculateReservoirSize(area) {
        return Math.ceil(area * 0.75);
    }

    function calculateLighting(area, environment) {
        if (environment === 'outdoor') return 'Natural sunlight';
        const watts = area * 30;
        return `${watts}W LED grow lights (full spectrum)`;
    }
});