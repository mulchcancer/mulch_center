document.addEventListener('DOMContentLoaded', function () {
  const navigation = document.getElementById('navigation');
  const contentContainer = document.getElementById('content-container');
  const sections = contentContainer.querySelectorAll('.content-section');
  const navButtons = navigation.querySelectorAll('.nav-button');
  let cancerTypesChartInstance, riskByIndustryChartInstance;

  const complaintData = [
    { quote: "A layer of brown dust covers everything outside...", source: "Resident A, Public Hearing" },
    { quote: "My son's asthma has gotten significantly worse...", source: "Resident B, Complaint Filing" },
    { quote: "The smell is one thing, but it's the visible dust cloud...", source: "Resident C, News Report" },
    { quote: "We've had to replace our air filters twice as often...", source: "Resident D, Community Meeting" }
  ];

  const flowchartData = {
    complaint: { title: "Resident Complaint", text: "A resident documents the issue..." },
    investigation: { title: "Agency Investigation", text: "An inspector visits the site..." },
    violation: { title: "Notice of Violation (NOV)", text: "If the investigation confirms..." },
    action: { title: "Corrective Action & Enforcement", text: "The facility is required..." }
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
      data: [65, 20, 10, 5],
      backgroundColor: ['#A67B5B', '#C8A98F', '#E1D3C5', '#F5F1EC']
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

        sections.forEach(section => section.classList.add('d-none'));
        document.getElementById(targetId).classList.remove('d-none');
      }
    });
  }

  function createCancerTypesChart() {
    const ctx = document.getElementById('cancerTypesChart').getContext('2d');
    if (cancerTypesChartInstance) cancerTypesChartInstance.destroy();
    cancerTypesChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: cancerTypesData,
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  function createRiskByIndustryChart(filter = 'all') {
    const ctx = document.getElementById('riskByIndustryChart').getContext('2d');
    if (riskByIndustryChartInstance) riskByIndustryChartInstance.destroy();

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
      options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false }
    });
  }

  document.getElementById('filter-all').addEventListener('click', (e) => {
    document.querySelectorAll('.btn').forEach(btn => btn.classList.remove('btn-brown', 'text-white'));
    document.querySelectorAll('.btn').forEach(btn => btn.classList.add('btn-outline-secondary'));
    e.target.classList.add('btn-brown', 'text-white');
    e.target.classList.remove('btn-outline-secondary');
    createRiskByIndustryChart('all');
  });

  document.getElementById('filter-high').addEventListener('click', (e) => {
    document.querySelectorAll('.btn').forEach(btn => btn.classList.remove('btn-brown', 'text-white'));
    document.querySelectorAll('.btn').forEach(btn => btn.classList.add('btn-outline-secondary'));
    e.target.classList.add('btn-brown', 'text-white');
    e.target.classList.remove('btn-outline-secondary');
    createRiskByIndustryChart('high');
  });

  function setupComplaintsSlider() {
    const slider = document.getElementById('complaints-slider');
    let currentIndex = 0;

    function showComplaint(index) {
      const complaint = complaintData[index];
      slider.innerHTML = `
        <div class="position-absolute w-100 h-100 d-flex flex-column justify-content-center align-items-center p-3 fade">
          <p class="fst-italic text-muted text-center">"${complaint.quote}"</p>
          <p class="fw-semibold small text-secondary">- ${complaint.source}</p>
        </div>`;
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

        detailsContainer.innerHTML = `<h6 class="text-brown">${stepData.title}</h6><p class="text-muted">${stepData.text}</p>`;
      }
    });
  }

  init();
});
