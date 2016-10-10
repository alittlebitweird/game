// Generate Sequencer Table
var sequencer = [
  [' ', ' ', ' ', ' ', '@', '@', '@', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', '/', '/', '/'],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', '.', '.', '.'],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',' ', ' ', ' ', ' ', '/', '/', '/', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', '.', '|', '.'],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',' ', ' ', ' ', ' ', '.', '.', '.', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', '#', '#', '#'],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '.', '|', '.', ' ', ' ', ' ',' ', ' ', ' ', '#', '#', ' ', ' ', ' ', ' '],
  ['#', '#', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '#', '#', '#', '#', ' ', ' ', '#','#', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  ['#', '#', '#', '#', '#', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '#', '#', '#', '#', ' ', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
];
   
var sequencerTable = document.getElementById('sequencer');

function setTileClass(tile) {
  if (tile == '.') {
    td.className = 'walls';
  } else if (tile == '#') {
    td.className = 'tiles';
  } else if (tile == '|') {
    td.className = 'doors';
  } else if (tile == '/') {
    td.className = 'roofs';
  } else if (tile == '@') {
    td.className = 'clouds'
  }
}
  
for (var y = 0; y < sequencer.length; y++) {
  var tr = document.createElement('tr');
  var s = sequencer[y];

  for (var x = 0; x < s.length; x++) {
    var td = document.createElement('td');
    td.setAttribute('data-tile-type', s[x]);
    setTileClass(s[x]);
    td.innerHTML = s[x];
    tr.appendChild(td);
  }
  sequencerTable.appendChild(tr);
}

function addInsertRow() {
  sequencerTable.insertRow(0);
  var row = sequencerTable.rows[0]
  for (x = 0; x < sequencerTable.rows[1].cells.length; x++) {
    var td = document.createElement('td');
    td.innerHTML = '<';
    td.className = 'insert-column';
    sequencerTable.rows[0].appendChild(td);
  }
}
addInsertRow();

function removeInsertRow() {
  sequencerTable.deleteRow(0);
}

// Add column to table
document.addEventListener('click', function(e) {
  e = e || window.event;
  var target = e.target || e.srcElement;
  if (target.className.includes('insert-column')) {
    insertColumn(target.cellIndex);
  }

}, false);

function insertColumn(rowNumber) {
  removeInsertRow();
  for (var y = 0; y < sequencer.length; y++) {
    row = sequencerTable.rows[y];
    row.insertCell(rowNumber);
    row.cells[rowNumber].innerHTML = ' ';
  }
  addInsertRow();
  makeAllTiles();
}

// Remove column from table
document.addEventListener('contextmenu', function(e) {
  e = e || window.event;
  var target = e.target || e.srcElement;
  if (target.className.includes('insert-column')) {
    removeInsertRow();
    deleteColumn(target.cellIndex);
    addInsertRow();
  }

}, false);

function deleteColumn(rowNumber) {
  for (var y = 0; y < sequencer.length; y++) {
    row = sequencerTable.rows[y];
    row.deleteCell(rowNumber);
  }
  makeAllTiles();
}

// Get Tile Name & Type From Select
function getTileNameAndTypeFromSelect() {
  var select = document.getElementById('brush-select');
  return [select.options[select.selectedIndex].text.toLowerCase(), select.options[select.selectedIndex].value];
}

function getTileNameFromSelect() {
  var select = document.getElementById('brush-select');
  return select.options[select.selectedIndex].text.toLowerCase();
}

// Paint on click
document.addEventListener('click', function(e) {
  e = e || window.event;
  var target = e.target || e.srcElement;
  if (e.srcElement.localName == 'td' && !target.className.includes('insert-column')) {
    paint(target);
  }
  makeAllTiles();
}, false);

function paint(tile) {
  var tileNameAndType = getTileNameAndTypeFromSelect();
  tile.className = tileNameAndType[0];
  tile.setAttribute('data-tile-type', tileNameAndType[1]);
  tile.innerHTML = tileNameAndType[1];
}

// Erase on right click
document.addEventListener('contextmenu', function(e) {
  e = e || window.event;
  var target = e.target || e.srcElement;
  if (e.srcElement.localName == 'td') {
    e.preventDefault();
    e.target.className = '';
    e.target.setAttribute('data-tile-type', ' ');
    e.target.innerHTML = ' ';

  }
}, false);


// Harold Code
// Textarea generation
//textarea = document.createElement("textarea");
//textarea.rows = 10;
//textarea.cols = 30;
//textarea.value = `
//    @@@                   ///
//                          ...
//            ///           .|.
//            ...           ###
//            .|.        ##
//##         #####   ##
//#####     ####
//##############`
//textarea.onkeyup = makeAllTiles;

function loadFromHash() {
  try {
    return atob(location.hash.slice(1))
  } catch(error) {
    console.log(error);
    console.log(location.hash);
    return ''
  }
}

function makeTiles(symbol) {
  //location.hash = btoa(textarea.value);
  location.hash = btoa(rows);

  //var rows = textarea.value.split('\n').reverse();
  //console.log(rows)
  //console.log(rows
  //        .map((row, i)=>row.split('').map((cell,j)=>cell===symbol?new Box(j*40, i*40, 40, 40):null))
  //        .reduce((a,b) => a.concat(b))
  //        .filter(a=>a));
  var rows = []
  for (var y = 0; y < sequencerTable.rows.length; y++) {
    var row = sequencerTable.rows[y];
    var rowData = ''
    for (var x = 0; x < row.cells.length; x++) {
      rowData += row.cells[x].innerHTML;
    }
    rows.push(rowData)
  }
  rows = rows.reverse();

  return rows
          .map((row, i)=>row.split('').map((cell,j)=>cell===symbol?new Box(j*40, i*40, 40, 40):null))
          .reduce((a,b) => a.concat(b))
          .filter(a=>a);
}

function makeAllTiles() {
  walls = makeTiles('.');
  tiles = makeTiles('#');
  doors = makeTiles('|');
  roofs = makeTiles('/');
  clouds = makeTiles('@');
}

function render() {
  scene.clear('lightblue');

  scene.lock(player);

  scene.context.fillStyle = 'green';
  tiles.forEach(tile=>tile.fill('green'));
  walls.forEach(tile=>tile.fill('white'));
  doors.forEach(tile=>tile.fill('brown'));
  roofs.forEach(tile=>tile.fill('red'));
  clouds.forEach(tile=>tile.fill('white'));

  player.resolve(tiles);
  player.fill('steelblue');

  scene.unlock();
}

scene = new Scene(600, 300);
player = new Platformer(100, 200, 30, 35);

makeAllTiles();

//document.body.appendChild(textarea);
render();
window.setInterval(render, 1000/60);

