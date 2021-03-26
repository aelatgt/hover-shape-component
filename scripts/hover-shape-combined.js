
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
      //this.el.object3D.lookAt(this.dragCursor.position);
      // Store cursor position for next frame.
      this.prevPosition.copy(this.dragCursor.position)
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
      this.el.emit(this.data.event, {el: this.el}, true)
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
        this.onNext = this.onNext.bind(this);
        this.el.sceneEl.addEventListener('nextShape', this.onNext);
    },
    tick: function () {
		var el = this.el;
        //This is one way simply way to get the hovering effect on the entity.
		el.setAttribute('position', el.object3D.position.x + ', ' + (.75 + Math.sin(Date.now() / 500) * .25) + ', ' + el.object3D.position.z);
	},
    onNext() { //Update the geometry primitive on click event 
        if (NAF.connection.isConnected()) {
            NAF.utils.takeOwnership(this.el);
            var newIndex = (this.data.index + 1) % this.SHAPES.length;
            this.el.setAttribute("hover-shape", "index", newIndex);
            this.el.setAttribute('geometry', 'primitive', this.SHAPES[newIndex]);
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
      	component: "position",
      	requiresNetworkUpdate: vectorRequiresUpdate(0.001)
    },
    {
        component: "rotation",
        requiresNetworkUpdate: vectorRequiresUpdate(0.001)
    },
    {
      	component: "hover-shape",
      	property: "index"
    },
    {
        component: "geometry",
        property: "primitive"
    }
    ],
  });

var el = document.createElement("a-entity");
el.setAttribute("networked", { 
    template: "#hover-shape-media",
    networkId: 'shapeButton',
    owner: 'scene',
  });
//Setups controller object
var elController = document.createElement("a-entity");
elController.setAttribute("geometry", "primitive", "plane");
elController.setAttribute("single-action-button", "event", "nextShape");
//Set position
AFRAME.scenes[0].appendChild(el);
AFRAME.scenes[0].appendChild(elController);
const player = document.querySelector('#avatar-rig').object3D;
el.object3D.position.x = player.position.x;
el.object3D.position.z = player.position.y;
elController.object3D.position.z = el.object3D.position.z + 1;