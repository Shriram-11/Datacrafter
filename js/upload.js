document.getElementById("uploadForm").addEventListener("submit", async (e) => {
          e.preventDefault();
          const fileInput = document.getElementById("csv_file").files[0];
          const formData = new FormData();
          formData.append("csv_file", fileInput);

          const token = localStorage.getItem("token");
          const response = await fetch(
            "http://127.0.0.1:8000/api/upload_csv/",
            {
              method: "POST",
              headers: {
                Authorization: "Bearer " + token,
              },
              body: formData,
            }
          );

          const data = await response.json();
          if (data.success) {
            alert("CSV uploaded successfully!");
            localStorage.setItem("edaData", JSON.stringify(data.data));
            window.location.href = "eda_report.html";
          } else {
            alert("Upload failed: " + data.message);
          }
});