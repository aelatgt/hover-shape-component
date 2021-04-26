NOTE: The networked components within this repository seem to currently have the following issues:
1. When positioning the .glb in Spoke, when a new user joins, the hover-shape can be reset to its initial index, and a duplicate with the correct index will be added to the scene.
2. If the hover-shape component is not added to the entity and just the drag-scale or drag-rotate are added, the rotation and scale are not synced across users.

This repository contains multiple scripts to define and inject networked aframe components into a hubs scene. The script will inject an entity with a custom template
#hover-shape-media, which will create a 3D a-entity with geometry to appear in a Hubs room. There will also be a small one-sided plane to act as a controller in front of the entity. When clicked directly, the a-entity will cycle through different 3D primitive shapes.
If you click the a-entity and drag the cursor horizontally, you will rotate the a-entity. This is some experimentation done with the different types of inputs to interact with
Hubs and networked components.

The components necessary are the drag-rotate component, drag-scale component, the single-action-button component, which is from Matt's https://github.com/aelatgt/hubs-scripting-guide tutorial, and the hover-shape component.
The hover-shape-combined.js file registers all of these components, as well as registers the new template which depends on them, and adds an a-entity with the template to a
scene. These are based off of the examples within hubs-scripting-guide. 

There is also a drag-scale-gizmo component that allows for external control of the scale of the entity. This can be set up by attaching the target entity with the 'gizmo-scaleable' component and adding an entity with drag-scale-gizmo to the scene.

To inject this script into a Hubs room:
1. Copy the link to the script being served statically on GitHub Pages: https://www.aelatgt.org/hover-shape-component/scripts/hover-shape-combined.js
2. Paste in the Custom Scripts in Room Settings of a Hubs Room and hit Apply.
3. Reload the Hubs room
4. Drag the hover-controller.glb and the hover-shape.glb files into the room to place them.
5. Now the entity will change shape when the controller is pressed.
