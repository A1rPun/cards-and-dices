var M=Object.defineProperty;var N=(l,a,u)=>a in l?M(l,a,{enumerable:!0,configurable:!0,writable:!0,value:u}):l[a]=u;var g=(l,a,u)=>(N(l,typeof a!="symbol"?a+"":a,u),u);import{d as E,c as m,a as r,t as S,n as k,o,_ as V,r as A,F as b,b as C,e as I,u as v,f as L,w as R,v as P,p as T,g as j}from"./index-DSVuqJWJ.js";const z=E({__name:"PlayingCard",props:{number:{},suit:{}},setup(l){function a(t){return t===11?"J":t===12?"Q":t===13?"K":t===14?"A":t<2||t>14?"":t.toString()}function u(t){return t==="spades"?"♠︎":t==="clubs"?"♣︎":t==="diamonds"?"♦︎":t==="hearts"?"♥︎":""}return(t,i)=>(o(),m("div",{class:k(["playing-card",[t.suit,{"playing-card--back":t.number===1,"playing-card--empty":t.number===0}]])},[r("div",{class:k(["playing-card--suit",[{hidden:t.number<2}]])},[r("span",null,S(u(t.suit)),1)],2),r("div",{class:k(["playing-card--number",[t.suit]])},[r("span",null,S(a(t.number)),1)],2),r("div",{class:k(["playing-card--suit-large",[{hidden:t.number<2}]])},[r("span",null,S(u(t.suit)),1)],2)],2))}}),_=V(z,[["__scopeId","data-v-f3f46736"]]),J=l=>(T("data-v-18059b29"),l=l(),j(),l),K=J(()=>r("h1",null,"Solitaire ♥︎ ♦︎ ♣︎ ♠︎",-1)),Q={class:"solitaire"},$={class:"solitaire--header"},q={class:"solitaire--goal"},G={class:"solitaire--wrap"},O={class:"solitaire--deck"},U={class:"solitaire--wrap"},W={class:"solitaire--playfield"},X=E({__name:"SolitaireView",setup(l){class a{constructor(s,e){g(this,"suit");g(this,"n");this.suit=s,this.n=e}isRed(){return this.suit==="hearts"||this.suit==="diamonds"}}class u{constructor(s){g(this,"cards");g(this,"hidden");const e=s.pop();this.hidden=s,this.cards=[e]}isEmpty(){return this.hidden.length===0&&this.cards.length===0}canAddCard(s){if(!this.cards.length)return!1;const e=this.cards[this.cards.length-1];return e.n-1===s.n&&e.isRed()!==s.isRed()}popHidden(){this.cards.length===0&&this.hidden.length&&this.cards.push(this.hidden.pop())}}const t=["hearts","diamonds","clubs","spades"].flatMap(n=>Array.from(Array(13),(s,e)=>new a(n,e+2))),i=A(-1),d=A({hearts:0,diamonds:0,clubs:0,spades:0});F(t);const y=A([]);for(let n=0,s=0;n<7;n++){const e=t.slice(s,s+n+1);y.value.push(new u(e)),s+=n+1}const p=t.slice(-24);function F(n){for(let s=n.length-1;s>0;s--){const e=Math.floor(Math.random()*(s+1));[n[s],n[e]]=[n[e],n[s]]}}function B(n){return n.n===14?(d.value[n.suit]=14,!0):n.n===2&&d.value[n.suit]===14?(d.value[n.suit]=2,!0):n.n-1===d.value[n.suit]?(d.value[n.suit]=n.n,!0):!1}function w(n){if(n.n===13){const[s]=y.value.filter(e=>e.isEmpty());if(s)return s}else{const[s]=y.value.filter(e=>e.canAddCard(n));if(s)return s}}return(n,s)=>(o(),m(b,null,[K,r("div",Q,[r("div",$,[r("div",q,[r("div",G,[(o(!0),m(b,null,C(d.value,(e,c)=>(o(),L(_,{key:c,suit:c,number:e,onClick:()=>{const h=new a(c,e),f=w(h);f&&(f.cards.push(h),e===2?d.value[c]=14:d.value[c]--)}},null,8,["suit","number","onClick"]))),128))])]),r("div",O,[r("div",U,[I(_,{suit:i.value>=0?v(p)[i.value].suit:"hearts",number:i.value>=0?v(p)[i.value].n:0,onClick:s[0]||(s[0]=()=>{if(B(v(p)[i.value])){v(p).splice(i.value,1),i.value--;return}const e=w(v(p)[i.value]);if(e){const c=v(p).splice(i.value,1);e.cards.push(...c),i.value--}})},null,8,["suit","number"]),I(_,{number:i.value===v(p).length-1?0:1,onClick:s[1]||(s[1]=()=>{i.value++,i.value>=v(p).length&&(i.value=-1)})},null,8,["number"])])])]),r("div",W,[(o(!0),m(b,null,C(y.value,(e,c)=>(o(),m("div",{key:c,class:"solitaire--playfield-lane"},[R(I(_,{number:0},null,512),[[P,e.isEmpty()]]),(o(!0),m(b,null,C(e.hidden,(h,f)=>(o(),L(_,{key:f,number:1}))),128)),(o(!0),m(b,null,C(e.cards,(h,f)=>(o(),L(_,{key:f,suit:h.suit,number:h.n,onClick:()=>{if(f===e.cards.length-1&&B(h)){e.cards.pop(),e.popHidden();return}const D=w(h);if(D){const H=e.cards.splice(f);D.cards.push(...H),e.popHidden()}}},null,8,["suit","number","onClick"]))),128))]))),128))])])],64))}}),ee=V(X,[["__scopeId","data-v-18059b29"]]);export{ee as default};