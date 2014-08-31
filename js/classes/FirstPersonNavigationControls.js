/*
 * @author Sann-Remy Chea / http://srchea.com/
 * FirstPersonNavigationControls class enables the mouse drag and drop and arrow keys for navigation.
 * Dependance: FirstPersonControls.js (included in Three.js)
 */

THREE.FirstPersonNavigationControls = function(object, domElement) {
	this.object = object;
	this.object.target = new THREE.Vector3(0, 0, 0);
	
	this.domElement = domElement;
	
	this.firstPersonControls = new THREE.FirstPersonControls(this.object, this.domElement);
	
	this.inverseDirection = true;
	this.velocity = 0.08;
	
	// initialization of FirstPersonControls variables
	this.firstPersonControls.movementSpeed = 5.0;
	this.firstPersonControls.lookSpeed = 0.005;
	this.firstPersonControls.noFly = true;
	this.firstPersonControls.activeLook = false;
	this.firstPersonControls.constrainVertical = true;
	this.firstPersonControls.verticalMin = 0;
	this.firstPersonControls.verticalMax = 0;
	
	// internals (for drag and drop)
	this._mouseDown = false;
	this._lon = 1;
	this._lat = 0;
	this._phi = 0;
	this._theta = 0;
	this._mouseDownX = 0;
	this._mouseDownY = 0;
	this._mouseDownLon = 0;
	this._mouseDownLat = 0;
	
	// functions
	this.setDomElement = function(domElement) {
		this.domElement = domElement;
		this.firstPersonControls.domElement = this.domElement;
	};
	
	// event functions
	this.onMouseDown = function(event) {
		event.preventDefault();
		
		this._mouseDown = true;
		
		this._mouseDownX = event.clientX;
		this._mouseDownY = event.clientY;
		
		this._mouseDownLon = this._lon;
		this._mouseDownLat = this._lat;
	};
	
	this.onMouseMove = function(event) {
		if(this._mouseDown) {
			var dragDirection = this.inverseDirection ? 1 : -1;
			this._lon = this._mouseDownLon+(dragDirection)*(this._mouseDownX-event.clientX)*this.velocity;
			this._lat = this._mouseDownLat+(dragDirection)*(event.clientY-this._mouseDownY)*this.velocity;
		}
	};
	
	this.onMouseUp = function(event) {
		this._mouseDown = false;
	};
	
	// update function
	this.update = function(delta) {
		this.firstPersonControls.update(delta);
		
		this._lat = Math.max(-90, Math.min(90, this._lat));
		this._phi = (90-this._lat)*Math.PI/180;
		this._theta = this._lon * Math.PI/180;
		
		this.object.target.x = Math.sin(this._phi)*Math.cos(this._theta);
		this.object.target.y = Math.cos(this._phi);
		this.object.target.z = Math.sin(this._phi)*Math.sin(this._theta);
		
		var x = THREE.Matrix4.__v1,
		y = THREE.Matrix4.__v2,
		z = THREE.Matrix4.__v3;
		
		z.x = -this.object.target.x;
		z.y = -this.object.target.y;
		z.z = -this.object.target.z;
		z.normalize();

		if (z.length() === 0)
			z.z = 1;

		x.cross(this.object.up, z).normalize();

		if (x.length() === 0) {
			z.x += 0.0001;
			x.cross(this.object.up, z).normalize();
		}

		y.cross(z, x).normalize();

		this.object.matrix.n11 = x.x;
		this.object.matrix.n12 = y.x;
		this.object.matrix.n13 = z.x;
		
		this.object.matrix.n21 = x.y;
		this.object.matrix.n22 = y.y;
		this.object.matrix.n23 = z.y;
		
		this.object.matrix.n31 = x.z;
		this.object.matrix.n32 = y.z;
		this.object.matrix.n33 = z.z;

		if(this.object.rotationAutoUpdate)
			this.object.rotation.setRotationFromMatrix(this.object.matrix);
	};
	
	function bind(scope, fn) {
		return function() {
			fn.apply(scope, arguments);
		};
	};
	
	this.domElement.addEventListener('mousedown', bind(this, this.onMouseDown), false);
	this.domElement.addEventListener('mousemove', bind(this, this.onMouseMove), false);
	this.domElement.addEventListener('mouseup', bind(this, this.onMouseUp), false);
};