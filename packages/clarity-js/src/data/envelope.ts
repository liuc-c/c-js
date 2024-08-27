import { BooleanFlag, Token, Upload, Envelope } from "@clarity-types/data";
import { time } from "@src/core/time";
import version from "@src/core/version";
import * as metadata from "@src/data/metadata";

export let data: Envelope = null;

export function start(): void {
  const m = metadata.data;
  data = {
    version,
    sequence: 0,
    start: 0,
    duration: 0,
    domainId: m.domainId,
    pv:m.pv,
    uuid: m.uuid,
    sessionId: m.sessionId,
    pageNum: m.pageNum,
    upload: Upload.Async,
    end: BooleanFlag.False
  };
}

export function stop(): void {
    data = null;
}

export function envelope(last: boolean): Token[] {
  data.start = data.start + data.duration;
  data.duration = time() - data.start;
  data.sequence++;
  data.upload = last && "sendBeacon" in navigator ? Upload.Beacon : Upload.Async;
  data.end = last ? BooleanFlag.True : BooleanFlag.False;
  return [
    data.version,
    data.sequence,
    data.start,
    data.duration,
    data.domainId,
    data.pv,
    data.uuid,
    data.sessionId,
    data.pageNum,
    data.upload,
    data.end,
    window.location.href,
    document.title
  ];
}

export function storage(){
  return {
    u:data.uuid,
    sid:data.sessionId,
    rid:this.rid(),
  }
}
