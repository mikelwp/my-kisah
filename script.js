let kisahData = JSON.parse(localStorage.getItem("kisah")) || [];
let currentAction = null;

function showModal(message, action) {
    document.getElementById("modalText").innerText = message;
    document.getElementById("modal").style.display = "block";
    currentAction = action;
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
    currentAction = null;
}

function confirmAction() {
    if (currentAction) currentAction();
    closeModal();
}

function addEntry() {
    const date = document.getElementById("dateInput").value;
    const text = document.getElementById("diaryInput").value;
    const imageInput = document.getElementById("imageInput").files[0];

    if (!date || !text) return;

    showModal("Simpan kisah ini?", function () {
        if (imageInput) {
            const reader = new FileReader();
            reader.onload = function (e) {
                saveEntry(date, text, e.target.result);
            };
            reader.readAsDataURL(imageInput);
        } else {
            saveEntry(date, text, null);
        }
    });
}

function saveEntry(date, text, image) {
    kisahData.push({ date, text, image });
    localStorage.setItem("kisah", JSON.stringify(kisahData));

    displayEntries();

    document.getElementById("diaryInput").value = "";
    document.getElementById("imageInput").value = "";
}

function deleteEntry(index) {
    const entry = kisahData[index];

    let msg = "Hapus kisah ini?";
    if (entry.image) msg = "Kisah ini ada gambar loh, yakin hapus?";

    showModal(msg, function () {
        kisahData.splice(index, 1);
        localStorage.setItem("kisah", JSON.stringify(kisahData));
        displayEntries();
    });
}

function displayEntries() {
    const container = document.getElementById("diaryList");
    container.innerHTML = "";

    kisahData.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "entry";

        div.innerHTML = `
            <small>${item.date}</small>
            <p>${item.text}</p>
            ${item.image ? `<img src="${item.image}">` : ""}
            <button onclick="deleteEntry(${index})">Hapus</button>
        `;

        container.appendChild(div);
    });
}

displayEntries();