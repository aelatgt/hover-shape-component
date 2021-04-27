
/**
 * Sets up an entity with the holdable button functionality so that it can alter
 * scale on cursor movement.
 */

AFRAME.registerComponent('drag-scale', {
  init: function () {
  //Setup holdable button functionality
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
      // Compute change in cursor vertical position
      const dy = this.dragCursor.position.y - this.prevPosition.y;

      // Take ownership of the `networked` entity and update the networked scale
      if (NAF.connection.isConnected()) {
        NAF.utils.takeOwnership(this.el)
      }
      //Update the scale of the object as the vertical change in the cursor position.
      this.el.object3D.scale.y = this.el.object3D.scale.y + dy;
      this.el.object3D.scale.x = this.el.object3D.scale.x + dy;
      this.el.object3D.scale.z = this.el.object3D.scale.z + dy;
      if (this.el.object3D.scale.y > this.scaleMax.y) {
            this.el.object3D.scale.x = this.scaleMax.x
            this.el.object3D.scale.y = this.scaleMax.y
            this.el.object3D.scale.z = this.scaleMax.z      
      } else if (this.el.object3D.scale.y < this.scaleMin.y) {
            this.el.object3D.scale.x = this.scaleMin.x
            this.el.object3D.scale.y = this.scaleMin.y
            this.el.object3D.scale.z = this.scaleMin.z          
      }
      //Sync the DOM values with the object3D
      this.el.object3D.matrixNeedsUpdate = true;

      // Store cursor position for next frame.
      this.prevPosition.copy(this.dragCursor.position)
    }
  },
})