document.addEventListener("DOMContentLoaded", function () {
    const edaData = JSON.parse(localStorage.getItem("edaData"));
    const reportContainer = document.getElementById("reportContainer");
  
    if (edaData) {
      // Helper function to generate rows with a subtitle column
      function generateDataRow(subtitle, dataObject) {
        return `
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">${subtitle}</td>
            ${Object.values(dataObject ?? {}).map(value => `<td style="border: 1px solid #ddd; padding: 8px;">${value ?? 'N/A'}</td>`).join("")}
          </tr>
        `;
      }
  
      // Dataset Overview Section
      const datasetOverviewTable = `
        <table class="table table-striped">
          <tr>
            <td style="font-weight: bold;">Rows</td>
            <td>${edaData?.dataset_overview?.shape?.[0] ?? 'N/A'}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Columns</td>
            <td>${edaData?.dataset_overview?.shape?.[1] ?? 'N/A'}</td>
          </tr>
        </table>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Metric</th>
              ${Object.keys(edaData?.dataset_overview?.columns ?? {}).map(key => `<th>${key}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${generateDataRow("Columns", edaData?.dataset_overview?.columns)}
            ${generateDataRow("Missing Values", edaData?.dataset_overview?.missing_values)}
            ${generateDataRow("Unique Values", edaData?.dataset_overview?.unique_values)}
          </tbody>
        </table>
      `;
  
      // Descriptive Statistics Section
      const descriptiveStatisticsTable = `
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Metric</th>
              ${Object.keys(edaData?.descriptive_statistics?.numeric_summary?.age ?? {}).map(key => `<th>${key}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${Object.entries(edaData?.descriptive_statistics?.numeric_summary ?? {}).map(
              ([metric, values]) => generateDataRow(metric, values)
            ).join("")}
          </tbody>
        </table>
      `;
  
      // Data Quality Analysis Section
      const dataQualityAnalysisHTML = `
        <div class="card">
          <h3>Data Quality Analysis</h3>
          <p><strong>Duplicates Count:</strong> ${edaData?.data_quality_analysis?.duplicates_count ?? 'N/A'}</p>
  
          <h4>Missing Data Summary (Percentage)</h4>
          <table class="table table-striped">
            <tbody>
              ${Object.entries(edaData?.data_quality_analysis?.missing_data_summary ?? {}).map(
                ([column, percent]) => `
                  <tr>
                    <th>${column}</th>
                    <td>${percent}%</td>
                  </tr>
                `
              ).join("")}
            </tbody>
          </table>
  
          ${edaData?.data_quality_analysis?.missing_data_pattern
            ? `<img src="data:image/png;base64,${edaData.data_quality_analysis.missing_data_pattern}" alt="Missing Data Pattern" class="mx-auto d-block">`
            : "<p class='text-center'>No missing data to visualize.</p>"}
        </div>
      `;
  
      // Outlier Analysis Section
      const outlierAnalysisHTML = `
        <div class="card">
          <h3>Outlier Analysis</h3>
          ${Object.entries(edaData?.outlier_analysis ?? {}).map(([col, info]) => `
            <div class="analysis-item">
              <h4>${col} Outlier Plot</h4>
              <p><strong>Outliers Count:</strong> ${info.iqr_outliers_count ?? 'N/A'}</p>
              <img src="data:image/png;base64,${info.boxplot_image}" alt="${col} Outlier Plot" class="mx-auto d-block">
            </div>
          `).join("")}
        </div>
      `;
  
      // Univariate Analysis Section
      const univariateAnalysisHTML = `
        <div class="card">
          <h3>Univariate Analysis</h3>
          ${Object.entries(edaData?.univariate_analysis?.numeric_analysis ?? {}).map(([col, analysis]) => `
            <div class="analysis-item">
              <h4>${col} Distribution</h4>
              <p><strong>Skewness:</strong> ${analysis.skewness?.toFixed(2) ?? 'N/A'}</p>
              <p><strong>Normality Test p-value:</strong> ${analysis.normality_test_pvalue?.toFixed(4) ?? 'N/A'}</p>
              <p><strong>Is Normal:</strong> ${analysis.is_normal ? "Yes" : "No"}</p>
              <img src="data:image/png;base64,${analysis.distribution_plot}" alt="${col} Distribution Plot" class="mx-auto d-block">
            </div>
          `).join("")}
        </div>
      `;
  
      // Bivariate Analysis Section
      const bivariateAnalysisHTML = `
        <div class="card">
          <h3>Bivariate Analysis</h3>
          ${edaData?.bivariate_analysis?.correlation_matrix
            ? `<img src="data:image/png;base64,${edaData.bivariate_analysis.correlation_matrix}" alt="Correlation Matrix" class="mx-auto d-block">`
            : "<p class='text-center'>No correlation matrix available.</p>"}
        </div>
      `;
  
      // Advanced Correlation Analysis Section
      //const advancedCorrelationHTML = edaData?.advanced_correlation_analysis?.pairplot ? `
        //<div class="card">
          //<h3>Advanced Correlation Analysis</h3>
          //<img src="data:image/png;base64,${edaData.advanced_correlation_analysis.pairplot}" alt="Advanced Correlation Analysis" class="mx-auto d-block">
        //</div>
      //` : '';
  
      // Clustering Analysis Section
      const clusteringAnalysisHTML = edaData?.clustering_analysis?.cluster_plot ? `
        <div class="card">
          <h3>Clustering Analysis</h3>
          <img src="data:image/png;base64,${edaData.clustering_analysis.cluster_plot}" alt="Clustering Analysis" class="mx-auto d-block">
        </div>
      ` : '';
  
      // Data Cleaning Suggestions Section
      const dataCleaningHTML = `
        <div class="card">
          <h3>Data Cleaning Suggestions</h3>
          <ul>
            ${edaData?.data_cleaning_suggestions?.missing_value_imputation?.mean_median?.map(item => `<li>Mean/Median Imputation: ${item}</li>`).join("")}
            ${edaData?.data_cleaning_suggestions?.missing_value_imputation?.mode_forward_fill?.map(item => `<li>Mode/Forward Fill Imputation: ${item}</li>`).join("")}
            ${edaData?.data_cleaning_suggestions?.scaling_normalization?.map(item => `<li>Scaling/Normalization: ${item}</li>`).join("")}
          </ul>
        </div>
      `;
  
      // Feature Engineering Suggestions Section
      const featureEngineeringHTML = `
        <div class="card">
          <h3>Feature Engineering Suggestions</h3>
          <ul>
            ${edaData?.feature_engineering_suggestions?.encoding?.map(item => `<li>Encoding: ${item}</li>`).join("")}
            ${edaData?.feature_engineering_suggestions?.transformation?.map(item => `<li>Transformation: ${item}</li>`).join("")}
          </ul>
        </div>
      `;
  
      // Build the full HTML with sections
      reportContainer.innerHTML = `
        <div class="container">
          <div class="row">
            <div class="col-12">
              <div class="card">
                <h3>Dataset Overview</h3>
                ${datasetOverviewTable}
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="card">
                <h3>Descriptive Statistics</h3>
                ${descriptiveStatisticsTable}
              </div>
            </div>
          </div>
          ${dataQualityAnalysisHTML}
          ${outlierAnalysisHTML}
          ${univariateAnalysisHTML}
          ${bivariateAnalysisHTML}
          ${clusteringAnalysisHTML}
          ${dataCleaningHTML}
          ${featureEngineeringHTML}
        </div>
      `;
    } else {
      reportContainer.innerHTML = "<p>No EDA data found. Please upload a CSV file first.</p>";
    }
  });

// Ensure the script runs after the DOM has fully loaded
window.onload = function() {
    const element = document.getElementById('reportContainer'); // Replace 'content' with your main container's ID
    const generatePDFButton = document.getElementById('generatePDF'); // Replace with your button's ID

    generatePDFButton.addEventListener('click', () => {
        // Configure and initiate PDF generation with html2pdf.js
        html2pdf().from(element).set({
            margin: 0.5, // Adjust as needed
            filename: 'report.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        }).save();
    });
};

// Login Event Listener
document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (data.success) {
        localStorage.setItem("token", data.data.access);
        window.location.href = "upload_csv.html"; // Redirect to CSV upload page
    } else {
        alert("Login failed: " + data.message);
    }
});

// Signup Event Listener



// Logout function
function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html"; // Redirect to login page
}
