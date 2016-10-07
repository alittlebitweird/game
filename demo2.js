function render() {
    scene.clear();
    tiles.forEach(tile => tile.fill('gray'));

    player.resolve(tiles);
    player.fill('steelblue');

    scene.context.fillStyle = 'orange';
    scene.context.fillRect(3, 150, 10, player.airLeft);
    scene.context.fillRect(13, 150, 10, player.vy);
}

scene = new Scene(300, 300);
player = new Platformer(70, 250, 50, 50);
tiles = [
    new Box(50, 50, 200, 10),
    new Box(50, 51, 10, 100),
    new Box(150, 151, 10, 50),
];

window.setInterval(render, 1000/60);
