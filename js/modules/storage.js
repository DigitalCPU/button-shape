// storage.js - localStorage presets
const KEY = 'buttonshape.design.v1';
export function saveDesign(design){
  try{ localStorage.setItem(KEY, JSON.stringify(design)); return true;}catch(e){return false}
}
export function loadDesign(){
  try{ const v = localStorage.getItem(KEY); return v?JSON.parse(v):null;}catch(e){return null}
}
