
/**
 * Component to give a hubs entity a constant hover, and click functionality to cycle through shapes.
 */

AFRAME.registerComponent('hover-shape', {
    schema: {
        index: {default: 0},
    },
    init: function () {
        //Define the different shapes that we will cycle through
        this.SHAPES = ['box', 'cone', 'dodecahedron', 'octahedron', 'sphere', 'torus', 'tetrahedron'];
        this.index = this.data.index;
        this.onNext = this.onNext.bind(this);
        this.el.sceneEl.addEventListener('nextShape', this.onNext);
    },
    tick: function () {
		var el = this.el;
        //This is one way simply way to get the hovering effect on the entity.
		el.setAttribute('position', el.object3D.position.x + ', ' + (.75 + Math.sin(Date.now() / 500) * .25) + ', ' + el.object3D.position.z);
        if (this.index != this.data.index) {
            this.index = this.data.index;
            this.el.setAttribute('geometry', 'primitive', this.SHAPES[this.index]);
        }
	},
    onNext() { //Update the geometry primitive on click event 
        if (NAF.connection.isConnected()) {
            NAF.utils.takeOwnership(this.el);
            var newIndex = (this.data.index + 1) % this.SHAPES.length;
            this.el.setAttribute("hover-shape", "index", newIndex);
        }
    }
});
