/**
 * Sets up an entity to receive scale changes from a drag-scale-gizmo controller.
 * 
 */

AFRAME.registerComponent('gizmo-scaleable', {
  init: function() {
      this.upScale = this.upScale.bind(this)
      //Listen on the scene for the event transferring the amount we should change the scale
      this.el.sceneEl.addEventListener("cursor-move", this.upScale)
  },
  //This method could be altered to change other aspects of the entity, such as transperency.
  upScale(e) {
      if (NAF.connection.isConnected()) {
        NAF.utils.takeOwnership(this.el)
      }
      //Retrieve the event detail for the change in order to scale the object by that amount.
      this.el.object3D.scale.y = this.el.object3D.scale.y + e.detail.change;
      this.el.object3D.scale.x = this.el.object3D.scale.x + e.detail.change;
      this.el.object3D.scale.z = this.el.object3D.scale.z + e.detail.change;
      el.object3D.matrixNeedsUpdate = true; //Have to call this to sync the Object3D changes with the DOM.
  }
})
