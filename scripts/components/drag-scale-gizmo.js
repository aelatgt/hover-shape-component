/**
 * Sets up an entity with the holdable button functionality so that it can alter
 * its own position horizontally and alter the scale of another entity specified by that change.
 */

AFRAME.registerComponent('drag-scale-gizmo', {
  schema: {
      slideWidth: {default: 2.5} //This will be the distance that we can drag the controller gizmo, as well as the amount that the scale will be changed.
  },
  init: function () {

  //Setup holdable button functionality
    console.log('set remove hover target')
    this.el.classList.add('interactable')
    this.el.setAttribute('tags', {
      isHoldable: true,
      holdableButton: true,
    })
    this.el.setAttribute('is-remote-hover-target', '')

    this.dragCursor = null // This will hold the cursor performing the drag, if any
    this.prevPosition = new THREE.Vector3() // Position of the cursor on the previous frame. Useful for determining speed of the drag.
    this.scaleMax = new THREE.Vector3(1.5, 1.5, 1.5);
    this.scaleMin = new THREE.Vector3(.5, .5, .5);
    this.slideWidth = this.data.slideWidth;
    this.initx = this.el.object3D.position.x;

    // Set up handlers for those events we enabled earlier
    this.el.object3D.addEventListener(
      'holdable-button-down',
      ({ object3D }) => {
        this.dragCursor = object3D
        this.prevPosition.copy(object3D.position)
      }
    )
    this.el.object3D.addEventListener('holdable-button-up', () => {
      this.dragCursor = null
    })
  },
  tick: function () {
    // If any cursor is held down...
    if (this.dragCursor) {
      // Compute change in cursor x position
      var dx = this.dragCursor.position.x - this.prevPosition.x;

      //Update the position of the controller slider 
      var dslide = (this.el.object3D.position.x + dx) - this.initx //This keeps track of how far we have shifted the gizmo from its initial x position.
      if (dslide < this.slideWidth && dslide > 0) { //Only update if the value is within our accepted range.
        	this.el.setAttribute('position', this.el.object3D.position.x + dx + ', ' + this.el.object3D.position.y + ', ' + this.el.object3D.position.z);
            this.el.emit("cursor-move", {change: dx}, true) //Send this change in x position data to the entity being controlled through event bubbling. (Check gizmo-scaleable.js)
      }

      // Store cursor position for next frame.
      this.prevPosition.copy(this.dragCursor.position)
    }
  },
})
