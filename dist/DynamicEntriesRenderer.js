!function(e){var t={};function n(i){if(t[i])return t[i].exports;var r=t[i]={i:i,l:!1,exports:{}};return e[i].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(i,r,function(t){return e[t]}.bind(null,r));return i},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=1)}([function(e,t,n){e.exports=function(){"use strict";
/*!
   * mustache.js - Logic-less {{mustache}} templates with JavaScript
   * http://github.com/janl/mustache.js
   */var e=Object.prototype.toString,t=Array.isArray||function(t){return"[object Array]"===e.call(t)};function n(e){return"function"==typeof e}function i(e){return e.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}function r(e,t){return null!=e&&"object"==typeof e&&t in e}var a=RegExp.prototype.test,s=/\S/;function o(e){return!function(e,t){return a.call(e,t)}(s,e)}var l={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;","`":"&#x60;","=":"&#x3D;"},h=/\s*/,u=/\s+/,c=/\s*=/,p=/\s*\}/,d=/#|\^|\/|>|\{|&|=|!/;function f(e){this.string=e,this.tail=e,this.pos=0}function g(e,t){this.view=e,this.cache={".":this.view},this.parent=t}function m(){this.templateCache={_cache:{},set:function(e,t){this._cache[e]=t},get:function(e){return this._cache[e]},clear:function(){this._cache={}}}}f.prototype.eos=function(){return""===this.tail},f.prototype.scan=function(e){var t=this.tail.match(e);if(!t||0!==t.index)return"";var n=t[0];return this.tail=this.tail.substring(n.length),this.pos+=n.length,n},f.prototype.scanUntil=function(e){var t,n=this.tail.search(e);switch(n){case-1:t=this.tail,this.tail="";break;case 0:t="";break;default:t=this.tail.substring(0,n),this.tail=this.tail.substring(n)}return this.pos+=t.length,t},g.prototype.push=function(e){return new g(e,this)},g.prototype.lookup=function(e){var t,i,a,s=this.cache;if(s.hasOwnProperty(e))t=s[e];else{for(var o,l,h,u=this,c=!1;u;){if(e.indexOf(".")>0)for(o=u.view,l=e.split("."),h=0;null!=o&&h<l.length;)h===l.length-1&&(c=r(o,l[h])||(i=o,a=l[h],null!=i&&"object"!=typeof i&&i.hasOwnProperty&&i.hasOwnProperty(a))),o=o[l[h++]];else o=u.view[e],c=r(u.view,e);if(c){t=o;break}u=u.parent}s[e]=t}return n(t)&&(t=t.call(this.view)),t},m.prototype.clearCache=function(){void 0!==this.templateCache&&this.templateCache.clear()},m.prototype.parse=function(e,n){var r=this.templateCache,a=e+":"+(n||v.tags).join(":"),s=void 0!==r,l=s?r.get(a):void 0;return null==l&&(l=function(e,n){if(!e)return[];var r,a,s,l=!1,g=[],m=[],b=[],y=!1,w=!1,E="",k=0;function C(){if(y&&!w)for(;b.length;)delete m[b.pop()];else b=[];y=!1,w=!1}function L(e){if("string"==typeof e&&(e=e.split(u,2)),!t(e)||2!==e.length)throw new Error("Invalid tags: "+e);r=new RegExp(i(e[0])+"\\s*"),a=new RegExp("\\s*"+i(e[1])),s=new RegExp("\\s*"+i("}"+e[1]))}L(n||v.tags);for(var S,P,F,j,x,O,T=new f(e);!T.eos();){if(S=T.pos,F=T.scanUntil(r))for(var q=0,H=F.length;q<H;++q)o(j=F.charAt(q))?(b.push(m.length),E+=j):(w=!0,l=!0,E+=" "),m.push(["text",j,S,S+1]),S+=1,"\n"===j&&(C(),E="",k=0,l=!1);if(!T.scan(r))break;if(y=!0,P=T.scan(d)||"name",T.scan(h),"="===P?(F=T.scanUntil(c),T.scan(c),T.scanUntil(a)):"{"===P?(F=T.scanUntil(s),T.scan(p),T.scanUntil(a),P="&"):F=T.scanUntil(a),!T.scan(a))throw new Error("Unclosed tag at "+T.pos);if(x=">"==P?[P,F,S,T.pos,E,k,l]:[P,F,S,T.pos],k++,m.push(x),"#"===P||"^"===P)g.push(x);else if("/"===P){if(!(O=g.pop()))throw new Error('Unopened section "'+F+'" at '+S);if(O[1]!==F)throw new Error('Unclosed section "'+O[1]+'" at '+S)}else"name"===P||"{"===P||"&"===P?w=!0:"="===P&&L(F)}if(C(),O=g.pop())throw new Error('Unclosed section "'+O[1]+'" at '+T.pos);return function(e){for(var t,n=[],i=n,r=[],a=0,s=e.length;a<s;++a)switch((t=e[a])[0]){case"#":case"^":i.push(t),r.push(t),i=t[4]=[];break;case"/":r.pop()[5]=t[2],i=r.length>0?r[r.length-1][4]:n;break;default:i.push(t)}return n}(function(e){for(var t,n,i=[],r=0,a=e.length;r<a;++r)(t=e[r])&&("text"===t[0]&&n&&"text"===n[0]?(n[1]+=t[1],n[3]=t[3]):(i.push(t),n=t));return i}(m))}(e,n),s&&r.set(a,l)),l},m.prototype.render=function(e,t,n,i){var r=this.getConfigTags(i),a=this.parse(e,r),s=t instanceof g?t:new g(t,void 0);return this.renderTokens(a,s,n,e,i)},m.prototype.renderTokens=function(e,t,n,i,r){for(var a,s,o,l="",h=0,u=e.length;h<u;++h)o=void 0,"#"===(s=(a=e[h])[0])?o=this.renderSection(a,t,n,i,r):"^"===s?o=this.renderInverted(a,t,n,i,r):">"===s?o=this.renderPartial(a,t,n,r):"&"===s?o=this.unescapedValue(a,t):"name"===s?o=this.escapedValue(a,t,r):"text"===s&&(o=this.rawValue(a)),void 0!==o&&(l+=o);return l},m.prototype.renderSection=function(e,i,r,a,s){var o=this,l="",h=i.lookup(e[1]);if(h){if(t(h))for(var u=0,c=h.length;u<c;++u)l+=this.renderTokens(e[4],i.push(h[u]),r,a,s);else if("object"==typeof h||"string"==typeof h||"number"==typeof h)l+=this.renderTokens(e[4],i.push(h),r,a,s);else if(n(h)){if("string"!=typeof a)throw new Error("Cannot use higher-order sections without the original template");null!=(h=h.call(i.view,a.slice(e[3],e[5]),(function(e){return o.render(e,i,r,s)})))&&(l+=h)}else l+=this.renderTokens(e[4],i,r,a,s);return l}},m.prototype.renderInverted=function(e,n,i,r,a){var s=n.lookup(e[1]);if(!s||t(s)&&0===s.length)return this.renderTokens(e[4],n,i,r,a)},m.prototype.indentPartial=function(e,t,n){for(var i=t.replace(/[^ \t]/g,""),r=e.split("\n"),a=0;a<r.length;a++)r[a].length&&(a>0||!n)&&(r[a]=i+r[a]);return r.join("\n")},m.prototype.renderPartial=function(e,t,i,r){if(i){var a=this.getConfigTags(r),s=n(i)?i(e[1]):i[e[1]];if(null!=s){var o=e[6],l=e[5],h=e[4],u=s;0==l&&h&&(u=this.indentPartial(s,h,o));var c=this.parse(u,a);return this.renderTokens(c,t,i,u,r)}}},m.prototype.unescapedValue=function(e,t){var n=t.lookup(e[1]);if(null!=n)return n},m.prototype.escapedValue=function(e,t,n){var i=this.getConfigEscape(n)||v.escape,r=t.lookup(e[1]);if(null!=r)return"number"==typeof r&&i===v.escape?String(r):i(r)},m.prototype.rawValue=function(e){return e[1]},m.prototype.getConfigTags=function(e){return t(e)?e:e&&"object"==typeof e?e.tags:void 0},m.prototype.getConfigEscape=function(e){return e&&"object"==typeof e&&!t(e)?e.escape:void 0};var v={name:"mustache.js",version:"4.2.0",tags:["{{","}}"],clearCache:void 0,escape:void 0,parse:void 0,render:void 0,Scanner:void 0,Context:void 0,Writer:void 0,set templateCache(e){b.templateCache=e},get templateCache(){return b.templateCache}},b=new m;return v.clearCache=function(){return b.clearCache()},v.parse=function(e,t){return b.parse(e,t)},v.render=function(e,n,i,r){if("string"!=typeof e)throw new TypeError('Invalid template! Template should be a "string" but "'+(t(a=e)?"array":typeof a)+'" was given as the first argument for mustache#render(template, view, partials)');var a;return b.render(e,n,i,r)},v.escape=function(e){return String(e).replace(/[&<>"'`=\/]/g,(function(e){return l[e]}))},v.Scanner=f,v.Context=g,v.Writer=m,v}()},function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return l})),n.d(t,"renderPagination",(function(){return h}));var i=n(0),r=n.n(i);var a={parseHTML:e=>(new DOMParser).parseFromString(e.trim(),"text/html").body.firstChild,parseTemplate(e,t){return this.parseHTML(r.a.render(e,t))}};class s{constructor(){this.hashRoutes=[],this.hashParams={}}readHashData(){this.hashRoutes=[],this.hashParams={};let e=window.location.hash.substr(1),t=e.split("?")[0],n=e.split("?")[1];return n&&(this.hashParams=n.split("&").reduce((function(e,t){let n=t.split("=");return e[n[0]]=n[1],e}),{})),t&&(1==t.split("/").length?this.hashRoutes=[t]:this.hashRoutes=t.split("/").filter((function(e){return e.length}))),{routes:this.hashRoutes,params:this.hashParams}}getHashString(e){let t="";e.routes&&e.routes.forEach(e=>{t+="/"+e});let n=0;return e.params&&Object.keys(e.params).forEach(i=>{e.params[i].length&&(t+=(0==n?"?":"&")+i+"="+e.params[i],n++)}),t}setHashData(e){history.pushState({},"","#"+this.getHashString(e))}listen(e=(()=>{})){e(this.readHashData()),window.addEventListener("hashchange",()=>e(this.readHashData()))}}var o={submitOnFormChange:!0,cacheResults:!0,requestFn:(e,t)=>{var n=new Headers;n.append("app-id","61cc1e2f679cb9641fa3f88f");var i={method:"GET",headers:n},r=new Request("https://dummyapi.io/data/v1/user?page="+(Number(e.pageNumber)-1)+"&limit="+e.perPage,i);fetch(r).then(e=>e.json()).then(n=>{let i={total:n.total,entries:n.data,delta:e.perPage,page:e.pageNumber};t(i)}).catch(e=>{})},onInit:function(){},onLoadingStart:function(){},onLoadingFinish:function(){},template:"\n        <div>\n            Build your template using Handlebars syntax. Data must be provided thru the requestFn callback\n        </div>\n    \n    "};
/*!
   * Dynamic Entries Renderer - Render and filter served entries using mustache templates
   * https://github.com/liferay-gs-latam/lfrgs-dynamic-items-container
   */class l{constructor(e,t){t={...o,...t},this.$wrapper=document.getElementById(e),this.$form=this.$wrapper.querySelector("[data-dynamic-entries-renderer-form]"),this.$list=this.$wrapper.querySelector("[data-dynamic-entries-renderer-list]"),this.template=t.template,this.requestFn=t.requestFn,this.onLoadingStart=t.onLoadingStart,this.onLoadingFinish=t.onLoadingFinish,this.submitOnFormChange=t.submitOnFormChange,this.enableCaching=t.enableCaching,this.$wrapper&&this.$form&&this.$list?this.init():console.log('DynamicEntriesRenderer: A "wrapper" and "list" element should be defined')}registerEvents(){this.$form.addEventListener("submit",e=>{e.preventDefault(),this.submit()}),this.$form.addEventListener("change",()=>{this.submitOnFormChange&&this.submit()}),window.addEventListener("hashchange",()=>{let e=this._hashRouter.readHashData().params;this.updateFilterElementsValues(e),this.submit(!1)})}init(){this._cache={},this._hashRouter=new s,this.filterElements={},this.isLoading=!1,this.response={},this.lastRequestParams={},this.registerEvents(),Array.from(this.$form.querySelectorAll("[data-dynamic-entries-renderer-filter-parameter]")).forEach(e=>{let t=e.getAttribute("data-dynamic-entries-renderer-filter-parameter");t.length&&(this.filterElements[t]=e)}),window.dispatchEvent(new Event("hashchange")),this.onInit&&this.onInit(this)}submit(e=!0){let t=this.getFilterElementsValues();e&&this.setHashParameters(t),this.request(t)}request(e){if(!this.requestFn||this.isLoading)return;let t=JSON.stringify(e);if(t!==JSON.stringify(this.lastRequestParams)){if(this.isLoading=!0,this.disable(),this.onLoadingStart&&this.onLoadingStart(this),this.enableCaching&&this._cache[t]){let e=this._cache[t];this.response=e,this.render(),this.isLoading=!1}else this.requestFn(e,e=>{this.response=e,this.render(),this.isLoading=!1,this.enableCaching?this._cache[t]=e:(this._cache[t]={},delete this._cache[t])});this.lastRequestParams=e}}render(){this.$list.innerHTML="",this.$list.appendChild(a.parseTemplate(this.template,this.response)),this.enable(),this.onLoadingFinish&&this.onLoadingFinish(this)}updateFilterElementsValues(e){Object.keys(this.filterElements).forEach(t=>{if(e[t]&&e[t].length)this.setFilterElementValue(t,e[t]);else{let e=this.getFilterElementDefaultValue(t);this.setFilterElementValue(t,e)}})}setHashParameters(e){let t={};Object.keys(e).forEach(n=>{let i=e[n];i&&i.length>0&&i!==this.getFilterElementDefaultValue(n)&&(t[n]=i)}),this._hashRouter.setHashData({params:t})}getFilterElementValue(e){return this.filterElements[e].value}getFilterElementDefaultValue(e){let t=this.filterElements[e];return t.hasAttribute("data-dynamic-entries-renderer-filter-default-value")?t.getAttribute("data-dynamic-entries-renderer-filter-default-value"):""}setFilterElementValue(e,t){if(!this.filterElements[e])return!1;if(this.isLoading)return!1;this.filterElements[e].value=decodeURIComponent(t)}getFilterElementsValues(){let e={};return Object.keys(this.filterElements).forEach(t=>{e[t]=this.getFilterElementValue(t)}),e}disable(){Object.keys(this.filterElements).forEach(e=>{let t=this.filterElements[e];t.hasAttribute("disabled")?t.setAttribute("data-originally-disabled","true"):(t.disabled=!0,t.classList.add("disabled"))})}enable(){Object.keys(this.filterElements).forEach(e=>{let t=this.filterElements[e];t.hasAttribute("data-originally-disabled")||(t.disabled=!1,t.removeAttribute("data-originally-disabled"),t.classList.remove("disabled"))})}}var h=(e,t,n,i)=>{void 0===i&&(i=e=>{console.log("renderPagination(): Please add a setPage fn")});let r=e=>{e>=1&&e<=n&&e!==t&&i(e)},a=((e="")=>parseHTML('\n            <nav id="'+e+'">\n                <ul class="pagination justify-content-center" data-pagination-items>\n                </ul>\n            </nav>\n        '))();e.appendChild(a);let s=a.querySelector("[data-pagination-items]"),o=(e=>parseHTML('\n            <li class="page-item '+(1==e?" disabled":"")+'" data-pagination-item>\n                <a class="page-link" href="#" data-to-page="previous" data-pagination-item-link>\n                    Previous\n                </a>\n            </li>\n        '))(t);s.appendChild(o);o.querySelector("[data-pagination-item-link]").addEventListener("click",e=>{e.preventDefault(),r(t-1)});let l=e=>{let n=((e,t)=>parseHTML('\n            <li class="page-item d-none d-md-block  '+(e==t?" active":"")+'" data-pagination-item>\n                <a class="page-link" href="#" data-to-page="'+e+'" data-pagination-item-link>'+e+"</a>\n            </li>\n        "))(e,t);s.appendChild(n);n.querySelector("[data-pagination-item-link]").addEventListener("click",t=>{t.preventDefault(),r(e)})},h=()=>{let e=parseHTML('\n            <li class="page-item d-none d-md-block  disabled">\n                <a class="page-link disabled">\n                    ...\n                </a> \n            </li>\n        ');s.appendChild(e)};if(n<11)for(let e=1;e<=n;e++)l(e);else{let e=2,i=t-1,r=n-t;if(i>=e+3){l(1),h();for(let n=e;n>=1;n--)l(t-n)}else for(let e=1;e<=i;e++)l(e);if(l(t),r>=e+3){for(let n=1;n<=e;n++)l(t+n);h(),l(n)}else for(let e=t+1;e<=n;e++)l(e)}let u=((e,t)=>parseHTML('\n            <li class="page-item '+(e>=t?" disabled":"")+'" data-pagination-item>\n                <a class="page-link" href="#" data-to-page="next" data-pagination-item-link>\n                    Next\n                </a>\n            </li>\n        '))(t,n);s.appendChild(u);u.querySelector("[data-pagination-item-link]").addEventListener("click",e=>{e.preventDefault(),r(t+1)})};window.DynamicEntriesRenderer=l,window.renderPagination=h}]);