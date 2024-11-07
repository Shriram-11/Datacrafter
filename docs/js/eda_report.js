document.addEventListener("DOMContentLoaded", function () {
    const edaData = JSON.parse(localStorage.getItem("edaData"));
    const reportContainer = document.getElementById("reportContainer");
  
    if (edaData) {
      // Helper function to generate rows with a subtitle column
      function generateDataRow(subtitle, dataObject) {
        return `
          <tr>
            <td class="font-weight-bold">${subtitle}</td>
            ${Object.values(dataObject ?? {}).map(value => `<td>${value ?? 'N/A'}</td>`).join("")}
          </tr>
        `;
      }
  
      // Dataset Overview Section
      const datasetOverviewTable = `
        <table class="table table-bordered">
          <tr>
            <td class="font-weight-bold">Rows</td>
            <td>${edaData?.dataset_overview?.shape?.[0] ?? 'N/A'}</td>
          </tr>
          <tr>
            <td class="font-weight-bold">Columns</td>
            <td>${edaData?.dataset_overview?.shape?.[1] ?? 'N/A'}</td>
          </tr>
        </table>
        <table class="table table-bordered">
          <thead class="thead-dark">
            <tr>
              <th>Column</th>
              <th>Data Type</th>
              <th>Missing Values</th>
              <th>Unique Values</th>
            </tr>
          </thead>
          <tbody>
            ${Object.keys(edaData?.dataset_overview?.columns ?? {}).map(column => `
              <tr>
                <td>${column}</td>
                <td>${edaData?.dataset_overview?.columns[column] ?? 'N/A'}</td>
                <td>${edaData?.dataset_overview?.missing_values?.[column] ?? 'N/A'}</td>
                <td>${edaData?.dataset_overview?.unique_values?.[column] ?? 'N/A'}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;

  
      // Descriptive Statistics Section
      const descriptiveStatisticsTable = `
        <table class="table table-bordered">
          <thead class="thead-dark">
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
        <div class="card shadow mb-4">
          <div class="card-header bg-dark text-white">Data Quality Analysis</div>
          <div class="card-body">
            <p><strong>Duplicates Count:</strong> ${edaData?.data_quality_analysis?.duplicates_count ?? 'N/A'}</p>
            <h5>Missing Data Summary (Percentage)</h5>
            <table class="table table-bordered">
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
              ? `<img src="data:image/png;base64,${edaData.data_quality_analysis.missing_data_pattern}" alt="Missing Data Pattern" class="img-fluid mx-auto d-block">`
              : "<p class='text-center'>No missing data to visualize.</p>"}
          </div>
        </div>
      `;
  
      // Outlier Analysis Section
      const outlierAnalysisHTML = `
        <div class="card shadow mb-4">
          <div class="card-header bg-dark text-white">Outlier Analysis</div>
          <div class="card-body">
            ${Object.entries(edaData?.outlier_analysis ?? {}).map(([col, info]) => `
              <div class="mb-4 border-bottom pb-4">
                <h5>${col} Outlier Plot</h5>
                <p><strong>Outliers Count:</strong> ${info.iqr_outliers_count ?? 'N/A'}</p>
                <img src="data:image/png;base64,${info.boxplot_image}" alt="${col} Outlier Plot" class="img-fluid mx-auto d-block">
              </div>
            `).join("")}
          </div>
        </div>
      `;
  
      // Univariate Analysis Section
      const univariateAnalysisHTML = `
        <div class="card shadow mb-4">
          <div class="card-header bg-dark text-white">Univariate Analysis</div>
          <div class="card-body">
            ${Object.entries(edaData?.univariate_analysis?.numeric_analysis ?? {}).map(([col, analysis]) => `
              <div class="mb-4 border-bottom pb-4">
                <h5>${col} Distribution</h5>
                <p><strong>Skewness:</strong> ${analysis.skewness?.toFixed(2) ?? 'N/A'}</p>
                <p><strong>Normality Test p-value:</strong> ${analysis.normality_test_pvalue?.toFixed(4) ?? 'N/A'}</p>
                <p><strong>Is Normal:</strong> ${analysis.is_normal ? "Yes" : "No"}</p>
                <img src="data:image/png;base64,${analysis.distribution_plot}" alt="${col} Distribution Plot" class="img-fluid mx-auto d-block">
              </div>
            `).join("")}
          </div>
        </div>
      `;
  
      // Bivariate Analysis Section with larger image
      const bivariateAnalysisHTML = `
        <div class="card shadow mb-4">
          <div class="card-header bg-dark text-white">Bivariate Analysis</div>
          <div class="card-body">
            ${edaData?.bivariate_analysis?.correlation_matrix
              ? `<img src="data:image/png;base64,${edaData.bivariate_analysis.correlation_matrix}" alt="Correlation Matrix" class="img-fluid mx-auto d-block" style="width: 100%; max-width: 1200px;">`
              : "<p class='text-center'>No correlation matrix available.</p>"}
          </div>
        </div>
      `;
  
      // Clustering Analysis Section
      const clusteringAnalysisHTML = edaData?.clustering_analysis?.cluster_plot ? `
        <div class="card shadow mb-4">
          <div class="card-header bg-dark text-white">Clustering Analysis</div>
          <div class="card-body">
            <img src="data:image/png;base64,${edaData.clustering_analysis.cluster_plot}" alt="Clustering Analysis" class="img-fluid mx-auto d-block">
          </div>
        </div>
      ` : '';
  
      // Data Cleaning Suggestions Section
      // Data Cleaning Suggestions Section
        // Data Cleaning Suggestions Section
        const dataCleaningHTML = `
        <div class="card shadow mb-4">
        <div class="card-header bg-dark text-white">Data Cleaning Suggestions</div>
        <div class="card-body">
            <ul class="list-unstyled">
            ${
                edaData?.data_cleaning_suggestions
                ? Object.entries(edaData.data_cleaning_suggestions).map(([key, items]) => `
                    <li><strong>${key.replace(/_/g, " ")}:</strong> ${Array.isArray(items) && items.length > 0 ? items.join(", ") : "No suggestions available"}</li>
                    `).join("")
                : "<li>No data cleaning suggestions available.</li>"
            }
            </ul>
        </div>
        </div>
        `;

        // Feature Engineering Suggestions Section
        const featureEngineeringHTML = `
        <div class="card shadow mb-4">
        <div class="card-header bg-dark text-white">Feature Engineering Suggestions</div>
        <div class="card-body">
            <ul class="list-unstyled">
            ${
                edaData?.feature_engineering_suggestions
                ? Object.entries(edaData.feature_engineering_suggestions).map(([key, items]) => `
                    <li><strong>${key}:</strong> ${Array.isArray(items) && items.length > 0 ? items.join(", ") : "No suggestions available"}</li>
                    `).join("")
                : "<li>No feature engineering suggestions available.</li>"
            }
            </ul>
        </div>
        </div>
        `;

        // Data Cleaning Suggestions Section



  
      // Build the full HTML with sections
      reportContainer.innerHTML = `
        <div class="container">
          <div class="row mb-4">
            <div class="col-12">
              <div class="card shadow">
                <div class="card-header bg-dark text-white">Dataset Overview</div>
                <div class="card-body">${datasetOverviewTable}</div>
              </div>
            </div>
          </div>
          <div class="row mb-4">
            <div class="col-12">
              <div class="card shadow">
                <div class="card-header bg-dark text-white">Descriptive Statistics</div>
                <div class="card-body">${descriptiveStatisticsTable}</div>
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
  
  // Add print-friendly styles
  window.onload = function() {
    document.getElementById("reportContainer").classList.add("container", "my-4");
    const printStyles = `
      @media print {
        .card {
          page-break-inside: avoid;
        }
        img {
          max-width: 100%;
        }
      }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = printStyles;
    document.head.appendChild(styleSheet);
  };
  
  document.getElementById("logout").addEventListener("click", () => {
    // Clear the access token from localStorage
    localStorage.removeItem("token");

    // Redirect to the login page
    window.location.href = "login.html"; // or the appropriate login page URL
});
