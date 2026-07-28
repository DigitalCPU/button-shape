# Button Designer (Button-Shape)

This repository is a web-based tool that converts a visual button design into:
- a runnable Python (.py) script using Pillow that generates a raster PNG button
- an SVG file for vector output

What I added
- Front-end modules (toolbar, canvas preview, generator, storage, output)
- Simple styling and app wiring
- Export button now downloads both button.py and button.svg

How it works
1. Open index.html in a browser (it is a static single-page app).
2. Use the controls in the top toolbar to design the button.
3. A live preview updates in the canvas; the right pane shows generated Python and SVG.
4. Click Export to download both the .py and .svg files.

Python requirements for generated .py
- Pillow (install with pip install pillow)

Notes and next steps
- The UI and generated code are intentionally simple to serve as a starting point.
- Improvements: add presets, font selection/upload, better text metrics in Pillow script, copy-to-clipboard, accessibility.

