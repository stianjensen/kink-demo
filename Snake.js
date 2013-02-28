function Snake( scene, material, position, radius, segments ) {
    this.length;
    this.radius = radius;
    this.previousSnake = null;
    this.glasses = null;

    this.submerge = false;
    this.headBob = false;

    var sphereGeometry = new THREE.SphereGeometry( radius );
    this.mesh = new THREE.Mesh( sphereGeometry, material );
    this.mesh.position =  position || new THREE.Vector3( 0, 0, 0 );
    this.addSegments( segments );

    scene.add(this.mesh);

};

Snake.prototype.toggleSubmerge = function() {
	this.submerge = ( this.submerge )? false : true;
}

Snake.prototype.toggleHeadBob = function() {
	this.headBob = ( this.headBob )? false : true;
}

Snake.prototype.setPrevious = function( previousSnake ) {
	this.previousSnake = previousSnake;
}

Snake.prototype.getPosition = function() {
	return this.mesh.position.clone();
}

Snake.prototype.attatchGlasses = function( geometry ) {
  var mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial({color: 0xbbbbbb}) );
  mesh.scale.set( .1, .1, .1 );
  mesh.position = this.getPosition();

  this.glasses = mesh;
  scene.add( this.glasses );
  
}

Snake.prototype.addSegments = function ( segments ) {
  var currentSegments = 0;
  var tempSnake = this;
  while ( tempSnake.previousSnake != null ) {
    tempSnake = tempSnake.previousSnake;
    currentSegments += 1;
  }

  for ( var i = 0; i < segments; i++ ) {
    tempSnake.setPrevious(
      new Snake(
        scene,
        materials.snakeTexture,
        tempSnake.getPosition(),
        ( this.radius - 10 ) - 5 * Math.sin( ( currentSegments + i ) / 2 )
        )
      )
    tempSnake = tempSnake.previousSnake;
  }
}

Snake.prototype.update = function( newPos ) {
	

	if ( this.previousSnake != null ) {
		this.previousSnake.update( this.mesh.position );
	}
	
	if ( this.submerge ) {
		newPos.add( new THREE.Vector3( 0, -2 * this.radius, 0 ) );
	}

	if ( this.headBob ) {
		newPos.add( new THREE.Vector3( 0, -20 * Math.sin( t/100 ), 0 ) );
	}

	var distance = this.mesh.position.distanceTo(newPos);
	var distanceToGo = distance - 40; // snake segment length
	var normalizedPointer = new THREE.Vector3( 0,0,0 );

	normalizedPointer.subVectors(newPos, this.mesh.position);
	normalizedPointer.normalize();
	normalizedPointer.multiplyScalar(distanceToGo);

	this.mesh.position.add(normalizedPointer);

  if ( this.glasses != null ) {
    this.glasses.lookAt( this.mesh.position );
    this.glasses.position.add( normalizedPointer );
  }
};

Snake.prototype.render = function() {
    
};
Snake.prototype.visibleToggle = function() {
    this.mesh.visible = !this.mesh.visible;
    if (this.previousSnake) 
        this.previousSnake.visibleToggle();
};
