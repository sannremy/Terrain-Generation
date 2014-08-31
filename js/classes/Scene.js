/*
 * @author Sann-Remy Chea / http://srchea.com/
 * Add or replace or remove elements in the scene
 */
Scene = function() {
	// scene
	this.scene = new THREE.Scene();
	this.viewport = document.getElementById('viewport');
	
	// camera
	this.fov = 50,
	this.aspect = window.innerWidth/window.innerHeight;
	this.near = 1;
	this.far = 100000;
	this.camera = new THREE.PerspectiveCamera(this.fov, this.aspect, this.near, this.far);
	this.camera.position.set(0, 180, 875);
	this.scene.add(this.camera);
	
	// controls
	this.controls = new THREE.FirstPersonNavigationControls(this.camera, this.viewport);
	
	// frame per second computation
	this.lastDate = (new Date()).getTime();
	this.frames = 0;
	this.fps = 0;

	this.width = 1000;
	this.height = 500;
	this.segments = 64;
	this.smoothingFactor = 60;
	this.terrain = new Array();
	this.border = true;
	this.info = false;
	this.fog = 0.001;
	this.deepth = -1;
	this.deepthGround = -80;

	this.texture = 'images/textures/grass.jpg';
	this.textureObject = THREE.ImageUtils.loadTexture(this.texture);
	this.textureObject.wrapS = THREE.RepeatWrapping;
	this.textureObject.wrapT = THREE.RepeatWrapping;
	this.textureRepeatX = Math.ceil(this.width / 100);
	this.textureRepeatY = Math.ceil(this.height / 100);
	this.textureObject.repeat.set(this.textureRepeatX, this.textureRepeatY);

	this.material = new THREE.MeshBasicMaterial({
		map: this.textureObject
	});

	this.materialGround = new THREE.MeshPhongMaterial({
		color: 0x826F26,
	});

	this.hemisphereLight = new THREE.HemisphereLight(0xC0C0C0, 0x826F26); // soft white light
	this.scene.add(this.hemisphereLight);

	this.geometry = null;
	this.geometryGround = null;
	this.mesh = null;
	this.meshGround = null;
	this.renderer = null;
	this.combined = null;
	this.combinedGround = null;
	
	// function
	this.init = function() {
		this.updateTerrain(this.width, this.height, this.segments, this.smoothingFactor);
		
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		this.renderer.setSize(window.innerWidth, window.innerHeight);

		this.viewport.appendChild(this.renderer.domElement);
	};
	
	this.updateTerrain = function(width, height, segments, smoothingFactor) {
		this.width = width;
		this.height = height;
		this.segments = segments;
		this.smoothingFactor = smoothingFactor;
		
		var terrainGeneration = new TerrainGeneration(this.width, this.height, this.segments, this.smoothingFactor);
		this.terrain = terrainGeneration.diamondSquare();
		
		this.geometry = new THREE.PlaneGeometry(this.width, this.height, this.segments, this.segments);
		this.geometryGround = new THREE.PlaneGeometry(this.width, this.height, this.segments, this.segments);
		var index = 0;
		for(var i = 0; i <= this.segments; i++) {
			for(var j = 0; j <= this.segments; j++) {
				this.geometry.vertices[index].z = this.terrain[i][j];
				this.geometryGround.vertices[index].z = this.terrain[i][j] + this.deepth;
				index++;
			}
		}
		
		this.setBorder(this.border);
		this.setFog(this.fog);
		this.setTexture(this.texture);
	};
	
	this.setBorder = function(border) {
		this.border = border;
		this.combined = new THREE.Geometry();
		this.combinedGround = new THREE.Geometry();
		this.scene.remove(this.mesh);
		this.scene.remove(this.meshGround);

		// sides
		var leftGeometry = new THREE.PlaneGeometry(this.width, 10, this.segments, 1),
			leftGroundGeometry = new THREE.PlaneGeometry(this.width, 10, this.segments, 1),
			a = 0;

		for(var i = this.segments; i >= 0; i--) {
			leftGeometry.vertices[a].z = this.terrain[0][i];
			leftGeometry.vertices[a].y = -this.height/2;
			if(this.border) {
				leftGroundGeometry.vertices[a].z = this.terrain[0][i] + this.deepth;
				leftGroundGeometry.vertices[a].y = -this.height/2;
			}
			a++;
		}
		for(var i = this.segments; i >= 0; i--) {
			leftGeometry.vertices[a].z = this.terrain[0][i] + this.deepth;
			leftGeometry.vertices[a].y = -this.height/2;
			if(this.border) {
				leftGroundGeometry.vertices[a].z = this.deepthGround;
				leftGroundGeometry.vertices[a].y = -this.height/2;
			}
			a++;
		}
		
		var rightGeometry = new THREE.PlaneGeometry(this.width, 10, this.segments, 1),
			rightGroundGeometry = new THREE.PlaneGeometry(this.width, 10, this.segments, 1);
		a = 0;
		for(var i = 0; i <= this.segments; i++) {
			rightGeometry.vertices[a].z = this.terrain[this.segments][i];
			rightGeometry.vertices[a].y = -this.height/2;
			if(this.border) {
				rightGroundGeometry.vertices[a].z = this.terrain[this.segments][i] + this.deepth;
				rightGroundGeometry.vertices[a].y = -this.height/2;
			}
			a++;
		}
		for(var i = 0; i <= this.segments; i++) {
			rightGeometry.vertices[a].z = this.terrain[this.segments][i] + this.deepth;
			rightGeometry.vertices[a].y = -this.height/2;
			if(this.border) {
				rightGroundGeometry.vertices[a].z = this.deepthGround;
				rightGroundGeometry.vertices[a].y = -this.height/2;
			}
			a++;
		}
		
		var topGeometry = new THREE.PlaneGeometry(this.height, 10, this.segments, 1),
			topGroundGeometry = new THREE.PlaneGeometry(this.height, 10, this.segments, 1);
		a = 0;
		
		for(var i = this.segments; i >= 0; i--) {
			topGeometry.vertices[a].z = this.terrain[i][0];
			topGeometry.vertices[a].x = -this.width/2;
			topGeometry.vertices[a].y = this.height/2-a*(this.height/this.segments);
			if(this.border) {
				topGroundGeometry.vertices[a].z = this.terrain[i][0] + this.deepth;
				topGroundGeometry.vertices[a].x = -this.width/2;
				topGroundGeometry.vertices[a].y = this.height/2-a*(this.height/this.segments);
			}
			a++;
		}
		for(var i = this.segments; i >= 0; i--) {
			topGeometry.vertices[a].z = this.terrain[i][0] + this.deepth;
			topGeometry.vertices[a].x = -this.width/2;
			topGeometry.vertices[a].y = this.height/2-(this.segments - i)*(this.height/this.segments);
			if(this.border) {
				topGroundGeometry.vertices[a].z = this.deepthGround;
				topGroundGeometry.vertices[a].x = -this.width/2;
				topGroundGeometry.vertices[a].y = this.height/2-(this.segments - i)*(this.height/this.segments);
			}
			a++;
		}
		
		var bottomGeometry = new THREE.PlaneGeometry(this.height, 10, this.segments, 1),
			bottomGroundGeometry = new THREE.PlaneGeometry(this.height, 10, this.segments, 1);
		a = 0;
		
		for(var i = 0; i <= this.segments; i++) {
			bottomGeometry.vertices[a].z = this.terrain[i][this.segments];
			bottomGeometry.vertices[a].x = -this.width/2;
			bottomGeometry.vertices[a].y = this.height/2-i*(this.height/this.segments);
			if(this.border) {
				bottomGroundGeometry.vertices[a].z = this.terrain[i][this.segments] + this.deepth;
				bottomGroundGeometry.vertices[a].x = -this.width/2;
				bottomGroundGeometry.vertices[a].y = this.height/2-i*(this.height/this.segments);
			}
			a++;
		}
		for(var i = 0; i <= this.segments; i++) {
			bottomGeometry.vertices[a].z = this.terrain[i][0] + this.deepth;
			bottomGeometry.vertices[a].x = -this.width/2;
			bottomGeometry.vertices[a].y = this.height/2-i*(this.height/this.segments);
			if(this.border) {
				bottomGroundGeometry.vertices[a].z = this.deepthGround;
				bottomGroundGeometry.vertices[a].x = -this.width/2;
				bottomGroundGeometry.vertices[a].y = this.height/2-i*(this.height/this.segments);
			}
			a++;
		}
		
		// base
		var baseGeometry = new THREE.PlaneGeometry(this.width, this.height, this.segments, this.segments),
			baseGroundGeometry = new THREE.PlaneGeometry(this.width, this.height, 1, 1);
		baseGeometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI));
		baseGroundGeometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI));
		a = 0;
		for(var i = this.segments; i >= 0; i--) {
			for(var j = 0; j <= this.segments; j++) {
				baseGeometry.vertices[a].z = this.terrain[i][j] + this.deepth;
				a++;
			}
		}

		if(this.border) {
			for(var i = 0; i < baseGroundGeometry.vertices.length; i++) {
				baseGroundGeometry.vertices[i].z = this.deepthGround;
			}

			leftGroundGeometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI));
			leftGroundGeometry.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI));
			topGroundGeometry.applyMatrix(new THREE.Matrix4().makeRotationZ(Math.PI));

			this.combinedGround.merge(leftGroundGeometry);
			this.combinedGround.merge(rightGroundGeometry);
			this.combinedGround.merge(topGroundGeometry);
			this.combinedGround.merge(bottomGroundGeometry);
			this.combinedGround.merge(baseGroundGeometry);
			
			this.combinedGround.merge(this.geometryGround);
			this.meshGround = new THREE.Mesh(this.combinedGround, this.materialGround);
			this.meshGround.rotation.x = Math.PI / 180 * (-90);
			this.scene.add(this.meshGround);
		}

		leftGeometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI));
		leftGeometry.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI));
		topGeometry.applyMatrix(new THREE.Matrix4().makeRotationZ(Math.PI));
		
		this.combined.merge(leftGeometry);
		this.combined.merge(rightGeometry);
		this.combined.merge(topGeometry);
		this.combined.merge(bottomGeometry);
		this.combined.merge(baseGeometry);
		
		this.combined.merge(this.geometry);
		this.mesh = new THREE.Mesh(this.combined, this.material);
		
		this.mesh.rotation.x = Math.PI / 180 * (-90);
		this.scene.add(this.mesh);
	};
	
	this.setInfo = function(info) {
		this.info = info;
	};
	
	this.setTexture = function(texture) {
		this.texture = texture;
		if(this.texture !== null) {
			this.textureObject = THREE.ImageUtils.loadTexture(this.texture);
			this.textureObject.wrapS = THREE.RepeatWrapping;
			this.textureObject.wrapT = THREE.RepeatWrapping;
			this.textureRepeatX = Math.ceil(this.width / 100);
			this.textureRepeatY = Math.ceil(this.height / 100);
			this.textureObject.repeat.set(this.textureRepeatX, this.textureRepeatY);

			this.material = new THREE.MeshBasicMaterial({
				map: this.textureObject
			});

			this.materialGround = new THREE.MeshPhongMaterial({
				color: 0x826F26,
			});
		}
		else {
			this.material = new THREE.MeshBasicMaterial({
				color : 0x808080,
				wireframe : true
			});

			this.materialGround = new THREE.MeshBasicMaterial({
				color : 0x808080,
				wireframe : true
			});
		}
		
		this.scene.remove(this.mesh);
		this.scene.remove(this.meshGround);
		if(this.border) {
			this.mesh = new THREE.Mesh(this.combined, this.material);
			this.meshGround = new THREE.Mesh(this.combinedGround, this.materialGround);
		}
		else {
			this.mesh = new THREE.Mesh(this.geometry, this.material);
			this.meshGround = new THREE.Mesh(this.geometryGround, this.materialGround);
		}
		
		this.meshGround.rotation.x = Math.PI / 180 * (-90);
		this.scene.add(this.meshGround);
		this.mesh.rotation.x = Math.PI / 180 * (-90);
		this.scene.add(this.mesh);
	};
	
	this.setFog = function(fog) {
		this.fog = fog;
		this.scene.fog = new THREE.FogExp2(0x000000, this.fog);
	};
	
	this.updateInfo = function() {
		// fps computation
		this.frames++;
		var nowDate = (new Date()).getTime();
		if(nowDate > this.lastDate+1000) {
			this.fps = Math.round((this.frames*1000)/(nowDate-this.lastDate));
			this.lastDate = nowDate;
			this.frames = 0;
		}
		
		// camera location and angle
		document.getElementById('debug').innerHTML =
			'-----<br />Camera position: ('+Math.round(this.camera.position.x)+', '+Math.round(this.camera.position.y)+', '+Math.round(this.camera.position.z)
			+')<br />Camera rotation: ('+Math.round(this.camera.rotation.x*100)/100+', '+Math.round(this.camera.rotation.y*100)/100+', '+Math.round(this.camera.rotation.z*100)/100+')'
			+'<br />'+this.fps+' FPS';
	};
	
	this.render = function() {
		this.controls.update(1);
		this.renderer.render(this.scene, this.camera);
		if(this.info)
			this.updateInfo();
		else
			document.getElementById('debug').innerHTML = '';
	};
};