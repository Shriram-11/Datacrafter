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
            <table style="width: 100%; border-collapse: collapse; margin-top: 8px;">
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Rows</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${edaData?.dataset_overview?.shape?.[0] ?? 'N/A'}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Columns</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${edaData?.dataset_overview?.shape?.[1] ?? 'N/A'}</td>
                </tr>
            </table>
            <table style="width: 100%; border-collapse: collapse; margin-top: 8px;">
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px;">Metric</th>
                    ${Object.keys(edaData?.dataset_overview?.columns ?? {}).map(key => `<th style="border: 1px solid #ddd; padding: 8px;">${key}</th>`).join("")}
                </tr>
                ${generateDataRow("Columns", edaData?.dataset_overview?.columns)}
                ${generateDataRow("Missing Values", edaData?.dataset_overview?.missing_values)}
                ${generateDataRow("Unique Values", edaData?.dataset_overview?.unique_values)}
            </table>
        `;

        // Descriptive Statistics Section
        const descriptiveStatisticsTable = `
            <table style="width: 100%; border-collapse: collapse; margin-top: 8px;">
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px;">Metric</th>
                    ${Object.keys(edaData?.descriptive_statistics?.numeric_summary?.age ?? {}).map(key => `<th style="border: 1px solid #ddd; padding: 8px;">${key}</th>`).join("")}
                </tr>
                ${Object.entries(edaData?.descriptive_statistics?.numeric_summary ?? {}).map(
                    ([metric, values]) => generateDataRow(metric, values)
                ).join("")}
            </table>
        `;

        // Data Quality Analysis Section
        const dataQualityAnalysisHTML = `
            <div class="card">
                <h3>Data Quality Analysis</h3>
                <p><strong>Duplicates Count:</strong> ${edaData?.data_quality_analysis?.duplicates_count ?? 'N/A'}</p>
                
                <h4>Missing Data Summary (Percentage)</h4>
                <table style="width: 100%; border-collapse: collapse;">
                    ${Object.entries(edaData?.data_quality_analysis?.missing_data_summary ?? {}).map(
                        ([column, percent]) => `
                            <tr>
                                <th style="border: 1px solid #ddd; padding: 8px;">${column}</th>
                                <td style="border: 1px solid #ddd; padding: 8px;">${percent}%</td>
                            </tr>
                        `
                    ).join("")}
                </table>
                
                ${edaData?.data_quality_analysis?.missing_data_pattern
                    ? `<img src="data:image/png;base64,${edaData.data_quality_analysis.missing_data_pattern}" alt="Missing Data Pattern">`
                    : "<p>No missing data to visualize.</p>"}
            </div>
        `;

        // Outlier Analysis Section
        const outlierAnalysisHTML = `
            <div class="card">
                <h3>Outlier Analysis</h3>
                ${Object.entries(edaData?.outlier_analysis ?? {}).map(([col, info]) => `
                    <h4>${col} Outlier Plot</h4>
                    <p><strong>Outliers Count:</strong> ${info.iqr_outliers_count ?? 'N/A'}</p>
                    <img src="data:image/png;base64,${info.boxplot_image}" alt="${col} Outlier Plot">
                `).join("")}
            </div>
        `;

        // Univariate Analysis Section
        const univariateAnalysisHTML = `
            <div class="card">
                <h3>Univariate Analysis</h3>
                ${Object.entries(edaData?.univariate_analysis?.numeric_analysis ?? {}).map(([col, analysis]) => `
                    <h4>${col} Distribution</h4>
                    <p><strong>Skewness:</strong> ${analysis.skewness?.toFixed(2) ?? 'N/A'}</p>
                    <p><strong>Normality Test p-value:</strong> ${analysis.normality_test_pvalue?.toFixed(4) ?? 'N/A'}</p>
                    <p><strong>Is Normal:</strong> ${analysis.is_normal ? "Yes" : "No"}</p>
                    <img src="data:image/png;base64,${analysis.distribution_plot}" alt="${col} Distribution Plot">
                `).join("")}
            </div>
        `;

        // Bivariate Analysis Section
        const bivariateAnalysisHTML = `
            <div class="card">
                <h3>Bivariate Analysis</h3>
                ${edaData?.bivariate_analysis?.correlation_matrix
                    ? `<img src="data:image/png;base64,${edaData.bivariate_analysis.correlation_matrix}" alt="Correlation Matrix">`
                    : "<p>No correlation matrix available.</p>"}
            </div>
        `;

        // Advanced Correlation Analysis Section
        const advancedCorrelationHTML = edaData?.advanced_correlation_analysis?.pairplot ? `
            <div class="card">
                <h3>Advanced Correlation Analysis</h3>
                <img src="data:image/png;base64,${edaData.advanced_correlation_analysis.pairplot}" alt="Advanced Correlation Analysis">
            </div>
        ` : '';

        // Clustering Analysis Section
        const clusteringAnalysisHTML = edaData?.clustering_analysis?.cluster_plot ? `
            <div class="card">
                <h3>Clustering Analysis</h3>
                <img src="data:image/png;base64,${edaData.clustering_analysis.cluster_plot}" alt="Clustering Analysis">
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
            <div class="card">
                <h3>Dataset Overview</h3>
                ${datasetOverviewTable}
            </div>

            <div class="card">
                <h3>Descriptive Statistics</h3>
                ${descriptiveStatisticsTable}
            </div>

            ${dataQualityAnalysisHTML}
            ${outlierAnalysisHTML}
            ${univariateAnalysisHTML}
            ${bivariateAnalysisHTML}
            ${advancedCorrelationHTML}
            ${clusteringAnalysisHTML}
            ${dataCleaningHTML}
            ${featureEngineeringHTML}
        `;
    } else {
        reportContainer.innerHTML = "<p>No EDA data found. Please upload a CSV file first.</p>";
    }
});
