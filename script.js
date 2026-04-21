let kisahData = JSON.parse(localStorage.getItem("kisah")) || [];
let currentAction = null;
let editIndex = -1;

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
    const text = document.getElementById("kisahInput").value;
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
    if (editIndex === -1) {
        kisahData.push({ date, text, image });
    } else {
        kisahData[editIndex] = {
            date,
            text,
            image: image || kisahData[editIndex].image
        };

        editIndex = -1;
    }

    localStorage.setItem("kisah", JSON.stringify(kisahData));
    displayEntries();

    document.getElementById("kisahInput").value = "";
    document.getElementById("imageInput").value = "";
    document.getElementById("dateInput").value = "";
}

function startEdit(index) {
    const data = kisahData[index];

    document.getElementById("dateInput").value = data.date;
    document.getElementById("kisahInput").value = data.text;

    editIndex = index;

    // scroll ke atas biar UX enak
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    const container = document.getElementById("kisahList");
    container.innerHTML = "";

    kisahData.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "entry";

        div.innerHTML = `
            <small>${item.date}</small>
            <p>${item.text}</p>
            ${item.image ? `<img src="${item.image}">` : ""}
            <button onclick="startEdit(${index})">Edit</button>
            <button onclick="deleteEntry(${index})">Hapus</button>
        `;

        container.appendChild(div);
    });
}

displayEntries();