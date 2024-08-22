import * as clarity from "./clarity";
import * as statistics from "./statistics"
import hash from "./core/hash";
import * as selector from "./layout/selector";
import { get, getNode, lookup } from "./layout/dom";

const helper = { hash, selector, get, getNode, lookup }
const version = clarity.version;

export { statistics,clarity, version, helper };
