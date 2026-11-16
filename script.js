
const form = document.getElementById("trackerForm");
const recordsTable = document.getElementById("recordsTable");

let records = JSON.parse(localStorage.getItem("podRecords")) || [];

function saveRecords() {
    localStorage.setItem("podRecords", JSON.stringify(records));
}

function renderRecords() {
    recordsTable.innerHTML = "";

    records.forEach((record, index) => {
        const row = document.createElement("tr");

        [
            record.collection,
            record.designs,
            record.views,
            record.sales,
            "$" + Number(record.earnings).toFixed(2)
        ].forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.onclick = () => {
            records.splice(index, 1);
            saveRecords();
            renderRecords();
        };

        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);

        recordsTable.appendChild(row);
    });

    updateSummary();
}

function updateSummary() {
    const totalEarnings = records.reduce(
        (sum, record) => sum + Number(record.earnings), 0
    );

    const totalSales = records.reduce(
        (sum, record) => sum + Number(record.sales), 0
    );

    const totalDesigns = records.reduce(
        (sum, record) => sum + Number(record.designs), 0
    );

    const percentage = Math.min((totalEarnings / 100) * 100, 100);

    document.getElementById("totalEarnings").textContent =
        "$" + totalEarnings.toFixed(2);

    document.getElementById("totalSales").textContent = totalSales;

    document.getElementById("totalDesigns").textContent = totalDesigns;

    document.getElementById("progress").style.width = percentage + "%";

    document.getElementById("progressText").textContent =
        percentage.toFixed(1) + "% completed";
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const record = {
        collection: document.getElementById("collection").value.trim(),
        designs: Number(document.getElementById("designs").value),
        views: Number(document.getElementById("views").value),
        sales: Number(document.getElementById("sales").value),
        earnings: Number(document.getElementById("earnings").value)
    };

    if (!record.collection) return;

    records.push(record);

    saveRecords();
    renderRecords();

    form.reset();
});

renderRecords();
