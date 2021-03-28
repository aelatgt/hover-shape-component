This repository contains multiple scripts to define and inject networked aframe components into a hubs scene. The script will inject an entity with a custom template
#hover-shape-media, which will create a 3D a-entity with geometry to appear in a Hubs room. There will also be a small one-sided plane to act as a controller in front of the entity. When clicked directly, the a-entity will cycle through different 3D primitive shapes.
If you click the a-entity and drag the cursor horizontally, you will rotate the a-entity. This is some experimentation done with the different types of inputs to interact with
Hubs and networked components.

The components necessary are the drag-rotate component, the single-action-button component, which is from Matt's https://github.com/aelatgt/hubs-scripting-guide tutorial, and the hover-shape component.
The hover-shape-combined.js file registers all of these components, as well as registers the new template which depends on them, and adds an a-entity with the template to a
scene. These are based off of the examples within hubs-scripting-guide.

To inject this script into a Hubs room:
1. Copy the link to the script being served statically on GitHub Pages: https://www.aelatgt.org/hover-shape-component/scripts/hover-shape-combined.js
2. Paste in the Custom Scripts in Room Settings of a Hubs Room and hit Apply.
3. Reload the Hubs room and the a-entity should be present and networked across all clients.
Note: As of now the position of the cube is fixed, so you may want to test on the WideOpenSpace scene or other less busy scenes that spawn you near the origin.
