/*
 * Generiert eine zufällige IP als Dummy-Daten
 * @returns {String}    zufällig generierte IP Adresse
 */
function generateRanIp() {
    var ipAdresse = Math.round(Math.random() * (256 - 1) + 1) + "."
            + Math.round(Math.random() * (256 - 1) + 1) + "."
            + Math.round(Math.random() * (256 - 1) + 1) + "."
            + Math.round(Math.random() * (256 - 1) + 1);
    return ipAdresse;
}

/*
 * Speichert die übertragenen Daten in Textdateien.
 * Jeder Nutzer bekommt eine eigene Textdatei, in der die IP hinterlegt wird.
 * Anschließend werden die Daten auf der Konsole ausgegeben.
 */
function registerData() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var pcName = "Client" + "_" + Math.round(Math.random() * (10000 - 1) + 10000);
    var ipAdress = generateRanIp();

    var URL = "http://localhost/AVS/sendData.php";
    var ajaxCom = new Ajax(URL, receive);
    // expected components (checked in receive())
    receivedObj = {"username": 0, "password": 0, "ipAdress": 0, "pcName": 0};
    ajaxCom.send({
        "username": username,
        "password": password,
        "ipAdress": ipAdress,
        "pcName": pcName
    }
    );

    write2console(receivedObj.username);
    write2console(receivedObj.password);
    write2console(receivedObj.ipAdress);
    write2console(receivedObj.pcName);

    ajaxCom.disconnect();
}

/*
 * Funktion zum Abruf des Serverarrays. Diese Funktion liefert alle angemeldeten Server.
 */
function queryData(table_id) {
    var files;
    var content;
    var URL = "http://localhost/AVS/requestData.php";
    var ajaxCom = new Ajax(URL, receive);
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    // expected components (checked in receive())
    receivedObj = {"files": 0, "content": 0};
    ajaxCom.send({
        "username": username,
        "password": password,
        "files": files,
        "content": content
    }
    );

    write2console(receivedObj.files);
    write2console(receivedObj.content);



    var ipadresses = receivedObj.content;
    var names = receivedObj.files;

    ajaxCom.disconnect();

    for (var i in ipadresses) {
        write2console(ipadresses[i]);
        write2console(names[i]);


        var table = document.getElementById(table_id);
        var lastRow = numRows(table_id);
        var rowNum = lastRow + 1;
        var row = table.insertRow(lastRow);

        var cell_1 = row.insertCell(0);
        var textNode = document.createTextNode(names[i]);
        cell_1.appendChild(textNode);

        var cell_2 = row.insertCell(1);
        var textNode = document.createTextNode(ipadresses[i]);
        cell_2.appendChild(textNode);

        var cell_3 = row.insertCell(2);
        var myButton = document.createElement("button");
        var Text = document.createTextNode("Löschen");
        myButton.id = names[i];
        myButton.appendChild(Text);
        myButton.setAttribute('onclick', 'deleteRow(this)');
        cell_3.appendChild(myButton);

    }

}

function numRows(table_id) {
    var rows = document.getElementById(table_id).getElementsByTagName('tr');
    var numRows = 0;
    for (i = 0; i < rows.length; i++) {
        numRows = numRows + 1;
        console.log(rows.length);
        //console.log(numRows);
    }
    return numRows;
}


function deleteTable(table_id) {
    var lastRow = numRows(table_id) - 1;
    console.log(lastRow);
    var i = 2;
    while (i <= lastRow) {
        document.getElementById(table_id).deleteRow(i);
        i + 2;
    }
    //console.log(lastRow);
    //console.log(i);

}

function getButton() {
    console.log("Test e");
    var e = window.event,
            btn = e.target || e.srcElement;
    console.log("Test e");
    return (btn.id);
}


/*
 * Helper Funtkion um die ParentNodes bis zum Element hochzugehen
 * @param {type} el
 * @param {type} tagName
 * @returns {.el.parentNode.parentNode}
 */
function upTo(el, tagName) {
    tagName = tagName.toLowerCase();
    console.log(tagName);
    console.log(el);
    while (el && el.parentNode) {
        el = el.parentNode;
        console.log(el);
        if (el.tagName && el.tagName.toLowerCase() == tagName) {
            return el;
        }
    }
    return null;
}

/*
 * Funktion zum löschen der ausgewählten Zeile
 * @param {type} el
 * @returns {undefined}
 */
function deleteRow(el) {
    var username = el.id;
    console.log(el.id);
    var flag = 1;
    console.log(el.getAttribute('id'));
    console.log(username);
    var URL = "http://localhost/AVS/deleteData.php";
    var ajaxCom = new Ajax(URL, receive);

    // expected components (checked in receive())
    receivedObj = {"username": 0, "flag": 0};
    ajaxCom.send({
        "username": username,
        "flag": flag
    });

    ajaxCom.disconnect();
    var row = upTo(el, 'tr')

    if (row)
        row.parentNode.removeChild(row);
}





/*
 * Löscht die Textdateien der registrierten Nutzer.
 * Wird im Feld User ein Name angegeben, wird nur der angegebene User gelsöcht.
 * Wird das Feld User freigelassen, werden alle Nutzer gelöscht.
 */
function deleteData() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var URL = "http://localhost/AVS/deleteData.php";
    var flag = 0;
    var ajaxCom = new Ajax(URL, receive);

    // expected components (checked in receive())
    receivedObj = {"username": 0, "password": 0, "flag": 0};
    ajaxCom.send({
        "username": username,
        "password": password,
        "flag": flag
    });

    ajaxCom.disconnect();
}
            