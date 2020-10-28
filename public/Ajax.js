function onload() {
    fetch("/test")
        .then((response) => response.json())
        .then((data) => loadList(data["data"]));
}

document.querySelector("table tbody").addEventListener("click", function (event) {
    if (event.target.className === "delete") {
        delete_person(event.target.dataset.id);
    }
    if (event.target.className === "edit") {
        var update = document.querySelector(".update");
        update.hidden ? showUpdate(false) : showUpdate(true);
        edit_person(event.target.dataset.id);
    }
});

function showUpdate(params) {
    var update = document.querySelector(".update");
    update.hidden = params;
    update.style.display = params ? "none" : "flex";
}

function delete_person(id) {
    fetch("/delete/" + id, {
        method: "delete",
    })
        .then((response) => response.json())
        .then((data) => loadList(data["data"]));
}

function edit_person(id) {
    document.querySelector(".update-btn").addEventListener("click", () => {
        var update_input = document.querySelector(".update-input").value;
        var update_age = document.querySelector(".update-age").value;
        fetch("/edit/" + id, {
            headers: {
                "content-type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                newName: update_input,
                newAge: update_age,
            }),
        })
            .then((response) => response.json())
            .then((data) => loadList(data["data"]));
    });
}

function search() {
    var search = document.querySelector("#search");
    const search_key = search.value;
    search_key.trim() == ""
        ? onload()
        : fetch("/search/" + search_key)
              .then((response) => response.json())
              .then((data) => loadList(data["data"]));
    var cancel = document.querySelector(".cancel");
    if (search_key) cancel.style.display = "inline";
    else cancel.style.display = "none";
}

document.querySelector(".cancel").addEventListener("click", () => {
    document.querySelector(".cancel").style.display = "none";
    document.querySelector("#search").value = null;
    onload();
});

function insert() {
    var name = document.getElementById("name").value;
    var age = document.getElementById("age").value;

    if (name == "" || age == "") {
        return alert("please Fill input");
    }

    var inputs = document.querySelectorAll(".input input");
    for (let i = 0; i < inputs.length; i++) {
        inputs[0].value = "";
    }

    fetch("/insert", {
        headers: {
            "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
            name: name,
            age: age,
        }),
    })
        .then((response) => response.json())
        .then((data) => insertRows(data["data"]));
}

function insertRows(data) {
    const table = document.querySelector("table tbody");
    const istable = table.querySelector(".no-data");
    let tableHtml = "<tr>";

    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            if (key === "date") {
                data[key] = new Date();
                data[key] = data[key].toLocaleString();
            }
            tableHtml += `<td>${data[key]}</td>`;
        }
    }
    tableHtml += `<td><button class="delete" data-id=${data.id}>Delete</button></td>`;
    tableHtml += `<td><button class="edit" data-id=${data.id}>Edit</button></td>`;
    tableHtml += "</tr>";

    if (istable) {
        table.innerHTML = tableHtml;
    } else {
        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
    }
}

function loadList(data) {
    const table = document.querySelector("table tbody");
    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan=6>NO DATA</td></tr>";
        return;
    }
    table.innerHTML = "";
    let tableHtml = "";
    data.forEach((d) => {
        tableHtml += "<tr>";
        tableHtml += `<td>${d.ID}</td>`;
        tableHtml += `<td>${d.NAME}</td>`;
        tableHtml += `<td>${d.AGE}</td>`;
        tableHtml += `<td>${new Date(d.date).toLocaleString()}</td>`;
        tableHtml += `<td><button class="delete" data-id=${d.ID}>Delete</button></td>`;
        tableHtml += `<td><button class="edit" data-id=${d.ID}>Edit</button></td>`;
        tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
}

document.querySelector(".update-btn").addEventListener("click", () => {
    document.querySelector(".update").style.display = "none";
});
