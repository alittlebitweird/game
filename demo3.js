var rows = textarea.value.split('\n').reverse();
scene = new Scene(300, 300);
scene.context.fillStyle = 'green';
makeTile = (i,j,cell) => scene.context.fillRect(j*100, i*100, 100, 100);
rows.forEach((row, i)=>row.split('').forEach((cell,j)=>makeTile(i,j,cell)));
