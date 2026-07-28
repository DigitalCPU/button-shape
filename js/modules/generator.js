// generator.js - produce Python (Pillow) code and SVG text from state
function esc(s){return s.replace(/"/g,'\"');}
export function generateCode(state){
  // Python Pillow script
  const py = `from PIL import Image, ImageDraw, ImageFont\n\nW=${state.width}\nH=${state.height}\nimg = Image.new("RGBA", (W, H), (0,0,0,0))\nd = ImageDraw.Draw(img)\n\n# shadow\nif ${state.shadow}:
    d.rounded_rectangle((6,6,W-6,H-6), radius=${state.radius}, fill=(0,0,0,64))\n\n# main\n` +
    `d.rounded_rectangle((0,0,W, H), radius=${state.radius}, fill=${tupleFromHex(state.fill)})\n\n# text\ntry:\n    font = ImageFont.truetype("arial.ttf", ${state.fontSize})\nexcept Exception:\n    font = ImageFont.load_default()\ntext = "${esc(state.label)}"\nw, h = d.textsize(text, font=font)\nd.text(((W-w)/2, (H-h)/2), text, fill=${tupleFromHex(state.textColor)}, font=font)\n\nimg.save('button.png')\nprint('Saved button.png')\n`;

  // SVG
  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"${state.width}\" height=\"${state.height}\">\n  <defs>\n    <filter id=\"s\">\n      <feDropShadow dx=\"4\" dy=\"4\" stdDeviation=\"4\" flood-color=\"#000\" flood-opacity=\"0.25\"/>\n    </filter>\n    <linearGradient id=\"g\" x1=\"0\" x2=\"0\" y1=\"0\" y2=\"1\">\n      <stop offset=\"0\" stop-color=\"${lightenHex(state.fill,0.12)}\"/>\n      <stop offset=\"1\" stop-color=\"${state.fill}\"/>\n    </linearGradient>\n  </defs>\n  <rect x=\"0\" y=\"0\" width=\"${state.width}\" height=\"${state.height}\" rx=\"${state.radius}\" ry=\"${state.radius}\" fill=\"${state.gradient?`url(#g)`:state.fill}\" ${state.shadow?`filter=\"url(#s)\"`:''}/>\n  <text x=\"${state.width/2}\" y=\"${state.height/2}\" font-size=\"${state.fontSize}\" text-anchor=\"middle\" dominant-baseline=\"middle\" fill=\"${state.textColor}\">${escapeXml(state.label)}</text>\n</svg>`;

  return {python: py, svg};
}

function tupleFromHex(h){
  const c = h.replace('#',''); const num = parseInt(c,16);
  const r = (num>>16)&255, g=(num>>8)&255, b=num&255;
  return `(${r}, ${g}, ${b}, 255)`;
}
function lightenHex(hex, amt){
  const c = hex.replace('#',''); const num=parseInt(c,16);
  let r=(num>>16)+Math.round(255*amt), g=(num>>8&255)+Math.round(255*amt), b=(num&255)+Math.round(255*amt);
  r=Math.min(255,r); g=Math.min(255,g); b=Math.min(255,b);
  return `#${(r<<16 | g<<8 | b).toString(16).padStart(6,'0')}`;
}
function escapeXml(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
