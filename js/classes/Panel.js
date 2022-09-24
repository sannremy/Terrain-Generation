/*
 * @author Sann-Remy Chea / http://sannremy.com/
 * Controllers
 */

Panel = function() {
	this.segmentsWarnLimit = 513;
	
	this.scene = new Scene();
		
	this.width = _getSelectedIntValue('width');
	this.height = _getSelectedIntValue('height');
	this.segments = Math.pow(2, _getSelectedIntValue('segments'));
	this.smoothingFactor = _getSelectedIntValue('smoothingfactor');
	
	this.texture = _getSelectedIntValue('texture');
	this.fog = _getSelectedIntValue('fog');
	
	this.border = document.getElementById('border').checked;
	this.info = document.getElementById('showinfo').checked;
	
	// functions
	this.generateTerrain = function() {
		var segments_old = _getSelectedIntValue('segments');
		this._updateParams();
		if(this.segments >= this.segmentsWarnLimit && !confirm("The number of segments is high, this may take several minutes to compute.\nDo you really want to continue?")) {
			document.getElementById('segments').value = segments_old;
			this.segments = Math.pow(2, segments_old);
		}
		else {
			this.scene.updateTerrain(this.width, this.height, this.segments, this.smoothingFactor);
		}
	};

	this.toggleBorder = function() {
		this._updateParams();
		this.scene.setBorder(this.border);
	};

	this.toggleInfo = function() {
		this._updateParams();
		this.scene.setInfo(this.info);
	};

	this.changeFog = function() {
		this._updateParams();
		this.scene.setFog(this.fog);
	};
	
	this.changeTexture = function() {
		this._updateParams();
		var texture;
		switch(this.texture) {
			case 1 : texture = 'images/textures/grass.jpg'; break;
			case 2 : texture = 'images/textures/sand.jpg'; break;
			case 3 : texture = 'images/textures/rock.jpg'; break;
			default : texture = null; break;
		}
		this.scene.setTexture(texture);
	};
	
	// internals
	this._updateParams = function() {	
		this.width = _getSelectedIntValue('width');
		this.height = _getSelectedIntValue('height');
		this.segments = Math.pow(2, _getSelectedIntValue('segments'));
		this.smoothingFactor = _getSelectedIntValue('smoothingfactor');
		
		this.texture = _getSelectedIntValue('texture');
		this.fog = _getSelectedIntValue('fog');
		
		this.border = document.getElementById('border').checked;
		this.info = document.getElementById('showinfo').checked;
	};
	
	function _getSelectedIntValue(element) {
		var value = document.getElementById(element).options[document.getElementById(element).selectedIndex].value;
		if(value % 1 == 0)
			return parseInt(value);
		else
			return parseFloat(value);
	};
};
