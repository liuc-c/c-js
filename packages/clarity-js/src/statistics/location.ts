
export let data = Object.freeze({
    __proto__: null,
    get HH(){ return location.hash},
    get HT(){ return location.host},
    get HN(){ return location.hostname},
    get HF(){ return location.href},
    get PN(){ return location.pathname},
    get PT(){ return location.port},
    get PL(){ return location.protocol},
    get SH(){ return location.search},
  })