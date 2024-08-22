
let navigator = window.navigator as any;

export let data = {
        __proto__: null,
        get ACN(){return navigator.appCodeName},
        get AN(){return navigator.appName},
        get AV(){return navigator.appVersion},
        get CE(){return navigator.cookieEnabled},
        get OL(){return navigator.onLine},
        get PM(){return navigator.platform},
        get UA(){return navigator.userAgent},
        get HC(){return navigator.hardwareConcurrency || 1},
        get PFTC(){return navigator.platform.toLowerCase()},
        get LAN(){return navigator.language},
        get JE(){return JE()},
        get SBN(){return SBN()},
        get CN(){return CN()},
        get EQTP(){return EQTP()},
    };

function JE() {
    return navigator.javaEnabled();
  }

  function SBN() {
    navigator.sendBeacon();
  }
  
  function CN() {
    var cnVal;
    if (navigator.connection) {
      cnVal =
        navigator.connection.type || navigator.connection.effectiveType;
    }
    if (typeof cnVal == "undefined") {
      cnVal = "";
    }
    return cnVal;
  }

  function EQTP() {
    function isNative(v) {
      return typeof v !== "undefined";
    }

    var userAgentInfo = navigator.userAgent.toLowerCase();
    var o = navigator.platform.toLowerCase();
    var isMac = o.indexOf("macintel") !== -1;
    var isPc =
      (o.indexOf("win32") == -1 && !isMac) || o.indexOf("iphone") != -1
        ? true
        : false;
    isPc = isPc == true ? (o.indexOf("i686") == -1 ? true : false) : isPc;

    var isVm =
      userAgentInfo.indexOf("android") != -1 ||
      userAgentInfo.indexOf("iphone") != -1 ||
      userAgentInfo.indexOf("symbianos") != -1 ||
      userAgentInfo.indexOf("windows phone") != -1 ||
      userAgentInfo.indexOf("ipad") != -1 ||
      userAgentInfo.indexOf("ipod") != -1
        ? true
        : false;
    var terMre = Object.getOwnPropertyDescriptor(navigator, "platform") == undefined &&
      (navigator.__proto__
        ? Object.getOwnPropertyDescriptor(navigator.__proto__, "platform")
            .value == undefined
        : true)
        ? true
        : false;

    terMre = terMre
      ? navigator.__lookupGetter__ &&
        isNative(navigator.__lookupGetter__("platform"))
      : terMre;

    if ((isPc && isVm && terMre) || (isPc && terMre && !isVm)) {
      if (o.indexOf("iphone") != -1 || o.indexOf("ipad") != -1) {
        return 0;
      }
      return 1;
    } else if ((!isPc && isVm) || (!terMre && isPc && isVm)) {
      return 2;
    } else {
      if (isMac) return 4;
      return 3;
    }
  };