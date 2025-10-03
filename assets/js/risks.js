document.addEventListener('DOMContentLoaded', function () {
    const navigation = document.getElementById('navigation');
    const contentContainer = document.getElementById('content-container');
    const sections = contentContainer.querySelectorAll('.content-section');
    const navButtons = navigation.querySelectorAll('.nav-button');
    let cancerTypesChartInstance, riskByIndustryChartInstance;

    // ... all your complaintData, flowchartData, riskChartData, etc. ...

    const flowchartData = {
        // ... data ...
    };

    // ... all your functions (init, setupNavigation, createCancerTypesChart, etc.) ...
    function setupNavigation() {
        navigation.addEventListener('click', (e) => {
            // ... logic ...
        });
    }

    // ... other functions ...

    init();
});