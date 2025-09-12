// UPDATE THE YEAR
  document.getElementById('current-year').textContent = new Date().getFullYear();
//JS FOR HEALTH RISKS PAGE 

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
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('bg-[#A67B5B]', 'text-white'));
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.add('bg-gray-200', 'text-gray-700'));
        e.target.classList.add('bg-[#A67B5B]', 'text-white');
        e.target.classList.remove('bg-gray-200', 'text-gray-700');
        createRiskByIndustryChart('all');
    });

    document.getElementById('filter-high').addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('bg-[#A67B5B]', 'text-white'));
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.add('bg-gray-200', 'text-gray-700'));
        e.target.classList.add('bg-[#A67B5B]', 'text-white');
        e.target.classList.remove('bg-gray-200', 'text-gray-700');
        createRiskByIndustryChart('high');
    });
    
    function setupComplaintsSlider() {
        const slider = document.getElementById('complaints-slider');
        let currentIndex = 0;

        function showComplaint(index) {
            const complaint = complaintData[index];
            slider.innerHTML = `
                <div class="absolute inset-0 flex flex-col items-center justify-center p-4 text-center transition-opacity duration-500 ease-in-out opacity-0" id="complaint-${index}">
                    <p class="text-gray-700 italic">"${complaint.quote}"</p>
                    <p class="mt-2 text-sm font-semibold text-gray-500">- ${complaint.source}</p>
                </div>
            `;
            setTimeout(() => {
                  const el = document.getElementById(`complaint-${index}`);
                  if(el) el.style.opacity = 1;
            }, 50);
        }

        function nextComplaint() {
            currentIndex = (currentIndex + 1) % complaintData.length;
            showComplaint(currentIndex);
        }

        showComplaint(currentIndex);
        setInterval(nextComplaint, 6000);
    }

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
                    <h4 class="font-bold text-lg text-[#A67B5B]">${stepData.title}</h4>
                    <p class="mt-2 text-gray-700">${stepData.text}</p>
                `;
            }
        });
    }

    init();
});