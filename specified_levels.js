document.addEventListener('DOMContentLoaded', async function () {
    const setReportDiv = "specified_levels";
    console.log("setReportDiv: ", setReportDiv);

    const loadingIndicator = document.getElementById(`loading_${setReportDiv}`);
    loadingIndicator.style.display = 'block';

    // Base URL configuration based on data access type (public/internal)
    let setBaseUrl = cda === "internal"
        ? `https://wm.${office.toLowerCase()}.ds.usace.army.mil:8243/${office.toLowerCase()}-data`
        : `https://cwms-data.usace.army.mil/cwms-data`;

    console.log("setBaseUrl: ", setBaseUrl);

    const categoryApiUrl = `${setBaseUrl}/specified-levels?office=${office}`;

    // Initial category fetch with headers for versioning
    fetch(categoryApiUrl, {
        method: 'GET',
        headers: {
            'Accept': 'application/json;version=2'
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        console.log("data: ", data);

        // Create and append the table to the specified container
        const table = createTableSpecifiedLevel(data);
        const tableContainer = document.getElementById(`table_container_${setReportDiv}`);
        if (tableContainer) {
            tableContainer.append(table);
        } else {
            console.warn(`Container with ID "table_container_${setReportDiv}" not found.`);
        }

        loadingIndicator.style.display = 'none';
    })
    .catch(error => {
        console.error('There was a problem with the initial fetch operation:', error);
        loadingIndicator.style.display = 'none';
    });
});

function createTableSpecifiedLevel(data) {
    // Create the table element
    const table = document.createElement("table");
    table.style.borderCollapse = "collapse";
    table.style.width = "100%";
    table.style.marginBottom = "40px";

    // Loop through each item in the data array
    data.forEach(item => {
        // Create a table row
        const row = document.createElement("tr");

        // Create a table cell
        const cell = document.createElement("td");
        cell.style.border = "1px solid #ccc";
        cell.style.padding = "8px";

        // Create a link element
        const link = document.createElement("a");
        link.href = `https://example.com/details/${encodeURIComponent(item.id)}`;  // Base URL with item ID as a parameter
        link.target = "_blank";  // Open link in new tab
        link.innerText = item.id;  // Set the link text to the id

        // Append the link to the cell
        cell.appendChild(link);

        // Append the cell to the row, and the row to the table
        row.appendChild(cell);
        table.appendChild(row);
    });

    // Return the created table
    return table;
}