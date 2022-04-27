
## Version 1
Drawing entrypoints, clickable and hoverable
Lines
Shapes
Textboxes

Export, import into displayer

## Usage
Create entrypoints. Elements created will be linked to selected entrypoint.
Elements will inherit their parent's settings, like line, shape, color etc.
To move elements around, click selectElements. Then left click and drag to move. 
Doubleclick to select element for editing.

## OOS
Editing
Deleting

White-out

viewer mode and editor mode
    In viewer mode can click on entrypoints to they are selected
    Then flip back to editor add new ones etc, so you can see where they will overlap

Connection points on the elements, each one will have a certain number, can have connections to other elements, like lines.

## Deployment
npm run deploy
if the gh-branch is not updating, I had to manually remove node_modules/.cache/gh-pages to get the deployment to work.

## Stretch goals
Background mode, so you can draw in the background on another layer, no image, then flip forward to the highlighter.
Full on drawing app, to I can create diagrams from the ground up, no need for importing an image?