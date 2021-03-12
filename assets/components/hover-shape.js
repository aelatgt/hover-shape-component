//This script will require that Matt's single-action-button.js script has been served and already injected into the hubs client as it simplifies the interaction signifiacntly.'

const SHAPES = ['box', 'cone', 'dodecahedron', 'octahedron', 'sphere'];

AFRAME.registerComponent('hover-shape', {
    schema: {
        index: {default: 0},
    },
    init: function () {
        this.onNext = this.onNext.bind(this);
        this.el.addEventListener('click', this.onNext);
    },
    tick: function () {
		var el = this.el;
		el.setAttribute('position', '1 ' + (.75 + Math.sin(Date.now() / 500) * .25) + ' -3');
	},
    onNext() {
           //if (this.networkedEl && !NAF.utils.isMine(this.networkedEl) && !NAF.utils.takeOwnership(this.networkedEl)) return;
           var newIndex = (this.data.index + 1) % SHAPES.length;
           this.el.setAttribute("hover-shape", "index", newIndex);
           this.el.setAttribute('geometry', 'primitive', SHAPES[newIndex]);
           console.log('cursor registered click event.');
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
      geometry="primitive: box; width: 1; height: 1; depth: 1"
      material="color: blue; shader: flat"
      single-action-button="event: click"
      randomize-networked-color="event: click"
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
        component: "material",
        property: 'color',
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
AFRAME.scenes[0].appendChild(el);

function testNext(nextIndex) {
      var newIndex = (nextIndex) % SHAPES.length;
      el.setAttribute("hover-shape", "index", newIndex);
      el.setAttribute('geometry', 'primitive', SHAPES[newIndex]);
      console.log('cursor registered click event.');
}