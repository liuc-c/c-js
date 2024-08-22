
import * as metadata from "@src/data/metadata"

export let data = Object.freeze({
  __proto__: null,
  get uuid() {
    return uuid();
  },
  get sid() {
    return sid();
  },
  get pc() {
    return pc();
  },
  get rid() {
    return rid();
  },
});

function uuid() {
    return metadata.data.uuid
}

function sid() {
    return metadata.data.sessionId
}

function pc() {
    return ''
}

function rid() {
  return (new Date().getTime()).toString();
}



