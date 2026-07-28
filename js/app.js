// app.js - wire up toolbar, canvas, generator, output
import {createToolbar} from './js/modules/toolbar.js';
import {createCanvas} from './js/modules/canvas.js';
import {createOutput} from './js/modules/output.js';
import {generateCode} from './js/modules/generator.js';
import {saveDesign, loadDesign} from './js/modules/storage.js';

(async function(){
  const toolbar = createToolbar(document.getElementById('toolbar'));
  const canvas = createCanvas();
  const output = createOutput();

  function refresh(state){
    canvas.render(state);
    const {python, svg} = generateCode(state);
    const view = output.show(python, svg);
    // attach export buttons
    document.getElementById('save-btn').onclick = ()=>{ saveDesign(state); alert('Design saved to localStorage'); };
    document.getElementById('export-btn').onclick = ()=>{
      // prepare files
      const py = python; const svgtxt = svg;
      // download .py
      download('button.py', py);
      // download .svg
      download('button.svg', svgtxt);
    };
  }

  toolbar.onChange((s)=>{ refresh(s); });

  // load saved
  const saved = loadDesign(); if(saved){ /* TODO: apply to controls later */ }

  function download(filename, content){
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([content],{type:'text/plain'})); a.download = filename; document.body.appendChild(a); a.click(); a.remove();
  }
})();
