 // Database of skin conditions
 const skinConditions = [
    {
        id: 1,
        name: "Acne Vulgaris",
        description: "Inflammatory condition with pimples, blackheads, and whiteheads.",
        causes: "Excess oil production, bacteria, inflammation, and clogged pores",
        treatment: "Topical retinoids (adapalene, tretinoin), benzoyl peroxide, salicylic acid, antibiotics for severe cases",
        symptoms: ["red", "bumps", "oily", "face", "chest", "back"],
        commonAge: "teens, young adults"
    },
    {
        id: 2,
        name: "Eczema (Atopic Dermatitis)",
        description: "Chronic inflammatory skin condition causing dry, itchy, and red skin.",
        causes: "Immune system dysfunction, genetic factors, environmental triggers",
        treatment: "Moisturizers, topical corticosteroids, antihistamines for itching, avoiding triggers",
        symptoms: ["dry", "red", "itchy", "face", "joints", "hands", "chronic"],
        commonAge: "all ages, often begins in childhood"
    },
    {
        id: 3,
        name: "Psoriasis",
        description: "Autoimmune condition causing rapid skin cell growth and scaling.",
        causes: "Immune system dysfunction, genetic factors, environmental triggers",
        treatment: "Topical corticosteroids, vitamin D analogs, phototherapy, biologics for severe cases",
        symptoms: ["red", "scaly", "itchy", "pain", "joints", "scalp", "chronic"],
        commonAge: "adults, can appear at any age"
    },
    {
        id: 4,
        name: "Rosacea",
        description: "Chronic inflammatory condition causing facial redness and visible blood vessels.",
        causes: "Blood vessel abnormalities, genetic factors, environmental triggers",
        treatment: "Topical metronidazole, azelaic acid, oral antibiotics, laser therapy for blood vessels",
        symptoms: ["red", "face", "bumps", "chronic"],
        commonAge: "middle-aged adults"
    },
    {
        id: 5,
        name: "Contact Dermatitis",
        description: "Skin inflammation caused by direct contact with irritants or allergens.",
        causes: "Direct contact with irritants (soaps, chemicals) or allergens (poison ivy, nickel)",
        treatment: "Avoiding triggers, topical corticosteroids, antihistamines for itching",
        symptoms: ["red", "itchy", "blisters", "pain", "swelling", "days", "weeks"],
        commonAge: "all ages"
    },
    {
        id: 6,
        name: "Fungal Infection (Tinea)",
        description: "Fungal skin infection causing red, itchy, scaly patches.",
        causes: "Dermatophyte fungi, warm/moist environments, direct contact",
        treatment: "Topical antifungals (clotrimazole, miconazole), oral antifungals for severe cases",
        symptoms: ["red", "itchy", "scaly", "circular", "spreading", "groin", "feet"],
        commonAge: "all ages"
    },
    {
        id: 7,
        name: "Urticaria (Hives)",
        description: "Raised, itchy welts on the skin that can appear and disappear quickly.",
        causes: "Allergic reactions, physical stimuli (heat, cold, pressure), medications, infections",
        treatment: "Antihistamines, avoiding triggers, corticosteroids for severe cases",
        symptoms: ["red", "itchy", "swelling", "widespread", "days"],
        commonAge: "all ages"
    },
    {
        id: 8,
        name: "Seborrheic Dermatitis",
        description: "Inflammatory skin condition causing scaly patches and red skin, often on the scalp.",
        causes: "Malassezia yeast, genetic factors, stress, hormonal changes",
        treatment: "Antifungal shampoos (ketoconazole), mild corticosteroids, regular cleansing",
        symptoms: ["dry", "scaly", "red", "oily", "scalp", "face"],
        commonAge: "adults, especially during stress"
    }
];

// DOM Elements
const analyzeBtn = document.getElementById('analyze-btn');
const loadingSection = document.getElementById('loading');
const resultsSection = document.getElementById('results');
const matchesContainer = document.getElementById('matches-container');
const conditionDetails = document.getElementById('condition-details');
const conditionName = document.getElementById('condition-name');
const conditionDescription = document.getElementById('condition-description');
const conditionCauses = document.getElementById('condition-causes');
const conditionTreatment = document.getElementById('condition-treatment');

// Event Listeners
analyzeBtn.addEventListener('click', analyzeSymptoms);

// Functions
function analyzeSymptoms() {
    // Get all selected symptoms
    const selectedSymptoms = [];
    document.querySelectorAll('.symptom-checkbox:checked').forEach(checkbox => {
        selectedSymptoms.push(checkbox.value);
    });
    
    // Get location and duration
    const location = document.getElementById('location-select').value;
    const duration = document.getElementById('duration-select').value;
    
    if (selectedSymptoms.length === 0 && !location) {
        alert('Please select at least one symptom or location.');
        return;
    }
    
    // Add location and duration to symptoms if selected
    if (location) selectedSymptoms.push(location);
    if (duration) selectedSymptoms.push(duration);
    
    // Show loading
    loadingSection.style.display = 'block';
    resultsSection.style.display = 'none';
    
    // Simulate processing delay
    setTimeout(() => {
        // Calculate matches based on symptom overlap
        const matches = calculateMatches(selectedSymptoms);
        
        // Display matches
        displayMatches(matches);
        
        // Hide loading, show results
        loadingSection.style.display = 'none';
        resultsSection.style.display = 'block';
    }, 1500);
}

function calculateMatches(selectedSymptoms) {
    const matches = [];
    
    skinConditions.forEach(condition => {
        // Count how many symptoms match
        let matchCount = 0;
        selectedSymptoms.forEach(symptom => {
            if (condition.symptoms.includes(symptom)) {
                matchCount++;
            }
        });
        
        // Calculate match percentage
        const matchPercentage = selectedSymptoms.length > 0 
            ? Math.round((matchCount / condition.symptoms.length) * 100) 
            : 0;
        
        // Only add if there's at least some match
        if (matchPercentage > 0) {
            matches.push({
                ...condition,
                matchPercentage
            });
        }
    });
    
    // Sort by match percentage (descending)
    return matches.sort((a, b) => b.matchPercentage - a.matchPercentage);
}

function displayMatches(matches) {
    matchesContainer.innerHTML = '';
    
    if (matches.length === 0) {
        matchesContainer.innerHTML = '<p>No matches found for the selected symptoms. Please try selecting different symptoms or consult a healthcare professional.</p>';
        conditionDetails.style.display = 'none';
        return;
    }
    
    matches.forEach(match => {
        const matchElement = document.createElement('div');
        matchElement.className = 'condition-match';
        matchElement.innerHTML = `
            <div>${match.name}</div>
            <div class="condition-match-percentage">${match.matchPercentage}% match</div>
        `;
        
        // Add click event to show details
        matchElement.addEventListener('click', () => {
            showConditionDetails(match);
        });
        
        matchesContainer.appendChild(matchElement);
    });
    
    // Show details of the best match by default
    showConditionDetails(matches[0]);
}

function showConditionDetails(condition) {
    conditionName.textContent = condition.name;
    conditionDescription.textContent = condition.description;
    conditionCauses.textContent = condition.causes;
    conditionTreatment.textContent = condition.treatment;
    
    conditionDetails.style.display = 'block';
    
    // Highlight the selected condition in the list
    document.querySelectorAll('.condition-match').forEach(match => {
        if (match.querySelector('div').textContent === condition.name) {
            match.style.backgroundColor = '#e0e7ff';
        } else {
            match.style.backgroundColor = 'transparent';
        }
    });
}