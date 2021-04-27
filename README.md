This repository contains multiple scripts to define and inject networked aframe components into a hubs scene. The script will inject an entity with a custom template
#hover-shape-media, which will create a 3D a-entity with geometry to appear in a Hubs room. There is also a controller entity. When the controller is clicked directly, the a-entity will cycle through different 3D primitive shapes.
If you click the a-entity and drag the cursor horizontally, you will rotate the a-entity. Additionally, there is a drag-scale component that allows vertical drags to change the scale of the entity, or alternatively,
the drag-scale-gizmo component allows a seperate object to be dragged along the x axis, and control the scale of a target entity with the gizmo-scaleable component. This is some experimentation done with the different types of inputs to interact with
Hubs and networked components.

The components necessary are the drag-scale-gizmo, gizmo-scaleable, drag-rotate component, drag-scale component, the single-action-button component, which is from Matt's https://github.com/aelatgt/hubs-scripting-guide tutorial, and the hover-shape component.
The hover-shape-combined.js file registers all of these components, as well as registers the new template which depends on them, and registers the components to be used with the glb. These are based off of the examples within hubs-scripting-guide. 

To inject these scripts into a Hubs room:
1. Copy the link to the script being served statically on GitHub Pages: https://www.aelatgt.org/hover-shape-component/scripts/hover-shape-combined.js
2. Paste in the Custom Scripts in Room Settings of a Hubs Room and hit Apply.
3. Reload the Hubs room
4. Position the hover-controller and hover-shape (and optionally the drag-scale-gizmo.glb) into a spoke scene and load it into a Hubs room. (OR just drag the glbs into a room. This could cause networking issues though).
5. Now the entity will change shape when the controller is pressed, rotate if dragged horizontally, and be scaled if the drag-scale-gizmo is either moved, or a vertical drag is used.

Working Demo: https://hubs.aelatgt.net/gaHxurs/hover-shape-component-demo

NOTE: The networked components within this repository seem to currently have the following issues:
1. When positioning the .glb in Spoke, when a new user joins, the hover-shape can be reset to its initial index, and a duplicate with the correct index will be added to the scene.
2. If the hover-shape component is not added to the entity and just the drag-scale or drag-rotate are added, the rotation and scale are not synced across users.
