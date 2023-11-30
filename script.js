const header = document.getElementById("header");
const snocontainer = document.getElementById("sno");
const bodyContainer = document.getElementById("body-container");
const columns = 26, rows = 50;
for (let i = 1; i <= columns; i++) {
    const headcell = document.createElement("div");
    headcell.className = "head-cell";
    headcell.innerText = String.fromCharCode(64 + i);
    header.appendChild(headcell);
}
for (let i = 1; i <= rows; i++) {
    const snocell = document.createElement("div");
    snocell.className = "sno-cell";
    snocell.innerText = i;
    snocontainer.appendChild(snocell);
}
for (let row = 1; row <= rows; row++) {
    const rowElement = document.createElement("div");
    rowElement.className = "row";
    for (let col = 1; col <= columns; col++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.contentEditable = true;
        cell.id = `${String.fromCharCode(64 + col)}${row}`;
        rowElement.appendChild(cell);
        cell.addEventListener("focus", onFocuscell);
        // cell.addEventListener("blur",onblur);
        cell.addEventListener("input", onChangeCellText);
    }
    bodyContainer.appendChild(rowElement);
}

let activecellId = null;
const activelement = document.getElementById("active-cell");
const form = document.querySelector(".form");
const state = [];
let current_sheet = 0;
state.push({});

form.addEventListener("change", onChangeFormData);

const defaultstyle = {
    fontFamily: "Times New Roman",
    fontSize: 16,
    isBold: false,
    isItalic: false,
    isUnderline: false,
    align: "left",
    textColor: "#000000",
    bgColor: "#ffffff",
    text: ""
}

function onChangeCellText(event) {
    // console.log(event.target.id);
    let changestext = event.target.innerText;
    if (state[current_sheet][activecellId]) {
        state[current_sheet][activecellId].text = changestext;
    }
    else {
        state[current_sheet][activecellId] = defaultstyle;
    }
}
function onChangeFormData() {
    const options = {
        fontFamily: form["fontFamily"].value,
        fontSize: form["fontSize"].value,
        isBold: form["isBold"].checked,
        isItalic: form["isItalic"].checked,
        isUnderline: form["isUnderline"].checked,
        align: form["align"].value,
        textColor: form["textColor"].value,
        bgColor: form["bgColor"].value,
    }
    applyStyles(options);
}
function applyStyles(styles) {
    if (!activecellId) {
        form.reset();
        return;
    }
    const activecell = document.getElementById(activecellId);
    activecell.style.color = styles["textColor"];
    activecell.style.backgroundColor = styles["bgColor"];
    activecell.style.fontFamily = styles["fontFamily"];
    activecell.style.fontSize = styles["fontSize"] + "px";
    activecell.style.textAlign = styles["align"];
    activecell.style.fontWeight = styles["isBold"] ? "bold" : "normal";
    activecell.style.textDecoration = styles["isUnderline"] ? "underline" : "none";
    activecell.style.fontStyle = styles["isItalic"] ? "italic" : "normal";
    state[current_sheet][activecellId] = { ...styles, text: activecell.innerText };
}
function onFocuscell(event) {
    // if (activecellId === event.target.id) return;
    activecellId = event.target.id;
    activelement.innerText = activecellId;
    if (state[current_sheet][activecellId]) {
        resetform(state[current_sheet][activecellId]);
    }
    else {
        resetform(defaultstyle);
    }
}
function resetform(styles) {
    // console.log("fired");
    form["textColor"].value = styles["textColor"];
    form["bgColor"].value = styles["bgColor"];
    form["fontFamily"].value = styles["fontFamily"];
    form["fontSize"].value = styles["fontSize"];
    form["align"].value = styles["align"];
    form["isBold"].value = styles["isBold"];
    form["isUnderline"].value = styles["isUnderline"];
    form["isItalic"].value = styles["isItalic"];
    // console.log(form);
    // form["textColor"].value=styles["textColor"];
}
function getid(i) {
    return [i.id.charCodeAt(0), Number(i.id[1])];
}
function highlight(headclass, cellid) {
    const head_cells = document.getElementsByClassName(headclass);
    // console.log(headclass,cellid);
    for (let el of head_cells) {
        if (el.innerText == cellid) {
            el.classList.add("head-active");
        }
    }
}
function unhighlight(headclass, cellid) {
    const head_cells = document.getElementsByClassName(headclass);
    // console.log(headclass,cellid);
    for (let el of head_cells) {
        if (el.innerText == cellid) {
            el.classList.remove("head-active");
        }
    }
}
function exportdata() {
    const data = JSON.stringify(state);
    const blob = new Blob([data], { type: "text/plain" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "data.json";
    link.href = url;
    link.click();
}
const cells = document.getElementsByClassName("cell");
for (let i of cells) {
    i.addEventListener("click", (event) => {
        let [row, col] = getid(i);
        if (event.ctrlKey) {
            const selected = document.getElementsByClassName("selected");
            highlight("head-cell", i.id[0]);
            highlight("sno-cell", i.id.slice(1));
            i.classList.add("selected");
            if (col > 1) {
                const top_cell = document.getElementById(`${String.fromCharCode(row)}${col - 1}`);
                if (top_cell.classList.contains("selected")) {
                    i.classList.add("top-cell-selected");
                    top_cell.classList.add("bottom-cell-selected");
                }
            }
            if (col < columns) {
                const bottom_cell = document.getElementById(`${String.fromCharCode(row)}${col + 1}`);
                // console.log(top_cell);
                if (bottom_cell.classList.contains("selected")) {
                    i.classList.add("bottom-cell-selected");
                    bottom_cell.classList.add("top-cell-selected");
                }
            }
            if (row > 65) {
                const left_cell = document.getElementById(`${String.fromCharCode(row - 1)}${col}`);
                if (left_cell.classList.contains("selected")) {
                    i.classList.add("left-cell-selected");
                    left_cell.classList.add("right-cell-selected");
                }
            }
            if (row < 91) {
                const right_cell = document.getElementById(`${String.fromCharCode(row + 1)}${col}`);
                if (right_cell.classList.contains("selected")) {
                    i.classList.add("right-cell-selected");
                    right_cell.classList.add("left-cell-selected");
                }
            }
        }
        else {
            const selected = document.getElementsByClassName("selected");
            for (let el of cells) {
                // console.log(el);
                unhighlight("head-cell", el.id[0]);
                unhighlight("sno-cell", el.id.slice(1));
                el.classList.remove("selected");
                el.classList.remove("top-cell-selected");
                el.classList.remove("bottom-cell-selected");
                el.classList.remove("left-cell-selected");
                el.classList.remove("right-cell-selected");
            }
            highlight("head-cell", i.id[0]);
            highlight("sno-cell", i.id.slice(1));
            i.classList.add("selected");
        }
    })
}
function nextsheet() {
    for (let i of cells) {
        i.style.color = defaultstyle["textColor"];
        i.style.backgroundColor = defaultstyle["bgColor"];
        i.style.fontFamily = defaultstyle["fontFamily"];
        i.style.fontSize = defaultstyle["fontSize"] + "px";
        i.style.textAlign = defaultstyle["align"];
        i.style.fontWeight = defaultstyle["isBold"] ? "bold" : "normal";
        i.style.textDecoration = defaultstyle["isUnderline"] ? "underline" : "none";
        i.style.fontStyle = defaultstyle["isItalic"] ? "italic" : "normal";
        i.innerText = "";
        i.classList.remove("selected");
    }
    current_sheet++;
    const sheetdisplay=document.getElementById("sheet");
    sheetdisplay.innerText=`Sheet ${current_sheet+1}`;
    state.push({});
    form.reset();
}
function previoussheet() {
    current_sheet--;
    if (current_sheet < 0) {
        return;
    }
    const sheetdisplay=document.getElementById("sheet");
    sheetdisplay.innerText=`Sheet ${current_sheet+1}`;
    for (let i of cells) {
        if (state[current_sheet][i.id] != undefined) {
            i.style.color = state[current_sheet][i.id]["textColor"];
            i.style.backgroundColor = state[current_sheet][i.id]["bgColor"];
            i.style.fontFamily = state[current_sheet][i.id]["fontFamily"];
            i.style.fontSize = state[current_sheet][i.id]["fontSize"];
            i.style.textAlign = state[current_sheet][i.id]["align"];
            i.style.fontWeight = state[current_sheet][i.id]["isBold"] ? "bold" : "normal";
            i.style.textDecoration = state[current_sheet][i.id]["isUnderline"] ? "undeline" : "none";
            i.style.fontStyle = state[current_sheet][i.id]["isItalic"] ? "italic" : "normal";
            i.innerText = state[current_sheet][i.id]["text"];
        }
        else {
            i.style.color = defaultstyle["textColor"];
            i.style.backgroundColor = defaultstyle["bgColor"];
            i.style.fontFamily = defaultstyle["fontFamily"];
            i.style.fontSize = defaultstyle["fontSize"];
            i.style.textAlign = defaultstyle["align"];
            i.style.fontWeight = defaultstyle["isBold"];
            i.style.textDecoration = defaultstyle["isUnderline"];
            i.style.fontStyle = defaultstyle["isItalic"];
        }
    }
}
function searchbar() {
    const searchbar = document.getElementById("search");
    const searchvalue=searchbar.value.toUpperCase();
    // console.log(searchvalue.slice(1,5));
    let res;
    if (searchvalue[0] != "=") {
        return;
    }
    if (searchvalue.slice(1, 4) == "SUM") {
        res = sum(searchvalue)[0];
    }
    else if (searchvalue.slice(1, 4) == "AVG") {
        res = sum(searchvalue)[0] / sum(searchvalue)[1];
    }
    else if(searchvalue.slice(1, 4) == "MIN"){
        res=min(searchvalue);
    }
    else if(searchvalue.slice(1, 4) == "MAX"){
        res=max(searchvalue);
    }
    else if(searchvalue.slice(1, 5) == "SORT"){
        // console.log("sort start");
        sort(searchvalue);
        return ;
    }
    searchbar.value += " = " + res;
    // console.log("yes");
}
function sum(value) {
    let startcell = document.getElementById(value.slice(5, value.indexOf(":")));
    let endcell = document.getElementById(value.slice(value.indexOf(":") + 1, value.lastIndexOf(")")));
    let found = false;
    let count = 0;
    let sum = 0;
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].id == startcell.id) {
            while (i < cells.length && cells[i].id != endcell.id) {
                sum += Number(cells[i].innerText);
                if (Number(cells[i].innerText)) {
                    count++;
                }
                i++;
            }
            if (i < i < cells.length) {
                sum += Number(cells[i].innerText);
                if (Number(cells[i].innerText)) {
                    count++;
                }
            }
            break;
        }
    }
    return [sum, count];
}
function min(value) {
    let startcell = document.getElementById(value.slice(5, value.indexOf(":")));
    let endcell = document.getElementById(value.slice(value.indexOf(":") + 1, value.lastIndexOf(")")));
    let found = false;
    let min = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].id == startcell.id) {
            while (i < cells.length && cells[i].id != endcell.id) {
                if (Number(cells[i].innerText)) {
                    if (Number(cells[i].innerText) < min) {
                        min = Number(cells[i].innerText);
                    }
                }
                i++;
            }
            if (i < i < cells.length) {
                if (Number(cells[i].innerText)) {
                    if (Number(cells[i].innerText) < min) {
                        min = Number(cells[i].innerText);
                    }
                }
            }
        }
    }
    if(min==Number.MAX_SAFE_INTEGER){
        return NaN;
    }
    return min;
}
function max(value){
    let startcell = document.getElementById(value.slice(5, value.indexOf(":")));
    let endcell = document.getElementById(value.slice(value.indexOf(":") + 1, value.lastIndexOf(")")));
    let found = false;
    let max = Number.MIN_VALUE;
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].id == startcell.id) {
            while (i < cells.length && cells[i].id != endcell.id) {
                if (Number(cells[i].innerText)) {
                    if (Number(cells[i].innerText) > max) {
                        max = Number(cells[i].innerText);
                    }
                }
                i++;
            }
            if (i < i < cells.length) {
                if (Number(cells[i].innerText)) {
                    if (Number(cells[i].innerText) > max) {
                        max = Number(cells[i].innerText);
                    }
                }
            }
        }
    }
    if(max==Number.MIN_VALUE){
        return NaN;
    }
    return max;
}
function sort(value){
    let startcell = document.getElementById(value.slice(5, value.indexOf(":")));
    let order;
    if(value.includes(",")){
        let endcell = document.getElementById(value.slice(value.indexOf(":") + 1, value.lastIndexOf(",")));
        order=value.slice(value.indexOf(",")+1,value.indexOf(")"));
    }
    else{
        let endcell = document.getElementById(value.slice(value.indexOf(":") + 1, value.lastIndexOf(")")));
    }
    let arr=[];
    for(let i of cells){
        if(i.innerText!=""){
            arr.push(i.innerText);
        }
    }
    // console.log("Yes");
    arr.sort();
    // console.log(order);
    if(order=="-1"){
        arr.reverse();
    }
    let x=0;
    for(let i of cells){
        if(i.innerText!=""){
            i.innerText=arr[x];
            x++;
        }
    }
}

