/**
 * Sets up an entity to receive scale changes from a drag-scale-gizmo controller.
 * 
 */

AFRAME.registerComponent('gizmo-scaleable', {
  init: function() {
      this.el.sceneEl.addEventListener("cursor-move", (e) => {
        let el = document.querySelector("[scaleable]") //Get the scaleable entity
        this.el.object3D.scale.y = this.el.object3D.scale.y + e.detail.change;
        this.el.object3D.scale.x = this.el.object3D.scale.x + e.detail.change;
        this.el.object3D.scale.z = this.el.object3D.scale.z + e.detail.change;
        el.object3D.matrixNeedsUpdate = true;
   })
  },
})