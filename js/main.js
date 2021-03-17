const maxRow = 30; // максимальне значення M
const maxColumn = 30; //максимальне значення N
const maxX = maxRow*maxColumn; //максимальне значення X
let m, n , x;
let colSum; //Для зберігання масиву сум стовпців
const matrixTable = document.querySelector('#matrix_table'); //створюється таблиця  
const avgTable = document.querySelector('#avg_table'); // нижній рядок з середніми значеннями я зробив як окрему таблицю, щоб можна було спокійно додавати рядки в першу)

window.onload = () => {
    writeDataToInfoBlock();
    const acceptButton = document.querySelector('.accept_btn');
    acceptButton.addEventListener('click', acceptForm);
}

// створює верхній інформаційний блок в вікні форми
function writeDataToInfoBlock(){
    const info = document.querySelector('.info');
    info.innerHTML = `<p> 0 < M < ${maxRow} </p><p> 0 < N < ${maxColumn}</p><p> 0 < X < ${maxX}</p>`;
}

//в результаті введення коректних даних в формі приховує блок з формою
function acceptForm(){
    if(checkForm()){ //функцыя CheckForm описана нижче
        document.getElementById('modal').style.display = 'none';
        createTable();
        }
}

// здійснюється перевірка на введення коректних даних
function checkForm(){
    let mField = document.getElementById('m_field'); //
    let nField = document.getElementById('n_field'); // доступаємось до полів форми
    let xField = document.getElementById('x_field'); //

    m = Number(mField.value); //
    n = Number(nField.value); //забираєм дані які знаходяться у них
    x = Number(xField.value); //

    if(m === '') {mField.style.background = '#eb4034'; return false; }  //
    if(n === '') {nField.style.background = '#eb4034'; return false; }  //перевірка чи поля заповнені якимись даними взагалі
    if(x === '') { xField.style.background = '#eb4034'; return false; } //

    if(m < 1 || m > maxRow) { mField.style.background = '#eb4034'; return false; }       //
    if(n < 1 || n > maxColumn) { nField.style.background = '#eb4034'; return false; }    // перевірка чи не виходять вони за допустимі межі
    if(x <= 0 || x > maxX) { xField.style.background = '#eb4034'; return false; }        //
    if(x > m*n) { xField.style.background = '#eb4034'; return false; }

    return true;
}

// створює таблицю на основі даних введених в формі
function createTable(){
    colSum = [...Array(Number(n)).fill(0)]; //створює масив розміром N і заповнює його нулями

    for(let i = 0; i < m; i++){              
        createRow(matrixTable,i);         // функція createRow описана нижче, приймає на вхід 2 параметри(таблиця в яку цей рядок вставлятиметься і індекс для задання id)
    }

    let tr =  document.createElement('tr');
    let id = 0;
    colSum.forEach(num => {                     //
        let td = document.createElement('td');  //
        td.setAttribute('id', `${id++}_avg`);   // перебирає масив з сумами стовпців і вичисляє середнє значення і заповнює
        td.classList.add('avg_td');             //
        td.innerText = (num/m).toFixed(3);      //
        tr.appendChild(td);
    });

    let add = document.createElement('td');     //
    add.classList.add('add');                       //створюється кнопка +
    add.setAttribute('colspan','2');            //
    add.addEventListener('click', addNewRow);  //при натискані буде викликатись функція addNewRow() яка описана ще нижче
    add.innerText = '+';                        //
    tr.appendChild(add);                        //
    avgTable.appendChild(tr);             
    //записує рядок з середніми значеннями в таблицю
    container.appendChild(avgTable);
}

//функція яка створює рядки (obj - це елемент в який потрібно вписати рядок(таблиця) i - id рядка)
function createRow(obj,i){
    let tr = document.createElement('tr');
    let rowSum = 0;
    for(let j = 0; j < n; j++){
            let td = document.createElement('td');
            td.setAttribute('id', `${i}_${j}`);
            td.addEventListener('click', addOnClick.bind(null,td)); // при натисканні на комірку викликається функція  addOnClick(this) this - поточна комірка. Функція збільшує значення комірки на 1
            td.classList.add('cell');
            td.addEventListener('mouseover',nearValue.bind(null,td)); // при наведені на комірку викликається функція nearValue(this) в яку передається this - комірка на яку навели
            td.addEventListener('mouseout',cellDefault); //при відведенні курсора з комірки викличется функція cellDefault() яка поверне комірки в білий колір
            
            let randNum = Math.random()*900+100 | 0; //вичисляється рандомне число від 100 до 999 (тризначне як в умов), операція | 0 відсікає дробову частину
            td.innerText = randNum;
            td.dataset.amount = randNum;
            
            let div = document.createElement('div');
            div.setAttribute('id','fill_div');
            td.appendChild(div);
            rowSum += randNum;      //підраховується сума по рядку
            colSum[j] += randNum;   //підраховується сума по стовпцю
            tr.appendChild(td);   
    }

    let sumTd = document.createElement('td');
    let del = document.createElement('td');  // створення кнопки видалення рядка
    sumTd.setAttribute('id', `${i}_sum`);
    sumTd.classList.add('sum_td');
    sumTd.dataset.amount = rowSum;
    sumTd.addEventListener('mouseover', mouseOverHendler.bind(null,sumTd)); // при наведені на комірку суми рядка викликається функція mouseOverHendler(this) в яку передається this - комірка на яку навели
    sumTd.addEventListener('mouseout', mouseOutHendler.bind(null,sumTd)); //при відведенні курсора з комірки викличется функція mouseOutHendler(this) яка поверне комірки в білий колір
    sumTd.innerText = rowSum;
    
    del.classList.add('del');
    del.addEventListener('click', delRow.bind(null,del));
    del.innerHTML = '&times';    //в комірку з кнопкою видалення введеться спец символ X
    
    tr.appendChild(sumTd);
    tr.appendChild(del);
    
    obj.appendChild(tr);
}

// додає новий рядок в кінець таблиц, збільшуючи значення m (кількість рядків на 1)
function addNewRow(){
    createRow(matrixTable,m++); // дана функція була описана вище
    avgUpdate(); //переобчислює середні значення по стовпцю (описана нижче)
}

// збільшує значення комірки на 1 і переобчислює суму рядка і середнє значення стовпця
function addOnClick(cell){
    incAmount(cell,1000); //збільшє значення комірки якщо воно не більше за значення другого аргументу в даному випадку 1000

    let row = cell.getAttribute('id').split('_')[0];  //витякує з комірки значення атрибуту id і бере значення рядка яке знаходиться перед символом _
    let col = cell.getAttribute('id').split('_')[1];  //витякує з комірки значення атрибуту id і бере значення стовпця яке знаходиться після символу _

    let sumTd = document.getElementById(`${row}_sum`); //бере комірку суми з відповідним номером рядка
    let avgTd = document.getElementById(`${col}_avg`); //бере комірку середнього значення стовпця з відповідним номером стовпця
    incAmount(sumTd, 99999); //збільшує суму на 1
    incAvg(avgTd,col); //переобчиснює середнє значення стовпця
    nearValue(cell); //знаходить комірки з найближчим значенням value
}

//функція для збільшення значення комірки на 1
function incAmount(obj,lim){
    let num = Number(obj.innerText) + 1; 
    if(num < lim) obj.innerText = num;
    obj.dataset.amount = num;
}

//перераховує середнього значення по стовпцю за переданим значеннями obj - комырки яка була змынена та індексом стовпця
function incAvg(obj,index){
    let num = ++colSum[index]; 
    obj.innerText = ((num+1) / Number(m)).toFixed(3);
}

// функція при наведені курсора на комірку суми
function mouseOverHendler(obj){
    let collection = obj.parentElement.getElementsByClassName('cell'); //з рядка в якому знаходиться комірка суми на яку було наведено витягуэться масив комірок зі значеннями
    let elements = Array.from(collection); //масив який було отримано, являється htmlColection і ми її переводим до типу Array для подальшої роботи
    elements.forEach(e => { //перебираєм кожну комірку з масиву
        let persent = (Number(e.dataset.amount) * 100 / Number(obj.dataset.amount)).toFixed(1); //вичисляє відсоток вкладу комірки в загальну суму, і округлює його до 1 знаку після коми
        e.innerText = `${persent}%`; //заміняє значення в комірках, на значення відсотків
        e.style.background = `linear-gradient(to top, aqua ${persent/100*42}px, white ${1}px)`; //заливає градієнтом, відповідно до значення відсотку
    }) 
}

// функція при знятті курсора з комірки суми
function mouseOutHendler(obj){
    let collection = obj.parentElement.getElementsByClassName('cell');
    let elements = Array.from(collection);
    elements.forEach(e => {
        e.innerText = e.dataset.amount;
        e.style.background = `white`;
    }) 
}

// перераховує середні значення по стовпцях
function avgUpdate(){
    let td = avgTable.getElementsByClassName('avgTd');
    let i = 0;
    colSum.forEach(num => {
        td[i].innerText = (num/m).toFixed(3);
        i++;
    })
}

// видаляє рядок і зменшує значення М на 1 
function delRow(obj){
    if(m > 1){ // якщо залишився 1 рядок - не видаляти його
        obj.parentElement.remove();
        m--;
        cells = obj.parentElement.getElementsByClassName('cell');
        for(let i = 0; i < n; i++){
            colSum[i] =  colSum[i] - Number(cells[i].innerText);
        }
        avgUpdate();
    }
}

// визначає комірки з найближчим значенням
function nearValue(obj){
    let num = Number(obj.dataset.amount); // визначає значення поточної комірки
    let arrayOfCells = Array.from(matrixTable.getElementsByClassName('cell')); //збирає усі комірки з таблиці
    let arr = arrayOfCells.map(e => e.innerText);   //забирає значення усіх комірок

    for(let i = 0; i < arr.length; i++ ){  //сортує масив, по зростанню різниці зачення комірки на яку було наведено до значення решти комірок 
        for(let j = 0; j < arr.length; j++ ){
            if(Math.abs(arr[i]-num) < Math.abs(arr[j]-num)){
                let temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }   
    }
    // відповідно до відсортованого масиву, проходить усі комірки, і шукає співпадіння з першими X елементами відсортованого масиву
        const xClosestElements = arr.slice(0,x + 1);
        console.log(x);
        console.log(xClosestElements);
        arrayOfCells.forEach(e =>{
            const value = e.innerText;
            if(xClosestElements.includes(value)){
                e.style.background = `red`; // в разі співпадіння зафарбовує червоним 
            }
        })
}

// функція зафарбовує усі комірки таблиці в білий
function cellDefault(){
    let arrayOfCells = Array.from(matrixTable.getElementsByClassName('cell'));
    arrayOfCells.forEach(e =>{
        e.style.background = 'white';
    })
}