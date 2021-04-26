/**
 * Sets up an entity to receive scale changes from a drag-scale-gizmo controller.
 * 
 */

AFRAME.registerComponent('gizmo-scaleable', {
  init: function() {
      this.upScale = this.upScale.bind(this)
      this.el.sceneEl.addEventListener("cursor-move", this.upScale)
  },
  upScale(e) {
      this.el.object3D.scale.y = this.el.object3D.scale.y + e.detail.change;
      this.el.object3D.scale.x = this.el.object3D.scale.x + e.detail.change;
      this.el.object3D.scale.z = this.el.object3D.scale.z + e.detail.change;
      el.object3D.matrixNeedsUpdate = true;
  }
})