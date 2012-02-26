var panel = new Panel();

panel.scene.init();
animate();

function animate() {
	requestAnimationFrame(animate);
	panel.scene.render();
}

//events
document.getElementById('border').addEventListener('click', function() { panel.toggleBorder(); }, false);
document.getElementById('fog').addEventListener('change', function() { panel.changeFog(); }, false);
document.getElementById('texture').addEventListener('change', function() { panel.changeTexture(); }, false);
document.getElementById('showinfo').addEventListener('click', function() { panel.toggleInfo(); }, false);
document.getElementById('generate').addEventListener('click', function() { panel.generateTerrain(); }, false);
document.addEventListener('keydown', function(event) {
	if(event.keyCode == 13) // enter
		panel.generateTerrain();
}, false);

//mouse styles
document.getElementById('viewport').addEventListener('mousedown', function() {
	document.body.style.cursor = 'url(images/cursors/closedhand.cur), default';
}, false);

document.getElementById('viewport').addEventListener('mouseup', function() {
	document.body.style.cursor = 'url(images/cursors/openhand.cur), default';
}, false);