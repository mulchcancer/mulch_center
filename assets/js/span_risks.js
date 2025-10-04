document.addEventListener('DOMContentLoaded', function () {
    const navigation = document.getElementById('navigation');
    const contentContainer = document.getElementById('content-container');
    const sections = contentContainer.querySelectorAll('.content-section');
    const navButtons = navigation.querySelectorAll('.nav-button');
    let cancerTypesChartInstance, riskByIndustryChartInstance;

    // --- SPANISH DATA TRANSLATION ---
    const complaintData = [
        { quote: "Una capa de polvo marrón cubre todo afuera... mi auto, mis ventanas, mis muebles de patio. Estoy constantemente limpiando.", source: "Residente A, Audiencia Pública" },
        { quote: "El asma de mi hijo ha empeorado significativamente desde que la planta de mantillo expandió sus operaciones. No podemos dejarlo jugar afuera en días ventosos.", source: "Residente B, Presentación de Quejas" },
        { quote: "El olor es una cosa, pero es la nube de polvo visible lo que me preocupa. ¿Qué estamos respirando todos los días?", source: "Residente C, Informe de Noticias" },
        { quote: "Tuvimos que reemplazar nuestros filtros de aire el doble de veces. El técnico de HVAC dijo que nunca había visto tanta materia particulada fina.", source: "Residente D, Reunión Comunitaria" }
    ];

    const flowchartData = {
        complaint: {
            title: "1. Queja De Residente",
            text: "Un residente documenta el problema (por ejemplo, fotos, videos, registros de fechas/horas) y presenta una queja formal ante la agencia estatal de protección ambiental o la junta local de calidad del aire, citando molestias, daños a la propiedad o preocupaciones de salud."
        },
        investigation: {
            title: "2. Investigación De La Agencia",
            text: "Un inspector visita el sitio y el vecindario circundante para verificar la queja. Pueden realizar un monitoreo de la calidad del aire, revisar el plan de control de polvo de la instalación y documentar evidencia visible de polvo que abandona la línea de propiedad."
        },
        violation: {
            title: "3. Aviso De Violación (NOV)",
            text: "Si la investigación confirma que la instalación está violando las regulaciones (por ejemplo, 'falta de control de polvo fugitivo' o 'creación de una molestia pública'), la agencia emite un Aviso formal de Violación, detallando las infracciones específicas observadas."
        },
        action: {
            title: "4. Acción Correctiva Y Aplicación",
            text: "Se requiere que la instalación presente e implemente un plan de acción correctiva, que podría incluir el uso de aerosoles de agua, cubrir pilas o instalar barreras contra el viento. El incumplimiento puede resultar en multas, sanciones o acciones legales adicionales."
        }
    };

    const riskChartData = {
        labels: ['Ebanistería/Fabricación de Muebles', 'Aserraderos', 'Carpintería/Ebanistería', 'Contrachapado/Aglomerado', 'Silvicultura/Tala', 'Fábricas de Pulpa/Papel'],
        datasets: [{
            label: 'Relación de Probabilidades para el Cáncer Sino-nasal',
            data: [45.5, 12.8, 11.3, 5.1, 2.5, 1.2],
            backgroundColor: ['#A67B5B', '#A67B5B', '#A67B5B', '#C8A98F', '#C8A98F', '#EFEBE7'],
            borderColor: '#FFFFFF',
            borderWidth: 1
        }]
    };

    const cancerTypesData = {
        labels: ['Adenocarcinoma Sino-nasal', 'Otros Cánceres Sino-nasales', 'Nasofaríngeo', 'Laríngeo'],
        datasets: [{
            label: 'Tipos de Cáncer Asociados',
            data: [65, 20, 10, 5],
            backgroundColor: ['#A67B5B', '#C8A98F', '#E1D3C5', '#F5F1EC'],
            hoverOffset: 4
        }]
    };
    // --- END SPANISH DATA TRANSLATION ---
    
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
                            // TRANSLATION: Odds Ratio (Increased Risk)
                            text: 'Relación de Probabilidades (Riesgo Aumentado)' 
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
                                // TRANSLATION: Odds Ratio: X. An OR of X represents a X-fold increased risk compared to an unexposed population.
                                return ` Relación de Probabilidades: ${context.raw}. Un OR de ${context.raw} representa un riesgo ${context.raw} veces mayor en comparación con una población no expuesta.`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // NOTE: Filter buttons now use custom-bg-brown, etc. from the CSS
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
    
    // --- CORRECTED SLIDER FUNCTION ---
    function setupComplaintsSlider() {
        const slider = document.getElementById('complaints-slider');
        let currentIndex = 0;
        const intervalDuration = 6000; 
        const fadeDuration = 600;      

        function createComplaintElement(complaint, index) {
            const div = document.createElement('div');
            div.id = `complaint-${index}`;
            
            div.className = 'position-absolute top-0 bottom-0 start-0 end-0 d-flex flex-column align-items-center justify-content-center p-4 text-center custom-complaint-transition';
            
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
                currentEl.style.opacity = 0;

                setTimeout(() => {
                    slider.removeChild(currentEl);
                    slider.appendChild(newEl);

                    setTimeout(() => {
                        newEl.style.opacity = 1;
                    }, 50); 
                }, fadeDuration);

            } else {
                // Initial load
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

        showComplaint(currentIndex);
        setInterval(nextComplaint, intervalDuration);
    }
    // --- END CORRECTED SLIDER FUNCTION ---


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