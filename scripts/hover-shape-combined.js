
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
      //Retrieve the event detail for the change in order to scale the object by that amount.
      this.el.object3D.scale.y = this.el.object3D.scale.y + e.detail.change;
      this.el.object3D.scale.x = this.el.object3D.scale.x + e.detail.change;
      this.el.object3D.scale.z = this.el.object3D.scale.z + e.detail.change;
      el.object3D.matrixNeedsUpdate = true; //Have to call this to sync the Object3D changes with the DOM.
  }
})


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
    this.prevRotation = new THREE.Vector3() // Rotation of the cursor on the previous frame.

    // Set up handlers for those events we enabled earlier
    this.el.object3D.addEventListener(
      'holdable-button-down',
      ({ object3D }) => {
        this.dragCursor = object3D
        this.prevPosition.copy(object3D.position)
        this.prevRotation.copy(object3D.rotation)
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
      const dr = this.dragCursor.rotation.y - this.prevRotation.y;

      // Take ownership of the `networked` entity and update the networked rotation
      if (NAF.connection.isConnected()) {
        NAF.utils.takeOwnership(this.el)
      }
      //Update the rotation of the object as the horizontal change in the cursor position.
      var sensitivity = .75;
      this.el.object3D.rotation.y = (dx + dz) * sensitivity + this.el.object3D.rotation.y;
      this.el.object3D.matrixNeedsUpdate = true;
     
      // Store cursor position for next frame.
      this.prevPosition.copy(this.dragCursor.position)
      this.prevRotation.copy(this.dragCursor.rotation)
    }
  },
})

/**
 * Sets up an entity for the SingleActionButton interaction system
 * so it will receive events when clicked. From Matt's hubs-scripting-guide.
 */

AFRAME.registerComponent('single-action-button', {
  schema: {
    event: { type: 'string' },
  },
  init: function () {
    // These first two lines tell Hubs' interaction system to pay attention to us
    this.el.classList.add('interactable')
    this.el.setAttribute('is-remote-hover-target', '')

    // This tag tells the button system to emit 'interact' events on our object
    this.el.setAttribute('tags', { singleActionButton: true })

    // Finally, we'll forward the 'interact' events to our entity for convenience
    this.el.object3D.addEventListener('interact', () =>
      this.el.emit(this.data.event, {el: this.el}, true) //Pass the event on to the hover-shape using event bubbling
    )
  },
})

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

//Query assets in order to setup template
const assets = document.querySelector("a-assets");
assets.insertAdjacentHTML(
  'beforeend',
  `
  <template id="hover-shape-media">
    <a-entity
      hover-shape="index: 0"
      geometry="primitive: box;"
      material="color: blue;"
      drag-rotate
      drag-scale
      gizmo-scaleable
    ></a-entity>
  </template>
`
)

const vectorRequiresUpdate = epsilon => {
		return () => {
			let prev = null;
			return curr => {
				if (prev === null) {
					prev = new THREE.Vector3(curr.x, curr.y, curr.z);
					return true;
				} else if (!NAF.utils.almostEqualVec3(prev, curr, epsilon)) {
					prev.copy(curr);
					return true;
				}
				return false;
			};
		};
	};

NAF.schemas.add({
  	template: "#hover-shape-media",
    components: [
    {
        component: "rotation",
        requiresNetworkUpdate: vectorRequiresUpdate(0.001)
    },
    {
        component: "scale",
        requiresNetworkUpdate: vectorRequiresUpdate(0.001)
    },
    {
      	component: "hover-shape",
      	property: "index"
    }
    ],
  });

AFRAME.GLTFModelPlus.registerComponent('networked', 'networked')
AFRAME.GLTFModelPlus.registerComponent('geometry', 'geometry')
AFRAME.GLTFModelPlus.registerComponent('single-action-button', 'single-action-button')
AFRAME.GLTFModelPlus.registerComponent('drag-scale-gizmo')
AFRAME.GLTFModelPlus.registerComponent('gizmo-scaleable')