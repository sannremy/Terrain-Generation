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
	this._lon = -90;
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
			this._lat = this._mouseDownLat+(dragDirection)*(this._mouseDownY-event.clientY)*this.velocity;
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

		var x = new THREE.Vector3(),
		y = new THREE.Vector3(),
		z = new THREE.Vector3();
		
		z.set(-this.object.target.x, this.object.target.y, this.object.target.z);
		z.normalize();

		if (z.length() === 0)
			z.z = 1;

		x.crossVectors(this.object.up, z).normalize();

		if (x.length() === 0) {
			z.x += 0.0001;
			x.crossVectors(this.object.up, z).normalize();
		}

		y.crossVectors(z, x).normalize();

		if(this.object.rotationAutoUpdate) {
			this.object.rotation.setFromRotationMatrix(new THREE.Matrix4(
				-x.x, y.x, z.x, 0,
				x.y, -y.y, z.y, 0,
				x.z, y.z, -z.z, 0,
				0, 0, 0, 0
			));
		}
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