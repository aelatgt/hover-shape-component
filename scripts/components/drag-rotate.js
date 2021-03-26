
/**
 * Sets up an entity with the holdable button functionality so that it can alter
 * rotatation on cursor movement.
 */

AFRAME.registerComponent('drag-rotate', {
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
      // Compute change in cursor position
      const dx = this.dragCursor.position.x - this.prevPosition.x;
      const dz = this.dragCursor.position.z - this.prevPosition.z;

      // Take ownership of the `networked` entity and update the networked radius
      if (NAF.connection.isConnected()) {
        NAF.utils.takeOwnership(this.el)
      }
      //Update the rotation of the object as the horizontal change in the cursor position.
      var sensitivity = .75;
      this.el.object3D.rotation.y = (dx + dz) * sensitivity + this.el.object3D.rotation.y;
      // Store cursor position for next frame.
      this.prevPosition.copy(this.dragCursor.position)
    }
  },
})
