
let screen = window.screen as any;

export let data =  Object.freeze({
    __proto__:null,
    get  AT(){return screen.availTop},
    get  AL(){return screen.availLeft},
    get  AH(){return screen.availHeight},
    get  AW(){return screen.availWidth},
    get  CD(){return screen.colorDepth},
    get  HT(){return screen.height},
    get  PD(){return screen.pixelDepth},
    get  WH(){return screen.width},
    get  ON(){return screen.orientation},
})