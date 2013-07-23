/**
*  -------------  FOUR.js -----------------------
*	@author: Jon Brennecke / http://www.jonbrennecke.com/
*	Custom Library for use with THREE.js by mrdoob / http://mrdoob.com/
*/

var FOUR = FOUR || { META: 'FOUR.js library by Jon Brennecke'};

FOUR.StartButton = function() {
	this.div = document.getElementById('start') || document.createElement('div');
	this.a = document.createElement('a');
    this.a.setAttribute('onclick','createScene()');
    this.a.id="start_button";
    this.a.className = "action";
    this.a.setAttribute('href',"javascript:void(0)");
    this.a.innerHTML="START";
    this.div.appendChild(this.a);
};

FOUR.StartButton.prototype = {
	remove: function() {
		if(document.getElementById('start_button') && this.a != undefined) {
    		this.a.parentNode.removeChild(this.a);
    	}
	}
};

FOUR.EnterButton = function() {
	if(document.getElementById("start_button")) {
		var tmp = document.getElementById("start_button");
		tmp.parentNode.removeChild(tmp);
	}
	this.div = document.getElementById('start') || document.createElement('div');
    this.a = document.createElement('a');
    this.a.setAttribute('onclick','action()');
    this.a.id="enter_button";
    this.a.className = "action";
    this.a.setAttribute('href',"javascript:void(0)");
    this.a.innerHTML="ENTER";
    this.div.appendChild(this.a);
};

FOUR.EnterButton.prototype = {
	remove: function() {
		if(document.getElementById('enter_button') && this.a != undefined) {
    		this.a.parentNode.removeChild(this.a);
    	}
	}
};

FOUR.Map = function() {
	this.loadStage = 0;
	this.hexArray = [];
	this.scale = 15;
	this.size = 10;
	this.width = 15;
	this.depth = 15;

	this.seaLevel = 6;
	this.groundLevel = 3;
	this.rockLevel = -5;

	this.dirtHeightMap = this.heightGen(3,4); 
	this.rockHeightMap = this.heightGen(3,4);
	this.textures = new FOUR.TextureLoader();

	var s = 2*this.scale;
	this.selector = new THREE.Mesh( new THREE.CubeGeometry( s, s, s, 1, 1, 1), new THREE.MeshLambertMaterial({ 
		color: 0x222222,
		opacity: 0.3,
		transparent: true,
		shading: THREE.FlatShading }) 
	);
};

FOUR.Map.prototype = {

	/**
	*	Load the map
	*/

	load: function() {
		this.textures.loadAll( this.generateArea.bind(this) );
	},

	/**
    *   generates an array for height values
    *	based on http://www.alteredqualia.com/three/examples/geometry_minecraft_fog.html
    */

	heightGen: function(quality, octaves) {
		var simplex = new FOUR.Math.SimplexNoise(),
			output = [], 
			s = this.width*this.depth, 
			z = Math.random()*100;

		for (var i=0;i<octaves;i++) {
			if ( i == 0 ) for ( var j = 0; j < s; j ++ ) output[ j ] = 0;
			for (var j=0;j<s; j++) {
				var x = j % this.width, y = ~~ ( j / this.width );
				output[ j ] -= simplex.noise( x / quality, y / quality, z ) * quality;
			}
			quality *= 4;
		}
		return output;
	},

	/* generate height of particular stack of blocks */
	getDirtHeight: function(i,j) {
		return ~~(this.dirtHeightMap[ i + j * this.width ] * 0.2 );
	},

	getRockHeight: function(i,j) {
		return ~~(this.rockHeightMap[ i + j * this.width ] * 0.2 );
	},

	/* 
    *   creates initial area defined by this.width and this.depth
    */
	generateArea: function() {
		var type;

		// rock layer

		for(var i=0;i<this.width;i++) {
			for(var j=0;j<this.depth;j++){

				var rockH = Math.abs(this.getRockHeight(i,j));

				for(var h = (this.rockLevel-this.groundLevel);h<(-this.groundLevel);h++){
					if ( -h < rockH ) {
						type = this.textures.dirt; 
					} else {
						type = this.textures.rock;
					}

					var obj = type.clone();
			        obj.scale.set(this.scale,this.scale,this.scale);
			        obj.position.set(
			        	2*this.scale*j,
			            2*this.scale*h,
			            2*this.scale*i
			        );  
			        obj.setLocus(i,j);
			        this.hexArray.push(obj); 
			        scene.add(obj);
				}
			}
		}

		// dirt and above
		
		for(var i=0;i<this.width;i++) {
			for(var j=0;j<this.depth;j++){

				var dirtH = Math.abs(this.getDirtHeight(i,j));
				if (dirtH > this.seaLevel) {
					var maxH = dirtH;
				} else {
					var maxH = this.seaLevel;
				}

				for(var h = (-this.groundLevel);h<maxH;h++){
					
					if ( h > (dirtH-1) ) {
						type = this.textures.water;
					} else if (h === (dirtH-1) ) {
						type = this.textures.grassyDirt;
					} else {
						type = this.textures.dirt; 
					}


					var obj = type.clone();
			        obj.scale.set(this.scale,this.scale,this.scale);
			        obj.position.set(
			        	2*this.scale*j,
			            2*this.scale*h,
			            2*this.scale*i
			        );  
			        obj.setLocus(i,j);
			        this.hexArray.push(obj); 
			        scene.add(obj);
				}           
       	 	}
		}

		// display the enter button upon map creation
		enter = new FOUR.EnterButton();
	}
};

/*
*   Tile object, inherits from THREE.Mesh
*/
FOUR.Tile = function(geometry, material) {
    THREE.Mesh.call(this, geometry, material);

    this.locus = {
    	i: undefined,
    	j: undefined
    };
};

FOUR.Tile.prototype = Object.create( THREE.Mesh.prototype );

FOUR.Tile.prototype.setLocus = function(i,j) {
	this.locus.i = i;
	this.locus.j = j;
};

FOUR.Tile.prototype.clone = function() {
	var obj = new FOUR.Tile(this.geometry, this.material);
	obj.locus = this.locus;
	return obj;
};

FOUR.Controls = function() {
	this.pause = false;
	camera.position.set(100,500,200);
	camera.lookAt(new THREE.Vector3(500,0,500));
};

FOUR.Controls.prototype = {
	pauseMenu: function() {

	},

	pauseControls: function() {
		this.pause = true;
	},

	unpauseControls: function() {
		this.pause = false;
	},

	/*
	* 	Flying First-Person Camera Controls 
	*/

	update: function() {
		if(this.pause === false) {
			camera.matrixAutoUpdate = false;
			camera.updateMatrix();
			var delta = clock.getDelta(); // seconds.
	    	var moveDistance = 200 * delta; // 200 pixels per second
	
			var vector = new THREE.Vector3( .03*mouse.x, .05*mouse.y, .05 );
		    projector.unprojectVector( vector, camera );
		    var ray = new THREE.Ray( camera.position, vector.sub( camera.position ).normalize() );

		    // rotate the camera towards ray
		   	camera.lookAt(ray.at(100));
		    camera.updateMatrix();
		    
			if ( keyboard.pressed("W") ) {
				camera.translate( moveDistance, camera._vector.set(0,0,-1) );
				camera.updateMatrix();
			}
			if ( keyboard.pressed("S") ) {
				camera.translateZ(  moveDistance );
			}					
			if ( keyboard.pressed("A") ) {
				camera.translate( moveDistance, camera._vector.set(-1,0,0) );
				camera.updateMatrix();
			}
			if ( keyboard.pressed("D") ) {
				camera.translate( moveDistance, camera._vector.set(1,0,0) );
				camera.updateMatrix();
			}
		}
	}

};

FOUR.Math = { META: "Math functions & objects " };

/*
*	Simplex Noise generator
*	based on simplex algorithm by Ken Perlin / http://mrl.nyu.edu/~perlin/noise/
*
*/

FOUR.Math.SimplexNoise = function() {
	this.p = [151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,
		 23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,
		 174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,
		 133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,
		 89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,
		 202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,
		 248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,
		 178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,
		 14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,
		 93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];

	for (var i=0; i < 256 ; i++) {
		this.p[256+i] = this.p[i];
	}
};

FOUR.Math.SimplexNoise.prototype = {

	noise: function(x,y,z) {
		var floorX = ~~x, floorY = ~~y, floorZ = ~~z;
			X = floorX && 255, Y = floorY && 255, Z = floorZ && 255;
			x -= ~~x; y-= ~~y; z -= ~~z;
		var u = this.fade(x), v=this.fade(y), w = this.fade(z),
			A = this.p[X]+Y,   AA = this.p[A]+Z, AB = this.p[A+1]+Z,
			B = this.p[X+1]+Y, BA = this.p[B]+Z, BB = this.p[B+1]+Z;

		return this.lerp(w, this.lerp(v, this.lerp(u, this.grad(this.p[AA  ], x  , y  , z   ), 
					                                   this.grad(this.p[BA  ], x-1, y  , z   )), 
					                      this.lerp(u, this.grad(this.p[AB  ], x  , y-1, z   ),  
					                                   this.grad(this.p[BB  ], x-1, y-1, z   ))),
					         this.lerp(v, this.lerp(u, this.grad(this.p[AA+1], x  , y  , z-1 ),  
					                                   this.grad(this.p[BA+1], x-1, y  , z-1 )), 
					                      this.lerp(u, this.grad(this.p[AB+1], x  , y-1, z-1 ),
					                                   this.grad(this.p[BB+1], x-1, y-1, z-1 ))));
	}, // end of function noise

	/* smoothing function */
	fade: function(t) { return t * t * t * (t * (t * 6 - 15) + 10); },

	/* Linear interpolation */
	lerp: function(t,a,b) { return a + t * (b - a); },

	/* cosine interpolation */
	// lerp: function(x,a,b) {
	// 	var ft = x * Math.PI,
	// 		f = (1 - Math.cos(ft)) * .5;
	// 	return  (a*(1-f) + b*f);
	// },

	grad: function(hash, x,y,z) {
		var h = hash & 15;                 
      	var u = h<8 ? x : y,                 
            v = h<4 ? y : h==12||h==14 ? x : z;
      	return ((h&1) == 0 ? u : -u) + ((h&2) == 0 ? v : -v);
	}
};

/**
*	 Abstract Base class for FOUR loaders 
*/

FOUR.Loader = function() {
	this.div;
	this.domElement;
	this.progress = 0;
	this.numItems = 0;
	this.callback;
};

FOUR.Loader.prototype = {
	loadStart: function( funct ) {
		this.div = document.getElementById('loadingBar') || document.createElement('div');
		this.div.className = "loadingBar";
		this.domElement = document.createElement('h1');
		this.domElement.innerHTML = "Loading...";
		this.domElement.id = "loading";
		this.div.appendChild(this.domElement);
		this.callback = funct;
	},

	// remove the loading domElement and return control flow
	onLoadComplete: function( ) {
		if( document.getElementById('loading') && this.domElement != undefined )
			this.domElement.parentNode.removeChild(this.domElement);
		this.callback();
	},

	updateProgress: function() {
		// this.div = document.getElementById('loadingBar') 
		// || console.log('error: load not initiated; can\'t update progress');
		this.progress++;
		if (this.progress === this.numItems) this.onLoadComplete();
	}
};

/**
*	Load Objects and textures
*	Inherits from FOUR.Loader
*/

FOUR.TextureLoader = function() {
	FOUR.Loader.call(this);

	this.dirt = undefined;
	this.grassyDirt = undefined;
	this.water = undefined;
	this.rock = undefined;
};

FOUR.TextureLoader.prototype = Object.create( FOUR.Loader.prototype );

FOUR.TextureLoader.prototype.loadGrassyDirt = function() {
    var loader = new THREE.JSONLoader(); 
    function loadObj(geometry,material) { 
        this.grassyDirt = new FOUR.Tile(geometry, new THREE.MeshFaceMaterial(material));
        this.grassyDirt.material.materials[0].shading = THREE.FlatShading;
        this.updateProgress();
    }    
    loader.load( "models/cube_grassyDirt.js", loadObj.bind(this) ); 
}

FOUR.TextureLoader.prototype.loadDirt = function() {
    var loader = new THREE.JSONLoader(); 
    function loadObj(geometry,material) { 
        this.dirt = new FOUR.Tile(geometry, new THREE.MeshFaceMaterial(material));
        this.dirt.material.materials[0].shading = THREE.FlatShading;
        this.updateProgress();
    }    
    loader.load( "models/cube_dirt.js", loadObj.bind(this) ); 
}

FOUR.TextureLoader.prototype.loadRock = function() {
    var loader = new THREE.JSONLoader(); 
    function loadObj(geometry,material) { 
        this.rock = new FOUR.Tile(geometry, new THREE.MeshFaceMaterial(material));
        this.rock.material.materials[0].shading = THREE.FlatShading;
        this.updateProgress();
    }    
    loader.load( "models/cube_rock.js", loadObj.bind(this) ); 
}

FOUR.TextureLoader.prototype.loadWater = function() {
    var loader = new THREE.JSONLoader();  
    function loadObj(geometry,material) { 
        this.water = new FOUR.Tile(geometry, new THREE.MeshFaceMaterial(material));
        this.water.material.materials[0].opacity = 0.3;
        this.water.material.materials[0].transparent = true;
        this.water.material.materials[0].shading = THREE.FlatShading;
        this.updateProgress();
    }    
    loader.load( "models/cube_water.js", loadObj.bind(this) ); 
}

FOUR.TextureLoader.prototype.loadAll = function( funct ) {
	this.numItems = 4;

	// display the DOM element
	this.loadStart( funct );

	this.loadGrassyDirt();
	this.loadWater();
	this.loadDirt();
	this.loadRock();
}

FOUR.Skybox = function(scale) {
	this.skybox = undefined;
	this.scale = scale;
    var loader = new THREE.JSONLoader();  
    function loadObj(geometry) { 
    	var materialArray = [];
		materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'models/skybox.png' ) }));

        this.skybox = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materialArray ) );
        console.log(this.skybox)
        this.skybox.material.materials[0].side = THREE.BackSide;
        this.skybox.material.materials[0].depthWrite = false;
        this.skybox.material.materials[0].fog = false;
        this.skybox.scale.set(this.scale, this.scale, this.scale);
		scene.add(this.skybox);
    }    
    loader.load( "models/skybox.js", loadObj.bind(this) ); 
};



