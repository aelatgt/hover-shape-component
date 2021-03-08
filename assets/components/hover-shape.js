const SHAPES = ['box', 'cone', 'dodecahedron', 'octahedron', 'sphere'];


AFRAME.registerComponent('hover-shape', {
    schema: {
        index: {default: 0},
    },
    init: function () {
        this.onNext = this.onNext.bind(this);
        NAF.utils
        .getNetworkedEntity(this.el)
        .then(networkedEl => {
            this.networkedEl = networkedEl;
            this.networkedEl.object3D.addEventListener('interact', this.onNext());
        });
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
let assets = document.querySelector("a-assets");
// create a new template variable
let shapeHoverTemplate = document.createElement("template");
shapeHoverTemplate.id = "hover-shape";
let newEntity = document.createElement("a-entity");

newEntity.setAttribute("class", "interactable");

//tempAtt var allows for multiple attributes to be reused.
let tempAtt = document.createAttribute("hover-shape");
tempAtt.value = "index: 0"
newEntity.setAttributeNode(tempAtt);
tempAtt = document.createAttribute("geometry")
tempAtt.value = "primitive: box; width: 1; height: 1; depth: 1";
newEntity.setAttributeNode(tempAtt);

//Adding entity to template and adding to assets? Does this mean that all changes to a template's attribute data will be synced?
shapeHoverTemplate.content.appendChild(newEntity);
assets.appendChild(shapeHoverTemplate);

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
  	template: "#hover-shape",
    components: [
    {
      	component: "position",
      	requiresNetworkUpdate: vectorRequiresUpdate(0.001)
    },
    {
      	component: "rotation",
      	requiresNetworkUpdate: vectorRequiresUpdate(0.5)
    },
    {
      	component: "scale",
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
el.setAttribute("networked", { template: "#hover-shape" } );
AFRAME.scenes[0].appendChild(el);

function testNext(nextIndex) {
      var newIndex = (nextIndex) % SHAPES.length;
      el.setAttribute("hover-shape", "index", newIndex);
      el.setAttribute('geometry', 'primitive', SHAPES[newIndex]);
      console.log('cursor registered click event.');
}