<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Terrain Generation using the diamond-square algorithm, Three.js and WebGL (Live demo) - srchea.com</title>
<link rel="shortcut icon" type="image/png" href="http://srchea.com/blog/wp-content/themes/srchea/images/favicon.png" />
<link rel="stylesheet" type="text/css" href="css/style.css" />
</head>
<body>
<div id="title">Terrain Generation using the <a href="http://www.gameprogrammer.com/fractal.html#diamond">diamond-square algorithm</a>, <a href="https://github.com/mrdoob/three.js/">Three.js</a> and <a href="http://www.khronos.org/webgl/">WebGL</a><br /><span id="debug"></span></div>
<div id="panel">
	<ul>
		<?php $options = ''; for($i = 2; $i <= 10000; $i++) $options .= '<option value="'.$i.'"'.($i === 500 ? ' selected="selected"' : '').'>'.$i.' px</option>'; ?>
		<li><label>Width<br /><select id="width"><?php echo $options; ?></select></label></li>
		<li><label>Height<br /><select id="height"><?php echo $options; ?></select></label></li>
		<li><label>Segments<br /><select id="segments"><?php for($i = 1; $i <= 14; $i++) echo '<option value="'.$i.'"'.($i === 6 ? ' selected="selected"' : '').'>'.(pow(2, $i)+1).'</option>'; ?></select></label></li>
		<li><label>Smoothing factor<br /><select id="smoothingfactor"><?php for($i = 0; $i <= 2000; $i++) echo '<option value="'.$i.'"'.($i === 60 ? ' selected="selected"' : '').'>'.$i.'</option>'; ?></select></label></li>
		<li><input id="generate" type="button" value="Generate" /></li>
		<li style="margin-top: 20px;"><label>Texture<br /><select id="texture"><option value="0">None</option><option value="1" selected="selected">Grass</option><option value="2">Sand</option><option value="3">Rock</option></select></label></li>
		<li><label>Fog<br /><select id="fog"><option value="0">None</option><option value="0.0003">0.0003</option><option value="0.0004">0.0004</option><option value="0.0005">0.0005</option><option value="0.0006">0.0006</option><option value="0.0007">0.0007</option><option value="0.0008">0.0008</option><option value="0.0009">0.0009</option><option value="0.001" selected="selected">0.001</option><option value="0.0011">0.0011</option><option value="0.0012">0.0012</option><option value="0.0013">0.0013</option><option value="0.0014">0.0014</option><option value="0.0015">0.0015</option><option value="0.0016">0.0016</option><option value="0.0017">0.0017</option><option value="0.0018">0.0018</option><option value="0.0019">0.0019</option><option value="0.002">0.002</option><option value="0.0021">0.0021</option><option value="0.0022">0.0022</option><option value="0.0023">0.0023</option><option value="0.0024">0.0024</option><option value="0.0025">0.0025</option><option value="0.0026">0.0026</option><option value="0.0027">0.0027</option><option value="0.0028">0.0028</option><option value="0.0029">0.0029</option><option value="0.003">0.003</option></select></label></li>
		<li><label>Border <input type="checkbox" id="border" /></label></li>
		<li><label>Show info <input type="checkbox" id="showinfo" /></label></li>
	</ul>
</div>
<div id="commands">Drag with the mouse and press a, w, d, s or &larr;, &uarr;, &rarr;, &darr; and r, f keys for navigation</div>
<div id="info"><a href="http://srchea.com">srchea.com</a> | <a href="http://twitter.com/srchea">Follow me</a></div>
<div id="viewport"></div>
<script src="js/classes/Three.js"></script>
<script src="js/classes/FirstPersonNavigationControls.js"></script>
<script src="js/classes/RequestAnimationFrame.js"></script>
<script src="js/classes/TerrainGeneration.js"></script>
<script src="js/classes/Scene.js"></script>
<script src="js/classes/Panel.js"></script>
<script src="js/front.js"></script>
</body>
</html>