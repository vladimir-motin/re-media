(function(root){
'use strict';
const known=v=>typeof v==='number'&&Number.isFinite(v);
const sum=xs=>xs.filter(known).reduce((a,b)=>a+b,0);
function top(rows,key,n=20){return rows.filter(x=>known(x[key])).slice().sort((a,b)=>b[key]-a[key]||String(a.id).localeCompare(String(b.id))).slice(0,n)}
function ratio(n,d){return known(n)&&known(d)&&d>0?n/d*100:null}
function monthly(rows,key,months){return months.map(month=>{const items=rows.filter(x=>x.date?.startsWith(month)),values=items.map(x=>x[key]).filter(known);return{month,value:values.length?sum(values):null,avg:values.length?sum(values)/values.length:null,count:items.length,measured:values.length,items}})}
function stories(rows){const map=new Map();for(const p of rows){if(!map.has(p.story))map.set(p.story,{id:p.story,title:p.title,preview:p.preview,image:p.image,date:p.date,items:[],tg:null,vc:null,dzen:null,total:null});const s=map.get(p.story);s.items.push(p);if(known(p.reach))s[p.platform]=(s[p.platform]??0)+p.reach;if(!s.image&&p.image)s.image=p.image;s.date=s.date<p.date?s.date:p.date}for(const s of map.values()){const vals=[s.tg,s.vc,s.dzen].filter(known);s.total=vals.length?sum(vals):null}return [...map.values()]}
function trafficMonths(rows,months){return months.map(month=>{let o={month,tg:0,vc:0,dzen:0,total:0};for(const r of rows.filter(x=>x.month===month)){o[r.platform]+=r.visits;o.total+=r.visits}return o})}
function trafficPages(rows,months,metadata=[]){const meta=new Map(metadata.map(p=>[p.url,p])),map=new Map();for(const r of rows.filter(x=>months.includes(x.month))){if(!map.has(r.url))map.set(r.url,{...(meta.get(r.url)||{}),id:r.url,url:r.url,title:meta.get(r.url)?.title||r.url,tg:0,vc:0,dzen:0,total:0});const p=map.get(r.url);p[r.platform]+=r.visits;p.total+=r.visits}return [...map.values()]}
function topicGroups(rows,key='reach',native=false){const map=new Map();for(const p of rows){for(const tag of (native?[p.nativeTopic||'Тема не указана']:p.tags)){if(!map.has(tag))map.set(tag,{id:tag,title:tag,items:[],values:[],opens:0,impressions:0});const t=map.get(tag);t.items.push(p);if(known(p[key]))t.values.push(p[key]);t.opens+=p.opens||0;t.impressions+=p.impressions||0}}return [...map.values()].map(t=>({...t,value:t.values.length?sum(t.values):null,avg:t.values.length?sum(t.values)/t.values.length:null,ctr:ratio(t.opens,t.impressions),count:t.items.length}))}
function filterDates(rows,from,to){return rows.filter(x=>x.date>=from&&x.date<=to)}
const API={known,sum,top,ratio,monthly,stories,trafficMonths,trafficPages,topicGroups,filterDates};
if(typeof module!=='undefined')module.exports=API;else root.Analytics=API;
})(typeof window!=='undefined'?window:globalThis);
