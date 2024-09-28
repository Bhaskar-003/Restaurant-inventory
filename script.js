let inventoryChart;

function initializeChart() {
    const ctx = document.getElementById('inventoryChart').getContext('2d');
    inventoryChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Total Value',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Total Value ($)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Items'
                    }
                }
            }
        }
    });
}

function updateChart() {
    const labels = [];
    const data = [];
    let totalValue = 0;

    const rows = document.querySelectorAll('#inventory-table tbody tr');
    rows.forEach(row => {
        const itemName = row.cells[0].textContent; // Get item name
        const itemQuantity = parseInt(row.cells[1].textContent, 10); // Get item quantity
        const itemPrice = parseFloat(row.cells[2].textContent); // Get item price

        const value = itemQuantity * itemPrice;
        totalValue += value; // Accumulate total value

        labels.push(itemName); // Add to labels array
        data.push(value); // Add to data array (total value)
    });

    inventoryChart.data.labels = labels;
    inventoryChart.data.datasets[0].data = data;
    inventoryChart.update();

    // Update dashboard statistics
    document.getElementById('total-items').textContent = rows.length;
    document.getElementById('total-value').textContent = totalValue.toFixed(2);
}

function downloadCSV() {
    const rows = document.querySelectorAll('#inventory-table tbody tr');
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Item Name,Quantity,Price,Category\n'; // Header row

    rows.forEach(row => {
        const rowData = [
            row.cells[0].textContent, // Item Name
            row.cells[1].textContent, // Quantity
            row.cells[2].textContent, // Price
            row.cells[3].textContent  // Category
        ];
        csvContent += rowData.join(',') + '\n'; // Join each row's cells with commas
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'inventory.csv'); // Filename
    document.body.appendChild(link); // Required for Firefox

    link.click(); // Trigger the download
    document.body.removeChild(link); // Clean up
}

function addRow(name, quantity, price, category) {
    const tableBody = document.querySelector('#inventory-table tbody');
    const newRow = tableBody.insertRow();
    newRow.innerHTML = `
        <td>${name}</td>
        <td>${quantity}</td>
        <td>${price}</td>
        <td>${category}</td>
        <td>
            <button class="edit-button">Edit</button>
            <button class="delete-button">Delete</button>
        </td>
    `;
}

document.getElementById('add-item-button').addEventListener('click', function () {
    const name = document.getElementById('item-name').value;
    const quantity = document.getElementById('item-quantity').value;
    const price = document.getElementById('item-price').value;
    const category = document.getElementById('item-category').value;

    addRow(name, quantity, price, category);

    document.getElementById('add-item-form').reset();
    updateChart(); // Update the chart with new data
});

document.addEventListener('click', function (e) {
    if (e.target.classList.contains('delete-button')) {
        e.target.closest('tr').remove();
        updateChart(); // Update the chart after deleting a row
    } else if (e.target.classList.contains('edit-button')) {
        const row = e.target.closest('tr');
        const name = row.cells[0].textContent;
        const quantity = row.cells[1].textContent;
        const price = row.cells[2].textContent;
        const category = row.cells[3].textContent;

        document.getElementById('item-name').value = name;
        document.getElementById('item-quantity').value = quantity;
        document.getElementById('item-price').value = price;
        document.getElementById('item-category').value = category;

        row.remove();
        updateChart(); // Update the chart after editing a row
    }
});

document.getElementById('save-csv-button').addEventListener('click', downloadCSV);

// Initialize the chart
initializeChart();
