/*!
 * version: 0.0.1-ce6b0d1
 */
import{g as r,a as n}from"./p-cf0e3f2d.js";function t(n,t){let e=[];try{e=n.map((r=>r.trim().toLowerCase())),e=t?[...new Set([`${r.cardBrand}`,...e])]:[...new Set(e)]}catch(r){}return e}function e(r=""){if(""===r||Array.isArray(r))return[...r];try{let n;if("string"==typeof r)if(r.match(/(\[|\])/))try{n=JSON.parse(r)}catch(t){n=r.replace(/(\[|\]|"|'| )/g,"").split(",")}else n=r.split(",");return n||[]}catch(r){throw new Error(r)}}const a=[...r.allowedBrands,...n];function c(r){const n=r.reduce(((r,n)=>(a.includes(n)?r.validBrands.push(n):r.invalidBrands.push(n),r)),{validBrands:[],invalidBrands:[]});return n.invalidBrands.length>0&&console.warn(`Invalid brand name(s) '${n.invalidBrands}' will not be rendered.`),n.validBrands}export{e as c,t as f,c as v}
