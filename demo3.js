// Generate Sequencer Table
var sequencer = [
  ['', '', '', '', '@', '@', '@', '', '', '','', '', '', '', '', '', '', '', '', '','', '', '', '', '', '', '/', '/', '/'],
  ['', '', '', '', '', '', '', '', '', '','', '', '', '', '', '', '', '', '', '','', '', '', '', '', '', '.', '.', '.'],
  ['', '', '', '', '', '', '', '', '', '','', '', '', '', '/', '/', '/', '', '', '','', '', '', '', '', '', '.', '|', '.'],
  ['', '', '', '', '', '', '', '', '', '','', '', '', '', '.', '.', '.', '', '', '','', '', '', '', '', '', '#', '#', '#'],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '.', '|', '.', '', '', '','', '', '', '#', '#', '', '', '', ''],
  ['#', '#', '', '', '', '', '', '', '', '', '', '', '', '#', '#', '#', '#', '', '', '#','#', '', '', '', '', '', '', '', ''],
  ['#', '#', '#', '#', '#', '', '', '', '', '', '', '', '#', '#', '#', '#', '', '', '', '','', '', '', '', '', '', '', '', ''],
  ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
];
   
var table = document.getElementById('sequencer');

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
  
for (var y=0; y < sequencer.length; y++) {
  var tr = document.createElement('tr');
  var s = sequencer[y];

  for (var x=0; x < s.length; x++) {
    var td = document.createElement('td');
    td.setAttribute('data-tile-type', s[x]);
    setTileClass(s[x]);
    td.innerHTML = s[x];
    tr.appendChild(td);
  }
  table.appendChild(tr);
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
  if (e.srcElement.localName == 'td') {
    paint(target);
  }
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
    e.target.setAttribute('data-tile-type', '');
    e.target.innerHTML = '';

  }
}, false);


// Harold Code

textarea = document.createElement("textarea");
textarea.rows = 10;
textarea.cols = 30;
textarea.value = `
    @@@                   ///
                          ...
            ///           .|.
            ...           ###
            .|.        ##
##         #####   ##
#####     ####
##############`
textarea.onkeyup = makeAllTiles;

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
    location.hash = btoa(textarea.value);
    var rows = textarea.value.split('\n').reverse();
    console.log(rows
            .map((row, i)=>row.split('').map((cell,j)=>cell===symbol?new Box(j*40, i*40, 40, 40):null))
            .reduce((a,b) => a.concat(b))
            .filter(a=>a));


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

scene = new Scene(300, 300);
player = new Platformer(100, 200, 30, 35);

makeAllTiles();

document.body.appendChild(textarea);
render();
window.setInterval(render, 1000/60);

