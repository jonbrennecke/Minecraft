function hoverAction(event) {
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
    projector.unprojectVector( vector, camera );
    var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
    var intersects = raycaster.intersectObjects(map.hexArray);
    if ( intersects.length > 0 ) {
      map.selector.position = {
        x: intersects[0].object.position.x,
        y: intersects[0].object.position.y+2*map.scale,
        z: intersects[0].object.position.z
      };
      //map.selector.scale.set(map.scale,map.scale,map.scale);
      scene.add(map.selector);
    }
    else {
      scene.remove(map.selector);
    }
}

function onMouseDown(event) {
  event.preventDefault();
  var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
  projector.unprojectVector( vector, camera );
  var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
  var intersects = raycaster.intersectObjects( map.hexArray );
  if(event.which == 3 || event.button == 2) { // if right click
      //rightClickMenu(event);
      if ( intersects.length > 0 ) {
          SELECTED = intersects[0].object;
          // var obj = cube.clone();
          // var scale = map.scale;
          // obj.scale.set(scale,scale,scale);
          // obj.position.set(SELECTED.position.x, SELECTED.position.y+2*map.scale, SELECTED.position.z);
          // map.hexArray.push(obj);
          scene.remove(SELECTED);
      }
  }
  else {
      var menu = document.getElementById('menu');
      menu.style.visibility = 'hidden';
      if ( intersects.length > 0 ) {
          // SELECTED = intersects[0].object;
          // var obj = cube.clone();
          // var scale = map.scale;
          // obj.scale.set(scale,scale,scale);
          // obj.position.set(SELECTED.position.x, SELECTED.position.y+2*map.scale, SELECTED.position.z);
          // map.hexArray.push(obj);
          // scene.add(obj);
      }
  }        
}




