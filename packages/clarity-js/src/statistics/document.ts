

export let data = Object.freeze({
    __proto__:null,
    get ref(){return ref()},
    get href(){return href()},
    get webY(){return webY()},
    get webX(){return webX()},
    get webTitle(){return webTitle()},
    get VDRD(){return VDRD()},
    get CID(){return CID()},
    get oCN(){return oCN() || 0},
    get hSL(){return document.documentElement.innerHTML.length},
    get IN(){return document.getElementsByTagName("*").length},
})

function ref() {
    return encodeURI(document.referrer);
  }

  function href() {
    return encodeURI(String(location));
  }

  function webY() {
    var webY;
    if (navigator.userAgent.indexOf("MSIE") > 0) {
      webY = window.screenTop;
    } else {
      webY = window.screenY;
    }
    return webY;
  }

  function webX() {
    var webX;
    if (navigator.userAgent.indexOf("MSIE") > 0) {
      webX = window.screenLeft;
    } else {
      webX = window.screenX;
    }
    return webX;
  }

  function webTitle() {
    var webTitleName = document.title;
    if (webTitleName.length > 40) {
      webTitleName = webTitleName.substring(0, 40);
    }
    webTitleName = encodeURI(webTitleName);
    return webTitleName;
  }

  function VDRD() {
    var canvas = document.createElement("canvas");
    var gl:any = canvas.getContext("experimental-webgl");
    var vendor, renderer;
    if (gl != null) {
      var debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo != null) {
        vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      }
    }
    return {
      VD: vendor,
      RD: renderer,
    };
  }

  function CID() {
    try {
      var a = "",
        k = "fillStyle",
        q = "beginPath",
        n = "closePath",
        j = "fill",
        h = "arc",
        e = "fillText",
        w = Math.PI;
      var p = document.createElement("canvas");
      p.width = 2000;
      p.height = 200;
      p.style.display = "inline";
      var s = p.getContext("2d");
      a +=
        "canvas winding:" +
        (s.isPointInPath(5, 5, "evenodd") === false ? "yes" : "no");
      s.textBaseline = "alphabetic";
      s[k] = "#f60";
      s.fillRect(125, 1, 62, 20);
      s[k] = "#069";
      s.font = "11pt no-real-font-123";
      var u = "Cwm fjordbank glyphs vext quiz, \ud83d\ude03";
      s[e](u, 2, 15);
      s[k] = "rgba(102, 204, 0, 0.2)";
      s.font = "18pt Arial";
      s[e](u, 4, 45);
      s.globalCompositeOperation = "multiply";
      s[k] = "rgb(255,0,255)";
      s[q]();
      s[h](50, 50, 50, 0, w * 2, true);
      s[n]();
      s[j]();
      s[k] = "rgb(0,255,255)";
      s[q]();
      s[h](100, 50, 50, 0, w * 2, true);
      s[n]();
      s[j]();
      s[k] = "rgb(255,255,0)";
      s[q]();
      s[h](75, 100, 50, 0, w * 2, true);
      s[n]();
      s[j]();
      s[k] = "rgb(255,0,255)";
      s[h](75, 75, 75, 0, w * 2, true);
      s[h](75, 75, 25, 0, w * 2, true);
      s[j]("evenodd");
      s.rect(0, 0, 10, 10);
      s.rect(2, 2, 6, 6);
      if (p.toDataURL) {
        a += ";canvas fp:" + p.toDataURL();
      }
      return (function (c) {
        var b = 0;
        if (c.length === 0) {
          return b;
        }
        for (var i = 0; i < c.length; i++) {
          b = (b << 5) - b + c.charCodeAt(i);
          b = b & b;
        }
        return b;
      })(a);
    } catch (o) {
      return o.message;
    }
  }

  function oCN() {
    var v = {},
        l=[],
      s = document.getElementsByTagName("script");

    for (var i = 0; i < s.length; i++) {
      if (s[i].src && s[i].src.indexOf(window.location.hostname) == -1) {
        var url = new URL(s[i].src);
        v[url.hostname] = url.hostname;
      }
    }
    l = Object.values(v);
    return l.length;
  }
