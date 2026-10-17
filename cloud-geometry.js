(function(root){
'use strict';
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
function fontSize(value,min,max,width){const large=clamp(width*.065,37,54);return 11+Math.pow(clamp((value-min)/(max-min||1),0,1),1.35)*(large-11)}
function project(p,ax,ay,width,height){const cy=Math.cos(ay),sy=Math.sin(ay),cx=Math.cos(ax),sx=Math.sin(ax),x=p.x*cy+p.z*sy,z=-p.x*sy+p.z*cy,y=p.y*cx-z*sx,depth=p.y*sx+z*cx,t=clamp((depth+1)/2,0,1),smooth=t*t*(3-2*t);return{x:x*width*.335,y:y*height*.31,depth,scale:.66+.48*smooth,opacity:.085+.915*Math.pow(smooth,1.18),blur:(1-smooth)*.7}}
function advance(state,target,dt){dt=clamp(dt,0,.05);const blend=1-Math.exp(-5*dt),vx=state.vx+(target.vx-state.vx)*blend,vy=state.vy+(target.vy-state.vy)*blend;return{x:state.x+vx*dt,y:state.y+vy*dt,vx,vy}}
const api={fontSize,project,advance};if(typeof module!=='undefined')module.exports=api;else root.CloudGeometry=api;
})(typeof window!=='undefined'?window:globalThis);
