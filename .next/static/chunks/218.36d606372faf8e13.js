"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[218],{9218:function(e,t,s){s.r(t),s.d(t,{default:function(){return l}});var r=s(257);class i{constructor(){this.errorQueue=[],this.maxErrors=100,this.retryAttempts=new Map,this.maxRetries=3,this.handlersBound=!1,this.setupGlobalHandlers();try{setTimeout(()=>{this.setupGlobalHandlers()},0)}catch(e){}try{queueMicrotask(()=>{this.setupGlobalHandlers()})}catch(e){}}setupGlobalHandlers(){let e="undefined"!=typeof globalThis?globalThis.window:void 0;return!!e&&!this.handlersBound&&(e.addEventListener("error",e=>{this.handleError(e.error,"Global Error Handler",{filename:e.filename,lineno:e.lineno,colno:e.colno})}),e.addEventListener("unhandledrejection",e=>{this.handleError(e.reason,"Unhandled Promise Rejection")}),this.handlersBound=!0,!0)}handleError(e,t="Unknown",s={},r={}){this.setupGlobalHandlers();let i=this.processError(e,t,s);return this.logError(i),this.storeError(i),this.sendToAnalytics(i),!1!==r.showUserNotification&&this.showUserFriendlyError(i,r.userMessage),this.isProduction,i}processError(e,t,s){let r;let i=new Date().toISOString();r=e instanceof Error?{name:e.name,message:e.message,stack:e.stack}:"string"==typeof e?{name:"CustomError",message:e,stack:Error().stack}:{name:"UnknownError",message:"An unknown error occurred",stack:Error().stack,originalError:e};let n="undefined"!=typeof globalThis?globalThis.navigator:void 0,o="undefined"!=typeof globalThis?globalThis.window:void 0;return{id:this.generateErrorId(),timestamp:i,context:t,error:r,severity:this.determineSeverity(r,t),metadata:{userAgent:n?.userAgent||"Unknown",url:o?.location?.href||"Unknown",online:"boolean"!=typeof n?.onLine||n.onLine,...s}}}determineSeverity(e,t){return t.includes("Auth")||t.includes("Database")||"SecurityError"===e.name||t.includes("Payment")?"critical":t.includes("API")||t.includes("Network")||"TypeError"===e.name||t.includes("Service Worker")?"high":t.includes("UI")||t.includes("Animation")||t.includes("Storage")?"medium":"low"}showUserFriendlyError(e,t){let s="undefined"!=typeof globalThis?globalThis.window:void 0;if(!s)return;let r=t;if(r||(r=this.getUserFriendlyMessage(e)),s.uiManager&&"function"==typeof s.uiManager.showToast){let t="critical"===e.severity||"high"===e.severity?"error":"warning";s.uiManager.showToast(r,t)}else"critical"!==e.severity||this.isProduction||alert(r)}getUserFriendlyMessage(e){let{error:t,context:s,metadata:r}=e;if(!r.online)return"\uD83C\uDF10 You appear to be offline. Please check your internet connection.";if(s.includes("Network")||s.includes("API"))return"\uD83D\uDD0C Connection issue. Please try again in a moment.";if(s.includes("Auth"))return"\uD83D\uDD10 Authentication issue. Please log in again.";if(s.includes("Storage"))return"\uD83D\uDCBE Unable to save your data. Please try again.";switch(e.severity){case"critical":return"⚠️ Something went wrong. Please refresh the page.";case"high":return"⚠️ There was an issue processing your request.";case"medium":return"⚠️ A minor issue occurred. You can continue using the app.";default:return"⚠️ Something unexpected happened."}}logError(e){let t=this.getLogLevel(e.severity);this.isProduction?"critical"===e.severity||e.severity:(console[t]("\uD83D\uDEA8 Error Details:",{id:e.id,severity:e.severity,context:e.context,message:e.error.message,timestamp:e.timestamp,metadata:e.metadata}),e.error.stack&&e.severity)}getLogLevel(e){switch(e){case"critical":case"high":return"error";case"medium":return"warn";case"low":return"info";default:return"log"}}storeError(e){this.errorQueue.push(e),this.errorQueue.length>this.maxErrors&&this.errorQueue.shift();let t="undefined"!=typeof globalThis?globalThis.window:void 0,s="undefined"!=typeof globalThis&&void 0!==globalThis.localStorage;if(!this.isProduction&&t&&s)try{let t=JSON.parse(globalThis.localStorage.getItem("errorLog")||"[]");t.push(e);let s=t.slice(-50);globalThis.localStorage.setItem("errorLog",JSON.stringify(s))}catch(e){}}sendToAnalytics(e){try{let t="undefined"!=typeof globalThis?globalThis.gtag:void 0;"function"==typeof t&&t("event","exception",{description:`${e.context}: ${e.error.message}`,fatal:"critical"===e.severity,custom_map:{severity:e.severity,context:e.context}});let s="undefined"!=typeof globalThis?globalThis.window:void 0;s&&s.analytics&&"function"==typeof s.analytics.trackError&&s.analytics.trackError(e)}catch(e){}}generateErrorId(){return`err_${Date.now()}_${Math.random().toString(36).substr(2,9)}`}async handleApiError(e,t,s={}){let r=`API Error: ${e.status} ${e.statusText}`;try{let t=await e.json();r=t&&t.message?`API Error: ${t.message}`:r}catch(e){}let i=this.handleError(Error(r),"API Request",{endpoint:t,status:e.status,statusText:e.statusText});if(!1!==s.enableRetry&&this.shouldRetry(e.status,t)){let e=await this.handleRetry(t,s.retryCallback);if(e.success)return e}return i}shouldRetry(e,t){let s=this.retryAttempts.get(t)||0;return[500,502,503,504,429].includes(e)&&s<this.maxRetries}async handleRetry(e,t){let s=this.retryAttempts.get(e)||0;for(;s<this.maxRetries;){let r=s+1;if(this.retryAttempts.set(e,r),s<this.maxRetries-1){let e=Math.min(1e3*Math.pow(2,s),1e4);await new Promise(t=>setTimeout(t,e))}try{if(t){let s=await t();return this.retryAttempts.delete(e),{success:!0,result:s}}}catch(e){s=r;continue}break}return this.retryAttempts.delete(e),this.handleError(Error(`Max retries (${this.maxRetries}) exceeded for ${e}`),"API Retry Failed"),{success:!1}}handleNetworkError(e,t="Network Operation"){let s="undefined"!=typeof globalThis?globalThis.navigator:void 0;return this.handleError(e,t,{type:"network",online:"boolean"!=typeof s?.onLine||s.onLine})}handleValidationError(e,t,s=null){return this.handleError(Error(`Validation Error: ${t}`),"Data Validation",{field:e,value:s,type:"validation"})}getRecentErrors(e=10){return this.errorQueue.slice(-e)}getErrorStats(){let e={total:this.errorQueue.length,bySeverity:{critical:0,high:0,medium:0,low:0},byContext:{},last24Hours:0},t=Date.now()-864e5;return this.errorQueue.forEach(s=>{e.bySeverity[s.severity]++,e.byContext[s.context]=(e.byContext[s.context]||0)+1,new Date(s.timestamp).getTime()>t&&e.last24Hours++}),e}clearErrors(){this.errorQueue=[],this.retryAttempts.clear(),this.setupGlobalHandlers();let e="undefined"!=typeof globalThis&&void 0!==globalThis.localStorage;!this.isProduction&&e&&globalThis.localStorage.removeItem("errorLog")}safeAsync(e,t,s=null,r={}){return(async()=>{try{return await e()}catch(i){if(this.handleError(i,t,{},{showUserNotification:r.showUserNotification,userMessage:r.userMessage}),r.enableRetry&&this.shouldRetryOperation(t)){let s=await this.handleRetry(t,e);if(s.success)return s.result}return s}})()}shouldRetryOperation(e){let t=this.retryAttempts.get(e)||0;return["Network","API","Storage","Database"].some(t=>e.includes(t))&&t<this.maxRetries}safeSync(e,t,s=null,r={}){try{return e()}catch(e){return this.handleError(e,t,{},{showUserNotification:r.showUserNotification,userMessage:r.userMessage}),s}}get isProduction(){try{return void 0!==r}catch(e){return!1}}}let n=new i;n.handleError.bind(n),n.handleApiError.bind(n),n.handleNetworkError.bind(n),n.handleValidationError.bind(n),n.safeAsync.bind(n),n.safeSync.bind(n),n.getRecentErrors.bind(n),n.getErrorStats.bind(n),n.clearErrors.bind(n);class o{constructor(){this.loadingStates=new Map,this.skeletonTemplates=new Map,this.progressTrackers=new Map,this.loadingCallbacks=new Map,this.initializeSkeletonTemplates(),this.setupIntersectionObserver()}initializeSkeletonTemplates(){this.skeletonTemplates.set("cigar-card",`
      <div class="skeleton-card">
        <div class="skeleton-header"></div>
        <div class="skeleton-content">
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
          <div class="skeleton-line medium"></div>
        </div>
      </div>
    `),this.skeletonTemplates.set("cigar-list",`
      <div class="skeleton-list">
        ${Array(6).fill('<div class="skeleton-item"><div class="skeleton-circle"></div><div class="skeleton-text"><div class="skeleton-line"></div><div class="skeleton-line short"></div></div></div>').join("")}
      </div>
    `),this.skeletonTemplates.set("dashboard-widget",`
      <div class="skeleton-widget">
        <div class="skeleton-title"></div>
        <div class="skeleton-chart"></div>
        <div class="skeleton-stats">
          <div class="skeleton-stat"></div>
          <div class="skeleton-stat"></div>
          <div class="skeleton-stat"></div>
        </div>
      </div>
    `),this.skeletonTemplates.set("3d-scene",`
      <div class="skeleton-3d">
        <div class="skeleton-canvas">
          <div class="skeleton-loading-spinner"></div>
          <div class="skeleton-loading-text">Initializing 3D Scene...</div>
        </div>
      </div>
    `)}setupIntersectionObserver(){this.lazyLoadObserver=new IntersectionObserver(e=>{e.forEach(e=>{if(e.isIntersecting){let t=e.target,{loadingId:s}=t.dataset;s&&this.triggerLazyLoad(s,t)}})},{rootMargin:"50px"})}startLoading(e,t={}){let{element:s=null,type:r="default",message:i="Loading...",showProgress:n=!1,showSkeleton:o=!1,skeletonType:a="default"}=t,l={id:e,element:s,type:r,message:i,showProgress:n,showSkeleton:o,skeletonType:a,startTime:Date.now(),progress:0,isComplete:!1};return this.loadingStates.set(e,l),s&&this.renderLoadingUI(l),n&&this.initializeProgressTracker(e),l}updateProgress(e,t,s=null){let r=this.loadingStates.get(e);if(!r)return;r.progress=Math.min(100,Math.max(0,t)),s&&(r.message=s),this.updateLoadingUI(r);let i=this.loadingCallbacks.get(e);i&&i.onProgress&&i.onProgress(r.progress,r.message)}finishLoading(e,t=!0,s=null){let r=this.loadingStates.get(e);if(!r)return;r.isComplete=!0,r.success=t,r.endTime=Date.now(),r.duration=r.endTime-r.startTime,s&&(r.message=s),this.showCompletionMessage(r),setTimeout(()=>{this.hideLoadingUI(r),this.loadingStates.delete(e),this.progressTrackers.delete(e)},t?800:2e3);let i=this.loadingCallbacks.get(e);i&&(t&&i.onSuccess?i.onSuccess(r):!t&&i.onError&&i.onError(r),this.loadingCallbacks.delete(e))}renderLoadingUI(e){let{element:t,showSkeleton:s,skeletonType:r,showProgress:i,message:n}=e;t&&(t.dataset.originalContent||(t.dataset.originalContent=t.innerHTML),s?this.renderSkeleton(t,r):this.renderSpinner(t,n,i),t.classList.add("loading-active"))}renderSkeleton(e,t){let s=this.skeletonTemplates.get(t)||this.getDefaultSkeleton();e.innerHTML=`
      <div class="skeleton-container" data-skeleton-type="${t}">
        ${s}
      </div>
    `,this.ensureSkeletonCSS()}renderSpinner(e,t,s){let r=s?`
      <div class="loading-progress">
        <div class="loading-progress-bar">
          <div class="loading-progress-fill" style="width: 0%"></div>
        </div>
        <div class="loading-progress-text">0%</div>
      </div>
    `:"";e.innerHTML=`
      <div class="loading-container">
        <div class="loading-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
        </div>
        <div class="loading-message">${t}</div>
        ${r}
      </div>
    `,this.ensureLoadingCSS()}updateLoadingUI(e){let{element:t,progress:s,message:r,showProgress:i}=e;if(!t)return;let n=t.querySelector(".loading-message");if(n&&(n.textContent=r),i){let e=t.querySelector(".loading-progress-fill"),r=t.querySelector(".loading-progress-text");e&&(e.style.width=`${s}%`),r&&(r.textContent=`${Math.round(s)}%`)}}showCompletionMessage(e){let{element:t,success:s,message:r}=e;t&&(t.innerHTML=`
      <div class="loading-completion ${s?"success":"error"}">
        <div class="${s?"success-icon":"error-icon"}">
          ${s?"✓":"⚠"}
        </div>
        <div class="completion-message">${r||(s?"Loaded successfully!":"Loading failed")}</div>
      </div>
    `)}hideLoadingUI(e){let{element:t}=e;if(!t)return;let{originalContent:s}=t.dataset;s&&(t.innerHTML=s,delete t.dataset.originalContent),t.classList.remove("loading-active")}initializeProgressTracker(e){this.progressTrackers.set(e,{total:0,completed:0,items:new Map})}addProgressItem(e,t,s=1){let r=this.progressTrackers.get(e);r&&(r.items.set(t,{weight:s,completed:!1}),r.total+=s)}completeProgressItem(e,t){let s=this.progressTrackers.get(e);if(!s)return;let r=s.items.get(t);if(!r||r.completed)return;r.completed=!0,s.completed+=r.weight;let i=s.completed/s.total*100;this.updateProgress(e,i)}enableLazyLoading(e,t,s){e.dataset.loadingId=t,e.dataset.lazyLoad="true",this.loadingCallbacks.set(t,{onLoad:s}),this.lazyLoadObserver.observe(e)}triggerLazyLoad(e,t){let s=this.loadingCallbacks.get(e);s&&s.onLoad&&(this.startLoading(e,{element:t,message:"Loading content...",showSkeleton:!0,skeletonType:t.dataset.skeletonType||"default"}),s.onLoad(t).then(()=>{this.finishLoading(e,!0)}).catch(t=>{n.handleError({type:"lazy_load",message:`Failed to lazy load content: ${t.message}`,error:t}),this.finishLoading(e,!1,"Failed to load content")})),this.lazyLoadObserver.unobserve(t)}createBatchLoader(e,t,s={}){let{element:r=null,concurrent:i=3,showProgress:o=!0,onItemComplete:l=null,onBatchComplete:d=null}=s;this.startLoading(e,{element:r,showProgress:o,message:`Loading ${t.length} items...`}),this.initializeProgressTracker(e),t.forEach((t,s)=>{this.addProgressItem(e,`item_${s}`,1)});let c=[],h=new a(i);return t.forEach((t,s)=>{let r=h.acquire().then(async r=>{try{let r=await t.loadFunction();return l&&l(t,r,s),this.completeProgressItem(e,`item_${s}`),{success:!0,result:r,item:t,index:s}}catch(r){return n.handleError({type:"batch_load_item",message:`Failed to load batch item ${s}: ${r.message}`,error:r}),this.completeProgressItem(e,`item_${s}`),{success:!1,error:r,item:t,index:s}}finally{r()}});c.push(r)}),Promise.allSettled(c).then(t=>{let s=t.filter(e=>e.value?.success).length,r=t.length-s,i=0===r,n=i?`Successfully loaded ${s} items`:`Loaded ${s} items, ${r} failed`;this.finishLoading(e,i,n),d&&d(t)}),c}setCallback(e,t){this.loadingCallbacks.set(e,t)}isLoading(e){let t=this.loadingStates.get(e);return t&&!t.isComplete}getLoadingState(e){return this.loadingStates.get(e)}getDefaultSkeleton(){return`
      <div class="skeleton-default">
        <div class="skeleton-line"></div>
        <div class="skeleton-line medium"></div>
        <div class="skeleton-line short"></div>
      </div>
    `}ensureSkeletonCSS(){if(document.getElementById("skeleton-styles"))return;let e=document.createElement("style");e.id="skeleton-styles",e.textContent=`
      .skeleton-container {
        animation: skeleton-pulse 1.5s ease-in-out infinite;
      }

      .skeleton-line,
      .skeleton-circle,
      .skeleton-header,
      .skeleton-title,
      .skeleton-chart,
      .skeleton-stat {
        background: linear-gradient(90deg, #2c2c2c 25%, #3c3c3c 50%, #2c2c2c 75%);
        background-size: 200% 100%;
        animation: skeleton-shimmer 2s infinite;
        border-radius: 4px;
      }

      .skeleton-line {
        height: 1rem;
        margin: 0.5rem 0;
      }

      .skeleton-line.short { width: 60%; }
      .skeleton-line.medium { width: 80%; }

      .skeleton-circle {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
      }

      .skeleton-header {
        height: 2rem;
        margin-bottom: 1rem;
      }

      .skeleton-title {
        height: 1.5rem;
        width: 40%;
        margin-bottom: 1rem;
      }

      .skeleton-chart {
        height: 200px;
        margin: 1rem 0;
      }

      .skeleton-stat {
        height: 1rem;
        width: 80px;
        margin: 0.5rem;
      }

      .skeleton-card {
        padding: 1rem;
        border: 1px solid #444;
        border-radius: 8px;
        margin: 1rem 0;
      }

      .skeleton-item {
        display: flex;
        align-items: center;
        padding: 0.5rem 0;
        gap: 1rem;
      }

      .skeleton-text {
        flex: 1;
      }

      .skeleton-stats {
        display: flex;
        gap: 1rem;
      }

      @keyframes skeleton-shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }

      @keyframes skeleton-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
    `,document.head.appendChild(e)}ensureLoadingCSS(){if(document.getElementById("loading-styles"))return;let e=document.createElement("style");e.id="loading-styles",e.textContent=`
      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        text-align: center;
      }

      .loading-spinner {
        position: relative;
        width: 48px;
        height: 48px;
        margin-bottom: 1rem;
      }

      .spinner-ring {
        display: block;
        position: absolute;
        width: 40px;
        height: 40px;
        border: 4px solid transparent;
        border-top-color: #c69c6d;
        border-radius: 50%;
        animation: spinner-spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
      }

      .spinner-ring:nth-child(1) { animation-delay: -0.45s; }
      .spinner-ring:nth-child(2) { animation-delay: -0.3s; }
      .spinner-ring:nth-child(3) { animation-delay: -0.15s; }

      .loading-message {
        color: #f0e6d2;
        font-size: 0.9rem;
        margin-bottom: 1rem;
      }

      .loading-progress {
        width: 200px;
        margin-top: 1rem;
      }

      .loading-progress-bar {
        width: 100%;
        height: 6px;
        background: #444;
        border-radius: 3px;
        overflow: hidden;
      }

      .loading-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #c69c6d, #dab785);
        border-radius: 3px;
        transition: width 0.3s ease;
      }

      .loading-progress-text {
        text-align: center;
        font-size: 0.8rem;
        margin-top: 0.5rem;
        color: #a67856;
      }

      .loading-completion {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1rem;
      }

      .success-icon,
      .error-icon {
        font-size: 2rem;
        margin-bottom: 0.5rem;
      }

      .success-icon { color: #28a745; }
      .error-icon { color: #dc3545; }

      .completion-message {
        font-size: 0.9rem;
      }

      .loading-completion.success .completion-message { color: #28a745; }
      .loading-completion.error .completion-message { color: #dc3545; }

      @keyframes spinner-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `,document.head.appendChild(e)}}class a{constructor(e){this.max=e,this.current=0,this.queue=[]}async acquire(){return new Promise(e=>{let t=()=>{this.current--,this.queue.length>0&&this.queue.shift()()};this.current<this.max?(this.current++,e(t)):this.queue.push(()=>{this.current++,e(t)})})}}var l=new o}}]);