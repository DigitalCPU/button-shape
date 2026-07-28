// toolbar.js - builds simple controls and exposes change events
export function createToolbar(container){
  const toolbar = document.getElementById('toolbar');
  toolbar.innerHTML = '';

  const controls = document.createElement('div');
  controls.className = 'controls';

  // helper
  function makeControl(labelText, node){
    const c = document.createElement('div'); c.className='control';
    const label = document.createElement('label'); label.textContent = labelText;
    c.appendChild(label); c.appendChild(node);
    return c;
  }

  // width/height
  const w = document.createElement('input'); w.type='number'; w.value=240; w.min=40; w.className='small';
  const h = document.createElement('input'); h.type='number'; h.value=80; h.min=20; h.className='small';
  const szWrap = document.createElement('div'); szWrap.style.display='flex'; szWrap.style.gap='6px'; szWrap.appendChild(w); szWrap.appendChild(h);

  controls.appendChild(makeControl('W × H', szWrap));

  // radius
  const radius = document.createElement('input'); radius.type='range'; radius.min=0; radius.max=100; radius.value=16;
  controls.appendChild(makeControl('Radius', radius));

  // colors
  const color = document.createElement('input'); color.type='color'; color.value='#3b82f6';
  const textColor = document.createElement('input'); textColor.type='color'; textColor.value='#ffffff';
  controls.appendChild(makeControl('Fill', color));
  controls.appendChild(makeControl('Text', textColor));

  // text
  const text = document.createElement('input'); text.type='text'; text.value='Click Me'; text.style.width='180px';
  controls.appendChild(makeControl('Label', text));

  // font size
  const fontSize = document.createElement('input'); fontSize.type='number'; fontSize.value=28; fontSize.min=8; fontSize.className='small';
  controls.appendChild(makeControl('Font', fontSize));

  // gradient toggle
  const gradient = document.createElement('input'); gradient.type='checkbox'; gradient.checked=true;
  controls.appendChild(makeControl('Gradient', gradient));

  // shadow
  const shadow = document.createElement('input'); shadow.type='checkbox'; shadow.checked=true;
  controls.appendChild(makeControl('Shadow', shadow));

  toolbar.appendChild(controls);

  // expose getter and event
  function getState(){
    return {
      width: parseInt(w.value,10), height: parseInt(h.value,10),
      radius: parseInt(radius.value,10),
      fill: color.value, textColor: textColor.value,
      label: text.value, fontSize: parseInt(fontSize.value,10),
      gradient: gradient.checked, shadow: shadow.checked
    };
  }

  const listeners = new Set();
  function emit(){
    const s = getState(); listeners.forEach(fn=>fn(s));
  }
  [w,h,radius,color,textColor,text,fontSize,gradient,shadow].forEach(n=>n.addEventListener('input',emit));

  return {getState, onChange: (fn)=>{listeners.add(fn); fn(getState());}, element: toolbar};
}
