localDataArray = new Array();

addItem = () => {
    const item = document.getElementById('newItem').value;
    if (!item) {
        alert("Please input an item");
        return;
    }
    document.getElementById('newItem').value = '';
    addNewItem(item);
}

addNewItem = (item) => {
    const bodySection = document.getElementById('tableBodyElement');
    const row = document.createElement('tr');

    const selectCell = document.createElement('td');
    const selectCheckbox = document.createElement('input');
    selectCheckbox.setAttribute('type', 'checkbox')
    selectCheckbox.setAttribute('class', 'rowCheckbox');
    selectCell.appendChild(selectCheckbox);

    const itemCell = document.createElement('td');
    itemCell.textContent = item;
    itemCell.setAttribute('contentEditable', 'true');

    const kittenCell = document.createElement('td');
    const kittenImage = document.createElement('img');
    let a = Math.floor(Math.random() * 100) + 100;
    let b = Math.floor(Math.random() * 100) + 100;
    kittenImage.setAttribute('src', 'http://placekitten.com/' + a + '/' + b);
    kittenCell.appendChild(kittenImage);

    const dateCell = document.createElement('td');
    const date = document.createElement('input');
    date.setAttribute('type', 'date');
    date.setAttribute('class', 'datepicker');
    date.setAttribute('id', 'date-object');
    date.valueAsDate = new Date();
    date.addEventListener('change', markUrgency);
    dateCell.appendChild(date);

    row.appendChild(selectCell);
    row.appendChild(itemCell);
    row.appendChild(kittenCell);
    row.appendChild(dateCell);
    bodySection.appendChild(row);

    localDataArray.push({
        selectCell:selectCell.innerHTML,
        itemCell:itemCell.innerHTML,
        kittenCell:kittenCell.innerHTML,
        dateCellValue:date.value
    })
    localStorage.setItem('localStorage', JSON.stringify(localDataArray));
}

removeSelected = () => {
    var table = document.getElementById("table");
    var rowCount = table.rows.length;
    for (var index = rowCount-1; index >= 0; index--) {
        var row = table.rows[index];
        var chk = row.cells[0].childNodes[0];
        if (chk != null && chk.checked) {
            table.deleteRow(index);
            localDataArray.splice(index-1, 1);
        }
    }
    localStorage.setItem('localStorage', JSON.stringify(localDataArray));
}

sortTable = () => {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchCount = 0;
    table = document.getElementById("table");
    switching = true;
    dir = "asc";
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].querySelector('#date-object');
            y = rows[i+1].querySelector('#date-object');
            if (dir == "asc") {
                if (x.value > y.value) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.value < y.value) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i+1], rows[i]);
            switching = true;
            switchCount++;
        } else {
            if (switchCount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

markUrgency = () => {
    var table = document.getElementById("tableBodyElement");
    var rows = table.rows;
    var rowCount = table.rows.length;
    var currentDate = new Date();
    for (var i = 0; i < rowCount; i++) {
        date = rows[i].querySelector('#date-object');
        selectedDate = Date.parse(date.value);
        if ((selectedDate - currentDate) / 84600000 < 5) {
            date.style.color = 'red';
        } else {
            date.style.color = 'black';
        }
        localDataArray[i]['dateCellValue'] = date.value;
    }
    localStorage.setItem('localStorage', JSON.stringify(localDataArray));
}

markImportant = () => {
    var table = document.getElementById("table");
    var rowCount = table.rows.length;
    for (var index = rowCount -1; index >= 0; index--) {
        var row = table.rows[index];
        var chk = row.cells[0].childNodes[0];
        if (chk != null && chk.checked) {
            if (row.style.color == 'red') {
                row.style.color = 'black';
                row.style.fontWeight = 'normal';
            } else {
                row.style.color = 'red';
                row.style.fontWeight = 'bold';
            }
            chk.checked = false;
        }
    }
}

window.onload = function () {
    var storage = localStorage.getItem('localStorage');
    if (storage) {
        localDataArray = JSON.parse(storage);
        const bodySection = document.getElementById('tableBodyElement');
        for (let i = 0; i < localDataArray.length; i++) {
            const row = document.createElement('tr');
            const selectCell = document.createElement('td');
            selectCell.innerHTML = localDataArray[i]['selectCell'];
            row.appendChild(selectCell);
            const itemCell = document.createElement('td');
            itemCell.innerHTML = localDataArray[i]['itemCell'];
            row.appendChild(itemCell)
            const kittenCell = document.createElement('td');
            kittenCell.innerHTML = localDataArray[i]['kittenCell'];
            row.appendChild(kittenCell)
            const dateCell = document.createElement('td');
            const date = document.createElement('input');
            date.setAttribute('type', 'date');
            date.setAttribute('class', 'datepicker');
            date.setAttribute('id', 'date-object');
            date.value = localDataArray[i]['dateCellValue'];
            date.addEventListener('change', markUrgency);
            dateCell.appendChild(date);
            row.appendChild(dateCell)
            bodySection.appendChild(row);
            markUrgency();
        }
    }
}


