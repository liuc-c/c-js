import {data as  screen} from "@src/statistics/screen"
import {data as  storage} from "@src/statistics/storage"
import {data as  navigator} from "@src/statistics/navigator"
import {data as  document} from "@src/statistics/document"
import compress from "@src/data/compress";
import config from "@src/core/config";
import { Setting} from "@clarity-types/data";

import * as metadata from "@src/data/metadata";

export function start(){
    upload();
}
export function stop(){

}

async function upload(){
    let payload = {
        cid: document.CID,
        u: storage.uuid,
        ref: document.ref,
        href: document.href,
        scw: screen.WH,
        sch: screen.HT,
        webX: document.webX,
        webY: document.webY,
        webTitle: document.webTitle,
        sColor: screen.CD,
        cN: navigator.HC,
        cT: document.VDRD.VD && document.VDRD.VD.trim(),
        g: document.VDRD.RD && document.VDRD.RD.trim(),
        mT: navigator.EQTP,
        cD: "",
        o: eval.toString.length * config.o,
        plat: navigator.PFTC,
        hi: history.length,
        cct: navigator.CN,
        uA: navigator.UA,
        sid: storage.sid || null,
        lan: navigator.LAN,
        sg: config.sg,
        rid: storage.rid || "",
        hSL: document.hSL,
        lN: document.IN,
        oCN: document.oCN || 0,
        pv: metadata.data.pv,
        time: Math.floor(Date.now()/1000)
      };
      let zipped = await compress(JSON.stringify(payload)) 
      send(payload,zipped);
}

function send(payload,zipped:Uint8Array,callback=null) {
    const url = config.upload as string;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url + '/api/c', true);
    
    xhr.timeout = Setting.UploadTimeout;
    if (zipped) {
        // xhr.setRequestHeader('Content-Type', 'application/octet-stream');
        // xhr.setRequestHeader('Content-Length', zipped.length.toString());
        xhr.send(zipped);
    } else {
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        var str = '';
        if (payload) {
            Object.keys(payload).forEach((key) => (str += `${key}=${payload[key]}&`));
            str = str.slice(0, -1);
        }
        xhr.send(payload);
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
            let res = JSON.parse(xhr.responseText);
            callback && callback(res, xhr.status, xhr);
          }
        }
      };
}
