(function () {
    'use strict';

    var upload$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        get queue () { return queue; },
        get start () { return start$f; },
        get stop () { return stop$d; },
        get track () { return track$1; }
    });
    var extract = /*#__PURE__*/Object.freeze({
        __proto__: null,
        get clone () { return clone; },
        get compute () { return compute$4; },
        get data () { return data$5; },
        get keys () { return keys; },
        get reset () { return reset$4; },
        get start () { return start$c; },
        get stop () { return stop$b; },
        get trigger () { return trigger$1; },
        get update () { return update; }
    });
    var limit = /*#__PURE__*/Object.freeze({
        __proto__: null,
        get check () { return check$2; },
        get compute () { return compute$3; },
        get data () { return data$4; },
        get start () { return start$b; },
        get stop () { return stop$a; },
        get trigger () { return trigger; }
    });
    var dimension = /*#__PURE__*/Object.freeze({
        __proto__: null,
        get compute () { return compute$2; },
        get data () { return data$3; },
        get log () { return log; },
        get reset () { return reset$3; },
        get start () { return start$a; },
        get stop () { return stop$9; },
        get updates () { return updates; }
    });
    var metadata$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        get callbacks () { return callbacks; },
        get clear () { return clear; },
        get consent () { return consent; },
        get data () { return data$2; },
        get electron () { return electron; },
        get id () { return id; },
        get metadata () { return metadata; },
        get save () { return save; },
        get shortid () { return shortid; },
        get start () { return start$9; },
        get stop () { return stop$8; }
    });
    var envelope$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        get data () { return data$1; },
        get envelope () { return envelope; },
        get start () { return start$8; },
        get stop () { return stop$7; }
    });
    var clarity = /*#__PURE__*/Object.freeze({
        __proto__: null,
        get consent () { return consent; },
        get event () { return event; },
        get hashText () { return hashText; },
        get identify () { return identify; },
        get metadata () { return metadata; },
        get pause () { return pause; },
        get resume () { return resume; },
        get set () { return set; },
        get signal () { return signal; },
        get start () { return start; },
        get stop () { return stop; },
        get upgrade () { return upgrade; },
        get version () { return version$1; }
    });

    var w = window;
    var c = "clarity" /* Constant.Clarity */;
    function setup() {
        // Start queuing up calls while Clarity is inactive and we are in a browser enviornment
        if (typeof w !== "undefined") {
            w[c] = function () {
                (w[c].q = w[c].q || []).push(arguments);
                // if the start function was called, don't queue it and instead process the queue
                arguments[0] === "start" && w[c].q.unshift(w[c].q.pop()) && process$7();
            };
        }
    }
    function process$7() {
        if (typeof w !== "undefined") {
            // Do not execute or reset global "clarity" variable if a version of Clarity is already running on the page
            if (w[c] && w[c].v) {
                return console.warn("Error CL001: Multiple Clarity tags detected.");
            }
            // Expose clarity in a browser environment
            // To be efficient about queuing up operations while Clarity is wiring up, we expose clarity.*(args) => clarity(*, args);
            // This allows us to reprocess any calls that we missed once Clarity is available on the page
            // Once Clarity script bundle is loaded on the page, we also initialize a "v" property that holds current version
            // We use the presence or absence of "v" to determine if we are attempting to run a duplicate instance
            var queue = w[c] ? (w[c].q || []) : [];
            w[c] = function (method) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                return clarity[method].apply(clarity, args);
            };
            w[c].v = version$1;
            while (queue.length > 0) {
                w[c].apply(w, queue.shift());
            }
        }
    }

    var config$1 = {
        projectId: null,
        delay: 1 * 1000 /* Time.Second */,
        lean: false,
        track: true,
        content: true,
        drop: [],
        mask: [],
        unmask: [],
        regions: [],
        cookies: [],
        fraud: true,
        checksum: [],
        report: null,
        upload: null,
        fallback: null,
        upgrade: null,
        action: null,
        dob: null,
        delayDom: false,
        throttleDom: true,
        conversions: false,
        d: '',
        u: '',
        p: '',
    };

    function api(method) {
        // Zone.js, a popular package for Angular, overrides native browser APIs which can lead to inconsistent state for single page applications.
        // Example issue: https://github.com/angular/angular/issues/31712
        // As a work around, we ensuring Clarity access APIs outside of Zone (and use native implementation instead)
        return window["Zone" /* Constant.Zone */] && "__symbol__" /* Constant.Symbol */ in window["Zone" /* Constant.Zone */] ? window["Zone" /* Constant.Zone */]["__symbol__" /* Constant.Symbol */](method) : method;
    }

    var startTime = 0;
    function start$I() {
        startTime = performance.now() + performance.timeOrigin;
    }
    // event.timestamp is number of milliseconds elapsed since the document was loaded
    // since iframes can be loaded later the event timestamp is not the same as performance.now()
    // converting everything to absolute time by adding timeorigin of the event view
    // to synchronize times before calculating the difference with start time
    function time(event) {
        if (event === void 0) { event = null; }
        var ts = event && event.timeStamp > 0 ? event.timeStamp : performance.now();
        var origin = event && event.view ? event.view.performance.timeOrigin : performance.timeOrigin;
        return Math.max(Math.round(ts + origin - startTime), 0);
    }
    function stop$F() {
        startTime = 0;
    }

    var version$1 = "0.7.41";

    var catchallRegex = /\S/gi;
    var unicodeRegex = true;
    var digitRegex = null;
    var letterRegex = null;
    var currencyRegex = null;
    function text$1(value, hint, privacy, mangle) {
        if (mangle === void 0) { mangle = false; }
        if (value) {
            switch (privacy) {
                case 0 /* Privacy.None */:
                    return value;
                case 1 /* Privacy.Sensitive */:
                    switch (hint) {
                        case "*T" /* Layout.Constant.TextTag */:
                        case "value":
                        case "placeholder":
                        case "click":
                            return redact$1(value);
                        case "input":
                        case "change":
                            return mangleToken(value);
                    }
                    return value;
                case 2 /* Privacy.Text */:
                case 3 /* Privacy.TextImage */:
                    switch (hint) {
                        case "*T" /* Layout.Constant.TextTag */:
                        case "data-" /* Layout.Constant.DataAttribute */:
                            return mangle ? mangleText(value) : mask(value);
                        case "src":
                        case "srcset":
                        case "title":
                        case "alt":
                            return privacy === 3 /* Privacy.TextImage */ ? "" /* Data.Constant.Empty */ : value;
                        case "value":
                        case "click":
                        case "input":
                        case "change":
                            return mangleToken(value);
                        case "placeholder":
                            return mask(value);
                    }
                    break;
                case 4 /* Privacy.Exclude */:
                    switch (hint) {
                        case "*T" /* Layout.Constant.TextTag */:
                        case "data-" /* Layout.Constant.DataAttribute */:
                            return mangle ? mangleText(value) : mask(value);
                        case "value":
                        case "input":
                        case "click":
                        case "change":
                            return Array(5 /* Data.Setting.WordLength */).join("\u2022" /* Data.Constant.Mask */);
                        case "checksum":
                            return "" /* Data.Constant.Empty */;
                    }
                    break;
                case 5 /* Privacy.Snapshot */:
                    switch (hint) {
                        case "*T" /* Layout.Constant.TextTag */:
                        case "data-" /* Layout.Constant.DataAttribute */:
                            return scrub(value, "\u25AA" /* Data.Constant.Letter */, "\u25AB" /* Data.Constant.Digit */);
                        case "value":
                        case "input":
                        case "click":
                        case "change":
                            return Array(5 /* Data.Setting.WordLength */).join("\u2022" /* Data.Constant.Mask */);
                        case "checksum":
                        case "src":
                        case "srcset":
                        case "alt":
                        case "title":
                            return "" /* Data.Constant.Empty */;
                    }
                    break;
            }
        }
        return value;
    }
    function url$1(input, electron) {
        if (electron === void 0) { electron = false; }
        // Replace the URL for Electron apps so we don't send back file:/// URL
        if (electron) {
            return "".concat("https://" /* Data.Constant.HTTPS */).concat("Electron" /* Data.Constant.Electron */);
        }
        var drop = config$1.drop;
        if (drop && drop.length > 0 && input && input.indexOf("?") > 0) {
            var _a = input.split("?"), path = _a[0], query = _a[1];
            var swap_1 = "*na*" /* Data.Constant.Dropped */;
            return path + "?" + query.split("&").map(function (p) { return drop.some(function (x) { return p.indexOf("".concat(x, "=")) === 0; }) ? "".concat(p.split("=")[0], "=").concat(swap_1) : p; }).join("&");
        }
        return input;
    }
    function mangleText(value) {
        var trimmed = value.trim();
        if (trimmed.length > 0) {
            var first = trimmed[0];
            var index = value.indexOf(first);
            var prefix = value.substr(0, index);
            var suffix = value.substr(index + trimmed.length);
            return "".concat(prefix).concat(trimmed.length.toString(36)).concat(suffix);
        }
        return value;
    }
    function mask(value) {
        return value.replace(catchallRegex, "\u2022" /* Data.Constant.Mask */);
    }
    function scrub(value, letter, digit) {
        regex(); // Initialize regular expressions
        return value ? value.replace(letterRegex, letter).replace(digitRegex, digit) : value;
    }
    function mangleToken(value) {
        var length = ((Math.floor(value.length / 5 /* Data.Setting.WordLength */) + 1) * 5 /* Data.Setting.WordLength */);
        var output = "" /* Layout.Constant.Empty */;
        for (var i = 0; i < length; i++) {
            output += i > 0 && i % 5 /* Data.Setting.WordLength */ === 0 ? " " /* Data.Constant.Space */ : "\u2022" /* Data.Constant.Mask */;
        }
        return output;
    }
    function regex() {
        // Initialize unicode regex, if supported by the browser
        // Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Unicode_Property_Escapes
        if (unicodeRegex && digitRegex === null) {
            try {
                digitRegex = new RegExp("\\p{N}", "gu");
                letterRegex = new RegExp("\\p{L}", "gu");
                currencyRegex = new RegExp("\\p{Sc}", "gu");
            }
            catch (_a) {
                unicodeRegex = false;
            }
        }
    }
    function redact$1(value) {
        var spaceIndex = -1;
        var gap = 0;
        var hasDigit = false;
        var hasEmail = false;
        var hasWhitespace = false;
        var array = null;
        regex(); // Initialize regular expressions
        for (var i = 0; i < value.length; i++) {
            var c = value.charCodeAt(i);
            hasDigit = hasDigit || (c >= 48 /* Data.Character.Zero */ && c <= 57 /* Data.Character.Nine */); // Check for digits in the current word
            hasEmail = hasEmail || c === 64 /* Data.Character.At */; // Check for @ sign anywhere within the current word
            hasWhitespace = c === 9 /* Data.Character.Tab */ || c === 10 /* Data.Character.NewLine */ || c === 13 /* Data.Character.Return */ || c === 32 /* Data.Character.Blank */;
            // Process each word as an individual token to redact any sensitive information
            if (i === 0 || i === value.length - 1 || hasWhitespace) {
                // Performance optimization: Lazy load string -> array conversion only when required
                if (hasDigit || hasEmail) {
                    if (array === null) {
                        array = value.split("" /* Data.Constant.Empty */);
                    }
                    // Work on a token at a time so we don't have to apply regex to a larger string
                    var token = value.substring(spaceIndex + 1, hasWhitespace ? i : i + 1);
                    // Check if unicode regex is supported, otherwise fallback to calling mask function on this token
                    if (unicodeRegex && currencyRegex !== null) {
                        // Do not redact information if the token contains a currency symbol
                        token = token.match(currencyRegex) ? token : scrub(token, "\u25AA" /* Data.Constant.Letter */, "\u25AB" /* Data.Constant.Digit */);
                    }
                    else {
                        token = mask(token);
                    }
                    // Merge token back into array at the right place
                    array.splice(spaceIndex + 1 - gap, token.length, token);
                    gap += token.length - 1;
                }
                // Reset digit and email flags after every word boundary, except the beginning of string
                if (hasWhitespace) {
                    hasDigit = false;
                    hasEmail = false;
                    spaceIndex = i;
                }
            }
        }
        return array ? array.join("" /* Data.Constant.Empty */) : value;
    }

    var state$b = null;
    var buffer = null;
    var update$2 = false;
    function start$H() {
        update$2 = false;
        reset$s();
    }
    function reset$s() {
        // Baseline state holds the previous values - if it is updated in the current payload,
        // reset the state to current value after sending the previous state
        if (update$2) {
            state$b = { time: time(), event: 4 /* Event.Baseline */, data: {
                    visible: buffer.visible,
                    docWidth: buffer.docWidth,
                    docHeight: buffer.docHeight,
                    screenWidth: buffer.screenWidth,
                    screenHeight: buffer.screenHeight,
                    scrollX: buffer.scrollX,
                    scrollY: buffer.scrollY,
                    pointerX: buffer.pointerX,
                    pointerY: buffer.pointerY,
                    activityTime: buffer.activityTime,
                    scrollTime: buffer.scrollTime
                }
            };
        }
        buffer = buffer ? buffer : {
            visible: 1 /* BooleanFlag.True */,
            docWidth: 0,
            docHeight: 0,
            screenWidth: 0,
            screenHeight: 0,
            scrollX: 0,
            scrollY: 0,
            pointerX: 0,
            pointerY: 0,
            activityTime: 0,
            scrollTime: 0
        };
    }
    function track$8(event, x, y, time) {
        switch (event) {
            case 8 /* Event.Document */:
                buffer.docWidth = x;
                buffer.docHeight = y;
                break;
            case 11 /* Event.Resize */:
                buffer.screenWidth = x;
                buffer.screenHeight = y;
                break;
            case 10 /* Event.Scroll */:
                buffer.scrollX = x;
                buffer.scrollY = y;
                buffer.scrollTime = time;
                break;
            default:
                buffer.pointerX = x;
                buffer.pointerY = y;
                break;
        }
        update$2 = true;
    }
    function activity(t) {
        buffer.activityTime = t;
    }
    function visibility(t, visible) {
        buffer.visible = visible === "visible" ? 1 /* BooleanFlag.True */ : 0 /* BooleanFlag.False */;
        if (!buffer.visible) {
            activity(t);
        }
        update$2 = true;
    }
    function compute$e() {
        if (update$2) {
            encode$1(4 /* Event.Baseline */);
        }
    }
    function stop$E() {
        reset$s();
    }

    var baseline = /*#__PURE__*/Object.freeze({
        __proto__: null,
        activity: activity,
        compute: compute$e,
        reset: reset$s,
        start: start$H,
        get state () { return state$b; },
        stop: stop$E,
        track: track$8,
        visibility: visibility
    });

    var data$j = null;
    // custom events allow 2 parameters or 1 parameter to be passed. If 2 are passed we
    // consider it a key value pair. If only 1 is passed we only consider the event to have a value.
    function event(a, b) {
        if (active() &&
            a &&
            typeof a === "string" /* Constant.String */ &&
            a.length < 255) {
            if (b && typeof b === "string" /* Constant.String */ && b.length < 255) {
                data$j = { key: a, value: b };
            }
            else {
                data$j = { value: a };
            }
            encode$1(24 /* Event.Custom */);
        }
    }

    var data$i = null;
    var updates$3 = null;
    function start$G() {
        data$i = {};
        updates$3 = {};
        count$1(5 /* Metric.InvokeCount */);
    }
    function stop$D() {
        data$i = {};
        updates$3 = {};
    }
    function count$1(metric) {
        if (!(metric in data$i)) {
            data$i[metric] = 0;
        }
        if (!(metric in updates$3)) {
            updates$3[metric] = 0;
        }
        data$i[metric]++;
        updates$3[metric]++;
    }
    function sum(metric, value) {
        if (value !== null) {
            if (!(metric in data$i)) {
                data$i[metric] = 0;
            }
            if (!(metric in updates$3)) {
                updates$3[metric] = 0;
            }
            data$i[metric] += value;
            updates$3[metric] += value;
        }
    }
    function max(metric, value) {
        // Ensure that we do not process null or NaN values
        if (value !== null && isNaN(value) === false) {
            if (!(metric in data$i)) {
                data$i[metric] = 0;
            }
            if (value > data$i[metric] || data$i[metric] === 0) {
                updates$3[metric] = value;
                data$i[metric] = value;
            }
        }
    }
    function compute$d() {
        encode$1(0 /* Event.Metric */);
    }
    function reset$r() {
        updates$3 = {};
    }

    function setTimeout(handler, timeout, event) {
        return window.setTimeout(measure(handler), timeout, event);
    }
    function clearTimeout(handle) {
        return window.clearTimeout(handle);
    }

    var data$h;
    var last = 0;
    var interval = 0;
    var timeout$6 = null;
    function start$F() {
        interval = 60000 /* Setting.PingInterval */;
        last = 0;
    }
    function reset$q() {
        if (timeout$6) {
            clearTimeout(timeout$6);
        }
        timeout$6 = setTimeout(ping, interval);
        last = time();
    }
    function ping() {
        var now = time();
        data$h = { gap: now - last };
        encode$1(25 /* Event.Ping */);
        if (data$h.gap < 300000 /* Setting.PingTimeout */) {
            timeout$6 = setTimeout(ping, interval);
        }
        else {
            suspend();
        }
    }
    function stop$C() {
        clearTimeout(timeout$6);
        last = 0;
        interval = 0;
    }

    var ping$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        get data () { return data$h; },
        reset: reset$q,
        start: start$F,
        stop: stop$C
    });

    var data$g = null;
    function start$E() {
        data$g = {};
    }
    function stop$B() {
        data$g = {};
    }
    function track$7(event, time) {
        if (!(event in data$g)) {
            data$g[event] = [[time, 0]];
        }
        else {
            var e = data$g[event];
            var last = e[e.length - 1];
            // Add a new entry only if the new event occurs after configured interval
            // Otherwise, extend the duration of the previous entry
            if (time - last[0] > 100 /* Setting.SummaryInterval */) {
                data$g[event].push([time, 0]);
            }
            else {
                last[1] = time - last[0];
            }
        }
    }
    function compute$c() {
        encode$1(36 /* Event.Summary */);
    }
    function reset$p() {
        data$g = {};
    }

    var summary = /*#__PURE__*/Object.freeze({
        __proto__: null,
        compute: compute$c,
        get data () { return data$g; },
        reset: reset$p,
        start: start$E,
        stop: stop$B,
        track: track$7
    });

    var data$f = null;
    function start$D() {
        if (!config$1.lean && config$1.upgrade) {
            config$1.upgrade("Config" /* Constant.Config */);
        }
        data$f = null;
    }
    // Following call will upgrade the session from lean mode into the full mode retroactively from the start of the page.
    // As part of the lean mode, we do not send back any layout information - including discovery of DOM and mutations.
    // However, if there's a need for full fidelity playback, calling this function will disable lean mode
    // and send all backed up layout events to the server.
    function upgrade(key) {
        // Upgrade only if Clarity was successfully activated on the page
        if (active() && config$1.lean) {
            config$1.lean = false;
            data$f = { key: key };
            // Update metadata to track we have upgraded this session
            save();
            // Callback upgrade handler, if configured
            if (config$1.upgrade) {
                config$1.upgrade(key);
            }
            encode$1(3 /* Event.Upgrade */);
        }
    }
    function stop$A() {
        data$f = null;
    }

    var upgrade$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        get data () { return data$f; },
        start: start$D,
        stop: stop$A,
        upgrade: upgrade
    });

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (g && (g = 0, op[0] && (_ = 0)), _) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    var data$e = null;
    function start$C() {
        reset$o();
    }
    function set(variable, value) {
        var values = typeof value === "string" /* Constant.String */ ? [value] : value;
        log$2(variable, values);
    }
    function identify(userId, sessionId, pageId, userHint) {
        if (sessionId === void 0) { sessionId = null; }
        if (pageId === void 0) { pageId = null; }
        if (userHint === void 0) { userHint = null; }
        return __awaiter(this, void 0, void 0, function () {
            var output;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = {};
                        return [4 /*yield*/, sha256(userId)];
                    case 1:
                        output = (_a.userId = _b.sent(), _a.userHint = userHint || redact(userId), _a);
                        // By default, hash custom userId using SHA256 algorithm on the client to preserve privacy
                        log$2("userId" /* Constant.UserId */, [output.userId]);
                        // Optional non-identifying name for the user
                        // If name is not explicitly provided, we automatically generate a redacted version of the userId
                        log$2("userHint" /* Constant.UserHint */, [output.userHint]);
                        log$2("userType" /* Constant.UserType */, [detect(userId)]);
                        // Log sessionId and pageId if provided
                        if (sessionId) {
                            log$2("sessionId" /* Constant.SessionId */, [sessionId]);
                            output.sessionId = sessionId;
                        }
                        if (pageId) {
                            log$2("pageId" /* Constant.PageId */, [pageId]);
                            output.pageId = pageId;
                        }
                        return [2 /*return*/, output];
                }
            });
        });
    }
    function log$2(variable, value) {
        if (active() &&
            variable &&
            value &&
            typeof variable === "string" /* Constant.String */ &&
            variable.length < 255) {
            var validValues = variable in data$e ? data$e[variable] : [];
            for (var i = 0; i < value.length; i++) {
                if (typeof value[i] === "string" /* Constant.String */ && value[i].length < 255) {
                    validValues.push(value[i]);
                }
            }
            data$e[variable] = validValues;
        }
    }
    function compute$b() {
        encode$1(34 /* Event.Variable */);
    }
    function reset$o() {
        data$e = {};
    }
    function stop$z() {
        reset$o();
    }
    function redact(input) {
        return input && input.length >= 5 /* Setting.WordLength */ ?
            "".concat(input.substring(0, 2)).concat(scrub(input.substring(2), "*" /* Constant.Asterix */, "*" /* Constant.Asterix */)) : scrub(input, "*" /* Constant.Asterix */, "*" /* Constant.Asterix */);
    }
    function sha256(input) {
        return __awaiter(this, void 0, void 0, function () {
            var buffer;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        if (!(crypto && input)) return [3 /*break*/, 2];
                        return [4 /*yield*/, crypto.subtle.digest("SHA-256" /* Constant.SHA256 */, new TextEncoder().encode(input))];
                    case 1:
                        buffer = _b.sent();
                        return [2 /*return*/, Array.prototype.map.call(new Uint8Array(buffer), function (x) { return (('00' + x.toString(16)).slice(-2)); }).join('')];
                    case 2: return [2 /*return*/, "" /* Constant.Empty */];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        _b.sent();
                        return [2 /*return*/, "" /* Constant.Empty */];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    function detect(input) {
        return input && input.indexOf("@" /* Constant.At */) > 0 ? "email" /* Constant.Email */ : "string" /* Constant.String */;
    }

    var variable = /*#__PURE__*/Object.freeze({
        __proto__: null,
        compute: compute$b,
        get data () { return data$e; },
        identify: identify,
        reset: reset$o,
        set: set,
        start: start$C,
        stop: stop$z
    });

    var signalCallback = null;
    function signal(cb) {
        signalCallback = cb;
    }
    function parseSignals(signalsPayload) {
        try {
            var parsedSignals = JSON.parse(signalsPayload);
            return parsedSignals;
        }
        catch (_a) {
            return [];
        }
    }
    function signalsEvent(signalsPayload) {
        try {
            if (!signalCallback) {
                return;
            }
            var signals = parseSignals(signalsPayload);
            signals.forEach(function (signal) {
                signalCallback(signal);
            });
        }
        catch (_a) {
            // do nothing
        }
    }

    var modules$1 = [baseline, dimension, variable, limit, summary, metadata$1, envelope$1, upload$1, ping$1, upgrade$1, extract];
    function start$B() {
        // Metric needs to be initialized before we can start measuring. so metric is not wrapped in measure
        start$G();
        modules$1.forEach(function (x) { return measure(x.start)(); });
    }
    function stop$y() {
        // Stop modules in the reverse order of their initialization
        // The ordering below should respect inter-module dependency.
        // E.g. if upgrade depends on upload, then upgrade needs to end before upload.
        // Similarly, if upload depends on metadata, upload needs to end before metadata.
        modules$1.slice().reverse().forEach(function (x) { return measure(x.stop)(); });
        stop$D();
    }
    function compute$a() {
        compute$b();
        compute$e();
        compute$2();
        compute$d();
        compute$c();
        compute$3();
        compute$4();
    }

    // tslint:disable: no-bitwise
    function hash (input, precision) {
        if (precision === void 0) { precision = null; }
        // Code inspired from C# GetHashCode: https://github.com/Microsoft/referencesource/blob/master/mscorlib/system/string.cs
        var hash = 0;
        var hashOne = 5381;
        var hashTwo = hashOne;
        for (var i = 0; i < input.length; i += 2) {
            var charOne = input.charCodeAt(i);
            hashOne = ((hashOne << 5) + hashOne) ^ charOne;
            if (i + 1 < input.length) {
                var charTwo = input.charCodeAt(i + 1);
                hashTwo = ((hashTwo << 5) + hashTwo) ^ charTwo;
            }
        }
        // Replace the magic number from C# implementation (1566083941) with a smaller prime number (11579)
        // This ensures we don't hit integer overflow and prevent collisions
        hash = Math.abs(hashOne + (hashTwo * 11579));
        return (precision ? hash % Math.pow(2, precision) : hash).toString(36);
    }

    var history$5 = [];
    var data$d;
    function start$A() {
        history$5 = [];
        max(26 /* Metric.Automation */, navigator.webdriver ? 1 /* BooleanFlag.True */ : 0 /* BooleanFlag.False */);
        try {
            max(31 /* Metric.Iframed */, window.top == window.self ? 1 /* IframeStatus.TopFrame */ : 2 /* IframeStatus.Iframe */);
        }
        catch (ex) {
            max(31 /* Metric.Iframed */, 0 /* IframeStatus.Unknown */);
        }
    }
    function check$4(id, target, input) {
        // Compute hash for fraud detection, if enabled. Hash is computed only if input meets the minimum length criteria
        if (config$1.fraud && id !== null && input && input.length >= 5 /* Setting.WordLength */) {
            data$d = { id: id, target: target, checksum: hash(input, 24 /* Setting.ChecksumPrecision */) };
            // Only encode this event if we haven't already reported this hash
            if (history$5.indexOf(data$d.checksum) < 0) {
                history$5.push(data$d.checksum);
                encode$2(41 /* Event.Fraud */);
            }
        }
    }

    var excludeClassNames = "load,active,fixed,visible,focus,show,collaps,animat" /* Constant.ExcludeClassNames */.split("," /* Constant.Comma */);
    var selectorMap = {};
    function reset$n() {
        selectorMap = {};
    }
    function get$1(input, type) {
        var a = input.attributes;
        var prefix = input.prefix ? input.prefix[type] : null;
        var suffix = type === 0 /* Selector.Alpha */ ? "".concat("~" /* Constant.Tilde */).concat(input.position - 1) : ":nth-of-type(".concat(input.position, ")");
        switch (input.tag) {
            case "STYLE":
            case "TITLE":
            case "LINK":
            case "META":
            case "*T" /* Constant.TextTag */:
            case "*D" /* Constant.DocumentTag */:
                return "" /* Constant.Empty */;
            case "HTML":
                return "HTML" /* Constant.HTML */;
            default:
                if (prefix === null) {
                    return "" /* Constant.Empty */;
                }
                prefix = "".concat(prefix).concat(">" /* Constant.Separator */);
                input.tag = input.tag.indexOf("svg:" /* Constant.SvgPrefix */) === 0 ? input.tag.substr("svg:" /* Constant.SvgPrefix */.length) : input.tag;
                var selector = "".concat(prefix).concat(input.tag).concat(suffix);
                var id = "id" /* Constant.Id */ in a && a["id" /* Constant.Id */].length > 0 ? a["id" /* Constant.Id */] : null;
                var classes = input.tag !== "BODY" /* Constant.BodyTag */ && "class" /* Constant.Class */ in a && a["class" /* Constant.Class */].length > 0 ? a["class" /* Constant.Class */].trim().split(/\s+/).filter(function (c) { return filter(c); }).join("." /* Constant.Period */) : null;
                if (classes && classes.length > 0) {
                    if (type === 0 /* Selector.Alpha */) {
                        // In Alpha mode, update selector to use class names, with relative positioning within the parent id container.
                        // If the node has valid class name(s) then drop relative positioning within the parent path to keep things simple.
                        var key = "".concat(getDomPath(prefix)).concat(input.tag).concat("." /* Constant.Dot */).concat(classes);
                        if (!(key in selectorMap)) {
                            selectorMap[key] = [];
                        }
                        if (selectorMap[key].indexOf(input.id) < 0) {
                            selectorMap[key].push(input.id);
                        }
                        selector = "".concat(key).concat("~" /* Constant.Tilde */).concat(selectorMap[key].indexOf(input.id));
                    }
                    else {
                        // In Beta mode, we continue to look at query selectors in context of the full page
                        selector = "".concat(prefix).concat(input.tag, ".").concat(classes).concat(suffix);
                    }
                }
                // Update selector to use "id" field when available. There are two exceptions:
                // (1) if "id" appears to be an auto generated string token, e.g. guid or a random id containing digits
                // (2) if "id" appears inside a shadow DOM, in which case we continue to prefix up to shadow DOM to prevent conflicts
                selector = id && filter(id) ? "".concat(getDomPrefix(prefix)).concat("#" /* Constant.Hash */).concat(id) : selector;
                return selector;
        }
    }
    function getDomPrefix(prefix) {
        var shadowDomStart = prefix.lastIndexOf("*S" /* Constant.ShadowDomTag */);
        var iframeDomStart = prefix.lastIndexOf("".concat("iframe:" /* Constant.IFramePrefix */).concat("HTML" /* Constant.HTML */));
        var domStart = Math.max(shadowDomStart, iframeDomStart);
        if (domStart < 0) {
            return "" /* Constant.Empty */;
        }
        return prefix.substring(0, prefix.indexOf(">" /* Constant.Separator */, domStart) + 1);
    }
    function getDomPath(input) {
        var parts = input.split(">" /* Constant.Separator */);
        for (var i = 0; i < parts.length; i++) {
            var tIndex = parts[i].indexOf("~" /* Constant.Tilde */);
            var dIndex = parts[i].indexOf("." /* Constant.Dot */);
            parts[i] = parts[i].substring(0, dIndex > 0 ? dIndex : (tIndex > 0 ? tIndex : parts[i].length));
        }
        return parts.join(">" /* Constant.Separator */);
    }
    // Check if the given input string has digits or excluded class names
    function filter(value) {
        if (!value) {
            return false;
        } // Do not process empty strings
        if (excludeClassNames.some(function (x) { return value.toLowerCase().indexOf(x) >= 0; })) {
            return false;
        }
        for (var i = 0; i < value.length; i++) {
            var c = value.charCodeAt(i);
            if (c >= 48 /* Character.Zero */ && c <= 57 /* Character.Nine */) {
                return false;
            }
        }
        return true;
    }

    var selector = /*#__PURE__*/Object.freeze({
        __proto__: null,
        get: get$1,
        reset: reset$n
    });

    var index = 1;
    var nodesMap = null; // Maps id => node to retrieve further node details using id.
    var values = [];
    var updateMap = [];
    var hashMap = {};
    var override = [];
    var unmask = [];
    var maskText = [];
    var maskExclude = [];
    var maskDisable = [];
    var maskTags = [];
    // The WeakMap object is a collection of key/value pairs in which the keys are weakly referenced
    var idMap = null; // Maps node => id.
    var iframeMap = null; // Maps iframe's contentDocument => parent iframe element
    var privacyMap = null; // Maps node => Privacy (enum)
    var fraudMap = null; // Maps node => FraudId (number)
    function start$z() {
        reset$m();
        parse$1(document, true);
    }
    function stop$x() {
        reset$m();
    }
    function reset$m() {
        index = 1;
        values = [];
        updateMap = [];
        hashMap = {};
        override = [];
        unmask = [];
        maskText = "address,password,contact" /* Mask.Text */.split("," /* Constant.Comma */);
        maskExclude = "password,secret,pass,social,ssn,code,hidden" /* Mask.Exclude */.split("," /* Constant.Comma */);
        maskDisable = "radio,checkbox,range,button,reset,submit" /* Mask.Disable */.split("," /* Constant.Comma */);
        maskTags = "INPUT,SELECT,TEXTAREA" /* Mask.Tags */.split("," /* Constant.Comma */);
        nodesMap = new Map();
        idMap = new WeakMap();
        iframeMap = new WeakMap();
        privacyMap = new WeakMap();
        fraudMap = new WeakMap();
        reset$n();
    }
    // We parse new root nodes for any regions or masked nodes in the beginning (document) and
    // later whenever there are new additions or modifications to DOM (mutations)
    function parse$1(root, init) {
        if (init === void 0) { init = false; }
        // Wrap selectors in a try / catch block.
        // It's possible for script to receive invalid selectors, e.g. "'#id'" with extra quotes, and cause the code below to fail
        try {
            // Parse unmask configuration into separate query selectors and override tokens as part of initialization
            if (init) {
                config$1.unmask.forEach(function (x) { return x.indexOf("!" /* Constant.Bang */) < 0 ? unmask.push(x) : override.push(x.substr(1)); });
            }
            // Since mutations may happen on leaf nodes too, e.g. text nodes, which may not support all selector APIs.
            // We ensure that the root note supports querySelectorAll API before executing the code below to identify new regions.
            if ("querySelectorAll" in root) {
                config$1.regions.forEach(function (x) { return root.querySelectorAll(x[1]).forEach(function (e) { return observe$c(e, "".concat(x[0])); }); }); // Regions
                config$1.mask.forEach(function (x) { return root.querySelectorAll(x).forEach(function (e) { return privacyMap.set(e, 3 /* Privacy.TextImage */); }); }); // Masked Elements
                config$1.checksum.forEach(function (x) { return root.querySelectorAll(x[1]).forEach(function (e) { return fraudMap.set(e, x[0]); }); }); // Fraud Checksum Check
                unmask.forEach(function (x) { return root.querySelectorAll(x).forEach(function (e) { return privacyMap.set(e, 0 /* Privacy.None */); }); }); // Unmasked Elements
            }
        }
        catch (e) {
            log$1(5 /* Code.Selector */, 1 /* Severity.Warning */, e ? e.name : null);
        }
    }
    function getId(node, autogen) {
        if (autogen === void 0) { autogen = false; }
        if (node === null) {
            return null;
        }
        var id = idMap.get(node);
        if (!id && autogen) {
            id = index++;
            idMap.set(node, id);
        }
        return id ? id : null;
    }
    function add(node, parent, data, source) {
        var id = getId(node, true);
        var parentId = parent ? getId(parent) : null;
        var previousId = getPreviousId(node);
        var parentValue = null;
        var regionId = exists(node) ? id : null;
        var fraudId = fraudMap.has(node) ? fraudMap.get(node) : null;
        var privacyId = config$1.content ? 1 /* Privacy.Sensitive */ : 3 /* Privacy.TextImage */;
        if (parentId >= 0 && values[parentId]) {
            parentValue = values[parentId];
            parentValue.children.push(id);
            regionId = regionId === null ? parentValue.region : regionId;
            fraudId = fraudId === null ? parentValue.metadata.fraud : fraudId;
            privacyId = parentValue.metadata.privacy;
        }
        // If there's an explicit region attribute set on the element, use it to mark a region on the page
        if (data.attributes && "data-clarity-region" /* Constant.RegionData */ in data.attributes) {
            observe$c(node, data.attributes["data-clarity-region" /* Constant.RegionData */]);
            regionId = id;
        }
        nodesMap.set(id, node);
        values[id] = {
            id: id,
            parent: parentId,
            previous: previousId,
            children: [],
            data: data,
            selector: null,
            hash: null,
            region: regionId,
            metadata: { active: true, suspend: false, privacy: privacyId, position: null, fraud: fraudId, size: null },
        };
        privacy(node, values[id], parentValue);
        updateSelector(values[id]);
        size$1(values[id]);
        track$6(id, source);
    }
    function update$1(node, parent, data, source) {
        var id = getId(node);
        var parentId = parent ? getId(parent) : null;
        var previousId = getPreviousId(node);
        var changed = false;
        var parentChanged = false;
        if (id in values) {
            var value = values[id];
            value.metadata.active = true;
            // Handle case where internal ordering may have changed
            if (value.previous !== previousId) {
                changed = true;
                value.previous = previousId;
            }
            // Handle case where parent might have been updated
            if (value.parent !== parentId) {
                changed = true;
                var oldParentId = value.parent;
                value.parent = parentId;
                // Move this node to the right location under new parent
                if (parentId !== null && parentId >= 0) {
                    var childIndex = previousId === null ? 0 : values[parentId].children.indexOf(previousId) + 1;
                    values[parentId].children.splice(childIndex, 0, id);
                    // Update region after the move
                    value.region = exists(node) ? id : values[parentId].region;
                }
                else {
                    // Mark this element as deleted if the parent has been updated to null
                    remove(id, source);
                }
                // Remove reference to this node from the old parent
                if (oldParentId !== null && oldParentId >= 0) {
                    var nodeIndex = values[oldParentId].children.indexOf(id);
                    if (nodeIndex >= 0) {
                        values[oldParentId].children.splice(nodeIndex, 1);
                    }
                }
                parentChanged = true;
            }
            // Update data
            for (var key in data) {
                if (diff(value["data"], data, key)) {
                    changed = true;
                    value["data"][key] = data[key];
                }
            }
            // Update selector
            updateSelector(value);
            track$6(id, source, changed, parentChanged);
        }
    }
    function sameorigin(node) {
        var output = false;
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "IFRAME" /* Constant.IFrameTag */) {
            var frame = node;
            // To determine if the iframe is same-origin or not, we try accessing it's contentDocument.
            // If the browser throws an exception, we assume it's cross-origin and move on.
            // However, if we do a get a valid document object back, we assume the contents are accessible and iframe is same-origin.
            try {
                var doc = frame.contentDocument;
                if (doc) {
                    iframeMap.set(frame.contentDocument, frame);
                    output = true;
                }
            }
            catch ( /* do nothing */_a) { /* do nothing */ }
        }
        return output;
    }
    function iframe(node) {
        var doc = node.nodeType === Node.DOCUMENT_NODE ? node : null;
        return doc && iframeMap.has(doc) ? iframeMap.get(doc) : null;
    }
    function privacy(node, value, parent) {
        var data = value.data;
        var metadata = value.metadata;
        var current = metadata.privacy;
        var attributes = data.attributes || {};
        var tag = data.tag.toUpperCase();
        switch (true) {
            case maskTags.indexOf(tag) >= 0:
                var type = attributes["type" /* Constant.Type */];
                var meta_1 = "" /* Constant.Empty */;
                var excludedPrivacyAttributes_1 = ["class" /* Constant.Class */, "style" /* Constant.Style */];
                Object.keys(attributes)
                    .filter(function (x) { return !excludedPrivacyAttributes_1.includes(x); })
                    .forEach(function (x) { return (meta_1 += attributes[x].toLowerCase()); });
                var exclude = maskExclude.some(function (x) { return meta_1.indexOf(x) >= 0; });
                // Regardless of privacy mode, always mask off user input from input boxes or drop downs with two exceptions:
                // (1) The node is detected to be one of the excluded fields, in which case we drop everything
                // (2) The node's type is one of the allowed types (like checkboxes)
                metadata.privacy = tag === "INPUT" /* Constant.InputTag */ && maskDisable.indexOf(type) >= 0 ? current : (exclude ? 4 /* Privacy.Exclude */ : 2 /* Privacy.Text */);
                break;
            case "data-clarity-mask" /* Constant.MaskData */ in attributes:
                metadata.privacy = 3 /* Privacy.TextImage */;
                break;
            case "data-clarity-unmask" /* Constant.UnmaskData */ in attributes:
                metadata.privacy = 0 /* Privacy.None */;
                break;
            case privacyMap.has(node):
                // If this node was explicitly configured to contain sensitive content, honor that privacy setting
                metadata.privacy = privacyMap.get(node);
                break;
            case fraudMap.has(node):
                // If this node was explicitly configured to be evaluated for fraud, then also mask content
                metadata.privacy = 2 /* Privacy.Text */;
                break;
            case tag === "*T" /* Constant.TextTag */:
                // If it's a text node belonging to a STYLE or TITLE tag or one of scrub exceptions, then capture content
                var pTag = parent && parent.data ? parent.data.tag : "" /* Constant.Empty */;
                var pSelector_1 = parent && parent.selector ? parent.selector[1 /* Selector.Default */] : "" /* Constant.Empty */;
                var tags = ["STYLE" /* Constant.StyleTag */, "TITLE" /* Constant.TitleTag */, "svg:style" /* Constant.SvgStyle */];
                metadata.privacy = tags.includes(pTag) || override.some(function (x) { return pSelector_1.indexOf(x) >= 0; }) ? 0 /* Privacy.None */ : current;
                break;
            case current === 1 /* Privacy.Sensitive */:
                // In a mode where we mask sensitive information by default, look through class names to aggressively mask content
                metadata.privacy = inspect(attributes["class" /* Constant.Class */], maskText, metadata);
                break;
        }
    }
    function inspect(input, lookup, metadata) {
        if (input && lookup.some(function (x) { return input.indexOf(x) >= 0; })) {
            return 2 /* Privacy.Text */;
        }
        return metadata.privacy;
    }
    function diff(a, b, field) {
        if (typeof a[field] === "object" && typeof b[field] === "object") {
            for (var key in a[field]) {
                if (a[field][key] !== b[field][key]) {
                    return true;
                }
            }
            for (var key in b[field]) {
                if (b[field][key] !== a[field][key]) {
                    return true;
                }
            }
            return false;
        }
        return a[field] !== b[field];
    }
    function position(parent, child) {
        child.metadata.position = 1;
        var idx = parent ? parent.children.indexOf(child.id) : -1;
        while (idx-- > 0) {
            var sibling = values[parent.children[idx]];
            if (child.data.tag === sibling.data.tag) {
                child.metadata.position = sibling.metadata.position + 1;
                break;
            }
        }
        return child.metadata.position;
    }
    function updateSelector(value) {
        var parent = value.parent && value.parent in values ? values[value.parent] : null;
        var prefix = parent ? parent.selector : null;
        var d = value.data;
        var p = position(parent, value);
        var s = { id: value.id, tag: d.tag, prefix: prefix, position: p, attributes: d.attributes };
        value.selector = [get$1(s, 0 /* Selector.Alpha */), get$1(s, 1 /* Selector.Beta */)];
        value.hash = value.selector.map(function (x) { return x ? hash(x) : null; });
        value.hash.forEach(function (h) { return hashMap[h] = value.id; });
    }
    function hashText(hash) {
        var id = lookup(hash);
        var node = getNode(id);
        return node !== null && node.textContent !== null ? node.textContent.substr(0, 25 /* Setting.ClickText */) : '';
    }
    function getNode(id) {
        return nodesMap.has(id) ? nodesMap.get(id) : null;
    }
    function getValue(id) {
        if (id in values) {
            return values[id];
        }
        return null;
    }
    function get(node) {
        var id = getId(node);
        return id in values ? values[id] : null;
    }
    function lookup(hash) {
        return hash in hashMap ? hashMap[hash] : null;
    }
    function has(node) {
        return nodesMap.has(getId(node));
    }
    function updates$2() {
        var output = [];
        for (var _i = 0, updateMap_1 = updateMap; _i < updateMap_1.length; _i++) {
            var id = updateMap_1[_i];
            if (id in values) {
                output.push(values[id]);
            }
        }
        updateMap = [];
        return output;
    }
    function remove(id, source) {
        if (id in values) {
            var value = values[id];
            value.metadata.active = false;
            value.parent = null;
            track$6(id, source);
            // Clean up node references for removed nodes
            removeNodeFromNodesMap(id);
        }
    }
    function removeNodeFromNodesMap(id) {
        // Shadow dom roots shouldn't be deleted,
        // we should keep listening to the mutations there even they're not rendered in the DOM.
        if (nodesMap.get(id).nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
            return;
        }
        nodesMap.delete(id);
        var value = id in values ? values[id] : null;
        if (value && value.children) {
            for (var _i = 0, _a = value.children; _i < _a.length; _i++) {
                var childId = _a[_i];
                removeNodeFromNodesMap(childId);
            }
        }
    }
    function size$1(value) {
        // If this element is a image node, and is masked, then track box model for the current element
        if (value.data.tag === "IMG" /* Constant.ImageTag */ && value.metadata.privacy === 3 /* Privacy.TextImage */) {
            value.metadata.size = [];
        }
    }
    function getPreviousId(node) {
        var id = null;
        // Some nodes may not have an ID by design since Clarity skips over tags like SCRIPT, NOSCRIPT, META, COMMENTS, etc..
        // In that case, we keep going back and check for their sibling until we find a sibling with ID or no more sibling nodes are left.
        while (id === null && node.previousSibling) {
            id = getId(node.previousSibling);
            node = node.previousSibling;
        }
        return id;
    }
    function track$6(id, source, changed, parentChanged) {
        if (changed === void 0) { changed = true; }
        if (parentChanged === void 0) { parentChanged = false; }
        // Keep track of the order in which mutations happened, they may not be sequential
        // Edge case: If an element is added later on, and pre-discovered element is moved as a child.
        // In that case, we need to reorder the pre-discovered element in the update list to keep visualization consistent.
        var uIndex = updateMap.indexOf(id);
        if (uIndex >= 0 && source === 1 /* Source.ChildListAdd */ && parentChanged) {
            updateMap.splice(uIndex, 1);
            updateMap.push(id);
        }
        else if (uIndex === -1 && changed) {
            updateMap.push(id);
        }
    }

    var dom = /*#__PURE__*/Object.freeze({
        __proto__: null,
        add: add,
        get: get,
        getId: getId,
        getNode: getNode,
        getValue: getValue,
        has: has,
        hashText: hashText,
        iframe: iframe,
        lookup: lookup,
        parse: parse$1,
        sameorigin: sameorigin,
        start: start$z,
        stop: stop$x,
        update: update$1,
        updates: updates$2
    });

    // Track the start time to be able to compute duration at the end of the task
    var idleTimeout = 5000;
    var tracker = {};
    var queuedTasks = [];
    var activeTask = null;
    var pauseTask = null;
    var resumeResolve = null;
    function pause$1() {
        if (pauseTask === null) {
            pauseTask = new Promise(function (resolve) {
                resumeResolve = resolve;
            });
        }
    }
    function resume$1() {
        if (pauseTask) {
            resumeResolve();
            pauseTask = null;
            if (activeTask === null) {
                run();
            }
        }
    }
    function reset$l() {
        tracker = {};
        queuedTasks = [];
        activeTask = null;
        pauseTask = null;
    }
    function schedule$1(task, priority) {
        if (priority === void 0) { priority = 0 /* Priority.Normal */; }
        return __awaiter(this, void 0, void 0, function () {
            var _i, queuedTasks_1, q, promise;
            return __generator(this, function (_a) {
                // If this task is already scheduled, skip it
                for (_i = 0, queuedTasks_1 = queuedTasks; _i < queuedTasks_1.length; _i++) {
                    q = queuedTasks_1[_i];
                    if (q.task === task) {
                        return [2 /*return*/];
                    }
                }
                promise = new Promise(function (resolve) {
                    var insert = priority === 1 /* Priority.High */ ? "unshift" : "push";
                    // Queue this task for asynchronous execution later
                    // We also store a unique page identifier (id) along with the task to ensure
                    // ensure that we do not accidentally execute this task in context of a different page
                    queuedTasks[insert]({ task: task, resolve: resolve, id: id() });
                });
                // If there is no active task running, and Clarity is not in pause state,
                // invoke the first task in the queue synchronously. This ensures that we don't yield the thread during unload event
                if (activeTask === null && pauseTask === null) {
                    run();
                }
                return [2 /*return*/, promise];
            });
        });
    }
    function run() {
        var entry = queuedTasks.shift();
        if (entry) {
            activeTask = entry;
            entry.task().then(function () {
                // Bail out if the context in which this task was operating is different from the current page
                // An example scenario where task could span across pages is Single Page Applications (SPA)
                // A task that started on page #1, but completes on page #2
                if (entry.id !== id()) {
                    return;
                }
                entry.resolve();
                activeTask = null; // Reset active task back to null now that the promise is resolved
                run();
            }).catch(function (error) {
                // If one of the scheduled tasks failed, log, recover and continue processing rest of the tasks
                if (entry.id !== id()) {
                    return;
                }
                if (error) {
                    log$1(0 /* Code.RunTask */, 1 /* Severity.Warning */, error.name, error.message, error.stack);
                }
                activeTask = null;
                run();
            });
        }
    }
    function state$a(timer) {
        var id = key(timer);
        if (id in tracker) {
            var elapsed = performance.now() - tracker[id].start;
            return (elapsed > tracker[id].yield) ? 0 /* Task.Wait */ : 1 /* Task.Run */;
        }
        // If this task is no longer being tracked, send stop message to the caller
        return 2 /* Task.Stop */;
    }
    function start$y(timer) {
        tracker[key(timer)] = { start: performance.now(), calls: 0, yield: 30 /* Setting.LongTask */ };
    }
    function restart$2(timer) {
        var id = key(timer);
        if (tracker && tracker[id]) {
            var c = tracker[id].calls;
            var y = tracker[id].yield;
            start$y(timer);
            tracker[id].calls = c + 1;
            tracker[id].yield = y;
        }
    }
    function stop$w(timer) {
        var end = performance.now();
        var id = key(timer);
        var duration = end - tracker[id].start;
        sum(timer.cost, duration);
        count$1(5 /* Metric.InvokeCount */);
        // For the first execution, which is synchronous, time is automatically counted towards TotalDuration.
        // However, for subsequent asynchronous runs, we need to manually update TotalDuration metric.
        if (tracker[id].calls > 0) {
            sum(4 /* Metric.TotalCost */, duration);
        }
    }
    function suspend$1(timer) {
        return __awaiter(this, void 0, void 0, function () {
            var id, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        id = key(timer);
                        if (!(id in tracker)) return [3 /*break*/, 2];
                        stop$w(timer);
                        _a = tracker[id];
                        return [4 /*yield*/, wait()];
                    case 1:
                        _a.yield = (_b.sent()).timeRemaining();
                        restart$2(timer);
                        _b.label = 2;
                    case 2: 
                    // After we are done with suspending task, ensure that we are still operating in the right context
                    // If the task is still being tracked, continue running the task, otherwise ask caller to stop execution
                    return [2 /*return*/, id in tracker ? 1 /* Task.Run */ : 2 /* Task.Stop */];
                }
            });
        });
    }
    function key(timer) {
        return "".concat(timer.id, ".").concat(timer.cost);
    }
    function wait() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!pauseTask) return [3 /*break*/, 2];
                        return [4 /*yield*/, pauseTask];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, new Promise(function (resolve) {
                            requestIdleCallback(resolve, { timeout: idleTimeout });
                        })];
                }
            });
        });
    }
    // Use native implementation of requestIdleCallback if it exists.
    // Otherwise, fall back to a custom implementation using requestAnimationFrame & MessageChannel.
    // While it's not possible to build a perfect polyfill given the nature of this API, the following code attempts to get close.
    // Background context: requestAnimationFrame invokes the js code right before: style, layout and paint computation within the frame.
    // This means, that any code that runs as part of requestAnimationFrame will by default be blocking in nature. Not what we want.
    // For non-blocking behavior, We need to know when browser has finished painting. This can be accomplished in two different ways (hacks):
    //   (1) Use MessageChannel to pass the message, and browser will receive the message right after paint event has occured.
    //   (2) Use setTimeout call within requestAnimationFrame. This also works, but there's a risk that browser may throttle setTimeout calls.
    // Given this information, we are currently using (1) from above. More information on (2) as well as some additional context is below:
    // https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Performance_best_practices_for_Firefox_fe_engineers
    function requestIdleCallbackPolyfill(callback, options) {
        var startTime = performance.now();
        var channel = new MessageChannel();
        var incoming = channel.port1;
        var outgoing = channel.port2;
        incoming.onmessage = function (event) {
            var currentTime = performance.now();
            var elapsed = currentTime - startTime;
            var duration = currentTime - event.data;
            if (duration > 30 /* Setting.LongTask */ && elapsed < options.timeout) {
                requestAnimationFrame(function () { outgoing.postMessage(currentTime); });
            }
            else {
                var didTimeout_1 = elapsed > options.timeout;
                callback({
                    didTimeout: didTimeout_1,
                    timeRemaining: function () { return didTimeout_1 ? 30 /* Setting.LongTask */ : Math.max(0, 30 /* Setting.LongTask */ - duration); }
                });
            }
        };
        requestAnimationFrame(function () { outgoing.postMessage(performance.now()); });
    }
    var requestIdleCallback = window["requestIdleCallback"] || requestIdleCallbackPolyfill;

    // Following code takes an array of tokens and transforms it to optimize for repeating tokens and make it efficient to send over the wire
    // The way it works is that it iterate over all tokens and checks if the current token was already seen in the tokens array so far
    // If so, it replaces the token with its reference (index). This helps us save bytes by not repeating the same value twice.
    // E.g. If tokens array is: ["hello", "world", "coding", "language", "world", "language", "example"]
    // Then the resulting tokens array after following code execution would be: ["hello", "world", "coding", "language", [1, 3], "example"]
    // Where [1,3] points to tokens[1] => "world" and tokens[3] => "language"
    function tokenize (tokens) {
        var output = [];
        var lookup = {};
        var pointer = 0;
        var reference = null;
        for (var i = 0; i < tokens.length; i++) {
            // Only optimize for string values
            if (typeof tokens[i] === "string" /* Constant.String */) {
                var token = tokens[i];
                var index = lookup[token] || -1;
                if (index >= 0) {
                    if (reference) {
                        reference.push(index);
                    }
                    else {
                        reference = [index];
                        output.push(reference);
                        pointer++;
                    }
                }
                else {
                    reference = null;
                    output.push(token);
                    lookup[token] = pointer++;
                }
            }
            else {
                // If the value is anything other than string, append it as it is to the output array
                // And, also increment the pointer to stay in sync with output array
                reference = null;
                output.push(tokens[i]);
                pointer++;
            }
        }
        return output;
    }

    var data$c;
    function reset$k() {
        data$c = null;
    }
    function start$x() {
        reset$k();
        compute$9();
    }
    function compute$9() {
        var body = document.body;
        var d = document.documentElement;
        var bodyClientWidth = body ? body.clientWidth : null;
        var bodyScrollWidth = body ? body.scrollWidth : null;
        var bodyOffsetWidth = body ? body.offsetWidth : null;
        var documentClientWidth = d ? d.clientWidth : null;
        var documentScrollWidth = d ? d.scrollWidth : null;
        var documentOffsetWidth = d ? d.offsetWidth : null;
        var width = Math.max(bodyClientWidth, bodyScrollWidth, bodyOffsetWidth, documentClientWidth, documentScrollWidth, documentOffsetWidth);
        var bodyClientHeight = body ? body.clientHeight : null;
        var bodyScrollHeight = body ? body.scrollHeight : null;
        var bodyOffsetHeight = body ? body.offsetHeight : null;
        var documentClientHeight = d ? d.clientHeight : null;
        var documentScrollHeight = d ? d.scrollHeight : null;
        var documentOffsetHeight = d ? d.offsetHeight : null;
        var height = Math.max(bodyClientHeight, bodyScrollHeight, bodyOffsetHeight, documentClientHeight, documentScrollHeight, documentOffsetHeight);
        // Check that width or height has changed from before, and also that width & height are not null values
        if ((data$c === null || width !== data$c.width || height !== data$c.height) && width !== null && height !== null) {
            data$c = { width: width, height: height };
            encode$4(8 /* Event.Document */);
        }
    }
    function stop$v() {
        reset$k();
    }

    var sheetAdoptionState = [];
    var sheetUpdateState = [];
    var replace = null;
    var replaceSync = null;
    function start$w() {
        if (replace === null) {
            replace = CSSStyleSheet.prototype.replace;
            CSSStyleSheet.prototype.replace = function () {
                if (active()) {
                    max(36 /* Metric.ConstructedStyles */, 1);
                }
                return replace.apply(this, arguments);
            };
        }
        if (replaceSync === null) {
            replaceSync = CSSStyleSheet.prototype.replaceSync;
            CSSStyleSheet.prototype.replaceSync = function () {
                if (active()) {
                    max(36 /* Metric.ConstructedStyles */, 1);
                }
                return replaceSync.apply(this, arguments);
            };
        }
    }
    function checkDocumentStyles(documentNode) {
        if (!(documentNode === null || documentNode === void 0 ? void 0 : documentNode.adoptedStyleSheets)) {
            // if we don't have adoptedStyledSheets on the Node passed to us, we can short circuit.
            return;
        }
        max(36 /* Metric.ConstructedStyles */, 1);
    }
    function compute$8() {
        checkDocumentStyles(document);
    }
    function reset$j() {
        sheetAdoptionState = [];
        sheetUpdateState = [];
    }
    function stop$u() {
        reset$j();
    }

    var state$9 = [];
    var elementAnimate = null;
    var animationPlay = null;
    var animationPause = null;
    var animationCancel = null;
    var animationFinish = null;
    var animationId = 'clarityAnimationId';
    var operationCount = 'clarityOperationCount';
    var maxOperations = 20;
    function start$v() {
        if (window["Animation"] &&
            window["KeyframeEffect"] &&
            window["KeyframeEffect"].prototype.getKeyframes &&
            window["KeyframeEffect"].prototype.getTiming) {
            reset$i();
            overrideAnimationHelper(animationPlay, "play");
            overrideAnimationHelper(animationPause, "pause");
            overrideAnimationHelper(animationCancel, "cancel");
            overrideAnimationHelper(animationFinish, "finish");
            if (elementAnimate === null) {
                elementAnimate = Element.prototype.animate;
                Element.prototype.animate = function () {
                    var createdAnimation = elementAnimate.apply(this, arguments);
                    trackAnimationOperation(createdAnimation, "play");
                    return createdAnimation;
                };
            }
        }
    }
    function reset$i() {
        state$9 = [];
    }
    function track$5(time, id, operation, keyFrames, timing, targetId, timeline) {
        state$9.push({
            time: time,
            event: 44 /* Event.Animation */,
            data: {
                id: id,
                operation: operation,
                keyFrames: keyFrames,
                timing: timing,
                targetId: targetId,
                timeline: timeline
            }
        });
        encode$4(44 /* Event.Animation */);
    }
    function stop$t() {
        reset$i();
    }
    function overrideAnimationHelper(functionToOverride, name) {
        if (functionToOverride === null) {
            functionToOverride = Animation.prototype[name];
            Animation.prototype[name] = function () {
                trackAnimationOperation(this, name);
                return functionToOverride.apply(this, arguments);
            };
        }
    }
    function trackAnimationOperation(animation, name) {
        if (active()) {
            var effect = animation.effect;
            var target = getId(effect.target);
            if (target !== null && effect.getKeyframes && effect.getTiming) {
                if (!animation[animationId]) {
                    animation[animationId] = shortid();
                    animation[operationCount] = 0;
                    var keyframes = effect.getKeyframes();
                    var timing = effect.getTiming();
                    track$5(time(), animation[animationId], 0 /* AnimationOperation.Create */, JSON.stringify(keyframes), JSON.stringify(timing), target);
                }
                if (animation[operationCount]++ < maxOperations) {
                    var operation = null;
                    switch (name) {
                        case "play":
                            operation = 1 /* AnimationOperation.Play */;
                            break;
                        case "pause":
                            operation = 2 /* AnimationOperation.Pause */;
                            break;
                        case "cancel":
                            operation = 3 /* AnimationOperation.Cancel */;
                            break;
                        case "finish":
                            operation = 4 /* AnimationOperation.Finish */;
                            break;
                    }
                    if (operation) {
                        track$5(time(), animation[animationId], operation);
                    }
                }
            }
        }
    }

    function encode$4 (type, timer, ts) {
        if (timer === void 0) { timer = null; }
        if (ts === void 0) { ts = null; }
        return __awaiter(this, void 0, void 0, function () {
            var eventTime, tokens, _a, d, _i, _b, r, _c, _d, entry, _e, _f, entry, _g, _h, entry, values, _j, values_1, value, state, data, active, suspend, privacy, mangle, keys, _k, keys_1, key, box, factor, attr;
            return __generator(this, function (_l) {
                switch (_l.label) {
                    case 0:
                        eventTime = ts || time();
                        tokens = [eventTime, type];
                        _a = type;
                        switch (_a) {
                            case 8 /* Event.Document */: return [3 /*break*/, 1];
                            case 7 /* Event.Region */: return [3 /*break*/, 2];
                            case 45 /* Event.StyleSheetAdoption */: return [3 /*break*/, 3];
                            case 46 /* Event.StyleSheetUpdate */: return [3 /*break*/, 3];
                            case 44 /* Event.Animation */: return [3 /*break*/, 4];
                            case 5 /* Event.Discover */: return [3 /*break*/, 5];
                            case 6 /* Event.Mutation */: return [3 /*break*/, 5];
                        }
                        return [3 /*break*/, 12];
                    case 1:
                        d = data$c;
                        tokens.push(d.width);
                        tokens.push(d.height);
                        track$8(type, d.width, d.height);
                        queue(tokens);
                        return [3 /*break*/, 12];
                    case 2:
                        for (_i = 0, _b = state$8; _i < _b.length; _i++) {
                            r = _b[_i];
                            tokens = [r.time, 7 /* Event.Region */];
                            tokens.push(r.data.id);
                            tokens.push(r.data.interaction);
                            tokens.push(r.data.visibility);
                            tokens.push(r.data.name);
                            queue(tokens);
                        }
                        reset$h();
                        return [3 /*break*/, 12];
                    case 3:
                        for (_c = 0, _d = sheetAdoptionState; _c < _d.length; _c++) {
                            entry = _d[_c];
                            tokens = [entry.time, entry.event];
                            tokens.push(entry.data.id);
                            tokens.push(entry.data.operation);
                            tokens.push(entry.data.newIds);
                            queue(tokens);
                        }
                        for (_e = 0, _f = sheetUpdateState; _e < _f.length; _e++) {
                            entry = _f[_e];
                            tokens = [entry.time, entry.event];
                            tokens.push(entry.data.id);
                            tokens.push(entry.data.operation);
                            tokens.push(entry.data.cssRules);
                            queue(tokens);
                        }
                        reset$j();
                        return [3 /*break*/, 12];
                    case 4:
                        for (_g = 0, _h = state$9; _g < _h.length; _g++) {
                            entry = _h[_g];
                            tokens = [entry.time, entry.event];
                            tokens.push(entry.data.id);
                            tokens.push(entry.data.operation);
                            tokens.push(entry.data.keyFrames);
                            tokens.push(entry.data.timing);
                            tokens.push(entry.data.timeline);
                            tokens.push(entry.data.targetId);
                            queue(tokens);
                        }
                        reset$i();
                        return [3 /*break*/, 12];
                    case 5:
                        // Check if we are operating within the context of the current page
                        if (state$a(timer) === 2 /* Task.Stop */) {
                            return [3 /*break*/, 12];
                        }
                        values = updates$2();
                        if (!(values.length > 0)) return [3 /*break*/, 11];
                        _j = 0, values_1 = values;
                        _l.label = 6;
                    case 6:
                        if (!(_j < values_1.length)) return [3 /*break*/, 10];
                        value = values_1[_j];
                        state = state$a(timer);
                        if (!(state === 0 /* Task.Wait */)) return [3 /*break*/, 8];
                        return [4 /*yield*/, suspend$1(timer)];
                    case 7:
                        state = _l.sent();
                        _l.label = 8;
                    case 8:
                        if (state === 2 /* Task.Stop */) {
                            return [3 /*break*/, 10];
                        }
                        data = value.data;
                        active = value.metadata.active;
                        suspend = value.metadata.suspend;
                        privacy = value.metadata.privacy;
                        mangle = shouldMangle(value);
                        keys = active ? ["tag", "attributes", "value"] : ["tag"];
                        for (_k = 0, keys_1 = keys; _k < keys_1.length; _k++) {
                            key = keys_1[_k];
                            if (data[key]) {
                                switch (key) {
                                    case "tag":
                                        box = size(value);
                                        factor = mangle ? -1 : 1;
                                        tokens.push(value.id * factor);
                                        if (value.parent && active) {
                                            tokens.push(value.parent);
                                            if (value.previous) {
                                                tokens.push(value.previous);
                                            }
                                        }
                                        tokens.push(suspend ? "*M" /* Constant.SuspendMutationTag */ : data[key]);
                                        if (box && box.length === 2) {
                                            tokens.push("".concat("#" /* Constant.Hash */).concat(str$1(box[0]), ".").concat(str$1(box[1])));
                                        }
                                        break;
                                    case "attributes":
                                        for (attr in data[key]) {
                                            if (data[key][attr] !== undefined) {
                                                tokens.push(attribute(attr, data[key][attr], privacy));
                                            }
                                        }
                                        break;
                                    case "value":
                                        check$4(value.metadata.fraud, value.id, data[key]);
                                        tokens.push(text$1(data[key], data.tag, privacy, mangle));
                                        break;
                                }
                            }
                        }
                        _l.label = 9;
                    case 9:
                        _j++;
                        return [3 /*break*/, 6];
                    case 10:
                        if (type === 6 /* Event.Mutation */) {
                            activity(eventTime);
                        }
                        queue(tokenize(tokens), !config$1.lean);
                        _l.label = 11;
                    case 11: return [3 /*break*/, 12];
                    case 12: return [2 /*return*/];
                }
            });
        });
    }
    function shouldMangle(value) {
        var privacy = value.metadata.privacy;
        return value.data.tag === "*T" /* Constant.TextTag */ && !(privacy === 0 /* Privacy.None */ || privacy === 1 /* Privacy.Sensitive */);
    }
    function size(value) {
        if (value.metadata.size !== null && value.metadata.size.length === 0) {
            var img = getNode(value.id);
            if (img) {
                return [Math.floor(img.offsetWidth * 100 /* Setting.BoxPrecision */), Math.floor(img.offsetHeight * 100 /* Setting.BoxPrecision */)];
            }
        }
        return value.metadata.size;
    }
    function str$1(input) {
        return input.toString(36);
    }
    function attribute(key, value, privacy) {
        return "".concat(key, "=").concat(text$1(value, key.indexOf("data-" /* Constant.DataAttribute */) === 0 ? "data-" /* Constant.DataAttribute */ : key, privacy));
    }

    var state$8 = [];
    var regionMap = null; // Maps region nodes => region name
    var regions = {};
    var queue$2 = [];
    var watch = false;
    var observer$1 = null;
    function start$u() {
        reset$h();
        observer$1 = null;
        regionMap = new WeakMap();
        regions = {};
        queue$2 = [];
        watch = window["IntersectionObserver"] ? true : false;
    }
    function observe$c(node, name) {
        if (regionMap.has(node) === false) {
            regionMap.set(node, name);
            observer$1 = observer$1 === null && watch ? new IntersectionObserver(handler$3, {
                // Get notified as intersection continues to change
                // This allows us to process regions that get partially hidden during the lifetime of the page
                // See: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#creating_an_intersection_observer
                // By default, intersection observers only fire an event when even a single pixel is visible and not thereafter.
                threshold: [0, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
            }) : observer$1;
            if (observer$1 && node && node.nodeType === Node.ELEMENT_NODE) {
                observer$1.observe(node);
            }
        }
    }
    function exists(node) {
        // Check if regionMap is not null before looking up a node
        // Since, dom module stops after region module, it's possible that we may set regionMap to be null
        // and still attempt to call exists on a late coming DOM mutation (or addition), effectively causing a script error
        return regionMap && regionMap.has(node);
    }
    function track$4(id, event) {
        var node = getNode(id);
        var data = id in regions ? regions[id] : { id: id, visibility: 0 /* RegionVisibility.Rendered */, interaction: 16 /* InteractionState.None */, name: regionMap.get(node) };
        // Determine the interaction state based on incoming event
        var interaction = 16 /* InteractionState.None */;
        switch (event) {
            case 9 /* Event.Click */:
                interaction = 20 /* InteractionState.Clicked */;
                break;
            case 27 /* Event.Input */:
                interaction = 30 /* InteractionState.Input */;
                break;
        }
        // Process updates to this region, if applicable
        process$6(node, data, interaction, data.visibility);
    }
    function compute$7() {
        // Process any regions where we couldn't resolve an "id" for at the time of last intersection observer event
        // This could happen in cases where elements are not yet processed by Clarity's virtual DOM but browser reports a change, regardless.
        // For those cases we add them to the queue and re-process them below
        var q = [];
        for (var _i = 0, queue_1 = queue$2; _i < queue_1.length; _i++) {
            var r = queue_1[_i];
            var id = getId(r.node);
            if (id) {
                r.state.data.id = id;
                regions[id] = r.state.data;
                state$8.push(r.state);
            }
            else {
                q.push(r);
            }
        }
        queue$2 = q;
        // Schedule encode only when we have at least one valid data entry
        if (state$8.length > 0) {
            encode$4(7 /* Event.Region */);
        }
    }
    function handler$3(entries) {
        for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
            var entry = entries_1[_i];
            var target = entry.target;
            var rect = entry.boundingClientRect;
            var overlap = entry.intersectionRect;
            var viewport = entry.rootBounds;
            // Only capture regions that have non-zero width or height to avoid tracking and sending regions
            // that cannot ever be seen by the user. In some cases, websites will have a multiple copy of the same region
            // like search box - one for desktop, and another for mobile. In those cases, CSS media queries determine which one should be visible.
            // Also, if these regions ever become non-zero width or height (through AJAX, user action or orientation change) - we will automatically start monitoring them from that point onwards
            if (regionMap.has(target) && rect.width + rect.height > 0 && viewport.width > 0 && viewport.height > 0) {
                var id = target ? getId(target) : null;
                var data = id in regions ? regions[id] : { id: id, name: regionMap.get(target), interaction: 16 /* InteractionState.None */, visibility: 0 /* RegionVisibility.Rendered */ };
                // For regions that have relatively smaller area, we look at intersection ratio and see the overlap relative to element's area
                // However, for larger regions, area of regions could be bigger than viewport and therefore comparison is relative to visible area
                var viewportRatio = overlap ? (overlap.width * overlap.height * 1.0) / (viewport.width * viewport.height) : 0;
                var visible = viewportRatio > 0.05 /* Setting.ViewportIntersectionRatio */ || entry.intersectionRatio > 0.8 /* Setting.IntersectionRatio */;
                // If an element is either visible or was visible and has been scrolled to the end
                // i.e. Scrolled to end is determined by if the starting position of the element + the window height is more than the total element height.
                // starting position is relative to the viewport - so Intersection observer returns a negative value for rect.top to indicate that the element top is above the viewport
                var scrolledToEnd = (visible || data.visibility == 10 /* RegionVisibility.Visible */) && Math.abs(rect.top) + viewport.height > rect.height;
                // Process updates to this region, if applicable
                process$6(target, data, data.interaction, (scrolledToEnd ?
                    13 /* RegionVisibility.ScrolledToEnd */ :
                    (visible ? 10 /* RegionVisibility.Visible */ : 0 /* RegionVisibility.Rendered */)));
                // Stop observing this element now that we have already received scrolled signal
                if (data.visibility >= 13 /* RegionVisibility.ScrolledToEnd */ && observer$1) {
                    observer$1.unobserve(target);
                }
            }
        }
        if (state$8.length > 0) {
            encode$4(7 /* Event.Region */);
        }
    }
    function process$6(n, d, s, v) {
        // Check if received a state that supersedes existing state
        var updated = s > d.interaction || v > d.visibility;
        d.interaction = s > d.interaction ? s : d.interaction;
        d.visibility = v > d.visibility ? v : d.visibility;
        // If the corresponding node is already discovered, update the internal state
        // Otherwise, track it in a queue to reprocess later.
        if (d.id) {
            if ((d.id in regions && updated) || !(d.id in regions)) {
                regions[d.id] = d;
                state$8.push(clone$1(d));
            }
        }
        else {
            // Get the time before adding to queue to ensure accurate event time
            queue$2.push({ node: n, state: clone$1(d) });
        }
    }
    function clone$1(r) {
        return { time: time(), data: { id: r.id, interaction: r.interaction, visibility: r.visibility, name: r.name } };
    }
    function reset$h() {
        state$8 = [];
    }
    function stop$s() {
        reset$h();
        regionMap = null;
        regions = {};
        queue$2 = [];
        if (observer$1) {
            observer$1.disconnect();
            observer$1 = null;
        }
        watch = false;
    }

    var state$7 = [];
    function start$t() {
        reset$g();
    }
    function observe$b(root) {
        bind(root, "change", recompute$8, true);
    }
    function recompute$8(evt) {
        var element = target(evt);
        if (element) {
            var value = element.value;
            var checksum = value && value.length >= 5 /* Setting.WordLength */ && config$1.fraud && "password,secret,pass,social,ssn,code,hidden" /* Mask.Exclude */.indexOf(element.type) === -1 ? hash(value, 24 /* Setting.ChecksumPrecision */) : "" /* Constant.Empty */;
            state$7.push({ time: time(evt), event: 42 /* Event.Change */, data: { target: target(evt), type: element.type, value: value, checksum: checksum } });
            schedule$1(encode$3.bind(this, 42 /* Event.Change */));
        }
    }
    function reset$g() {
        state$7 = [];
    }
    function stop$r() {
        reset$g();
    }

    function offset(element) {
        var output = { x: 0, y: 0 };
        // Walk up the chain to ensure we compute offset distance correctly
        // In case where we may have nested IFRAMEs, we keep walking up until we get to the top most parent page
        if (element && element.offsetParent) {
            do {
                var parent_1 = element.offsetParent;
                var frame = parent_1 === null ? iframe(element.ownerDocument) : null;
                output.x += element.offsetLeft;
                output.y += element.offsetTop;
                element = frame ? frame : parent_1;
            } while (element);
        }
        return output;
    }

    var UserInputTags = ["input", "textarea", "radio", "button", "canvas"];
    var state$6 = [];
    function start$s() {
        reset$f();
    }
    function observe$a(root) {
        bind(root, "click", handler$2.bind(this, 9 /* Event.Click */, root), true);
    }
    function handler$2(event, root, evt) {
        var frame = iframe(root);
        var d = frame ? frame.contentDocument.documentElement : document.documentElement;
        var x = "pageX" in evt ? Math.round(evt.pageX) : ("clientX" in evt ? Math.round(evt["clientX"] + d.scrollLeft) : null);
        var y = "pageY" in evt ? Math.round(evt.pageY) : ("clientY" in evt ? Math.round(evt["clientY"] + d.scrollTop) : null);
        // In case of iframe, we adjust (x,y) to be relative to top parent's origin
        if (frame) {
            var distance = offset(frame);
            x = x ? x + Math.round(distance.x) : x;
            y = y ? y + Math.round(distance.y) : y;
        }
        var t = target(evt);
        // Find nearest anchor tag (<a/>) parent if current target node is part of one
        // If present, we use the returned link element to populate text and link properties below
        var a = link(t);
        // Get layout rectangle for the target element
        var l = layout$1(t);
        // Reference: https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail
        // This property helps differentiate between a keyboard navigation vs. pointer click
        // In case of a keyboard navigation, we use center of target element as (x,y)
        if (evt.detail === 0 && l) {
            x = Math.round(l.x + (l.w / 2));
            y = Math.round(l.y + (l.h / 2));
        }
        var eX = l ? Math.max(Math.floor(((x - l.x) / l.w) * 32767 /* Setting.ClickPrecision */), 0) : 0;
        var eY = l ? Math.max(Math.floor(((y - l.y) / l.h) * 32767 /* Setting.ClickPrecision */), 0) : 0;
        // Check for null values before processing this event
        if (x !== null && y !== null) {
            state$6.push({
                time: time(evt),
                event: event,
                data: {
                    target: t,
                    x: x,
                    y: y,
                    eX: eX,
                    eY: eY,
                    button: evt.button,
                    reaction: reaction(t),
                    context: context(a),
                    text: text(t),
                    link: a ? a.href : null,
                    hash: null,
                    trust: evt.isTrusted ? 1 /* BooleanFlag.True */ : 0 /* BooleanFlag.False */
                }
            });
            schedule$1(encode$3.bind(this, event));
        }
    }
    function link(node) {
        while (node && node !== document) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                var element = node;
                if (element.tagName === "A") {
                    return element;
                }
            }
            node = node.parentNode;
        }
        return null;
    }
    function text(element) {
        var output = null;
        if (element) {
            // Grab text using "textContent" for most HTMLElements, however, use "value" for HTMLInputElements and "alt" for HTMLImageElement.
            var t = element.textContent || String(element.value || '') || element.alt;
            if (t) {
                // Replace multiple occurrence of space characters with a single white space
                // Also, trim any spaces at the beginning or at the end of string
                // Finally, send only first few characters as specified by the Setting
                output = t.replace(/\s+/g, " " /* Constant.Space */).trim().substr(0, 25 /* Setting.ClickText */);
            }
        }
        return output;
    }
    function reaction(element) {
        if (element.nodeType === Node.ELEMENT_NODE) {
            var tag = element.tagName.toLowerCase();
            if (UserInputTags.indexOf(tag) >= 0) {
                return 0 /* BooleanFlag.False */;
            }
        }
        return 1 /* BooleanFlag.True */;
    }
    function layout$1(element) {
        var box = null;
        var de = document.documentElement;
        if (typeof element.getBoundingClientRect === "function") {
            // getBoundingClientRect returns rectangle relative positioning to viewport
            var rect = element.getBoundingClientRect();
            if (rect && rect.width > 0 && rect.height > 0) {
                // Add viewport's scroll position to rectangle to get position relative to document origin
                // Also: using Math.floor() instead of Math.round() because in Edge,
                // getBoundingClientRect returns partial pixel values (e.g. 162.5px) and Chrome already
                // floors the value (e.g. 162px). This keeps consistent behavior across browsers.
                box = {
                    x: Math.floor(rect.left + ("pageXOffset" in window ? window.pageXOffset : de.scrollLeft)),
                    y: Math.floor(rect.top + ("pageYOffset" in window ? window.pageYOffset : de.scrollTop)),
                    w: Math.floor(rect.width),
                    h: Math.floor(rect.height)
                };
            }
        }
        return box;
    }
    function context(a) {
        if (a && a.hasAttribute("target" /* Constant.Target */)) {
            switch (a.getAttribute("target" /* Constant.Target */)) {
                case "_blank" /* Constant.Blank */: return 1 /* BrowsingContext.Blank */;
                case "_parent" /* Constant.Parent */: return 2 /* BrowsingContext.Parent */;
                case "_top" /* Constant.Top */: return 3 /* BrowsingContext.Top */;
            }
        }
        return 0 /* BrowsingContext.Self */;
    }
    function reset$f() {
        state$6 = [];
    }
    function stop$q() {
        reset$f();
    }

    var state$5 = [];
    function start$r() {
        reset$e();
    }
    function observe$9(root) {
        bind(root, "cut", recompute$7.bind(this, 0 /* Clipboard.Cut */), true);
        bind(root, "copy", recompute$7.bind(this, 1 /* Clipboard.Copy */), true);
        bind(root, "paste", recompute$7.bind(this, 2 /* Clipboard.Paste */), true);
    }
    function recompute$7(action, evt) {
        state$5.push({ time: time(evt), event: 38 /* Event.Clipboard */, data: { target: target(evt), action: action } });
        schedule$1(encode$3.bind(this, 38 /* Event.Clipboard */));
    }
    function reset$e() {
        state$5 = [];
    }
    function stop$p() {
        reset$e();
    }

    var timeout$5 = null;
    var state$4 = [];
    function start$q() {
        reset$d();
    }
    function observe$8(root) {
        bind(root, "input", recompute$6, true);
    }
    function recompute$6(evt) {
        var input = target(evt);
        var value = get(input);
        if (input && input.type && value) {
            var v = input.value;
            switch (input.type) {
                case "radio":
                case "checkbox":
                    v = input.checked ? "true" : "false";
                    break;
            }
            var data = { target: input, value: v };
            // If last entry in the queue is for the same target node as the current one, remove it so we can later swap it with current data.
            if (state$4.length > 0 && (state$4[state$4.length - 1].data.target === data.target)) {
                state$4.pop();
            }
            state$4.push({ time: time(evt), event: 27 /* Event.Input */, data: data });
            clearTimeout(timeout$5);
            timeout$5 = setTimeout(process$5, 1000 /* Setting.InputLookAhead */, 27 /* Event.Input */);
        }
    }
    function process$5(event) {
        schedule$1(encode$3.bind(this, event));
    }
    function reset$d() {
        state$4 = [];
    }
    function stop$o() {
        clearTimeout(timeout$5);
        reset$d();
    }

    var state$3 = [];
    var timeout$4 = null;
    function start$p() {
        reset$c();
    }
    function observe$7(root) {
        bind(root, "mousedown", mouse.bind(this, 13 /* Event.MouseDown */, root), true);
        bind(root, "mouseup", mouse.bind(this, 14 /* Event.MouseUp */, root), true);
        bind(root, "mousemove", mouse.bind(this, 12 /* Event.MouseMove */, root), true);
        bind(root, "wheel", mouse.bind(this, 15 /* Event.MouseWheel */, root), true);
        bind(root, "dblclick", mouse.bind(this, 16 /* Event.DoubleClick */, root), true);
        bind(root, "touchstart", touch.bind(this, 17 /* Event.TouchStart */, root), true);
        bind(root, "touchend", touch.bind(this, 18 /* Event.TouchEnd */, root), true);
        bind(root, "touchmove", touch.bind(this, 19 /* Event.TouchMove */, root), true);
        bind(root, "touchcancel", touch.bind(this, 20 /* Event.TouchCancel */, root), true);
    }
    function mouse(event, root, evt) {
        var frame = iframe(root);
        var d = frame ? frame.contentDocument.documentElement : document.documentElement;
        var x = "pageX" in evt ? Math.round(evt.pageX) : ("clientX" in evt ? Math.round(evt["clientX"] + d.scrollLeft) : null);
        var y = "pageY" in evt ? Math.round(evt.pageY) : ("clientY" in evt ? Math.round(evt["clientY"] + d.scrollTop) : null);
        // In case of iframe, we adjust (x,y) to be relative to top parent's origin
        if (frame) {
            var distance = offset(frame);
            x = x ? x + Math.round(distance.x) : x;
            y = y ? y + Math.round(distance.y) : y;
        }
        // Check for null values before processing this event
        if (x !== null && y !== null) {
            handler$1({ time: time(evt), event: event, data: { target: target(evt), x: x, y: y } });
        }
    }
    function touch(event, root, evt) {
        var frame = iframe(root);
        var d = frame ? frame.contentDocument.documentElement : document.documentElement;
        var touches = evt.changedTouches;
        var t = time(evt);
        if (touches) {
            for (var i = 0; i < touches.length; i++) {
                var entry = touches[i];
                var x = "clientX" in entry ? Math.round(entry["clientX"] + d.scrollLeft) : null;
                var y = "clientY" in entry ? Math.round(entry["clientY"] + d.scrollTop) : null;
                x = x && frame ? x + Math.round(frame.offsetLeft) : x;
                y = y && frame ? y + Math.round(frame.offsetTop) : y;
                // Check for null values before processing this event
                if (x !== null && y !== null) {
                    handler$1({ time: t, event: event, data: { target: target(evt), x: x, y: y } });
                }
            }
        }
    }
    function handler$1(current) {
        switch (current.event) {
            case 12 /* Event.MouseMove */:
            case 15 /* Event.MouseWheel */:
            case 19 /* Event.TouchMove */:
                var length_1 = state$3.length;
                var last = length_1 > 1 ? state$3[length_1 - 2] : null;
                if (last && similar$1(last, current)) {
                    state$3.pop();
                }
                state$3.push(current);
                clearTimeout(timeout$4);
                timeout$4 = setTimeout(process$4, 500 /* Setting.LookAhead */, current.event);
                break;
            default:
                state$3.push(current);
                process$4(current.event);
                break;
        }
    }
    function process$4(event) {
        schedule$1(encode$3.bind(this, event));
    }
    function reset$c() {
        state$3 = [];
    }
    function similar$1(last, current) {
        var dx = last.data.x - current.data.x;
        var dy = last.data.y - current.data.y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        var gap = current.time - last.time;
        var match = current.data.target === last.data.target;
        return current.event === last.event && match && distance < 20 /* Setting.Distance */ && gap < 25 /* Setting.Interval */;
    }
    function stop$n() {
        clearTimeout(timeout$4);
        // Send out any pending pointer events in the pipeline
        if (state$3.length > 0) {
            process$4(state$3[state$3.length - 1].event);
        }
    }

    var data$b;
    function start$o() {
        bind(window, "resize", recompute$5);
        recompute$5();
    }
    function recompute$5() {
        var de = document.documentElement;
        // window.innerWidth includes width of the scrollbar and is not a true representation of the viewport width.
        // Therefore, when possible, use documentElement's clientWidth property.
        data$b = {
            width: de && "clientWidth" in de ? Math.min(de.clientWidth, window.innerWidth) : window.innerWidth,
            height: de && "clientHeight" in de ? Math.min(de.clientHeight, window.innerHeight) : window.innerHeight,
        };
        encode$3(11 /* Event.Resize */);
    }
    function reset$b() {
        data$b = null;
    }
    function stop$m() {
        reset$b();
    }

    var state$2 = [];
    var initialTop = null;
    var initialBottom = null;
    var timeout$3 = null;
    function start$n() {
        state$2 = [];
        recompute$4();
    }
    function observe$6(root) {
        var frame = iframe(root);
        var node = frame ? frame.contentWindow : (root === document ? window : root);
        bind(node, "scroll", recompute$4, true);
    }
    function recompute$4(event) {
        if (event === void 0) { event = null; }
        var w = window;
        var de = document.documentElement;
        var element = event ? target(event) : de;
        // If the target is a Document node, then identify corresponding documentElement and window for this document
        if (element && element.nodeType === Node.DOCUMENT_NODE) {
            var frame = iframe(element);
            w = frame ? frame.contentWindow : w;
            element = de = element.documentElement;
        }
        // Edge doesn't support scrollTop position on document.documentElement.
        // For cross browser compatibility, looking up pageYOffset on window if the scroll is on document.
        // And, if for some reason that is not available, fall back to looking up scrollTop on document.documentElement.
        var x = element === de && "pageXOffset" in w ? Math.round(w.pageXOffset) : Math.round(element.scrollLeft);
        var y = element === de && "pageYOffset" in w ? Math.round(w.pageYOffset) : Math.round(element.scrollTop);
        var width = window.innerWidth;
        var height = window.innerHeight;
        var xPosition = width / 3;
        var yOffset = width > height ? height * 0.15 : height * 0.2;
        var startYPosition = yOffset;
        var endYPosition = height - yOffset;
        var top = getPositionNode(xPosition, startYPosition);
        var bottom = getPositionNode(xPosition, endYPosition);
        var current = { time: time(event), event: 10 /* Event.Scroll */, data: { target: element, x: x, y: y, top: top, bottom: bottom } };
        // We don't send any scroll events if this is the first event and the current position is top (0,0)
        if ((event === null && x === 0 && y === 0) || (x === null || y === null)) {
            initialTop = top;
            initialBottom = bottom;
            return;
        }
        var length = state$2.length;
        var last = length > 1 ? state$2[length - 2] : null;
        if (last && similar(last, current)) {
            state$2.pop();
        }
        state$2.push(current);
        clearTimeout(timeout$3);
        timeout$3 = setTimeout(process$3, 500 /* Setting.LookAhead */, 10 /* Event.Scroll */);
    }
    function getPositionNode(x, y) {
        var _a, _b;
        var node;
        if ("caretPositionFromPoint" in document) {
            node = (_a = document.caretPositionFromPoint(x, y)) === null || _a === void 0 ? void 0 : _a.offsetNode;
        }
        else if ("caretRangeFromPoint" in document) {
            node = (_b = document.caretRangeFromPoint(x, y)) === null || _b === void 0 ? void 0 : _b.startContainer;
        }
        if (!node) {
            node = document.elementFromPoint(x, y);
        }
        if (node && node.nodeType === Node.TEXT_NODE) {
            node = node.parentNode;
        }
        return node;
    }
    function reset$a() {
        state$2 = [];
        initialTop = null;
        initialBottom = null;
    }
    function process$3(event) {
        schedule$1(encode$3.bind(this, event));
    }
    function similar(last, current) {
        var dx = last.data.x - current.data.x;
        var dy = last.data.y - current.data.y;
        return (dx * dx + dy * dy < 20 /* Setting.Distance */ * 20 /* Setting.Distance */) && (current.time - last.time < 25 /* Setting.Interval */);
    }
    function compute$6() {
        var _a, _b;
        if (initialTop) {
            var top_1 = metadata$2(initialTop, null);
            log(31 /* Dimension.InitialScrollTop */, (_a = top_1 === null || top_1 === void 0 ? void 0 : top_1.hash) === null || _a === void 0 ? void 0 : _a.join("." /* Constant.Dot */));
        }
        if (initialBottom) {
            var bottom = metadata$2(initialBottom, null);
            log(32 /* Dimension.InitialScrollBottom */, (_b = bottom === null || bottom === void 0 ? void 0 : bottom.hash) === null || _b === void 0 ? void 0 : _b.join("." /* Constant.Dot */));
        }
    }
    function stop$l() {
        clearTimeout(timeout$3);
        state$2 = [];
        initialTop = null;
        initialBottom = null;
    }

    var data$a = null;
    var previous = null;
    var timeout$2 = null;
    function start$m() {
        reset$9();
    }
    function observe$5(root) {
        bind(root, "selectstart", recompute$3.bind(this, root), true);
        bind(root, "selectionchange", recompute$3.bind(this, root), true);
    }
    function recompute$3(root) {
        var doc = root.nodeType === Node.DOCUMENT_NODE ? root : document;
        var current = doc.getSelection();
        // Bail out if we don't have a valid selection
        if (current === null) {
            return;
        }
        // Bail out if we got a valid selection but not valid nodes
        // In Edge, selectionchange gets fired even on interactions like right clicks and
        // can result in null anchorNode and focusNode if there was no previous selection on page
        // Also, ignore any selections that start and end at the exact same point
        if ((current.anchorNode === null && current.focusNode === null) ||
            (current.anchorNode === current.focusNode && current.anchorOffset === current.focusOffset)) {
            return;
        }
        var startNode = data$a.start ? data$a.start : null;
        if (previous !== null && data$a.start !== null && startNode !== current.anchorNode) {
            clearTimeout(timeout$2);
            process$2(21 /* Event.Selection */);
        }
        data$a = {
            start: current.anchorNode,
            startOffset: current.anchorOffset,
            end: current.focusNode,
            endOffset: current.focusOffset
        };
        previous = current;
        clearTimeout(timeout$2);
        timeout$2 = setTimeout(process$2, 500 /* Setting.LookAhead */, 21 /* Event.Selection */);
    }
    function process$2(event) {
        schedule$1(encode$3.bind(this, event));
    }
    function reset$9() {
        previous = null;
        data$a = { start: 0, startOffset: 0, end: 0, endOffset: 0 };
    }
    function stop$k() {
        reset$9();
        clearTimeout(timeout$2);
    }

    var state$1 = [];
    function start$l() {
        reset$8();
    }
    function observe$4(root) {
        bind(root, "submit", recompute$2, true);
    }
    function recompute$2(evt) {
        state$1.push({ time: time(evt), event: 39 /* Event.Submit */, data: { target: target(evt) } });
        schedule$1(encode$3.bind(this, 39 /* Event.Submit */));
    }
    function reset$8() {
        state$1 = [];
    }
    function stop$j() {
        reset$8();
    }

    var data$9;
    function start$k() {
        bind(window, "pagehide", recompute$1);
    }
    function recompute$1(evt) {
        data$9 = { name: evt.type };
        encode$3(26 /* Event.Unload */, time(evt));
        stop();
    }
    function reset$7() {
        data$9 = null;
    }
    function stop$i() {
        reset$7();
    }

    var data$8;
    function start$j() {
        bind(document, "visibilitychange", recompute);
        recompute();
    }
    function recompute(evt) {
        if (evt === void 0) { evt = null; }
        data$8 = { visible: "visibilityState" in document ? document.visibilityState : "default" };
        encode$3(28 /* Event.Visibility */, time(evt));
    }
    function reset$6() {
        data$8 = null;
    }
    function stop$h() {
        reset$6();
    }

    function start$i() {
        start$g();
        start$s();
        start$r();
        start$p();
        start$q();
        start$o();
        start$j();
        start$n();
        start$m();
        start$t();
        start$l();
        start$k();
    }
    function stop$g() {
        stop$e();
        stop$q();
        stop$p();
        stop$n();
        stop$o();
        stop$m();
        stop$h();
        stop$l();
        stop$k();
        stop$r();
        stop$j();
        stop$i();
    }
    function observe$3(root) {
        observe$6(root);
        // Only monitor following interactions if the root node is a document
        // In case of shadow DOM, following events automatically bubble up to the parent document.
        if (root.nodeType === Node.DOCUMENT_NODE) {
            observe$a(root);
            observe$9(root);
            observe$7(root);
            observe$8(root);
            observe$5(root);
            observe$b(root);
            observe$4(root);
        }
    }

    var interaction = /*#__PURE__*/Object.freeze({
        __proto__: null,
        observe: observe$3,
        start: start$i,
        stop: stop$g
    });

    var digitsRegex = /[^0-9\.]/g;
    /* JSON+LD (Linked Data) Recursive Parser */
    function ld(json) {
        for (var _i = 0, _a = Object.keys(json); _i < _a.length; _i++) {
            var key = _a[_i];
            var value = json[key];
            if (key === "@type" /* JsonLD.Type */ && typeof value === "string") {
                value = value.toLowerCase();
                /* Normalizations */
                value = value.indexOf("article" /* JsonLD.Article */) >= 0 || value.indexOf("posting" /* JsonLD.Posting */) >= 0 ? "article" /* JsonLD.Article */ : value;
                switch (value) {
                    case "article" /* JsonLD.Article */:
                    case "recipe" /* JsonLD.Recipe */:
                        log(5 /* Dimension.SchemaType */, json[key]);
                        log(8 /* Dimension.AuthorName */, json["creator" /* JsonLD.Creator */]);
                        log(18 /* Dimension.Headline */, json["headline" /* JsonLD.Headline */]);
                        break;
                    case "product" /* JsonLD.Product */:
                        log(5 /* Dimension.SchemaType */, json[key]);
                        log(10 /* Dimension.ProductName */, json["name" /* JsonLD.Name */]);
                        log(12 /* Dimension.ProductSku */, json["sku" /* JsonLD.Sku */]);
                        if (json["brand" /* JsonLD.Brand */]) {
                            log(6 /* Dimension.ProductBrand */, json["brand" /* JsonLD.Brand */]["name" /* JsonLD.Name */]);
                        }
                        break;
                    case "aggregaterating" /* JsonLD.AggregateRating */:
                        if (json["ratingValue" /* JsonLD.RatingValue */]) {
                            max(11 /* Metric.RatingValue */, num$1(json["ratingValue" /* JsonLD.RatingValue */], 100 /* Setting.RatingScale */));
                            max(18 /* Metric.BestRating */, num$1(json["bestRating" /* JsonLD.BestRating */]));
                            max(19 /* Metric.WorstRating */, num$1(json["worstRating" /* JsonLD.WorstRating */]));
                        }
                        max(12 /* Metric.RatingCount */, num$1(json["ratingCount" /* JsonLD.RatingCount */]));
                        max(17 /* Metric.ReviewCount */, num$1(json["reviewCount" /* JsonLD.ReviewCount */]));
                        break;
                    case "person" /* JsonLD.Author */:
                        log(8 /* Dimension.AuthorName */, json["name" /* JsonLD.Name */]);
                        break;
                    case "offer" /* JsonLD.Offer */:
                        log(7 /* Dimension.ProductAvailability */, json["availability" /* JsonLD.Availability */]);
                        log(14 /* Dimension.ProductCondition */, json["itemCondition" /* JsonLD.ItemCondition */]);
                        log(13 /* Dimension.ProductCurrency */, json["priceCurrency" /* JsonLD.PriceCurrency */]);
                        log(12 /* Dimension.ProductSku */, json["sku" /* JsonLD.Sku */]);
                        max(13 /* Metric.ProductPrice */, num$1(json["price" /* JsonLD.Price */]));
                        break;
                    case "brand" /* JsonLD.Brand */:
                        log(6 /* Dimension.ProductBrand */, json["name" /* JsonLD.Name */]);
                        break;
                }
            }
            // Continue parsing nested objects
            if (value !== null && typeof (value) === "object" /* Constant.Object */) {
                ld(value);
            }
        }
    }
    function num$1(input, scale) {
        if (scale === void 0) { scale = 1; }
        if (input !== null) {
            switch (typeof input) {
                case "number" /* Constant.Number */: return Math.round(input * scale);
                case "string" /* Constant.String */: return Math.round(parseFloat(input.replace(digitsRegex, "" /* Constant.Empty */)) * scale);
            }
        }
        return null;
    }

    var IGNORE_ATTRIBUTES = ["title", "alt", "onload", "onfocus", "onerror", "data-drupal-form-submit-last", "aria-label"];
    var newlineRegex = /[\r\n]+/g;
    function processNode (node, source, timestamp) {
        var _a;
        var child = null;
        // Do not track this change if we are attempting to remove a node before discovering it
        if (source === 2 /* Source.ChildListRemove */ && has(node) === false) {
            return child;
        }
        // Special handling for text nodes that belong to style nodes
        if (source !== 0 /* Source.Discover */ &&
            node.nodeType === Node.TEXT_NODE &&
            node.parentElement &&
            node.parentElement.tagName === "STYLE") {
            node = node.parentNode;
        }
        var add = has(node) === false;
        var call = add ? "add" : "update";
        var parent = node.parentElement ? node.parentElement : null;
        var insideFrame = node.ownerDocument !== document;
        switch (node.nodeType) {
            case Node.DOCUMENT_TYPE_NODE:
                parent = insideFrame && node.parentNode ? iframe(node.parentNode) : parent;
                var docTypePrefix = insideFrame ? "iframe:" /* Constant.IFramePrefix */ : "" /* Constant.Empty */;
                var doctype = node;
                var docAttributes = { name: doctype.name, publicId: doctype.publicId, systemId: doctype.systemId };
                var docData = { tag: docTypePrefix + "*D" /* Constant.DocumentTag */, attributes: docAttributes };
                dom[call](node, parent, docData, source);
                break;
            case Node.DOCUMENT_NODE:
                // We check for regions in the beginning when discovering document and
                // later whenever there are new additions or modifications to DOM (mutations)
                if (node === document)
                    parse$1(document);
                checkDocumentStyles(node);
                observe$2(node);
                break;
            case Node.DOCUMENT_FRAGMENT_NODE:
                var shadowRoot = node;
                if (shadowRoot.host) {
                    parse$1(shadowRoot);
                    var type = typeof (shadowRoot.constructor);
                    if (type === "function" /* Constant.Function */ && shadowRoot.constructor.toString().indexOf("[native code]" /* Constant.NativeCode */) >= 0) {
                        observe$2(shadowRoot);
                        // See: https://wicg.github.io/construct-stylesheets/ for more details on adoptedStyleSheets.
                        // At the moment, we are only able to capture "open" shadow DOM nodes. If they are closed, they are not accessible.
                        // In future we may decide to proxy "attachShadow" call to gain access, but at the moment, we don't want to
                        // cause any unintended side effect to the page. We will re-evaluate after we gather more real world data on this.
                        var style = "" /* Constant.Empty */;
                        var fragmentData = { tag: "*S" /* Constant.ShadowDomTag */, attributes: { style: style } };
                        dom[call](node, shadowRoot.host, fragmentData, source);
                    }
                    else {
                        // If the browser doesn't support shadow DOM natively, we detect that, and send appropriate tag back.
                        // The differentiation is important because we don't have to observe pollyfill shadow DOM nodes,
                        // the same way we observe real shadow DOM nodes (encapsulation provided by the browser).
                        dom[call](node, shadowRoot.host, { tag: "*P" /* Constant.PolyfillShadowDomTag */, attributes: {} }, source);
                    }
                    checkDocumentStyles(node);
                }
                break;
            case Node.TEXT_NODE:
                // In IE11 TEXT_NODE doesn't expose a valid parentElement property. Instead we need to lookup parentNode property.
                parent = parent ? parent : node.parentNode;
                // Account for this text node only if we are tracking the parent node
                // We do not wish to track text nodes for ignored parent nodes, like script tags
                // Also, we do not track text nodes for STYLE tags
                // The only exception is when we receive a mutation to remove the text node, in that case
                // parent will be null, but we can still process the node by checking it's an update call.
                if (call === "update" || (parent && has(parent) && parent.tagName !== "STYLE" && parent.tagName !== "NOSCRIPT")) {
                    var textData = { tag: "*T" /* Constant.TextTag */, value: node.nodeValue };
                    dom[call](node, parent, textData, source);
                }
                break;
            case Node.ELEMENT_NODE:
                var element = node;
                var tag = element.tagName;
                var attributes = getAttributes(element);
                // In some cases, external libraries like vue-fragment, can modify parentNode property to not be in sync with the DOM
                // For correctness, we first look at parentElement and if it not present then fall back to using parentNode
                parent = node.parentElement ? node.parentElement : (node.parentNode ? node.parentNode : null);
                // If we encounter a node that is part of SVG namespace, prefix the tag with SVG_PREFIX
                if (element.namespaceURI === "http://www.w3.org/2000/svg" /* Constant.SvgNamespace */) {
                    tag = "svg:" /* Constant.SvgPrefix */ + tag;
                }
                switch (tag) {
                    case "HTML":
                        parent = insideFrame && parent ? iframe(parent) : null;
                        var htmlPrefix = insideFrame ? "iframe:" /* Constant.IFramePrefix */ : "" /* Constant.Empty */;
                        var htmlData = { tag: htmlPrefix + tag, attributes: attributes };
                        dom[call](node, parent, htmlData, source);
                        break;
                    case "SCRIPT":
                        if ("type" /* Constant.Type */ in attributes && attributes["type" /* Constant.Type */] === "application/ld+json" /* Constant.JsonLD */) {
                            try {
                                ld(JSON.parse(element.text.replace(newlineRegex, "" /* Constant.Empty */)));
                            }
                            catch ( /* do nothing */_b) { /* do nothing */ }
                        }
                        break;
                    case "NOSCRIPT":
                        // keeping the noscript tag but ignoring its contents. Some HTML markup relies on having these tags
                        // to maintain parity with the original css view, but we don't want to execute any noscript in Clarity
                        var noscriptData = { tag: tag, attributes: {}, value: '' };
                        dom[call](node, parent, noscriptData, source);
                        break;
                    case "META":
                        var key = ("property" /* Constant.Property */ in attributes ?
                            "property" /* Constant.Property */ :
                            ("name" /* Constant.Name */ in attributes ? "name" /* Constant.Name */ : null));
                        if (key && "content" /* Constant.Content */ in attributes) {
                            var content = attributes["content" /* Constant.Content */];
                            switch (attributes[key]) {
                                case "og:title" /* Constant.ogTitle */:
                                    log(20 /* Dimension.MetaTitle */, content);
                                    break;
                                case "og:type" /* Constant.ogType */:
                                    log(19 /* Dimension.MetaType */, content);
                                    break;
                                case "generator" /* Constant.Generator */:
                                    log(21 /* Dimension.Generator */, content);
                                    break;
                            }
                        }
                        break;
                    case "HEAD":
                        var head = { tag: tag, attributes: attributes };
                        var l = insideFrame && ((_a = node.ownerDocument) === null || _a === void 0 ? void 0 : _a.location) ? node.ownerDocument.location : location;
                        head.attributes["*B" /* Constant.Base */] = l.protocol + "//" + l.host + l.pathname;
                        dom[call](node, parent, head, source);
                        break;
                    case "BASE":
                        // Override the auto detected base path to explicit value specified in this tag
                        var baseHead = get(node.parentElement);
                        if (baseHead) {
                            // We create "a" element so we can generate protocol and hostname for relative paths like "/path/"
                            var a = document.createElement("a");
                            a.href = attributes["href"];
                            baseHead.data.attributes["*B" /* Constant.Base */] = a.protocol + "//" + a.host + a.pathname;
                        }
                        break;
                    case "STYLE":
                        var styleData = { tag: tag, attributes: attributes, value: getStyleValue(element) };
                        dom[call](node, parent, styleData, source);
                        break;
                    case "IFRAME":
                        var iframe$1 = node;
                        var frameData = { tag: tag, attributes: attributes };
                        if (sameorigin(iframe$1)) {
                            monitor(iframe$1);
                            frameData.attributes["*O" /* Constant.SameOrigin */] = "true";
                            if (iframe$1.contentDocument && iframe$1.contentWindow && iframe$1.contentDocument.readyState !== "loading") {
                                child = iframe$1.contentDocument;
                            }
                        }
                        dom[call](node, parent, frameData, source);
                        break;
                    case "LINK":
                        // electron stylesheets reference the local file system - translating those
                        // to inline styles so playback can work
                        if (electron && attributes['rel'] === "stylesheet" /* Constant.StyleSheet */) {
                            for (var styleSheetIndex in Object.keys(document.styleSheets)) {
                                var currentStyleSheet = document.styleSheets[styleSheetIndex];
                                if (currentStyleSheet.ownerNode == element) {
                                    var syntheticStyleData = { tag: "STYLE", attributes: attributes, value: getCssRules(currentStyleSheet) };
                                    dom[call](node, parent, syntheticStyleData, source);
                                    break;
                                }
                            }
                            break;
                        }
                        // for links that aren't electron style sheets we can process them normally
                        var linkData = { tag: tag, attributes: attributes };
                        dom[call](node, parent, linkData, source);
                        break;
                    case "VIDEO":
                    case "AUDIO":
                    case "SOURCE":
                        // Ignoring any base64 src attribute for media elements to prevent big unused tokens to be sent and shock the network
                        if ("src" /* Constant.Src */ in attributes && attributes["src" /* Constant.Src */].startsWith("data:")) {
                            attributes["src" /* Constant.Src */] = "";
                        }
                        var mediaTag = { tag: tag, attributes: attributes };
                        dom[call](node, parent, mediaTag, source);
                        break;
                    default:
                        var data = { tag: tag, attributes: attributes };
                        if (element.shadowRoot) {
                            child = element.shadowRoot;
                        }
                        dom[call](node, parent, data, source);
                        break;
                }
                break;
        }
        return child;
    }
    function observe$2(root) {
        if (has(root)) {
            return;
        }
        observe$1(root); // Observe mutations for this root node
        observe$3(root); // Observe interactions for this root node
    }
    function getStyleValue(style) {
        // Call trim on the text content to ensure we do not process white spaces ( , \n, \r\n, \t, etc.)
        // Also, check if stylesheet has any data-* attribute, if so process rules instead of looking up text
        var value = style.textContent ? style.textContent.trim() : "" /* Constant.Empty */;
        var dataset = style.dataset ? Object.keys(style.dataset).length : 0;
        if (value.length === 0 || dataset > 0) {
            value = getCssRules(style.sheet);
        }
        return value;
    }
    function getCssRules(sheet) {
        var value = "" /* Constant.Empty */;
        var cssRules = null;
        // Firefox throws a SecurityError when trying to access cssRules of a stylesheet from a different domain
        try {
            cssRules = sheet ? sheet.cssRules : [];
        }
        catch (e) {
            log$1(1 /* Code.CssRules */, 1 /* Severity.Warning */, e ? e.name : null);
            if (e && e.name !== "SecurityError") {
                throw e;
            }
        }
        if (cssRules !== null) {
            for (var i = 0; i < cssRules.length; i++) {
                value += cssRules[i].cssText;
            }
        }
        return value;
    }
    function getAttributes(element) {
        var output = {};
        var attributes = element.attributes;
        if (attributes && attributes.length > 0) {
            for (var i = 0; i < attributes.length; i++) {
                var name_1 = attributes[i].name;
                if (IGNORE_ATTRIBUTES.indexOf(name_1) < 0) {
                    output[name_1] = attributes[i].value;
                }
            }
        }
        // For INPUT tags read the dynamic "value" property if an explicit "value" attribute is not set
        if (element.tagName === "INPUT" /* Constant.InputTag */ && !("value" /* Constant.Value */ in output) && element.value) {
            output["value" /* Constant.Value */] = element.value;
        }
        return output;
    }

    function traverse (root, timer, source, timestamp) {
        return __awaiter(this, void 0, void 0, function () {
            var queue, entry, next, state, subnode;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queue = [root];
                        _a.label = 1;
                    case 1:
                        if (!(queue.length > 0)) return [3 /*break*/, 4];
                        entry = queue.shift();
                        next = entry.firstChild;
                        while (next) {
                            queue.push(next);
                            next = next.nextSibling;
                        }
                        state = state$a(timer);
                        if (!(state === 0 /* Task.Wait */)) return [3 /*break*/, 3];
                        return [4 /*yield*/, suspend$1(timer)];
                    case 2:
                        state = _a.sent();
                        _a.label = 3;
                    case 3:
                        if (state === 2 /* Task.Stop */) {
                            return [3 /*break*/, 4];
                        }
                        subnode = processNode(entry, source);
                        if (subnode) {
                            queue.push(subnode);
                        }
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }

    var observers = [];
    var mutations = [];
    var insertRule = null;
    var deleteRule = null;
    var attachShadow = null;
    var queue$1 = [];
    var timeout$1 = null;
    var activePeriod = null;
    var history$4 = {};
    function start$h() {
        observers = [];
        queue$1 = [];
        timeout$1 = null;
        activePeriod = 0;
        history$4 = {};
        // Some popular open source libraries, like styled-components, optimize performance
        // by injecting CSS using insertRule API vs. appending text node. A side effect of
        // using javascript API is that it doesn't trigger DOM mutation and therefore we
        // need to override the insertRule API and listen for changes manually.
        if (insertRule === null) {
            insertRule = CSSStyleSheet.prototype.insertRule;
            CSSStyleSheet.prototype.insertRule = function () {
                if (active()) {
                    schedule(this.ownerNode);
                }
                return insertRule.apply(this, arguments);
            };
        }
        if (deleteRule === null) {
            deleteRule = CSSStyleSheet.prototype.deleteRule;
            CSSStyleSheet.prototype.deleteRule = function () {
                if (active()) {
                    schedule(this.ownerNode);
                }
                return deleteRule.apply(this, arguments);
            };
        }
        // Add a hook to attachShadow API calls
        // In case we are unable to add a hook and browser throws an exception,
        // reset attachShadow variable and resume processing like before
        if (attachShadow === null) {
            attachShadow = Element.prototype.attachShadow;
            try {
                Element.prototype.attachShadow = function () {
                    if (active()) {
                        return schedule(attachShadow.apply(this, arguments));
                    }
                    else {
                        return attachShadow.apply(this, arguments);
                    }
                };
            }
            catch (_a) {
                attachShadow = null;
            }
        }
    }
    function observe$1(node) {
        // Create a new observer for every time a new DOM tree (e.g. root document or shadowdom root) is discovered on the page
        // In the case of shadow dom, any mutations that happen within the shadow dom are not bubbled up to the host document
        // For this reason, we need to wire up mutations every time we see a new shadow dom.
        // Also, wrap it inside a try / catch. In certain browsers (e.g. legacy Edge), observer on shadow dom can throw errors
        try {
            var m = api("MutationObserver" /* Constant.MutationObserver */);
            var observer = m in window ? new window[m](measure(handle$1)) : null;
            if (observer) {
                observer.observe(node, { attributes: true, childList: true, characterData: true, subtree: true });
                observers.push(observer);
            }
        }
        catch (e) {
            log$1(2 /* Code.MutationObserver */, 0 /* Severity.Info */, e ? e.name : null);
        }
    }
    function monitor(frame) {
        // Bind to iframe's onload event so we get notified anytime there's an update to iframe content.
        // This includes cases where iframe location is updated without explicitly updating src attribute
        // E.g. iframe.contentWindow.location.href = "new-location";
        if (has(frame) === false) {
            bind(frame, "load" /* Constant.LoadEvent */, generate.bind(this, frame, "childList" /* Constant.ChildList */), true);
        }
    }
    function stop$f() {
        for (var _i = 0, observers_1 = observers; _i < observers_1.length; _i++) {
            var observer = observers_1[_i];
            if (observer) {
                observer.disconnect();
            }
        }
        observers = [];
        history$4 = {};
        mutations = [];
        queue$1 = [];
        activePeriod = 0;
        timeout$1 = null;
    }
    function active$2() {
        activePeriod = time() + 3000 /* Setting.MutationActivePeriod */;
    }
    function handle$1(m) {
        // Queue up mutation records for asynchronous processing
        var now = time();
        track$7(6 /* Event.Mutation */, now);
        mutations.push({ time: now, mutations: m });
        schedule$1(process$1, 1 /* Priority.High */).then(function () {
            setTimeout(compute$9);
            measure(compute$7)();
        });
    }
    function process$1() {
        return __awaiter(this, void 0, void 0, function () {
            var timer, record, instance, _i, _a, mutation, state, target, type, value;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        timer = { id: id(), cost: 3 /* Metric.LayoutCost */ };
                        start$y(timer);
                        _b.label = 1;
                    case 1:
                        if (!(mutations.length > 0)) return [3 /*break*/, 8];
                        record = mutations.shift();
                        instance = time();
                        _i = 0, _a = record.mutations;
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        mutation = _a[_i];
                        state = state$a(timer);
                        if (!(state === 0 /* Task.Wait */)) return [3 /*break*/, 4];
                        return [4 /*yield*/, suspend$1(timer)];
                    case 3:
                        state = _b.sent();
                        _b.label = 4;
                    case 4:
                        if (state === 2 /* Task.Stop */) {
                            return [3 /*break*/, 6];
                        }
                        target = mutation.target;
                        type = config$1.throttleDom ? track$3(mutation, timer, instance, record.time) : mutation.type;
                        if (type && target && target.ownerDocument) {
                            parse$1(target.ownerDocument);
                        }
                        if (type && target && target.nodeType == Node.DOCUMENT_FRAGMENT_NODE && target.host) {
                            parse$1(target);
                        }
                        switch (type) {
                            case "attributes" /* Constant.Attributes */:
                                processNode(target, 3 /* Source.Attributes */, record.time);
                                break;
                            case "characterData" /* Constant.CharacterData */:
                                processNode(target, 4 /* Source.CharacterData */, record.time);
                                break;
                            case "childList" /* Constant.ChildList */:
                                processNodeList(mutation.addedNodes, 1 /* Source.ChildListAdd */, timer, record.time);
                                processNodeList(mutation.removedNodes, 2 /* Source.ChildListRemove */, timer, record.time);
                                break;
                            case "suspend" /* Constant.Suspend */:
                                value = get(target);
                                if (value) {
                                    value.metadata.suspend = true;
                                }
                                break;
                        }
                        _b.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 2];
                    case 6: return [4 /*yield*/, encode$4(6 /* Event.Mutation */, timer, record.time)];
                    case 7:
                        _b.sent();
                        return [3 /*break*/, 1];
                    case 8:
                        stop$w(timer);
                        return [2 /*return*/];
                }
            });
        });
    }
    function track$3(m, timer, instance, timestamp) {
        var value = m.target ? get(m.target.parentNode) : null;
        // Check if the parent is already discovered and that the parent is not the document root
        if (value && value.data.tag !== "HTML" /* Constant.HTML */) {
            // calculate inactive period based on the timestamp of the mutation not when the mutation is processed
            var inactive = timestamp > activePeriod;
            var target = get(m.target);
            var element = target && target.selector ? target.selector.join() : m.target.nodeName;
            var parent_1 = value.selector ? value.selector.join() : "" /* Constant.Empty */;
            // We use selector, instead of id, to determine the key (signature for the mutation) because in some cases
            // repeated mutations can cause elements to be destroyed and then recreated as new DOM nodes
            // In those cases, IDs will change however the selector (which is relative to DOM xPath) remains the same
            var key = [parent_1, element, m.attributeName, names(m.addedNodes), names(m.removedNodes)].join();
            // Initialize an entry if it doesn't already exist
            history$4[key] = key in history$4 ? history$4[key] : [0, instance];
            var h = history$4[key];
            // Lookup any pending nodes queued up for removal, and process them now if we suspended a mutation before
            if (inactive === false && h[0] >= 10 /* Setting.MutationSuspendThreshold */) {
                processNodeList(h[2], 2 /* Source.ChildListRemove */, timer);
            }
            // Update the counter
            h[0] = inactive ? (h[1] === instance ? h[0] : h[0] + 1) : 1;
            h[1] = instance;
            // Return updated mutation type based on if we have already hit the threshold or not
            if (h[0] === 10 /* Setting.MutationSuspendThreshold */) {
                // Store a reference to removedNodes so we can process them later
                // when we resume mutations again on user interactions
                h[2] = m.removedNodes;
                return "suspend" /* Constant.Suspend */;
            }
            else if (h[0] > 10 /* Setting.MutationSuspendThreshold */) {
                return "" /* Constant.Empty */;
            }
        }
        return m.type;
    }
    function names(nodes) {
        var output = [];
        for (var i = 0; nodes && i < nodes.length; i++) {
            output.push(nodes[i].nodeName);
        }
        return output.join();
    }
    function processNodeList(list, source, timer, timestamp) {
        return __awaiter(this, void 0, void 0, function () {
            var length, i, state;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        length = list ? list.length : 0;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < length)) return [3 /*break*/, 6];
                        if (!(source === 1 /* Source.ChildListAdd */)) return [3 /*break*/, 2];
                        traverse(list[i], timer, source);
                        return [3 /*break*/, 5];
                    case 2:
                        state = state$a(timer);
                        if (!(state === 0 /* Task.Wait */)) return [3 /*break*/, 4];
                        return [4 /*yield*/, suspend$1(timer)];
                    case 3:
                        state = _a.sent();
                        _a.label = 4;
                    case 4:
                        if (state === 2 /* Task.Stop */) {
                            return [3 /*break*/, 6];
                        }
                        processNode(list[i], source);
                        _a.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
    function schedule(node) {
        // Only schedule manual trigger for this node if it's not already in the queue
        if (queue$1.indexOf(node) < 0) {
            queue$1.push(node);
        }
        // Cancel any previous trigger before scheduling a new one.
        // It's common for a webpage to call multiple synchronous "insertRule" / "deleteRule" calls.
        // And in those cases we do not wish to monitor changes multiple times for the same node.
        if (timeout$1) {
            clearTimeout(timeout$1);
        }
        timeout$1 = setTimeout(function () { trigger$2(); }, 33 /* Setting.LookAhead */);
        return node;
    }
    function trigger$2() {
        for (var _i = 0, queue_1 = queue$1; _i < queue_1.length; _i++) {
            var node = queue_1[_i];
            // Generate a mutation for this node only if it still exists
            if (node) {
                var shadowRoot = node.nodeType === Node.DOCUMENT_FRAGMENT_NODE;
                // Skip re-processing shadowRoot if it was already discovered
                if (shadowRoot && has(node)) {
                    continue;
                }
                generate(node, shadowRoot ? "childList" /* Constant.ChildList */ : "characterData" /* Constant.CharacterData */);
            }
        }
        queue$1 = [];
    }
    function generate(target, type) {
        measure(handle$1)([{
                addedNodes: [target],
                attributeName: null,
                attributeNamespace: null,
                nextSibling: null,
                oldValue: null,
                previousSibling: null,
                removedNodes: [],
                target: target,
                type: type
            }]);
    }

    function target(evt) {
        var path = evt.composed && evt.composedPath ? evt.composedPath() : null;
        var node = (path && path.length > 0 ? path[0] : evt.target);
        active$2(); // Mark active periods of time so mutations can continue uninterrupted
        return node.nodeType === Node.DOCUMENT_NODE ? node.documentElement : node;
    }
    function metadata$2(node, event, text) {
        if (text === void 0) { text = null; }
        // If the node is null, we return a reserved value for id: 0. Valid assignment of id begins from 1+.
        var output = { id: 0, hash: null, privacy: 2 /* Privacy.Text */, node: node };
        if (node) {
            var value = get(node);
            if (value !== null) {
                var metadata_1 = value.metadata;
                output.id = value.id;
                output.hash = value.hash;
                output.privacy = metadata_1.privacy;
                if (value.region) {
                    track$4(value.region, event);
                }
                if (metadata_1.fraud) {
                    check$4(metadata_1.fraud, value.id, text || value.data.value);
                }
            }
        }
        return output;
    }

    function encode$3 (type, ts) {
        if (ts === void 0) { ts = null; }
        return __awaiter(this, void 0, void 0, function () {
            var t, tokens, _i, _a, entry, pTarget, _b, _c, entry, cTarget, cHash, _d, _e, entry, target, r, u, _f, _g, entry, iTarget, s, startTarget, endTarget, _h, _j, entry, sTarget, top_1, bottom, sTopHash, sBottomHash, _k, _l, entry, target, _m, _o, entry, target, _p, _q, entry, v;
            return __generator(this, function (_r) {
                t = ts || time();
                tokens = [t, type];
                switch (type) {
                    case 13 /* Event.MouseDown */:
                    case 14 /* Event.MouseUp */:
                    case 12 /* Event.MouseMove */:
                    case 15 /* Event.MouseWheel */:
                    case 16 /* Event.DoubleClick */:
                    case 17 /* Event.TouchStart */:
                    case 18 /* Event.TouchEnd */:
                    case 19 /* Event.TouchMove */:
                    case 20 /* Event.TouchCancel */:
                        for (_i = 0, _a = state$3; _i < _a.length; _i++) {
                            entry = _a[_i];
                            pTarget = metadata$2(entry.data.target, entry.event);
                            if (pTarget.id > 0) {
                                tokens = [entry.time, entry.event];
                                tokens.push(pTarget.id);
                                tokens.push(entry.data.x);
                                tokens.push(entry.data.y);
                                queue(tokens);
                                track$8(entry.event, entry.data.x, entry.data.y);
                            }
                        }
                        reset$c();
                        break;
                    case 9 /* Event.Click */:
                        for (_b = 0, _c = state$6; _b < _c.length; _b++) {
                            entry = _c[_b];
                            cTarget = metadata$2(entry.data.target, entry.event, entry.data.text);
                            tokens = [entry.time, entry.event];
                            cHash = cTarget.hash ? cTarget.hash.join("." /* Constant.Dot */) : "" /* Constant.Empty */;
                            tokens.push(cTarget.id);
                            tokens.push(entry.data.x);
                            tokens.push(entry.data.y);
                            tokens.push(entry.data.eX);
                            tokens.push(entry.data.eY);
                            tokens.push(entry.data.button);
                            tokens.push(entry.data.reaction);
                            tokens.push(entry.data.context);
                            tokens.push(text$1(entry.data.text, "click", cTarget.privacy));
                            tokens.push(url$1(entry.data.link));
                            tokens.push(cHash);
                            tokens.push(entry.data.trust);
                            queue(tokens);
                            track$2(entry.time, entry.event, cHash, entry.data.x, entry.data.y, entry.data.reaction, entry.data.context);
                        }
                        reset$f();
                        break;
                    case 38 /* Event.Clipboard */:
                        for (_d = 0, _e = state$5; _d < _e.length; _d++) {
                            entry = _e[_d];
                            tokens = [entry.time, entry.event];
                            target = metadata$2(entry.data.target, entry.event);
                            if (target.id > 0) {
                                tokens.push(target.id);
                                tokens.push(entry.data.action);
                                queue(tokens);
                            }
                        }
                        reset$e();
                        break;
                    case 11 /* Event.Resize */:
                        r = data$b;
                        tokens.push(r.width);
                        tokens.push(r.height);
                        track$8(type, r.width, r.height);
                        reset$b();
                        queue(tokens);
                        break;
                    case 26 /* Event.Unload */:
                        u = data$9;
                        tokens.push(u.name);
                        reset$7();
                        queue(tokens);
                        break;
                    case 27 /* Event.Input */:
                        for (_f = 0, _g = state$4; _f < _g.length; _f++) {
                            entry = _g[_f];
                            iTarget = metadata$2(entry.data.target, entry.event, entry.data.value);
                            tokens = [entry.time, entry.event];
                            tokens.push(iTarget.id);
                            tokens.push(text$1(entry.data.value, "input", iTarget.privacy));
                            queue(tokens);
                        }
                        reset$d();
                        break;
                    case 21 /* Event.Selection */:
                        s = data$a;
                        if (s) {
                            startTarget = metadata$2(s.start, type);
                            endTarget = metadata$2(s.end, type);
                            tokens.push(startTarget.id);
                            tokens.push(s.startOffset);
                            tokens.push(endTarget.id);
                            tokens.push(s.endOffset);
                            reset$9();
                            queue(tokens);
                        }
                        break;
                    case 10 /* Event.Scroll */:
                        for (_h = 0, _j = state$2; _h < _j.length; _h++) {
                            entry = _j[_h];
                            sTarget = metadata$2(entry.data.target, entry.event);
                            top_1 = metadata$2(entry.data.top, entry.event);
                            bottom = metadata$2(entry.data.bottom, entry.event);
                            sTopHash = (top_1 === null || top_1 === void 0 ? void 0 : top_1.hash) ? top_1.hash.join("." /* Constant.Dot */) : "" /* Constant.Empty */;
                            sBottomHash = (bottom === null || bottom === void 0 ? void 0 : bottom.hash) ? bottom.hash.join("." /* Constant.Dot */) : "" /* Constant.Empty */;
                            if (sTarget.id > 0) {
                                tokens = [entry.time, entry.event];
                                tokens.push(sTarget.id);
                                tokens.push(entry.data.x);
                                tokens.push(entry.data.y);
                                tokens.push(sTopHash);
                                tokens.push(sBottomHash);
                                queue(tokens);
                                track$8(entry.event, entry.data.x, entry.data.y, entry.time);
                            }
                        }
                        reset$a();
                        break;
                    case 42 /* Event.Change */:
                        for (_k = 0, _l = state$7; _k < _l.length; _k++) {
                            entry = _l[_k];
                            tokens = [entry.time, entry.event];
                            target = metadata$2(entry.data.target, entry.event);
                            if (target.id > 0) {
                                tokens = [entry.time, entry.event];
                                tokens.push(target.id);
                                tokens.push(entry.data.type);
                                tokens.push(text$1(entry.data.value, "change", target.privacy));
                                tokens.push(text$1(entry.data.checksum, "checksum", target.privacy));
                                queue(tokens);
                            }
                        }
                        reset$g();
                        break;
                    case 39 /* Event.Submit */:
                        for (_m = 0, _o = state$1; _m < _o.length; _m++) {
                            entry = _o[_m];
                            tokens = [entry.time, entry.event];
                            target = metadata$2(entry.data.target, entry.event);
                            if (target.id > 0) {
                                tokens.push(target.id);
                                queue(tokens);
                            }
                        }
                        reset$8();
                        break;
                    case 22 /* Event.Timeline */:
                        for (_p = 0, _q = updates$1; _p < _q.length; _p++) {
                            entry = _q[_p];
                            tokens = [entry.time, entry.event];
                            tokens.push(entry.data.type);
                            tokens.push(entry.data.hash);
                            tokens.push(entry.data.x);
                            tokens.push(entry.data.y);
                            tokens.push(entry.data.reaction);
                            tokens.push(entry.data.context);
                            queue(tokens, false);
                        }
                        reset$5();
                        break;
                    case 28 /* Event.Visibility */:
                        v = data$8;
                        tokens.push(v.visible);
                        queue(tokens);
                        visibility(t, v.visible);
                        reset$6();
                        break;
                }
                return [2 /*return*/];
            });
        });
    }

    var state = [];
    var updates$1 = [];
    function start$g() {
        state = [];
        reset$5();
    }
    function reset$5() {
        updates$1 = [];
    }
    function track$2(time, event, hash, x, y, reaction, context) {
        if (reaction === void 0) { reaction = 1 /* BooleanFlag.True */; }
        if (context === void 0) { context = 0 /* BrowsingContext.Self */; }
        state.push({
            time: time,
            event: 22 /* Event.Timeline */,
            data: {
                type: event,
                hash: hash,
                x: x,
                y: y,
                reaction: reaction,
                context: context
            }
        });
        // Since timeline only keeps the data for configured time, we still want to continue tracking these values
        // as part of the baseline. For instance, in a scenario where last scroll happened 5s ago.
        // We would still need to capture the last scroll position as part of the baseline event, even when timeline will be empty.
        track$8(event, x, y);
    }
    function compute$5() {
        var temp = [];
        updates$1 = [];
        var max = data$1.start + data$1.duration;
        var min = Math.max(max - 2000 /* Setting.TimelineSpan */, 0);
        for (var _i = 0, state_1 = state; _i < state_1.length; _i++) {
            var s = state_1[_i];
            if (s.time >= min) {
                if (s.time <= max) {
                    updates$1.push(s);
                }
                temp.push(s);
            }
        }
        state = temp; // Drop events less than the min time
        encode$3(22 /* Event.Timeline */);
    }
    function stop$e() {
        state = [];
        reset$5();
    }

    var discoverBytes = 0;
    var playbackBytes = 0;
    var playback;
    var analysis;
    var timeout = null;
    var transit;
    var active$1;
    var queuedTime = 0;
    var track$1;
    function start$f() {
        active$1 = true;
        discoverBytes = 0;
        playbackBytes = 0;
        queuedTime = 0;
        playback = [];
        analysis = [];
        transit = {};
        track$1 = null;
    }
    function queue(tokens, transmit) {
        if (transmit === void 0) { transmit = true; }
        if (active$1) {
            var now = time();
            var type = tokens.length > 1 ? tokens[1] : null;
            var event_1 = JSON.stringify(tokens);
            switch (type) {
                case 5 /* Event.Discover */:
                    discoverBytes += event_1.length;
                case 37 /* Event.Box */:
                case 6 /* Event.Mutation */:
                case 43 /* Event.Snapshot */:
                case 45 /* Event.StyleSheetAdoption */:
                case 46 /* Event.StyleSheetUpdate */:
                    playbackBytes += event_1.length;
                    playback.push(event_1);
                    break;
                default:
                    analysis.push(event_1);
                    break;
            }
            // Increment event count metric
            count$1(25 /* Metric.EventCount */);
            // Following two checks are precautionary and act as a fail safe mechanism to get out of unexpected situations.
            // Check 1: If for any reason the upload hasn't happened after waiting for 2x the config.delay time,
            // reset the timer. This allows Clarity to attempt an upload again.
            var gap = delay();
            if (now - queuedTime > (gap * 2)) {
                clearTimeout(timeout);
                timeout = null;
            }
            // Transmit Check: When transmit is set to true (default), it indicates that we should schedule an upload
            // However, in certain scenarios - like metric calculation - which are triggered as part of an existing upload
            // We enrich the data going out with the existing upload. In these cases, call to upload comes with 'transmit' set to false.
            if (transmit && timeout === null) {
                if (type !== 25 /* Event.Ping */) {
                    reset$q();
                }
                timeout = setTimeout(upload, gap);
                queuedTime = now;
                check$2(playbackBytes);
            }
        }
    }
    function stop$d() {
        clearTimeout(timeout);
        upload(true);
        discoverBytes = 0;
        playbackBytes = 0;
        queuedTime = 0;
        playback = [];
        analysis = [];
        transit = {};
        track$1 = null;
        active$1 = false;
    }
    function upload(final) {
        if (final === void 0) { final = false; }
        return __awaiter(this, void 0, void 0, function () {
            var sendPlaybackBytes, last, e, a, p, encoded, payload, zipped;
            return __generator(this, function (_a) {
                timeout = null;
                sendPlaybackBytes = config$1.lean === false && playbackBytes > 0 && (playbackBytes < 1048576 /* Setting.MaxFirstPayloadBytes */ || data$1.sequence > 0);
                if (sendPlaybackBytes) {
                    max(1 /* Metric.Playback */, 1 /* BooleanFlag.True */);
                }
                // CAUTION: Ensure "transmit" is set to false in the queue function for following events
                // Otherwise you run a risk of infinite loop.
                compute$7();
                compute$5();
                compute$a();
                compute$8();
                last = final === true;
                e = JSON.stringify(envelope(last));
                a = "[".concat(analysis.join(), "]");
                p = sendPlaybackBytes ? "[".concat(playback.join(), "]") : "" /* Constant.Empty */;
                encoded = { e: e, a: a, p: p };
                payload = stringify(encoded);
                zipped = null;
                sum(2 /* Metric.TotalBytes */, zipped ? zipped.length : payload.length);
                send(payload, zipped, data$1.sequence, last);
                // Clear out events now that payload has been dispatched
                analysis = [];
                if (sendPlaybackBytes) {
                    playback = [];
                    playbackBytes = 0;
                    discoverBytes = 0;
                }
                return [2 /*return*/];
            });
        });
    }
    function stringify(encoded) {
        return encoded.p.length > 0 ? "{\"e\":".concat(encoded.e, ",\"a\":").concat(encoded.a, ",\"p\":").concat(encoded.p, "}") : "{\"e\":".concat(encoded.e, ",\"a\":").concat(encoded.a, "}");
    }
    function send(payload, zipped, sequence, beacon) {
        if (beacon === void 0) { beacon = false; }
        // Upload data if a valid URL is defined in the config
        if (typeof config$1.upload === "string" /* Constant.String */) {
            var url_1 = config$1.upload;
            var dispatched = false;
            // If it's the last payload, attempt to upload using sendBeacon first.
            // The advantage to using sendBeacon is that browser can decide to upload asynchronously, improving chances of success
            // However, we don't want to rely on it for every payload, since we have no ability to retry if the upload failed.
            // Also, in case of sendBeacon, we do not have a way to alter HTTP headers and therefore can't send compressed payload
            if (beacon && "sendBeacon" in navigator) {
                try {
                    // Navigator needs to be bound to sendBeacon before it is used to avoid errors in some browsers
                    dispatched = navigator.sendBeacon.bind(navigator)(url_1, payload);
                    if (dispatched) {
                        done(sequence);
                    }
                }
                catch ( /* do nothing - and we will automatically fallback to XHR below */_a) { /* do nothing - and we will automatically fallback to XHR below */ }
            }
            // Before initiating XHR upload, we check if the data has already been uploaded using sendBeacon
            // There are two cases when dispatched could still be false:
            //   a) It's not the last payload, and therefore we didn't attempt sending sendBeacon
            //   b) It's the last payload, however, we failed to queue sendBeacon call and need to now fall back to XHR.
            //      E.g. if data is over 64KB, several user agents (like Chrome) will reject to queue the sendBeacon call.
            if (dispatched === false) {
                // While tracking payload for retry, we only track string value of the payload to err on the safe side
                // Not all browsers support compression API and the support for it in supported browsers is still experimental
                if (sequence in transit) {
                    transit[sequence].attempts++;
                }
                else {
                    transit[sequence] = { data: payload, attempts: 1 };
                }
                var xhr_1 = new XMLHttpRequest();
                xhr_1.open("POST", url_1, true);
                xhr_1.timeout = 15000 /* Setting.UploadTimeout */;
                xhr_1.ontimeout = function () { report(new Error("".concat("Timeout" /* Constant.Timeout */, " : ").concat(url_1))); };
                if (sequence !== null) {
                    xhr_1.onreadystatechange = function () { measure(check$3)(xhr_1, sequence); };
                }
                xhr_1.withCredentials = true;
                if (zipped) {
                    // If we do have valid compressed array, send it with appropriate HTTP headers so server can decode it appropriately
                    xhr_1.setRequestHeader("Accept" /* Constant.Accept */, "application/x-clarity-gzip" /* Constant.ClarityGzip */);
                    xhr_1.send(zipped);
                }
                else {
                    // In all other cases, continue sending string back to the server
                    xhr_1.send(payload);
                }
            }
        }
        else if (config$1.upload) {
            var callback = config$1.upload;
            callback(payload);
            done(sequence);
        }
    }
    function check$3(xhr, sequence) {
        var transitData = transit[sequence];
        if (xhr && xhr.readyState === 4 /* XMLReadyState.Done */ && transitData) {
            // Attempt send payload again (as configured in settings) if we do not receive a success (2XX) response code back from the server
            if ((xhr.status < 200 || xhr.status > 208) && transitData.attempts <= 1 /* Setting.RetryLimit */) {
                // We re-attempt in all cases except when server explicitly rejects our request with 4XX error
                if (xhr.status >= 400 && xhr.status < 500) {
                    // In case of a 4XX response from the server, we bail out instead of trying again
                    trigger(6 /* Check.Server */);
                }
                else {
                    // Browser will send status = 0 when it refuses to put network request over the wire
                    // This could happen for several reasons, couple of known ones are:
                    //    1: Browsers block upload because of content security policy violation
                    //    2: Safari will terminate pending XHR requests with status code 0 if the user navigates away from the page
                    // In any case, we switch the upload URL to fallback configuration (if available) before re-trying one more time
                    if (xhr.status === 0) {
                        config$1.upload = config$1.fallback ? config$1.fallback : config$1.upload;
                    }
                    // In all other cases, re-attempt sending the same data
                    // For retry we always fallback to string payload, even though we may have attempted
                    // sending zipped payload earlier
                    send(transitData.data, null, sequence);
                }
            }
            else {
                track$1 = { sequence: sequence, attempts: transitData.attempts, status: xhr.status };
                // Send back an event only if we were not successful in our first attempt
                if (transitData.attempts > 1) {
                    encode$1(2 /* Event.Upload */);
                }
                // Handle response if it was a 200 response with a valid body
                if (xhr.status === 200 && xhr.responseText) {
                    response(xhr.responseText);
                }
                // If we exhausted our retries then trigger Clarity's shutdown for this page since the data will be incomplete
                if (xhr.status === 0) {
                    // And, right before we terminate the session, we will attempt one last time to see if we can use
                    // different transport option (sendBeacon vs. XHR) to get this data to the server for analysis purposes
                    send(transitData.data, null, sequence, true);
                    trigger(3 /* Check.Retry */);
                }
                // Signal that this request completed successfully
                if (xhr.status >= 200 && xhr.status <= 208) {
                    done(sequence);
                }
                // Stop tracking this payload now that it's all done
                delete transit[sequence];
            }
        }
    }
    function done(sequence) {
        // If we everything went successfully, and it is the first sequence, save this session for future reference
        if (sequence === 1) {
            save();
        }
    }
    function delay() {
        // Progressively increase delay as we continue to send more payloads from the client to the server
        // If we are not uploading data to a server, and instead invoking UploadCallback, in that case keep returning configured value
        var gap = config$1.lean === false && discoverBytes > 0 ? 100 /* Setting.MinUploadDelay */ : data$1.sequence * config$1.delay;
        return typeof config$1.upload === "string" /* Constant.String */ ? Math.max(Math.min(gap, 30000 /* Setting.MaxUploadDelay */), 100 /* Setting.MinUploadDelay */) : config$1.delay;
    }
    function response(payload) {
        var lines = payload && payload.length > 0 ? payload.split("\n") : [];
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            var parts = line && line.length > 0 ? line.split(/ (.*)/) : ["" /* Constant.Empty */];
            switch (parts[0]) {
                case "END" /* Constant.End */:
                    // Clear out session storage and end the session so we can start fresh the next time
                    trigger(6 /* Check.Server */);
                    break;
                case "UPGRADE" /* Constant.Upgrade */:
                    // Upgrade current session to send back playback information
                    upgrade("Auto" /* Constant.Auto */);
                    break;
                case "ACTION" /* Constant.Action */:
                    // Invoke action callback, if configured and has a valid value
                    if (config$1.action && parts.length > 1) {
                        config$1.action(parts[1]);
                    }
                    break;
                case "EXTRACT" /* Constant.Extract */:
                    if (parts.length > 1) {
                        trigger$1(parts[1]);
                    }
                    break;
                case "SIGNAL" /* Constant.Signal */:
                    if (parts.length > 1) {
                        signalsEvent(parts[1]);
                    }
                    break;
            }
        }
    }

    var history$3 = {};
    var data$7;
    function start$e() {
        bind(window, "error", handler);
        history$3 = {};
    }
    function handler(error) {
        var e = error["error"] || error;
        // While rare, it's possible for code to fail repeatedly during the lifetime of the same page
        // In those cases, we only want to log the failure first few times and not spam logs with redundant information.
        if (!(e.message in history$3)) {
            history$3[e.message] = 0;
        }
        if (history$3[e.message]++ >= 5 /* Setting.ScriptErrorLimit */) {
            return true;
        }
        // Send back information only if the handled error has valid information
        if (e && e.message) {
            data$7 = {
                message: e.message,
                line: error["lineno"],
                column: error["colno"],
                stack: e.stack,
                source: error["filename"]
            };
            encode$2(31 /* Event.ScriptError */);
        }
        return true;
    }

    function encode$2 (type) {
        return __awaiter(this, void 0, void 0, function () {
            var tokens;
            return __generator(this, function (_a) {
                tokens = [time(), type];
                switch (type) {
                    case 31 /* Event.ScriptError */:
                        tokens.push(data$7.message);
                        tokens.push(data$7.line);
                        tokens.push(data$7.column);
                        tokens.push(data$7.stack);
                        tokens.push(url$1(data$7.source));
                        queue(tokens);
                        break;
                    case 33 /* Event.Log */:
                        if (data$6) {
                            tokens.push(data$6.code);
                            tokens.push(data$6.name);
                            tokens.push(data$6.message);
                            tokens.push(data$6.stack);
                            tokens.push(data$6.severity);
                            queue(tokens, false);
                        }
                        break;
                    case 41 /* Event.Fraud */:
                        if (data$d) {
                            tokens.push(data$d.id);
                            tokens.push(data$d.target);
                            tokens.push(data$d.checksum);
                            queue(tokens, false);
                        }
                        break;
                }
                return [2 /*return*/];
            });
        });
    }

    var history$2 = {};
    var data$6;
    function start$d() {
        history$2 = {};
    }
    function log$1(code, severity, name, message, stack) {
        if (name === void 0) { name = null; }
        if (message === void 0) { message = null; }
        if (stack === void 0) { stack = null; }
        var key = name ? "".concat(name, "|").concat(message) : "";
        // While rare, it's possible for code to fail repeatedly during the lifetime of the same page
        // In those cases, we only want to log the failure once and not spam logs with redundant information.
        if (code in history$2 && history$2[code].indexOf(key) >= 0) {
            return;
        }
        data$6 = { code: code, name: name, message: message, stack: stack, severity: severity };
        // Maintain history of errors in memory to avoid sending redundant information
        if (code in history$2) {
            history$2[code].push(key);
        }
        else {
            history$2[code] = [key];
        }
        encode$2(33 /* Event.Log */);
    }
    function stop$c() {
        history$2 = {};
    }

    var data$5 = {};
    var keys = new Set();
    var variables = {};
    var selectors = {};
    var hashes = {};
    var validation = {};
    function start$c() {
        reset$4();
    }
    // Input string is of the following form:
    // EXTRACT 101|element { "1": ".class1", "2": "~window.a.b", "3": "!abc"}
    // if element is present on the page it will set up event 101 to grab the contents of the class1 selector into component 1,
    // the javascript evaluated contents of window.a.b into component 2,
    // and the contents of Clarity's hash abc into component 3
    function trigger$1(input) {
        try {
            var parts = input && input.length > 0 ? input.split(/ (.*)/) : ["" /* Constant.Empty */];
            var keyparts = parts[0].split(/\|(.*)/);
            var key = parseInt(keyparts[0]);
            var element = keyparts.length > 1 ? keyparts[1] : "" /* Constant.Empty */;
            var values = parts.length > 1 ? JSON.parse(parts[1]) : {};
            variables[key] = {};
            selectors[key] = {};
            hashes[key] = {};
            validation[key] = element;
            for (var v in values) {
                // values is a set of strings for proper JSON parsing, but it's more efficient
                // to interact with them as numbers
                var id = parseInt(v);
                var value = values[v];
                var source = 2 /* ExtractSource.Text */;
                if (value.startsWith("~" /* Constant.Tilde */)) {
                    source = 0 /* ExtractSource.Javascript */;
                }
                else if (value.startsWith("!" /* Constant.Bang */)) {
                    source = 4 /* ExtractSource.Hash */;
                }
                switch (source) {
                    case 0 /* ExtractSource.Javascript */:
                        var variable = value.substring(1, value.length);
                        variables[key][id] = parse(variable);
                        break;
                    case 2 /* ExtractSource.Text */:
                        selectors[key][id] = value;
                        break;
                    case 4 /* ExtractSource.Hash */:
                        var hash = value.substring(1, value.length);
                        hashes[key][id] = hash;
                        break;
                }
            }
        }
        catch (e) {
            log$1(8 /* Code.Config */, 1 /* Severity.Warning */, e ? e.name : null);
        }
    }
    function clone(v) {
        return JSON.parse(JSON.stringify(v));
    }
    function compute$4() {
        try {
            for (var v in variables) {
                var key = parseInt(v);
                if (validation[key] == "" /* Constant.Empty */ || document.querySelector(validation[key])) {
                    var variableData = variables[key];
                    for (var v_1 in variableData) {
                        var variableKey = parseInt(v_1);
                        var value = str(evaluate(clone(variableData[variableKey])));
                        if (value) {
                            update(key, variableKey, value);
                        }
                    }
                    var selectorData = selectors[key];
                    for (var s in selectorData) {
                        var selectorKey = parseInt(s);
                        var nodes = document.querySelectorAll(selectorData[selectorKey]);
                        if (nodes) {
                            var text = Array.from(nodes).map(function (e) { return e.textContent; });
                            update(key, selectorKey, text.join("<SEP>" /* Constant.Seperator */).substring(0, 10000 /* Setting.ExtractLimit */));
                        }
                    }
                    var hashData = hashes[key];
                    for (var h in hashData) {
                        var hashKey = parseInt(h);
                        var content = hashText(hashData[hashKey]).trim().substring(0, 10000 /* Setting.ExtractLimit */);
                        update(key, hashKey, content);
                    }
                }
            }
            if (keys.size > 0) {
                encode$1(40 /* Event.Extract */);
            }
        }
        catch (e) {
            log$1(5 /* Code.Selector */, 1 /* Severity.Warning */, e ? e.name : null);
        }
    }
    function reset$4() {
        keys.clear();
    }
    function update(key, subkey, value) {
        var update = false;
        if (!(key in data$5)) {
            data$5[key] = {};
            update = true;
        }
        if (!isEmpty(hashes[key])
            && (!(subkey in data$5[key]) || data$5[key][subkey] != value)) {
            update = true;
        }
        data$5[key][subkey] = value;
        if (update) {
            keys.add(key);
        }
        return;
    }
    function stop$b() {
        reset$4();
    }
    function parse(variable) {
        var syntax = [];
        var parts = variable.split("." /* Constant.Dot */);
        while (parts.length > 0) {
            var part = parts.shift();
            var arrayStart = part.indexOf("[" /* Constant.ArrayStart */);
            var conditionStart = part.indexOf("{" /* Constant.ConditionStart */);
            var conditionEnd = part.indexOf("}" /* Constant.ConditionEnd */);
            syntax.push({
                name: arrayStart > 0 ? part.substring(0, arrayStart) : (conditionStart > 0 ? part.substring(0, conditionStart) : part),
                type: arrayStart > 0 ? 1 /* Type.Array */ : (conditionStart > 0 ? 2 /* Type.Object */ : 3 /* Type.Simple */),
                condition: conditionStart > 0 ? part.substring(conditionStart + 1, conditionEnd) : null
            });
        }
        return syntax;
    }
    // The function below takes in a variable name in following format: "a.b.c" and safely evaluates its value in javascript context
    // For instance, for a.b.c, it will first check window["a"]. If it exists, it will recursively look at: window["a"]["b"] and finally,
    // return the value for window["a"]["b"]["c"].
    function evaluate(variable, base) {
        if (base === void 0) { base = window; }
        if (variable.length == 0) {
            return base;
        }
        var part = variable.shift();
        var output;
        if (base && base[part.name]) {
            var obj = base[part.name];
            if (part.type !== 1 /* Type.Array */ && match(obj, part.condition)) {
                output = evaluate(variable, obj);
            }
            else if (Array.isArray(obj)) {
                var filtered = [];
                for (var _i = 0, obj_1 = obj; _i < obj_1.length; _i++) {
                    var value = obj_1[_i];
                    if (match(value, part.condition)) {
                        var op = evaluate(variable, value);
                        if (op) {
                            filtered.push(op);
                        }
                    }
                }
                output = filtered;
            }
            return output;
        }
        return null;
    }
    function str(input) {
        // Automatically trim string to max of Setting.ExtractLimit to avoid fetching long strings
        return input ? JSON.stringify(input).substring(0, 10000 /* Setting.ExtractLimit */) : input;
    }
    function match(base, condition) {
        if (condition) {
            var prop = condition.split(":");
            return prop.length > 1 ? base[prop[0]] == prop[1] : base[prop[0]];
        }
        return true;
    }
    function isEmpty(obj) {
        return Object.keys(obj).length == 0;
    }

    function encode$1 (event) {
        var t = time();
        var tokens = [t, event];
        switch (event) {
            case 4 /* Event.Baseline */:
                var b = state$b;
                if (b) {
                    tokens = [b.time, b.event];
                    tokens.push(b.data.visible);
                    tokens.push(b.data.docWidth);
                    tokens.push(b.data.docHeight);
                    tokens.push(b.data.screenWidth);
                    tokens.push(b.data.screenHeight);
                    tokens.push(b.data.scrollX);
                    tokens.push(b.data.scrollY);
                    tokens.push(b.data.pointerX);
                    tokens.push(b.data.pointerY);
                    tokens.push(b.data.activityTime);
                    tokens.push(b.data.scrollTime);
                    queue(tokens, false);
                }
                reset$s();
                break;
            case 25 /* Event.Ping */:
                tokens.push(data$h.gap);
                queue(tokens);
                break;
            case 35 /* Event.Limit */:
                tokens.push(data$4.check);
                queue(tokens, false);
                break;
            case 3 /* Event.Upgrade */:
                tokens.push(data$f.key);
                queue(tokens);
                break;
            case 2 /* Event.Upload */:
                tokens.push(track$1.sequence);
                tokens.push(track$1.attempts);
                tokens.push(track$1.status);
                queue(tokens, false);
                break;
            case 24 /* Event.Custom */:
                // not all custom events have a key - if it wasn't passed server handles just value
                data$j.key && tokens.push(data$j.key);
                tokens.push(data$j.value);
                queue(tokens);
                break;
            case 34 /* Event.Variable */:
                var variableKeys = Object.keys(data$e);
                if (variableKeys.length > 0) {
                    for (var _i = 0, variableKeys_1 = variableKeys; _i < variableKeys_1.length; _i++) {
                        var v = variableKeys_1[_i];
                        tokens.push(v);
                        tokens.push(data$e[v]);
                    }
                    reset$o();
                    queue(tokens, false);
                }
                break;
            case 0 /* Event.Metric */:
                var metricKeys = Object.keys(updates$3);
                if (metricKeys.length > 0) {
                    for (var _a = 0, metricKeys_1 = metricKeys; _a < metricKeys_1.length; _a++) {
                        var m = metricKeys_1[_a];
                        var key = parseInt(m, 10);
                        tokens.push(key);
                        // For computation, we need microseconds precision that performance.now() API offers
                        // However, for data over the wire, we round it off to milliseconds precision.
                        tokens.push(Math.round(updates$3[m]));
                    }
                    reset$r();
                    queue(tokens, false);
                }
                break;
            case 1 /* Event.Dimension */:
                var dimensionKeys = Object.keys(updates);
                if (dimensionKeys.length > 0) {
                    for (var _b = 0, dimensionKeys_1 = dimensionKeys; _b < dimensionKeys_1.length; _b++) {
                        var d = dimensionKeys_1[_b];
                        var key = parseInt(d, 10);
                        tokens.push(key);
                        tokens.push(updates[d]);
                    }
                    reset$3();
                    queue(tokens, false);
                }
                break;
            case 36 /* Event.Summary */:
                var eventKeys = Object.keys(data$g);
                if (eventKeys.length > 0) {
                    for (var _c = 0, eventKeys_1 = eventKeys; _c < eventKeys_1.length; _c++) {
                        var e = eventKeys_1[_c];
                        var key = parseInt(e, 10);
                        tokens.push(key);
                        tokens.push([].concat.apply([], data$g[e]));
                    }
                    reset$p();
                    queue(tokens, false);
                }
                break;
            case 40 /* Event.Extract */:
                var extractKeys = keys;
                extractKeys.forEach((function (e) {
                    tokens.push(e);
                    var token = [];
                    for (var d in data$5[e]) {
                        var key = parseInt(d, 10);
                        token.push(key);
                        token.push(data$5[e][d]);
                    }
                    tokens.push(token);
                }));
                reset$4();
                queue(tokens, false);
        }
    }

    var data$4;
    function start$b() {
        data$4 = { check: 0 /* Check.None */ };
    }
    function check$2(bytes) {
        if (data$4.check === 0 /* Check.None */) {
            var reason = data$4.check;
            reason = data$1.sequence >= 128 /* Setting.PayloadLimit */ ? 1 /* Check.Payload */ : reason;
            reason = data$1.pageNum >= 128 /* Setting.PageLimit */ ? 7 /* Check.Page */ : reason;
            reason = time() > 7200000 /* Setting.ShutdownLimit */ ? 2 /* Check.Shutdown */ : reason;
            reason = bytes > 10485760 /* Setting.PlaybackBytesLimit */ ? 2 /* Check.Shutdown */ : reason;
            if (reason !== data$4.check) {
                trigger(reason);
            }
        }
    }
    function trigger(reason) {
        data$4.check = reason;
        clear();
        stop();
    }
    function compute$3() {
        if (data$4.check !== 0 /* Check.None */) {
            encode$1(35 /* Event.Limit */);
        }
    }
    function stop$a() {
        data$4 = null;
    }

    var data$3 = null;
    var updates = null;
    function start$a() {
        data$3 = {};
        updates = {};
    }
    function stop$9() {
        data$3 = {};
        updates = {};
    }
    function log(dimension, value) {
        // Check valid value before moving ahead
        if (value) {
            // Ensure received value is casted into a string if it wasn't a string to begin with
            value = "".concat(value);
            if (!(dimension in data$3)) {
                data$3[dimension] = [];
            }
            if (data$3[dimension].indexOf(value) < 0) {
                data$3[dimension].push(value);
                // If this is a new value, track it as part of updates object
                // This allows us to only send back new values in subsequent payloads
                if (!(dimension in updates)) {
                    updates[dimension] = [];
                }
                updates[dimension].push(value);
                // Limit check to ensure we have a cap on number of dimensions we can collect
                if (data$3[dimension].length > 128 /* Setting.CollectionLimit */) {
                    trigger(5 /* Check.Collection */);
                }
            }
        }
    }
    function compute$2() {
        encode$1(1 /* Event.Dimension */);
    }
    function reset$3() {
        updates = {};
    }

    var data$2 = null;
    var callbacks = [];
    var electron = 0 /* BooleanFlag.False */;
    var rootDomain = null;
    function start$9() {
        rootDomain = null;
        var ua = navigator && "userAgent" in navigator ? navigator.userAgent : "" /* Constant.Empty */;
        var title = document && document.title ? document.title : "" /* Constant.Empty */;
        electron = ua.indexOf("Electron" /* Constant.Electron */) > 0 ? 1 /* BooleanFlag.True */ : 0 /* BooleanFlag.False */;
        // Populate ids for this page
        var s = session();
        var u = user();
        var uuid = config$1.u;
        var domainId = config$1.d;
        var pv = config$1.p;
        // let projectId = config.projectId || hash(location.host);
        // data = { projectId, userId: u.id, sessionId: s.session, pageNum: s.count };
        data$2 = { domainId: domainId, uuid: uuid, pv: pv, sessionId: s.session, pageNum: s.count };
        // Override configuration based on what's in the session storage, unless it is blank (e.g. using upload callback, like in devtools)
        config$1.lean = config$1.track && s.upgrade !== null ? s.upgrade === 0 /* BooleanFlag.False */ : config$1.lean;
        config$1.upload = config$1.track && typeof config$1.upload === "string" /* Constant.String */ && s.upload && s.upload.length > "https://" /* Constant.HTTPS */.length ? s.upload : config$1.upload;
        // Log page metadata as dimensions
        log(0 /* Dimension.UserAgent */, ua);
        log(3 /* Dimension.PageTitle */, title);
        log(1 /* Dimension.Url */, url$1(location.href, !!electron));
        log(2 /* Dimension.Referrer */, document.referrer);
        log(15 /* Dimension.TabId */, tab());
        log(16 /* Dimension.PageLanguage */, document.documentElement.lang);
        log(17 /* Dimension.DocumentDirection */, document.dir);
        log(26 /* Dimension.DevicePixelRatio */, "".concat(window.devicePixelRatio));
        log(28 /* Dimension.Dob */, u.dob.toString());
        log(29 /* Dimension.CookieVersion */, u.version.toString());
        // Capture additional metadata as metrics
        max(0 /* Metric.ClientTimestamp */, s.ts);
        max(1 /* Metric.Playback */, 0 /* BooleanFlag.False */);
        max(35 /* Metric.Electron */, electron);
        // Capture navigator specific dimensions
        if (navigator) {
            log(9 /* Dimension.Language */, navigator.language);
            max(33 /* Metric.HardwareConcurrency */, navigator.hardwareConcurrency);
            max(32 /* Metric.MaxTouchPoints */, navigator.maxTouchPoints);
            max(34 /* Metric.DeviceMemory */, Math.round(navigator.deviceMemory));
            userAgentData();
        }
        if (screen) {
            max(14 /* Metric.ScreenWidth */, Math.round(screen.width));
            max(15 /* Metric.ScreenHeight */, Math.round(screen.height));
            max(16 /* Metric.ColorDepth */, Math.round(screen.colorDepth));
        }
        // Read cookies specified in configuration
        for (var _i = 0, _a = config$1.cookies; _i < _a.length; _i++) {
            var key = _a[_i];
            var value = getCookie(key);
            if (value) {
                set(key, value);
            }
        }
        // Track ids using a cookie if configuration allows it
        track(u);
    }
    function userAgentData() {
        var uaData = navigator["userAgentData"];
        if (uaData && uaData.getHighEntropyValues) {
            uaData.getHighEntropyValues(["model", "platform", "platformVersion", "uaFullVersion"]).then(function (ua) {
                var _a;
                log(22 /* Dimension.Platform */, ua.platform);
                log(23 /* Dimension.PlatformVersion */, ua.platformVersion);
                (_a = ua.brands) === null || _a === void 0 ? void 0 : _a.forEach(function (brand) { log(24 /* Dimension.Brand */, brand.name + "~" /* Constant.Tilde */ + brand.version); });
                log(25 /* Dimension.Model */, ua.model);
                max(27 /* Metric.Mobile */, ua.mobile ? 1 /* BooleanFlag.True */ : 0 /* BooleanFlag.False */);
            });
        }
        else {
            log(22 /* Dimension.Platform */, navigator.platform);
        }
    }
    function stop$8() {
        rootDomain = null;
        data$2 = null;
    }
    function metadata(cb, wait) {
        if (wait === void 0) { wait = true; }
        var upgraded = config$1.lean ? 0 /* BooleanFlag.False */ : 1 /* BooleanFlag.True */;
        // if caller hasn't specified that they want to skip waiting for upgrade but we've already upgraded, we need to
        // directly execute the callback rather than adding to our list as we only process callbacks at the moment
        // we go through the upgrading flow.
        if (data$2 && (upgraded || wait === false)) {
            // Immediately invoke the callback if the caller explicitly doesn't want to wait for the upgrade confirmation
            cb(data$2, !config$1.lean);
        }
        else {
            callbacks.push({ callback: cb, wait: wait });
        }
    }
    function id() {
        return data$2 ? [data$2.uuid, data$2.sessionId, data$2.pageNum].join("." /* Constant.Dot */) : "" /* Constant.Empty */;
    }
    function consent(status) {
        if (status === void 0) { status = true; }
        if (!status) {
            config$1.track = false;
            setCookie("_clsk" /* Constant.SessionKey */, "" /* Constant.Empty */, -Number.MAX_VALUE);
            setCookie("_clck" /* Constant.CookieKey */, "" /* Constant.Empty */, -Number.MAX_VALUE);
            stop();
            window.setTimeout(start, 250 /* Setting.RestartDelay */);
            return;
        }
        if (active()) {
            config$1.track = true;
            track(user(), 1 /* BooleanFlag.True */);
        }
    }
    function clear() {
        // Clear any stored information in the cookie that tracks session information so we can restart fresh the next time
        setCookie("_clsk" /* Constant.SessionKey */, "" /* Constant.Empty */, 0);
    }
    function tab() {
        var id = shortid();
        if (config$1.track && supported(window, "sessionStorage" /* Constant.SessionStorage */)) {
            var value = sessionStorage.getItem("_cltk" /* Constant.TabKey */);
            id = value ? value : id;
            sessionStorage.setItem("_cltk" /* Constant.TabKey */, id);
        }
        return id;
    }
    function save() {
        var ts = Math.round(Date.now());
        var upload = config$1.upload && typeof config$1.upload === "string" /* Constant.String */ ? config$1.upload.replace("https://" /* Constant.HTTPS */, "" /* Constant.Empty */) : "" /* Constant.Empty */;
        var upgrade = config$1.lean ? 0 /* BooleanFlag.False */ : 1 /* BooleanFlag.True */;
        processCallback(upgrade);
        setCookie("_clsk" /* Constant.SessionKey */, [data$2.sessionId, ts, data$2.pageNum, upgrade, upload].join("|" /* Constant.Pipe */), 1 /* Setting.SessionExpire */);
    }
    function processCallback(upgrade) {
        if (callbacks.length > 0) {
            callbacks.forEach(function (x) {
                if (x.callback && (!x.wait || upgrade)) {
                    x.callback(data$2, !config$1.lean);
                }
            });
        }
    }
    function supported(target, api) {
        try {
            return !!target[api];
        }
        catch (_a) {
            return false;
        }
    }
    function track(u, consent) {
        if (consent === void 0) { consent = null; }
        // If consent is not explicitly specified, infer it from the user object
        consent = consent === null ? u.consent : consent;
        // Convert time precision into days to reduce number of bytes we have to write in a cookie
        // E.g. Math.ceil(1628735962643 / (24*60*60*1000)) => 18852 (days) => ejo in base36 (13 bytes => 3 bytes)
        var end = Math.ceil((Date.now() + (365 /* Setting.Expire */ * 86400000 /* Time.Day */)) / 86400000 /* Time.Day */);
        // If DOB is not set in the user object, use the date set in the config as a DOB
        var dob = u.dob === 0 ? (config$1.dob === null ? 0 : config$1.dob) : u.dob;
        // To avoid cookie churn, write user id cookie only once every day
        if (u.expiry === null || Math.abs(end - u.expiry) >= 1 /* Setting.CookieInterval */ || u.consent !== consent || u.dob !== dob) {
            var cookieParts = [data$2.uuid, 2 /* Setting.CookieVersion */, end.toString(36), consent, dob];
            setCookie("_clck" /* Constant.CookieKey */, cookieParts.join("|" /* Constant.Pipe */), 365 /* Setting.Expire */);
        }
    }
    function shortid() {
        var id = Math.floor(Math.random() * Math.pow(2, 32));
        if (window && window.crypto && window.crypto.getRandomValues && Uint32Array) {
            id = window.crypto.getRandomValues(new Uint32Array(1))[0];
        }
        return id.toString(36);
    }
    function session() {
        var output = { session: shortid(), ts: Math.round(Date.now()), count: 1, upgrade: null, upload: "" /* Constant.Empty */ };
        var value = getCookie("_clsk" /* Constant.SessionKey */);
        if (value) {
            var parts = value.split("|" /* Constant.Pipe */);
            // Making it backward & forward compatible by using greater than comparison (v0.6.21)
            // In future version, we can reduce the parts length to be 5 where the last part contains the full upload URL
            if (parts.length >= 5 && output.ts - num(parts[1]) < 1800000 /* Setting.SessionTimeout */) {
                output.session = parts[0];
                output.count = num(parts[2]) + 1;
                output.upgrade = num(parts[3]);
                output.upload = parts.length >= 6 ? "".concat("https://" /* Constant.HTTPS */).concat(parts[5], "/").concat(parts[4]) : "".concat("https://" /* Constant.HTTPS */).concat(parts[4]);
            }
        }
        return output;
    }
    function num(string, base) {
        if (base === void 0) { base = 10; }
        return parseInt(string, base);
    }
    function user() {
        var output = { id: shortid(), version: 0, expiry: null, consent: 0 /* BooleanFlag.False */, dob: 0 };
        var cookie = getCookie("_clck" /* Constant.CookieKey */);
        if (cookie && cookie.length > 0) {
            // Splitting and looking up first part for forward compatibility, in case we wish to store additional information in a cookie
            var parts = cookie.split("|" /* Constant.Pipe */);
            // For backward compatibility introduced in v0.6.18; following code can be removed with future iterations
            // Count number of times Clarity's user cookie crumb appears in document.cookie (could be on different sub-domains e.g. www.domain.com and .domain.com)
            var count = 0;
            for (var _i = 0, _a = document.cookie.split(";" /* Constant.Semicolon */); _i < _a.length; _i++) {
                var c = _a[_i];
                count += c.split("=" /* Constant.Equals */)[0].trim() === "_clck" /* Constant.CookieKey */ ? 1 : 0;
            }
            // Check if we either got version-less cookie value or saw multiple copies of the user cookie crumbs
            // In both these cases, we go ahead and delete the existing cookie set on current domain
            if (parts.length === 1 || count > 1) {
                var deleted = "".concat(";" /* Constant.Semicolon */).concat("expires=" /* Constant.Expires */).concat((new Date(0)).toUTCString()).concat(";path=/" /* Constant.Path */);
                // First, delete current user cookie which might be set on current sub-domain vs. root domain
                document.cookie = "".concat("_clck" /* Constant.CookieKey */, "=").concat(deleted);
                // Second, same thing for current session cookie so it can be re-written later with the root domain
                document.cookie = "".concat("_clsk" /* Constant.SessionKey */, "=").concat(deleted);
            }
            // End code for backward compatibility
            // Read version information and timestamp from cookie, if available
            if (parts.length > 1) {
                output.version = num(parts[1]);
            }
            if (parts.length > 2) {
                output.expiry = num(parts[2], 36);
            }
            // Check if we have explicit consent to track this user
            if (parts.length > 3 && num(parts[3]) === 1) {
                output.consent = 1 /* BooleanFlag.True */;
            }
            if (parts.length > 4 && num(parts[1]) > 1) {
                output.dob = num(parts[4]);
            }
            // Set track configuration to true for this user if we have explicit consent, regardless of project setting
            config$1.track = config$1.track || output.consent === 1 /* BooleanFlag.True */;
            // Get user id from cookie only if we tracking is enabled, otherwise fallback to a random id
            output.id = config$1.track ? parts[0] : output.id;
        }
        return output;
    }
    function getCookie(key) {
        var _a;
        if (supported(document, "cookie" /* Constant.Cookie */)) {
            var cookies = document.cookie.split(";" /* Constant.Semicolon */);
            if (cookies) {
                for (var i = 0; i < cookies.length; i++) {
                    var pair = cookies[i].split("=" /* Constant.Equals */);
                    if (pair.length > 1 && pair[0] && pair[0].trim() === key) {
                        // Some browsers automatically url encode cookie values if they are not url encoded.
                        // We therefore encode and decode cookie values ourselves.
                        // For backwards compatability we need to consider 3 cases:
                        // * Cookie was previously not encoded by Clarity and browser did not encode it
                        // * Cookie was previously not encoded by Clarity and browser encoded it once or more
                        // * Cookie was previously encoded by Clarity and browser did not encode it
                        var _b = decodeCookieValue(pair[1]), isEncoded = _b[0], decodedValue = _b[1];
                        while (isEncoded) {
                            _a = decodeCookieValue(decodedValue), isEncoded = _a[0], decodedValue = _a[1];
                        }
                        return decodedValue;
                    }
                }
            }
        }
        return null;
    }
    function decodeCookieValue(value) {
        try {
            var decodedValue = decodeURIComponent(value);
            return [decodedValue != value, decodedValue];
        }
        catch (_a) {
        }
        return [false, value];
    }
    function encodeCookieValue(value) {
        return encodeURIComponent(value);
    }
    function setCookie(key, value, time) {
        // only write cookies if we are currently in a cookie writing mode (and they are supported)
        // OR if we are trying to write an empty cookie (i.e. clear the cookie value out)
        if ((config$1.track || value == "" /* Constant.Empty */) && ((navigator && navigator.cookieEnabled) || supported(document, "cookie" /* Constant.Cookie */))) {
            // Some browsers automatically url encode cookie values if they are not url encoded.
            // We therefore encode and decode cookie values ourselves.
            var encodedValue = encodeCookieValue(value);
            var expiry = new Date();
            expiry.setDate(expiry.getDate() + time);
            var expires = expiry ? "expires=" /* Constant.Expires */ + expiry.toUTCString() : "" /* Constant.Empty */;
            var cookie = "".concat(key, "=").concat(encodedValue).concat(";" /* Constant.Semicolon */).concat(expires).concat(";path=/" /* Constant.Path */);
            try {
                // Attempt to get the root domain only once and fall back to writing cookie on the current domain.
                if (rootDomain === null) {
                    var hostname = location.hostname ? location.hostname.split("." /* Constant.Dot */) : [];
                    // Walk backwards on a domain and attempt to set a cookie, until successful
                    for (var i = hostname.length - 1; i >= 0; i--) {
                        rootDomain = ".".concat(hostname[i]).concat(rootDomain ? rootDomain : "" /* Constant.Empty */);
                        // We do not wish to attempt writing a cookie on the absolute last part of the domain, e.g. .com or .net.
                        // So we start attempting after second-last part, e.g. .domain.com (PASS) or .co.uk (FAIL)
                        if (i < hostname.length - 1) {
                            // Write the cookie on the current computed top level domain
                            document.cookie = "".concat(cookie).concat(";" /* Constant.Semicolon */).concat("domain=" /* Constant.Domain */).concat(rootDomain);
                            // Once written, check if the cookie exists and its value matches exactly with what we intended to set
                            // Checking for exact value match helps us eliminate a corner case where the cookie may already be present with a different value
                            // If the check is successful, no more action is required and we can return from the function since rootDomain cookie is already set
                            // If the check fails, continue with the for loop until we can successfully set and verify the cookie
                            if (getCookie(key) === value) {
                                return;
                            }
                        }
                    }
                    // Finally, if we were not successful and gone through all the options, play it safe and reset rootDomain to be empty
                    // This forces our code to fall back to always writing cookie to the current domain
                    rootDomain = "" /* Constant.Empty */;
                }
            }
            catch (_a) {
                rootDomain = "" /* Constant.Empty */;
            }
            document.cookie = rootDomain ? "".concat(cookie).concat(";" /* Constant.Semicolon */).concat("domain=" /* Constant.Domain */).concat(rootDomain) : cookie;
        }
    }

    var data$1 = null;
    function start$8() {
        var m = data$2;
        data$1 = {
            version: version$1,
            sequence: 0,
            start: 0,
            duration: 0,
            domainId: m.domainId,
            pv: m.pv,
            uuid: m.uuid,
            sessionId: m.sessionId,
            pageNum: m.pageNum,
            upload: 0 /* Upload.Async */,
            end: 0 /* BooleanFlag.False */
        };
    }
    function stop$7() {
        data$1 = null;
    }
    function envelope(last) {
        data$1.start = data$1.start + data$1.duration;
        data$1.duration = time() - data$1.start;
        data$1.sequence++;
        data$1.upload = last && "sendBeacon" in navigator ? 1 /* Upload.Beacon */ : 0 /* Upload.Async */;
        data$1.end = last ? 1 /* BooleanFlag.True */ : 0 /* BooleanFlag.False */;
        return [
            data$1.version,
            data$1.sequence,
            data$1.start,
            data$1.duration,
            data$1.domainId,
            data$1.pv,
            data$1.uuid,
            data$1.sessionId,
            data$1.pageNum,
            data$1.upload,
            data$1.end
        ];
    }

    var history$1;
    function reset$2() {
        history$1 = [];
    }
    function report(e) {
        // Do not report the same message twice for the same page
        if (history$1 && history$1.indexOf(e.message) === -1) {
            var url = config$1.report;
            if (url && url.length > 0) {
                var payload = { v: data$1.version, p: data$1.projectId, u: data$1.userId, s: data$1.sessionId, n: data$1.pageNum };
                if (e.message) {
                    payload.m = e.message;
                }
                if (e.stack) {
                    payload.e = e.stack;
                }
                // Using POST request instead of a GET request (img-src) to not violate existing CSP rules
                // Since, Clarity already uses XHR to upload data, we stick with similar POST mechanism for reporting too
                var xhr = new XMLHttpRequest();
                xhr.open("POST", url, true);
                xhr.send(JSON.stringify(payload));
                history$1.push(e.message);
            }
        }
        return e;
    }

    // tslint:disable-next-line: ban-types
    function measure (method) {
        return function () {
            var start = performance.now();
            try {
                method.apply(this, arguments);
            }
            catch (ex) {
                throw report(ex);
            }
            var duration = performance.now() - start;
            sum(4 /* Metric.TotalCost */, duration);
            if (duration > 30 /* Setting.LongTask */) {
                count$1(7 /* Metric.LongTaskCount */);
                max(6 /* Metric.ThreadBlockedTime */, duration);
            }
        };
    }

    var bindings = [];
    function bind(target, event, listener, capture) {
        if (capture === void 0) { capture = false; }
        listener = measure(listener);
        // Wrapping following lines inside try / catch to cover edge cases where we might try to access an inaccessible element.
        // E.g. Iframe may start off as same-origin but later turn into cross-origin, and the following lines will throw an exception.
        try {
            target[api("addEventListener" /* Constant.AddEventListener */)](event, listener, capture);
            bindings.push({ event: event, target: target, listener: listener, capture: capture });
        }
        catch ( /* do nothing */_a) { /* do nothing */ }
    }
    function reset$1() {
        // Walk through existing list of bindings and remove them all
        for (var _i = 0, bindings_1 = bindings; _i < bindings_1.length; _i++) {
            var binding = bindings_1[_i];
            // Wrapping inside try / catch to avoid situations where the element may be destroyed before we get a chance to unbind
            try {
                binding.target[api("removeEventListener" /* Constant.RemoveEventListener */)](binding.event, binding.listener, binding.capture);
            }
            catch ( /* do nothing */_a) { /* do nothing */ }
        }
        bindings = [];
    }

    var pushState = null;
    var replaceState = null;
    var url = null;
    var count = 0;
    function start$7() {
        url = getCurrentUrl();
        count = 0;
        bind(window, "popstate", compute$1);
        // Add a proxy to history.pushState function
        if (pushState === null) {
            pushState = history.pushState;
            history.pushState = function () {
                pushState.apply(this, arguments);
                if (active() && check$1()) {
                    compute$1();
                }
            };
        }
        // Add a proxy to history.replaceState function
        if (replaceState === null) {
            replaceState = history.replaceState;
            history.replaceState = function () {
                replaceState.apply(this, arguments);
                if (active() && check$1()) {
                    compute$1();
                }
            };
        }
    }
    function check$1() {
        if (count++ > 20 /* Setting.CallStackDepth */) {
            log$1(4 /* Code.CallStackDepth */, 0 /* Severity.Info */);
            return false;
        }
        return true;
    }
    function compute$1() {
        count = 0; // Reset the counter
        if (url !== getCurrentUrl()) {
            // If the url changed, start tracking it as a new page
            stop();
            window.setTimeout(restart$1, 250 /* Setting.RestartDelay */);
        }
    }
    function restart$1() {
        start();
        max(29 /* Metric.SinglePage */, 1 /* BooleanFlag.True */);
    }
    function getCurrentUrl() {
        return location.href ? location.href.replace(location.hash, "" /* Constant.Empty */) : location.href;
    }
    function stop$6() {
        url = null;
        count = 0;
    }

    var status = false;
    function start$6() {
        status = true;
        start$I();
        reset$l();
        reset$1();
        reset$2();
        start$7();
    }
    function stop$5() {
        stop$6();
        reset$2();
        reset$1();
        reset$l();
        stop$F();
        status = false;
    }
    function active() {
        return status;
    }
    function check() {
        try {
            var globalPrivacyControlSet = navigator && "globalPrivacyControl" in navigator && navigator['globalPrivacyControl'] == true;
            return status === false &&
                typeof Promise !== "undefined" &&
                window["MutationObserver"] &&
                document["createTreeWalker"] &&
                "now" in Date &&
                "now" in performance &&
                typeof WeakMap !== "undefined" &&
                !globalPrivacyControlSet;
        }
        catch (ex) {
            return false;
        }
    }
    function config(override) {
        // Process custom configuration overrides, if available
        if (override === null || status) {
            return false;
        }
        for (var key in override) {
            if (key in config$1) {
                config$1[key] = override[key];
            }
        }
        return true;
    }
    // Suspend ends the current Clarity instance after a configured timeout period
    // The way it differs from the "end" call is that it starts listening to
    // user interaction events as soon as it terminates existing clarity instance.
    // On the next interaction, it automatically starts another instance under a different page id
    // E.g. if configured timeout is 10m, and user stays inactive for an hour.
    // In this case, we will suspend clarity after 10m of inactivity and after another 50m when user interacts again
    // Clarity will restart and start another instance seamlessly. Effectively not missing any active time, but also
    // not holding the session during inactive time periods.
    function suspend() {
        if (status) {
            event("clarity" /* Constant.Clarity */, "suspend" /* Constant.Suspend */);
            stop();
            ["mousemove", "touchstart"].forEach(function (x) { return bind(document, x, restart); });
            ["resize", "scroll", "pageshow"].forEach(function (x) { return bind(window, x, restart); });
        }
    }
    function restart() {
        start();
        event("clarity" /* Constant.Clarity */, "restart" /* Constant.Restart */);
    }

    function start$5() {
        start$A();
        start$e();
        start$d();
    }
    function stop$4() {
        stop$c();
    }

    var diagnostic = /*#__PURE__*/Object.freeze({
        __proto__: null,
        start: start$5,
        stop: stop$4
    });

    function start$4() {
        schedule$1(discover, 1 /* Priority.High */).then(function () {
            measure(compute$9)();
            measure(compute$7)();
            measure(compute$6)();
        });
    }
    function discover() {
        return __awaiter(this, void 0, void 0, function () {
            var ts, timer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ts = time();
                        timer = { id: id(), cost: 3 /* Metric.LayoutCost */ };
                        start$y(timer);
                        return [4 /*yield*/, traverse(document, timer, 0 /* Source.Discover */)];
                    case 1:
                        _a.sent();
                        checkDocumentStyles(document);
                        return [4 /*yield*/, encode$4(5 /* Event.Discover */, timer, ts)];
                    case 2:
                        _a.sent();
                        stop$w(timer);
                        return [2 /*return*/];
                }
            });
        });
    }

    function start$3() {
        // The order below is important
        // and is determined by interdependencies of modules
        start$x();
        start$u();
        start$z();
        if (config$1.delayDom) {
            // Lazy load layout module as part of page load time performance improvements experiment
            bind(window, 'load', function () {
                start$h();
            });
        }
        else {
            start$h();
        }
        start$4();
        start$w();
        start$v();
    }
    function stop$3() {
        stop$s();
        stop$x();
        stop$f();
        stop$v();
        stop$u();
        stop$t();
    }

    var layout = /*#__PURE__*/Object.freeze({
        __proto__: null,
        hashText: hashText,
        start: start$3,
        stop: stop$3
    });

    function encode (type) {
        return __awaiter(this, void 0, void 0, function () {
            var t, tokens;
            return __generator(this, function (_a) {
                t = time();
                tokens = [t, type];
                switch (type) {
                    case 29 /* Event.Navigation */:
                        tokens.push(data.fetchStart);
                        tokens.push(data.connectStart);
                        tokens.push(data.connectEnd);
                        tokens.push(data.requestStart);
                        tokens.push(data.responseStart);
                        tokens.push(data.responseEnd);
                        tokens.push(data.domInteractive);
                        tokens.push(data.domComplete);
                        tokens.push(data.loadEventStart);
                        tokens.push(data.loadEventEnd);
                        tokens.push(data.redirectCount);
                        tokens.push(data.size);
                        tokens.push(data.type);
                        tokens.push(data.protocol);
                        tokens.push(data.encodedSize);
                        tokens.push(data.decodedSize);
                        reset();
                        queue(tokens);
                        break;
                }
                return [2 /*return*/];
            });
        });
    }

    var data = null;
    function reset() {
        data = null;
    }
    function compute(entry) {
        data = {
            fetchStart: Math.round(entry.fetchStart),
            connectStart: Math.round(entry.connectStart),
            connectEnd: Math.round(entry.connectEnd),
            requestStart: Math.round(entry.requestStart),
            responseStart: Math.round(entry.responseStart),
            responseEnd: Math.round(entry.responseEnd),
            domInteractive: Math.round(entry.domInteractive),
            domComplete: Math.round(entry.domComplete),
            loadEventStart: Math.round(entry.loadEventStart),
            loadEventEnd: Math.round(entry.loadEventEnd),
            redirectCount: Math.round(entry.redirectCount),
            size: entry.transferSize ? entry.transferSize : 0,
            type: entry.type,
            protocol: entry.nextHopProtocol,
            encodedSize: entry.encodedBodySize ? entry.encodedBodySize : 0,
            decodedSize: entry.decodedBodySize ? entry.decodedBodySize : 0
        };
        encode(29 /* Event.Navigation */);
    }

    var observer;
    var types = ["navigation" /* Constant.Navigation */, "resource" /* Constant.Resource */, "longtask" /* Constant.LongTask */, "first-input" /* Constant.FID */, "layout-shift" /* Constant.CLS */, "largest-contentful-paint" /* Constant.LCP */];
    function start$2() {
        // Capture connection properties, if available
        if (navigator && "connection" in navigator) {
            log(27 /* Dimension.ConnectionType */, navigator["connection"]["effectiveType"]);
        }
        // Check the browser support performance observer as a pre-requisite for any performance measurement
        if (window["PerformanceObserver"] && PerformanceObserver.supportedEntryTypes) {
            // Start monitoring performance data after page has finished loading.
            // If the document.readyState is not yet complete, we intentionally call observe using a setTimeout.
            // This allows us to capture loadEventEnd on navigation timeline.
            if (document.readyState !== "complete") {
                bind(window, "load", setTimeout.bind(this, observe, 0));
            }
            else {
                observe();
            }
        }
        else {
            log$1(3 /* Code.PerformanceObserver */, 0 /* Severity.Info */);
        }
    }
    function observe() {
        // Some browsers will throw an error for unsupported entryType, e.g. "layout-shift"
        // In those cases, we log it as a warning and continue with rest of the Clarity processing
        try {
            if (observer) {
                observer.disconnect();
            }
            observer = new PerformanceObserver(measure(handle));
            // Reference: https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver/observe
            // "buffered" flag indicates whether buffered entries should be queued into the observer's buffer.
            // It must only be used only with the "type" option, and cannot be used with entryTypes.
            // This is why we need to individually "observe" each supported type
            for (var _i = 0, types_1 = types; _i < types_1.length; _i++) {
                var x = types_1[_i];
                if (PerformanceObserver.supportedEntryTypes.indexOf(x) >= 0) {
                    // Initialize CLS with a value of zero. It's possible (and recommended) for sites to not have any cumulative layout shift.
                    // In those cases, we want to still initialize the metric in Clarity
                    if (x === "layout-shift" /* Constant.CLS */) {
                        sum(9 /* Metric.CumulativeLayoutShift */, 0);
                    }
                    observer.observe({ type: x, buffered: true });
                }
            }
        }
        catch (_a) {
            log$1(3 /* Code.PerformanceObserver */, 1 /* Severity.Warning */);
        }
    }
    function handle(entries) {
        process(entries.getEntries());
    }
    function process(entries) {
        var visible = "visibilityState" in document ? document.visibilityState === "visible" : true;
        for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];
            switch (entry.entryType) {
                case "navigation" /* Constant.Navigation */:
                    compute(entry);
                    break;
                case "resource" /* Constant.Resource */:
                    var name_1 = entry.name;
                    log(4 /* Dimension.NetworkHosts */, host(name_1));
                    if (name_1 === config$1.upload || name_1 === config$1.fallback) {
                        max(28 /* Metric.UploadTime */, entry.duration);
                    }
                    break;
                case "longtask" /* Constant.LongTask */:
                    count$1(7 /* Metric.LongTaskCount */);
                    break;
                case "first-input" /* Constant.FID */:
                    if (visible) {
                        max(10 /* Metric.FirstInputDelay */, entry["processingStart"] - entry.startTime);
                    }
                    break;
                case "layout-shift" /* Constant.CLS */:
                    // Scale the value to avoid sending back floating point number
                    if (visible && !entry["hadRecentInput"]) {
                        sum(9 /* Metric.CumulativeLayoutShift */, entry["value"] * 1000);
                    }
                    break;
                case "largest-contentful-paint" /* Constant.LCP */:
                    if (visible) {
                        max(8 /* Metric.LargestPaint */, entry.startTime);
                    }
                    break;
            }
        }
    }
    function stop$2() {
        if (observer) {
            observer.disconnect();
        }
        observer = null;
    }
    function host(url) {
        var a = document.createElement("a");
        a.href = url;
        return a.host;
    }

    function start$1() {
        reset();
        start$2();
    }
    function stop$1() {
        stop$2();
        reset();
    }

    var performance$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        start: start$1,
        stop: stop$1
    });

    var modules = [diagnostic, layout, interaction, performance$1];
    function start(config$1) {
        if (config$1 === void 0) { config$1 = null; }
        // Check that browser supports required APIs and we do not attempt to start Clarity multiple times
        if (check()) {
            config(config$1);
            start$6();
            start$B();
            modules.forEach(function (x) { return measure(x.start)(); });
            // If it's an internal call to start, without explicit configuration,
            // re-process any newly accumulated items in the queue
            if (config$1 === null) {
                process$7();
            }
        }
    }
    // By default Clarity is asynchronous and will yield by looking for requestIdleCallback.
    // However, there can still be situations with single page apps where a user action can result
    // in the whole DOM being destroyed and reconstructed. While Clarity will perform favorably out of the box,
    // we do allow external clients to manually pause Clarity for that short burst of time and minimize
    // performance impact even further. For reference, we are talking single digit milliseconds optimization here, not seconds.
    function pause() {
        if (active()) {
            event("clarity" /* Constant.Clarity */, "pause" /* Constant.Pause */);
            pause$1();
        }
    }
    // This is how external clients can get out of pause state, and resume Clarity to continue monitoring the page
    function resume() {
        if (active()) {
            resume$1();
            event("clarity" /* Constant.Clarity */, "resume" /* Constant.Resume */);
        }
    }
    function stop() {
        if (active()) {
            // Stop modules in the reverse order of their initialization and start queuing up items again
            modules.slice().reverse().forEach(function (x) { return measure(x.stop)(); });
            stop$y();
            stop$5();
            setup();
        }
    }

    var helper = { hash: hash, selector: selector, get: get, getNode: getNode, lookup: lookup };
    var version = version$1;

    // Execute clarity-js in context of the webpage
    (function () {
        if (typeof window !== "undefined") {
            var w = window;
            var c = 'clarity';
            // Stop any existing instance of clarity-js
            if (w[c]) {
                w[c]("stop");
            }
            // Re-wire clarity-js for developer tools and expose helper methods as part of the global object
            w[c] = function (method) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                return clarity[method].apply(clarity, args);
            };
            w[c].h = function (method) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                return helper[method].apply(helper, args);
            };
            w[c].v = version;
            // Notify developer tools that clarity-js is wired up
            window.postMessage({ action: "wireup" }, "*");
        }
    })();

})();
