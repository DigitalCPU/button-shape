// output.js - shows generated code and provides export / copy
export function createOutput(){
  const out = document.getElementById('output');
  function show(pythonCode, svgText){
    out.innerHTML = '';
    const heading = document.createElement('div'); heading.style.marginBottom='8px';
    heading.textContent = 'Generated Python (.py) and SVG preview below — use Export to download';
    out.appendChild(heading);

    const tabs = document.createElement('div'); tabs.style.display='flex'; tabs.style.gap='8px'; tabs.style.marginBottom='8px';
    const pyBtn = document.createElement('button'); pyBtn.textContent='Python'; const svgBtn = document.createElement('button'); svgBtn.textContent='SVG';
    [pyBtn,svgBtn].forEach(b=>{b.className='btn'; b.style.padding='6px 10px'; b.style.background='transparent'; b.style.color='var(--muted)'});
    pyBtn.style.background='var(--accent)'; pyBtn.style.color='white';
    tabs.appendChild(pyBtn); tabs.appendChild(svgBtn); out.appendChild(tabs);

    const pre = document.createElement('pre'); pre.textContent = pythonCode; pre.style.whiteSpace='pre-wrap'; pre.style.fontSize='12px';
    out.appendChild(pre);

    pyBtn.addEventListener('click',()=>{ pre.textContent = pythonCode; pyBtn.style.background='var(--accent)'; svgBtn.style.background='transparent'; pyBtn.style.color='white'; svgBtn.style.color='var(--muted)'; });
    svgBtn.addEventListener('click',()=>{ pre.textContent = svgText; svgBtn.style.background='var(--accent)'; pyBtn.style.background='transparent'; svgBtn.style.color='white'; pyBtn.style.color='var(--muted)'; });

    return {getCurrent: ()=>pre.textContent};
  }

  return {show};
}
