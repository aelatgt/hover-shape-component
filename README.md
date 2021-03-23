This repository contains multiple scripts to define and inject networked aframe components into a hubs scene. The script will inject an entity with a custom template
#hover-shape-media, which will create a 3D a-entity with geometry to appear in a Hubs room. When clicked directly the a-entity will cycle through different 3D primitive shapes.
If you click the a-entity and drag the cursor horizontally, you will rotate the a-entity.

The components necessary are the drag-rotate component, the single-action-button component, which is from Matt's hubs-scripting-guide tutorial, and the hover-shape component.
The hover-shape-combined.js file registers all of these components, as well as registers the new template which depends on them, and adds an a-entity with the template to a
scene.

To inject this script into a Hubs room:
1. Copy the link from the GitHubs pages where the script will be served
2. Paste in the Room Settings of a Hubs Room into Custom Scripts and hit Apply
3. Reload the Hubs room and the a-entity should be present and networked across all clients.
