// assets/js/risks.js
document.addEventListener('DOMContentLoaded', function () {
  // --- Elements/selectors ---
  const navButtons = document.querySelectorAll('#navigation .nav-button');
  const sections = document.querySelectorAll('.content-section');
  const filterAllBtn = document.getElementById('filter-all');
  const filterHighBtn = document.getElementById('filter-high');
  const flowchart = document.getElementById('flowchart');
  const flowchartDetails = document.getElementById('flowchart-details');
  const complaintsSlider = document.getElementById('complaints-slider');

  // --- Data ---
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
      text: "If the investigation confirms that the facility is violating regulations (e.g., 'failure to control fugitive dust' or 'creating a public nuisance'), the agency issues a formal Notice of Violation."
    },
    action: {
      title: "Corrective Action & Enforcement",
      text: "The facility is required to submit and implement a corrective action plan, which could include water sprays, covering piles, or installing windbreaks. Failure to comply can result in fines or further legal action."
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
      hoverOffset: 6
    }]
  };

  // chart instances
  let cancerChart = null;
  let riskChart = null;

  // --- Helpers / Init ---
  function showSection(targetId) {
    sections.forEach(s => {
      if (s.id === targetId) {
        s.classList.remove('d-none');
      } else {
        s.classList.add('d-none');
      }
    });
    // update nav active button styles
    navButtons.forEach(btn => {
      if (btn.dataset.target === targetId) {
        btn.classList.remove('btn-outline-secondary');
        btn.classList.add('btn-primary');
      } else {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline-secondary');
      }
    });
  }

  // Navigation clicks
  navButtons.forEach(btn => {
    btn.addEventListener('click', (ev) => {
      const target = btn.dataset.target;
      showSection(target);
    });
  });

  // --- Charts ---
  function createCancerChart() {
    const ctx = document.getElementById('cancerTypesChart').getContext('2d');
    if (cancerChart) cancerChart.destroy();
    cancerChart = new Chart(ctx, {
      type: 'doughnut',
      data: cancerTypesData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                return `${label}: ${value}%`;
              }
            }
          }
        }
      }
    });
  }

  function createRiskChart(filter = 'all') {
    const ctx = document.getElementById('riskByIndustryChart').getContext('2d');
    if (riskChart) riskChart.destroy();

    // deep copy
    let dataCopy = JSON.parse(JSON.stringify(riskChartData));

    if (filter === 'high') {
      const highIdx = dataCopy.datasets[0].data.map((v,i) => v > 10 ? i : -1).filter(i => i !== -1);
      dataCopy.labels = highIdx.map(i => dataCopy.labels[i]);
      dataCopy.datasets.forEach(ds => {
        ds.data = highIdx.map(i => ds.data[i]);
        ds.backgroundColor = highIdx.map(i => ds.backgroundColor[i]);
      });
    }

    riskChart = new Chart(ctx, {
      type: 'bar',
      data: dataCopy,
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true,
            title: { display: true, text: 'Odds Ratio (Increased Risk)' }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                const val = context.raw;
                return ` Odds Ratio: ${val}. An OR of ${val} represents a ${val}-fold increased risk vs unexposed population.`;
              }
            }
          }
        }
      }
    });
  }

  // Filter buttons
  function markFilter(activeBtn) {
    // only affect filter buttons
    document.querySelectorAll('.filter-btn').forEach(b => {
      b.classList.remove('btn-brown', 'text-white');
      b.classList.add('btn-outline-secondary');
    });
    activeBtn.classList.remove('btn-outline-secondary');
    activeBtn.classList.add('btn-brown', 'text-white');
  }

  filterAllBtn.addEventListener('click', function () {
    markFilter(filterAllBtn);
    createRiskChart('all');
  });

  filterHighBtn.addEventListener('click', function () {
    markFilter(filterHighBtn);
    createRiskChart('high');
  });

  // --- Complaints slider with fade ---
  function setupComplaintsSlider() {
    let idx = 0;
    let currentEl = null;
    const total = complaintData.length;

    function show(index) {
      const c = complaintData[index];
      const el = document.createElement('div');
      el.className = 'complaint-slide';
      el.innerHTML = `<p class="fst-italic text-muted text-center">"${escapeHtml(c.quote)}"</p>
                      <p class="fw-semibold small text-secondary mt-2">- ${escapeHtml(c.source)}</p>`;
      // append then allow transition
      complaintsSlider.appendChild(el);

      // force reflow then show
      requestAnimationFrame(() => el.classList.add('visible'));

      // remove previous after transition
      if (currentEl && currentEl !== el) {
        currentEl.classList.remove('visible');
        // remove after transition time
        setTimeout(() => {
          if (currentEl && currentEl.parentElement) currentEl.parentElement.removeChild(currentEl);
        }, 500);
      }
      currentEl = el;
    }

    function next() {
      idx = (idx + 1) % total;
      show(idx);
    }

    // show first
    show(idx);
    setInterval(next, 6000);
  }

  // safe escaping for inserted text
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (m) {
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m];
    });
  }

  // --- Flowchart clicks ---
  function setupFlowchart() {
    flowchart.addEventListener('click', function (ev) {
      const step = ev.target.closest('.flowchart-step');
      if (!step) return;
      const id = step.dataset.id;
      const data = flowchartData[id];
      if (!data) return;

      // toggle active class
      flowchart.querySelectorAll('.flowchart-step').forEach(s => s.classList.remove('active'));
      step.classList.add('active');

      flowchartDetails.innerHTML = `<h6 class="text-brown">${escapeHtml(data.title)}</h6><p class="text-muted mt-2">${escapeHtml(data.text)}</p>`;
    });
  }

  // --- Tooltips (Bootstrap) ---
  function enableTooltips() {
    const tipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tipTriggerList.map(function (el) {
      return new bootstrap.Tooltip(el);
    });
  }

  // --- initialize everything ---
  function init() {
    // set initial filter state
    markFilter(filterAllBtn);
    createCancerChart();
    createRiskChart('all');
    setupComplaintsSlider();
    setupFlowchart();
    enableTooltips();
  }

  // show default first section (overview)
  showSection('overview');
  init();
});
