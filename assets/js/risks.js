document.addEventListener('DOMContentLoaded', function () {
    const navigation = document.getElementById('navigation');
    const contentContainer = document.getElementById('content-container');
    const sections = contentContainer.querySelectorAll('.content-section');
    const navButtons = navigation.querySelectorAll('.nav-button');
    let cancerTypesChartInstance, riskByIndustryChartInstance;

    const complaintData = [
        { quote: "A layer of brown dust covers everything outside... my car, my windows, my patio furniture. I'm constantly cleaning.", source: "Resident A, Public Hearing" },
        { quote: "My son's asthma has gotten significantly worse since the mulch plant expanded its operations. We can't let him play outside on windy days.", source: "Resident B, Complaint Filing" },
        { quote: "The smell is one thing, but it's the visible dust cloud that worries me. What are we breathing in every day?", source: "Resident C, News Report" },
        { quote: "We've had to replace our air filters twice as often. The HVAC technician said he's never seen so much fine particulate matter.", source: "Resident D, Community Meeting" }
    ];

    const flowchartData = {
        complaint: {
            title: "Resident Complaint",
            text: "A resident documents the issue (e.g., photos, videos, logs of dates/times) and files a formal complaint with the state's environmental protection agency or local air quality board, citing nuisance, property damage, or health concerns."
        },
        investigation: {
            title: "Agency Investigation",
            text: "An inspector visits the site and surrounding neighborhood to verify the complaint. They may conduct air quality monitoring, review the facility's dust control plan, and document visible evidence of dust leaving the property line."
        },
        violation: {
            title: "Notice of Violation (NOV)",
            text: "If the investigation confirms that the facility is violating regulations (e.g., 'failure to control fugitive dust' or 'creating a public nuisance'), the agency issues a formal Notice of Violation, detailing the specific infractions observed."
        },
        action: {
            title: "Corrective Action & Enforcement",
            text: "The facility is required to submit and implement a corrective action plan, which could include using water sprays, covering piles, or installing windbreaks. Failure to comply can result in fines, penalties, or further legal action."
        }
    };

    const riskChartData = {
        labels: ['Cabinet/Furniture Making', 'Sawmills', 'Carpentry/Joinery', 'Plywood/Particleboard', 'Forestry/Logging', 'Pulp/Paper Mills'],
        datasets: [{
            label: 'Odds Ratio for Sino-nasal Cancer',
            data: [45.5, 12.8, 11.3, 5.1, 2.5, 1.2],
            backgroundColor: ['#A67B5B', '#A67B5B', '#A67B5B', '#C8A98F', '#C8A98F', '#EFEBE7'],
            borderColor: '#FFFFFF',
            borderWidth: 1
        }]
    };

    const cancerTypesData = {
        labels: ['Sino-nasal adenocarcinoma', 'Other Sino-nasal cancers', 'Nasopharyngeal', 'Laryngeal'],
        datasets: [{
            label: 'Associated Cancer Types',
            data: [65, 20, 10, 5],
            backgroundColor: ['#A67B5B', '#C8A98F', '#E1D3C5', '#F5F1EC'],
            hoverOffset: 4
        }]
    };

    function init() {
        setupNavigation();
        setupFlowchart();
        setupComplaintsSlider();
        createCancerTypesChart();
        createRiskByIndustryChart();
    }

    function setupNavigation() {
        navigation.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-button')) {
                const targetId = e.target.dataset.target;
                
                navButtons.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');

                sections.forEach(section => {
                    section.classList.remove('active');
                    if (section.id === targetId) {
                        section.classList.add('active');
                    }
                });
            }
        });
    }

    function createCancerTypesChart() {
        const ctx = document.getElementById('cancerTypesChart').getContext('2d');
        if (cancerTypesChartInstance) {
            cancerTypesChartInstance.destroy();
        }
        cancerTypesChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: cancerTypesData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed !== null) {
                                    label += context.parsed + '%';
                                }
                                return label;
                            }
                        }
                    }
                }
            },
        });
    }

    function createRiskByIndustryChart(filter = 'all') {
        const ctx = document.getElementById('riskByIndustryChart').getContext('2d');
        if (riskByIndustryChartInstance) {
            riskByIndustryChartInstance.destroy();
        }

        let filteredData = JSON.parse(JSON.stringify(riskChartData));
        if (filter === 'high') {
            const highRiskIndices = filteredData.datasets[0].data.map((val, i) => val > 10 ? i : -1).filter(i => i !== -1);
            filteredData.labels = highRiskIndices.map(i => filteredData.labels[i]);
            filteredData.datasets.forEach(ds => {
                ds.data = highRiskIndices.map(i => ds.data[i]);
                ds.backgroundColor = highRiskIndices.map(i => ds.backgroundColor[i]);
            });
        }

        riskByIndustryChartInstance = new Chart(ctx, {
            type: 'bar',
            data: filteredData,
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Odds Ratio (Increased Risk)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return ` Odds Ratio: ${context.raw}. An OR of ${context.raw} represents a ${context.raw}-fold increased risk compared to an unexposed population.`;
                            }
                        }
                    }
                }
            }
        });
    }

    document.getElementById('filter-all').addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('custom-bg-brown', 'text-white');
            btn.classList.add('bg-light', 'text-secondary'); 
        });
        e.target.classList.add('custom-bg-brown', 'text-white');
        e.target.classList.remove('bg-light', 'text-secondary');
        createRiskByIndustryChart('all');
    });

    document.getElementById('filter-high').addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('custom-bg-brown', 'text-white');
            btn.classList.add('bg-light', 'text-secondary');
        });
        e.target.classList.add('custom-bg-brown', 'text-white');
        e.target.classList.remove('bg-light', 'text-secondary');
        createRiskByIndustryChart('high');
    });
    
    function setupComplaintsSlider() {
    const slider = document.getElementById('complaints-slider');
    let currentIndex = 0;

    function showComplaint(index) {
        const complaint = complaintData[index];
        const isInitialLoad = slider.querySelector(`#complaint-${index}`) === null;

        // 1. Create the new element with text and an initial opacity of 0
        slider.innerHTML = `
            <div class="position-absolute top-0 bottom-0 start-0 end-0 d-flex flex-column align-items-center justify-content-center p-4 text-center custom-complaint-transition opacity-0" id="complaint-${index}">
                <p class="text-secondary fst-italic">"${complaint.quote}"</p>
                <p class="mt-2 small fw-semibold text-secondary">- ${complaint.source}</p>
            </div>
        `;
        
        // 2. Find the newly inserted element
        const el = document.getElementById(`complaint-${index}`);

        // 3. Use a slight delay to allow the browser to render the element 
        //    before transitioning its opacity. This is crucial for CSS transitions on new elements.
        setTimeout(() => {
             // If it's the first load, set opacity to 1 immediately for a blank-space-free start.
             // Otherwise, rely on the CSS transition for a smooth fade-in.
             el.style.opacity = 1;
        }, 50); // 50ms is enough for the browser to register the element
    }

// ... (Keep the rest of your JS code above this function unchanged) ...

function setupComplaintsSlider() {
    const slider = document.getElementById('complaints-slider');
    let currentIndex = 0;
    const intervalDuration = 6000; // Total time per slide
    const fadeDuration = 600;      // Must be slightly longer than the CSS transition (500ms)

    function createComplaintElement(complaint, index) {
        const div = document.createElement('div');
        div.id = `complaint-${index}`;
        
        // Use Bootstrap classes and the custom transition class
        div.className = 'position-absolute top-0 bottom-0 start-0 end-0 d-flex flex-column align-items-center justify-content-center p-4 text-center custom-complaint-transition';
        
        // Start hidden
        div.style.opacity = 0; 

        div.innerHTML = `
            <p class="text-secondary fst-italic">"${complaint.quote}"</p>
            <p class="mt-2 small fw-semibold text-secondary">- ${complaint.source}</p>
        `;
        return div;
    }

    function showComplaint(index) {
        const complaint = complaintData[index];
        const newEl = createComplaintElement(complaint, index);
        const currentEl = slider.querySelector('.custom-complaint-transition');
        
        if (currentEl) {
            // 1. Start the fade-out of the current element
            currentEl.style.opacity = 0;

            // 2. Wait for the fade-out to complete
            setTimeout(() => {
                // 3. Remove the old element from the DOM
                slider.removeChild(currentEl);
                
                // 4. Add the new element (still hidden at opacity 0)
                slider.appendChild(newEl);

                // 5. Use requestAnimationFrame/setTimeout for smooth fade-in
                //    This tells the browser: "Wait one drawing cycle, THEN set opacity to 1."
                setTimeout(() => {
                    newEl.style.opacity = 1;
                }, 50); // Small delay to ensure the element is painted before transition starts

            }, fadeDuration);

        } else {
            // Initial load: Add the first element immediately and fade it in
            slider.appendChild(newEl);
            setTimeout(() => {
                newEl.style.opacity = 1;
            }, 50);
        }
        }

        function nextComplaint() {
            currentIndex = (currentIndex + 1) % complaintData.length;
            showComplaint(currentIndex);
        }

        // Initialize with the first complaint
        showComplaint(currentIndex);
        
        // Set the continuous interval
        setInterval(nextComplaint, intervalDuration);
    }

// ... (Keep the rest of your JS code below this function unchanged) ...

    function setupFlowchart() {
        const flowchart = document.getElementById('flowchart');
        const detailsContainer = document.getElementById('flowchart-details');

        flowchart.addEventListener('click', (e) => {
            const stepElement = e.target.closest('.flowchart-step');
            if (stepElement) {
                const stepId = stepElement.dataset.id;
                const stepData = flowchartData[stepId];

                flowchart.querySelectorAll('.flowchart-step').forEach(el => el.classList.remove('active'));
                stepElement.classList.add('active');

                detailsContainer.innerHTML = `
                    <h4 class="fw-bold h5 custom-text-brown">${stepData.title}</h4>
                    <p class="mt-2 text-secondary">${stepData.text}</p>
                `;
            }
        });
    }

    init();
});