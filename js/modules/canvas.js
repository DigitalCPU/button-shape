// canvas.js - renders preview into canvas
export function createCanvas(){
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  function render(state){
    const dpi = window.devicePixelRatio || 1;
    canvas.width = (state.width + 40) * dpi;
    canvas.height = (state.height + 40) * dpi;
    canvas.style.width = (state.width + 40) + 'px';
    canvas.style.height = (state.height + 40) + 'px';
    ctx.setTransform(dpi,0,0,dpi,0,0);

    ctx.clearRect(0,0,canvas.width,canvas.height);
    const x = 20, y = 20, w = state.width, h = state.height, r = Math.min(state.radius, Math.min(w,h)/2);

    if(state.shadow){
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      roundRect(ctx, x+6, y+6, w, h, r); ctx.fill();
      ctx.restore();
    }

    // gradient or solid
    if(state.gradient){
      const g = ctx.createLinearGradient(x,y,x,y+h);
      g.addColorStop(0, lighten(state.fill, 0.15));
      g.addColorStop(1, state.fill);
      ctx.fillStyle = g;
    } else { ctx.fillStyle = state.fill; }

    roundRect(ctx, x, y, w, h, r); ctx.fill();

    // text
    ctx.fillStyle = state.textColor;
    ctx.font = `${state.fontSize}px sans-serif`;
    ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
    ctx.fillText(state.label, x + w/2, y + h/2 + 1);
  }

  function roundRect(ctx,x,y,w,h,r){
    ctx.beginPath(); ctx.moveTo(x+r,y);
    ctx.arcTo(x+w,y,x+w,y+h,r);
    ctx.arcTo(x+w,y+h,x,y+h,r);
    ctx.arcTo(x,y+h,x,y,r);
    ctx.arcTo(x,y,x+w,y,r); ctx.closePath();
  }

  function lighten(hex, amt){
    const c = hex.replace('#',''); const num=parseInt(c,16);
    let r=(num>>16)+Math.round(255*amt), g=(num>>8&255)+Math.round(255*amt), b=(num&255)+Math.round(255*amt);
    r=Math.min(255,r); g=Math.min(255,g); b=Math.min(255,b);
    return `rgb(${r},${g},${b})`;
  }

  return {render};
}
