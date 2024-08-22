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

var _a$1;
var DataHelper = /** @class */ (function () {
    function DataHelper(state) {
        var _this = this;
        this.regionMap = {};
        this.regions = {};
        this.metrics = {};
        this.lean = false;
        this.reset = function () {
            _this.metrics = {};
            _this.lean = false;
            _this.regions = {};
            _this.regionMap = {};
        };
        this.metric = function (event) {
            if (_this.state.options.metadata) {
                var metricMarkup = [];
                var regionMarkup = [];
                // Copy over metrics for future reference
                for (var m in event.data) {
                    if (typeof event.data[m] === "number") {
                        if (!(m in _this.metrics)) {
                            _this.metrics[m] = 0;
                        }
                        var key = parseInt(m, 10);
                        if (m in DataHelper.METRIC_MAP && (DataHelper.METRIC_MAP[m].unit === "html-price" || DataHelper.METRIC_MAP[m].unit === "ld-price")) {
                            _this.metrics[m] = event.data[m];
                        }
                        else {
                            _this.metrics[m] += event.data[m];
                        }
                        _this.lean = key === 1 /* Data.Metric.Playback */ && event.data[m] === 0 ? true : _this.lean;
                    }
                }
                for (var entry in _this.metrics) {
                    if (entry in DataHelper.METRIC_MAP) {
                        var m = _this.metrics[entry];
                        var map = DataHelper.METRIC_MAP[entry];
                        var unit = "unit" in map ? map.unit : "" /* Data.Constant.Empty */;
                        metricMarkup.push("<li><h2>".concat(_this.value(m, unit), "<span>").concat(_this.key(unit), "</span></h2>").concat(map.name, "</li>"));
                    }
                }
                // Append region information to metadata
                for (var name_1 in _this.regions) {
                    var r = _this.regions[name_1];
                    var className = (r.visibility === 10 /* Layout.RegionVisibility.Visible */ ? "visible" : (r.interaction === 20 /* Layout.InteractionState.Clicked */ ? "clicked" : "" /* Data.Constant.Empty */));
                    regionMarkup.push("<span class=\"".concat(className, "\">").concat(name_1, "</span>"));
                }
                _this.state.options.metadata.innerHTML = "<ul>".concat(metricMarkup.join("" /* Data.Constant.Empty */), "</ul><div>").concat(regionMarkup.join("" /* Data.Constant.Empty */), "</div>");
            }
        };
        this.key = function (unit) {
            switch (unit) {
                case "html-price":
                case "ld-price":
                case "cls":
                    return "" /* Data.Constant.Empty */;
                default: return unit;
            }
        };
        this.value = function (num, unit) {
            switch (unit) {
                case "KB": return Math.round(num / 1024);
                case "s": return Math.round(num / 10) / 100;
                case "cls": return num / 1000;
                case "html-price": return num / 100;
                default: return num;
            }
        };
        this.state = state;
    }
    DataHelper.prototype.region = function (event) {
        var data = event.data;
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var r = data_1[_i];
            if (!(r.name in this.regions)) {
                this.regions[r.name] = { interaction: r.interaction, visibility: r.visibility };
            }
            this.regionMap[r.id] = r.name;
        }
    };
    DataHelper.METRIC_MAP = (_a$1 = {},
        _a$1[2 /* Data.Metric.TotalBytes */] = { name: "Total Bytes", unit: "KB" },
        _a$1[4 /* Data.Metric.TotalCost */] = { name: "Total Cost", unit: "ms" },
        _a$1[3 /* Data.Metric.LayoutCost */] = { name: "Layout Cost", unit: "ms" },
        _a$1[8 /* Data.Metric.LargestPaint */] = { name: "LCP", unit: "s" },
        _a$1[9 /* Data.Metric.CumulativeLayoutShift */] = { name: "CLS", unit: "cls" },
        _a$1[7 /* Data.Metric.LongTaskCount */] = { name: "Long Tasks" },
        _a$1[24 /* Data.Metric.CartTotal */] = { name: "Cart Total", unit: "html-price" },
        _a$1[13 /* Data.Metric.ProductPrice */] = { name: "Product Price", unit: "ld-price" },
        _a$1[6 /* Data.Metric.ThreadBlockedTime */] = { name: "Thread Blocked", unit: "ms" },
        _a$1);
    return DataHelper;
}());

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
var hashMap = {};
// The WeakMap object is a collection of key/value pairs in which the keys are weakly referenced
var idMap = null; // Maps node => id.
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
function getNode(id) {
    return nodesMap.has(id) ? nodesMap.get(id) : null;
}
function get$2(node) {
    var id = getId(node);
    return id in values ? values[id] : null;
}
function lookup(hash) {
    return hash in hashMap ? hashMap[hash] : null;
}

var helper = { hash: hash, selector: selector, get: get$2, getNode: getNode, lookup: lookup };

var EnrichHelper = /** @class */ (function () {
    function EnrichHelper() {
        var _this = this;
        this.reset = function () {
            _this.children = {};
            _this.nodes = {};
            helper.selector.reset();
        };
        this.selectors = function (event) {
            event.data.forEach && event.data.forEach(function (d) {
                var parent = _this.nodes[d.parent];
                var children = _this.children[d.parent] || [];
                var node = _this.nodes[d.id] || { tag: d.tag, parent: d.parent, previous: d.previous };
                var attributes = d.attributes || {};
                /* Track parent-child relationship for this element */
                if (node.parent !== d.parent) {
                    var childIndex = d.previous === null ? 0 : children.indexOf(d.previous) + 1;
                    children.splice(childIndex, 0, d.id);
                    // Stop tracking this node from children of previous parent
                    if (node.parent !== d.parent) {
                        var exParent = _this.children[node.parent];
                        var nodeIndex = exParent ? exParent.indexOf(d.id) : -1;
                        if (nodeIndex >= 0) {
                            _this.children[node.parent].splice(nodeIndex, 1);
                        }
                    }
                    node.parent = d.parent;
                }
                else if (children.indexOf(d.id) < 0) {
                    children.push(d.id);
                }
                /* Get current position */
                node.position = _this.position(d.id, d.tag, node, children, children.map(function (c) { return _this.nodes[c]; }));
                /* For backward compatibility, continue populating current selector and hash like before in addition to beta selector and hash */
                var input = { id: d.id, tag: d.tag, prefix: parent ? [parent.alpha, parent.beta] : null, position: node.position, attributes: attributes };
                // Get stable selector
                // We intentionally use "null" value for empty selectors to keep parity with v0.6.25 and before.
                var selectorAlpha = helper.selector.get(input, 0 /* Layout.Selector.Alpha */);
                d.selectorAlpha = selectorAlpha.length > 0 ? selectorAlpha : null;
                d.hashAlpha = selectorAlpha.length > 0 ? helper.hash(d.selectorAlpha) : null;
                // Get beta selector
                var selectorBeta = helper.selector.get(input, 1 /* Layout.Selector.Beta */);
                d.selectorBeta = selectorBeta.length > 0 ? selectorBeta : null;
                d.hashBeta = selectorBeta.length > 0 ? helper.hash(d.selectorBeta) : null;
                /* Track state for future reference */
                node.alpha = selectorAlpha;
                node.beta = selectorBeta;
                _this.nodes[d.id] = node;
                if (d.parent) {
                    _this.children[d.parent] = children;
                }
            });
            return event;
        };
        this.position = function (id, tag, child, children, siblings) {
            child.position = 1;
            var idx = children ? children.indexOf(id) : -1;
            while (idx-- > 0) {
                if (tag === siblings[idx].tag) {
                    child.position = siblings[idx].position + 1;
                    break;
                }
            }
            return child.position;
        };
        this.reset();
    }
    return EnrichHelper;
}());

var HeatmapHelper = /** @class */ (function () {
    function HeatmapHelper(state, layout) {
        var _this = this;
        this.data = null;
        this.scrollData = null;
        this.max = null;
        this.offscreenRing = null;
        this.gradientPixels = null;
        this.timeout = null;
        this.observer = null;
        this.state = null;
        this.layout = null;
        this.scrollAvgFold = null;
        this.addScrollMakers = false;
        this.reset = function () {
            _this.data = null;
            _this.scrollData = null;
            _this.max = null;
            _this.offscreenRing = null;
            _this.gradientPixels = null;
            _this.timeout = null;
            // Reset resize observer
            if (_this.observer) {
                _this.observer.disconnect();
                _this.observer = null;
            }
            // Remove scroll and resize event listeners
            if (_this.state && _this.state.window) {
                var win = _this.state.window;
                win.removeEventListener("scroll", _this.redraw, true);
                win.removeEventListener("resize", _this.redraw, true);
            }
        };
        this.clear = function () {
            var doc = _this.state.window.document;
            var win = _this.state.window;
            var canvas = doc.getElementById("clarity-heatmap-canvas" /* Constant.HeatmapCanvas */);
            var de = doc.documentElement;
            if (canvas) {
                canvas.width = de.clientWidth;
                canvas.height = de.clientHeight;
                canvas.style.left = win.pageXOffset + "px" /* Constant.Pixel */;
                canvas.style.top = win.pageYOffset + "px" /* Constant.Pixel */;
                canvas.getContext("2d" /* Constant.Context */).clearRect(0, 0, canvas.width, canvas.height);
            }
            _this.reset();
        };
        this.scroll = function (activity, avgFold, addMarkers) {
            _this.scrollData = _this.scrollData || activity;
            _this.scrollAvgFold = avgFold != null ? avgFold : _this.scrollAvgFold;
            _this.addScrollMakers = addMarkers != null ? addMarkers : _this.addScrollMakers;
            var canvas = _this.overlay();
            var context = canvas.getContext("2d" /* Constant.Context */);
            var doc = _this.state.window.document;
            var body = doc.body;
            var de = doc.documentElement;
            var height = Math.max(body.scrollHeight, body.offsetHeight, de.clientHeight, de.scrollHeight, de.offsetHeight);
            canvas.height = Math.min(height, 65535 /* Setting.ScrollCanvasMaxHeight */);
            canvas.style.top = 0 + "px" /* Constant.Pixel */;
            if (canvas.width > 0 && canvas.height > 0) {
                if (_this.scrollData) {
                    var grd = context.createLinearGradient(0, 0, 0, canvas.height);
                    for (var _i = 0, _a = _this.scrollData; _i < _a.length; _i++) {
                        var currentCombination = _a[_i];
                        var huePercentView = 1 - (currentCombination.cumulativeSum / _this.scrollData[0].cumulativeSum);
                        var percentView = (currentCombination.scrollReachY / 100) * (height / canvas.height);
                        var hue = huePercentView * 240 /* Setting.MaxHue */;
                        if (percentView <= 1) {
                            grd.addColorStop(percentView, "hsla(".concat(hue, ", 100%, 50%, 0.6)"));
                        }
                    }
                    // Fill with gradient
                    context.fillStyle = grd;
                    context.fillRect(0, 0, canvas.width, canvas.height);
                    if (_this.addScrollMakers) {
                        _this.addInfoMarkers(context, _this.scrollData, canvas.width, canvas.height, _this.scrollAvgFold);
                    }
                }
            }
        };
        this.addInfoMarkers = function (context, scrollMapInfo, width, height, avgFold) {
            _this.addMarker(context, width, "Average Fold" /* Constant.AverageFold */, avgFold, 84 /* Setting.MarkerMediumWidth */);
            var markers = [75, 50, 25];
            var _loop_1 = function (marker) {
                var closest = scrollMapInfo.reduce(function (prev, curr) {
                    return ((Math.abs(curr.percUsers - marker)) < (Math.abs(prev.percUsers - marker)) ? curr : prev);
                });
                if (closest.percUsers >= marker - 2 /* Setting.MarkerRange */ && closest.percUsers <= marker + 2 /* Setting.MarkerRange */) {
                    var markerLine = (closest.scrollReachY / 100) * height;
                    _this.addMarker(context, width, "".concat(marker, "%"), markerLine, 35 /* Setting.MarkerSmallWidth */);
                }
            };
            for (var _i = 0, markers_1 = markers; _i < markers_1.length; _i++) {
                var marker = markers_1[_i];
                _loop_1(marker);
            }
        };
        this.addMarker = function (context, heatmapWidth, label, markerY, markerWidth) {
            context.beginPath();
            context.moveTo(0, markerY);
            context.lineTo(heatmapWidth, markerY);
            context.setLineDash([2, 2]);
            context.lineWidth = 1 /* Setting.MarkerLineHeight */;
            context.strokeStyle = "white" /* Setting.MarkerColor */;
            context.stroke();
            context.fillStyle = "#323130" /* Setting.CanvasTextColor */;
            context.fillRect(0, (markerY - 32 /* Setting.MarkerHeight */ / 2), markerWidth, 32 /* Setting.MarkerHeight */);
            context.fillStyle = "white" /* Setting.MarkerColor */;
            context.font = "500 12px Segoe UI" /* Setting.CanvasTextFont */;
            context.fillText(label, 5 /* Setting.MarkerPadding */, markerY + 5 /* Setting.MarkerPadding */);
        };
        this.click = function (activity) {
            _this.data = _this.data || activity;
            var heat = _this.transform();
            var canvas = _this.overlay();
            var ctx = canvas.getContext("2d" /* Constant.Context */);
            if (canvas.width > 0 && canvas.height > 0) {
                // To speed up canvas rendering, we draw ring & gradient on an offscreen canvas, so we can use drawImage API
                // Canvas performance tips: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas
                // Pre-render similar primitives or repeating objects on an offscreen canvas
                var ring = _this.getRing();
                var gradient = _this.getGradient();
                // Render activity for each (x,y) coordinate in our data
                for (var _i = 0, heat_1 = heat; _i < heat_1.length; _i++) {
                    var entry = heat_1[_i];
                    ctx.globalAlpha = entry.a;
                    ctx.drawImage(ring, entry.x - 20 /* Setting.Radius */, entry.y - 20 /* Setting.Radius */);
                }
                // Add color to the canvas based on alpha value of each pixel
                var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
                for (var i = 0; i < pixels.data.length; i += 4) {
                    // For each pixel, we have 4 entries in data array: (r,g,b,a)
                    // To pick the right color from gradient pixels, we look at the alpha value of the pixel
                    // Alpha value ranges from 0-255
                    var alpha = pixels.data[i + 3];
                    if (alpha > 0) {
                        var offset = (alpha - 1) * 4;
                        pixels.data[i] = gradient.data[offset];
                        pixels.data[i + 1] = gradient.data[offset + 1];
                        pixels.data[i + 2] = gradient.data[offset + 2];
                    }
                }
                ctx.putImageData(pixels, 0, 0);
            }
        };
        this.overlay = function () {
            // Create canvas for visualizing heatmap
            var doc = _this.state.window.document;
            var win = _this.state.window;
            var de = doc.documentElement;
            var canvas = doc.getElementById("clarity-heatmap-canvas" /* Constant.HeatmapCanvas */);
            if (canvas === null) {
                canvas = doc.createElement("CANVAS" /* Constant.Canvas */);
                canvas.id = "clarity-heatmap-canvas" /* Constant.HeatmapCanvas */;
                canvas.width = 0;
                canvas.height = 0;
                canvas.style.position = "absolute" /* Constant.Absolute */;
                canvas.style.zIndex = "".concat(2147483647 /* Setting.ZIndex */);
                de.appendChild(canvas);
                win.addEventListener("scroll", _this.redraw, true);
                win.addEventListener("resize", _this.redraw, true);
                _this.observer = _this.state.window["ResizeObserver"] ? new ResizeObserver(_this.redraw) : null;
                if (_this.observer) {
                    _this.observer.observe(doc.body);
                }
            }
            // Ensure canvas is positioned correctly
            canvas.width = de.clientWidth;
            canvas.height = de.clientHeight;
            canvas.style.left = win.pageXOffset + "px" /* Constant.Pixel */;
            canvas.style.top = win.pageYOffset + "px" /* Constant.Pixel */;
            canvas.getContext("2d" /* Constant.Context */).clearRect(0, 0, canvas.width, canvas.height);
            return canvas;
        };
        this.getRing = function () {
            if (_this.offscreenRing === null) {
                var doc = _this.state.window.document;
                _this.offscreenRing = doc.createElement("CANVAS" /* Constant.Canvas */);
                _this.offscreenRing.width = 20 /* Setting.Radius */ * 2;
                _this.offscreenRing.height = 20 /* Setting.Radius */ * 2;
                var ctx = _this.offscreenRing.getContext("2d" /* Constant.Context */);
                ctx.shadowOffsetX = 20 /* Setting.Radius */ * 2;
                ctx.shadowBlur = 20 /* Setting.Radius */ / 2;
                ctx.shadowColor = "black" /* Constant.Black */;
                ctx.beginPath();
                ctx.arc(-20 /* Setting.Radius */, 20 /* Setting.Radius */, 20 /* Setting.Radius */ / 2, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.fill();
            }
            return _this.offscreenRing;
        };
        this.getGradient = function () {
            if (_this.gradientPixels === null) {
                var doc = _this.state.window.document;
                var offscreenGradient = doc.createElement("CANVAS" /* Constant.Canvas */);
                offscreenGradient.width = 1;
                offscreenGradient.height = 256 /* Setting.Colors */;
                var ctx = offscreenGradient.getContext("2d" /* Constant.Context */);
                var gradient = ctx.createLinearGradient(0, 0, 0, 256 /* Setting.Colors */);
                var step = 1 / HeatmapHelper.COLORS.length;
                for (var i = 0; i < HeatmapHelper.COLORS.length; i++) {
                    gradient.addColorStop(step * (i + 1), HeatmapHelper.COLORS[i]);
                }
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, 1, 256 /* Setting.Colors */);
                _this.gradientPixels = ctx.getImageData(0, 0, 1, 256 /* Setting.Colors */);
            }
            return _this.gradientPixels;
        };
        this.redraw = function (event) {
            if (_this.data) {
                if (_this.timeout) {
                    clearTimeout(_this.timeout);
                }
                _this.timeout = setTimeout(_this.click, 30 /* Setting.Interval */);
            }
            else if (_this.scrollData) {
                if (event.type != 'scroll') {
                    if (_this.timeout) {
                        clearTimeout(_this.timeout);
                    }
                    _this.timeout = setTimeout(_this.scroll, 30 /* Setting.Interval */);
                }
            }
        };
        this.transform = function () {
            var output = [];
            var points = {};
            var localMax = 0;
            var height = _this.state.window && _this.state.window.document ? _this.state.window.document.documentElement.clientHeight : 0;
            for (var _i = 0, _a = _this.data; _i < _a.length; _i++) {
                var element = _a[_i];
                var el = _this.layout.get(element.hash);
                if (el && typeof el.getBoundingClientRect === "function") {
                    var r = el.getBoundingClientRect();
                    var v = _this.visible(el, r, height);
                    // Process clicks for only visible elements
                    if (_this.max === null || v) {
                        for (var i = 0; i < element.points; i++) {
                            var x = Math.round(r.left + (element.x[i] / 32767 /* Data.Setting.ClickPrecision */) * r.width);
                            var y = Math.round(r.top + (element.y[i] / 32767 /* Data.Setting.ClickPrecision */) * r.height);
                            var k = "".concat(x).concat("X" /* Constant.Separator */).concat(y).concat("X" /* Constant.Separator */).concat(v ? 1 : 0);
                            points[k] = k in points ? points[k] + element.clicks[i] : element.clicks[i];
                            localMax = Math.max(points[k], localMax);
                        }
                    }
                }
            }
            // Set the max value from the firs t
            _this.max = _this.max ? _this.max : localMax;
            // Once all points are accounted for, convert everything into absolute (x, y)
            for (var _b = 0, _c = Object.keys(points); _b < _c.length; _b++) {
                var coordinates = _c[_b];
                var parts = coordinates.split("X" /* Constant.Separator */);
                var alpha = Math.min((points[coordinates] / _this.max) + 0.15 /* Setting.AlphaBoost */, 1);
                if (parts[2] === "1") {
                    output.push({ x: parseInt(parts[0], 10), y: parseInt(parts[1], 10), a: alpha });
                }
            }
            return output;
        };
        this.visible = function (el, r, height) {
            var doc = _this.state.window.document;
            var visibility = r.height > height ? true : false;
            if (visibility === false && r.width > 0 && r.height > 0) {
                while (!visibility && doc) {
                    var shadowElement = null;
                    var elements = doc.elementsFromPoint(r.left + (r.width / 2), r.top + (r.height / 2));
                    for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
                        var e = elements_1[_i];
                        // Ignore if top element ends up being the canvas element we added for heatmap visualization
                        if (e.tagName === "CANVAS" /* Constant.Canvas */ || (e.id && e.id.indexOf("clarity-" /* Constant.ClarityPrefix */) === 0)) {
                            continue;
                        }
                        visibility = e === el;
                        shadowElement = e.shadowRoot && e.shadowRoot != doc ? e.shadowRoot : null;
                        break;
                    }
                    doc = shadowElement;
                }
            }
            return visibility && r.bottom >= 0 && r.top <= height;
        };
        this.state = state;
        this.layout = layout;
    }
    HeatmapHelper.COLORS = ["blue", "cyan", "lime", "yellow", "red"];
    return HeatmapHelper;
}());

var InteractionHelper = /** @class */ (function () {
    function InteractionHelper(state, layout) {
        var _this = this;
        this.hoverId = null;
        this.targetId = null;
        this.points = [];
        this.scrollPointIndex = 0;
        this.clickAudio = null;
        this.reset = function () {
            _this.points = [];
            _this.scrollPointIndex = 0;
            _this.clickAudio = null;
            _this.hoverId = null;
            _this.targetId = null;
            _this.layout.reset();
        };
        this.scroll = function (event) {
            var data = event.data;
            var doc = _this.state.window.document;
            var de = doc.documentElement;
            var scrollTarget = _this.layout.element(data.target) || doc.body;
            var scrollable = scrollTarget.scrollHeight > scrollTarget.clientHeight || scrollTarget.scrollWidth > scrollTarget.clientWidth;
            if (scrollTarget && scrollable) {
                scrollTarget.scrollTo(data.x, data.y);
                // In an edge case, scrolling API doesn't work when css on HTML element has height:100% and overflow:auto
                // In those cases, we fall back to scrolling the body element.
                if (scrollTarget === de && scrollTarget.offsetTop !== data.y) {
                    scrollTarget = doc.body;
                    scrollTarget.scrollTo(data.x, data.y);
                }
            }
            // Position canvas relative to scroll events on the parent page
            if (scrollTarget === de || scrollTarget === doc.body) {
                if (!scrollable) {
                    _this.state.window.scrollTo(data.x, data.y);
                }
                var canvas = _this.overlay();
                if (canvas) {
                    canvas.style.left = data.x + "px" /* Constant.Pixel */;
                    canvas.style.top = data.y + "px" /* Constant.Pixel */;
                    canvas.width = de.clientWidth;
                    canvas.height = de.clientHeight;
                }
                _this.scrollPointIndex = _this.points.length;
            }
        };
        this.resize = function (event) {
            var data = event.data;
            var width = data.width;
            var height = data.height;
            if (_this.state.options.onresize) {
                _this.state.options.onresize(width, height);
            }
        };
        this.visibility = function (event) {
            var doc = _this.state.window.document;
            if (doc && doc.documentElement && event.data.visible !== "visible" /* Constant.Visible */) {
                doc.documentElement.style.backgroundColor = "black" /* Constant.Black */;
                doc.documentElement.style.opacity = "0.4" /* Constant.HiddenOpacity */;
            }
            else {
                doc.documentElement.style.backgroundColor = "transparent" /* Constant.Transparent */;
                doc.documentElement.style.opacity = "1" /* Constant.VisibleOpacity */;
            }
        };
        this.input = function (event) {
            var data = event.data;
            var el = _this.layout.element(data.target);
            if (el) {
                switch (el.type) {
                    case "checkbox":
                    case "radio":
                        el.checked = data.value === "true";
                        break;
                    default:
                        el.value = data.value;
                        break;
                }
            }
        };
        this.selection = function (event) {
            var data = event.data;
            var doc = _this.state.window.document;
            var s = doc.getSelection();
            // Wrapping selection code inside a try / catch to avoid throwing errors when dealing with elements inside the shadow DOM.
            try {
                s.setBaseAndExtent(_this.layout.element(data.start), data.startOffset, _this.layout.element(data.end), data.endOffset);
            }
            catch (ex) {
                console.warn("Exception encountered while trying to set selection: " + ex);
            }
        };
        this.pointer = function (event) {
            var data = event.data;
            var type = event.event;
            var doc = _this.state.window.document;
            var de = doc.documentElement;
            var p = doc.getElementById("clarity-pointer" /* Constant.PointerLayer */);
            var pointerWidth = 29 /* Setting.PointerWidth */;
            var pointerHeight = 38 /* Setting.PointerHeight */;
            if (p === null) {
                p = doc.createElement("DIV");
                p.id = "clarity-pointer" /* Constant.PointerLayer */;
                de.appendChild(p);
                // Add custom styles
                var style = doc.createElement("STYLE");
                style.textContent =
                    "@keyframes pulsate-one { 0% { transform: scale(1, 1); opacity: 1; } 100% { transform: scale(3, 3); opacity: 0; } }" +
                        "@keyframes pulsate-two { 0% { transform: scale(1, 1); opacity: 1; } 100% { transform: scale(5, 5); opacity: 0; } }" +
                        "@keyframes pulsate-touch { 0% { transform: scale(1, 1); opacity: 1; } 100% { transform: scale(2, 2); opacity: 0; } }" +
                        "@keyframes disappear { 90% { transform: scale(1, 1); opacity: 1; } 100% { transform: scale(1.3, 1.3); opacity: 0; } }" +
                        "#".concat("clarity-interaction-canvas" /* Constant.InteractionCanvas */, " { position: absolute; left: 0; top: 0; z-index: ").concat(2147483647 /* Setting.ZIndex */, "; background: none; }") +
                        "#".concat("clarity-pointer" /* Constant.PointerLayer */, " { position: absolute; z-index: ").concat(2147483647 /* Setting.ZIndex */, "; url(").concat("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAmCAYAAAA4LpBhAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAASDSURBVHgB7VdPTCNlFH8z0/+FFmRatnFNiDGR4O4mBk08smZvXjjIxRueNME9eHGNxoLxSNwr4WyigYToQRJLjXDzQtDNmnhR4kWWAJm20ymddtrx94bvI9NBWAptsod9ycvM92fe73vv/b73fUP0DIlCfRQ1AMTtjwcHB1+gPgOT67oK6+TkZBjNbxRF+X1gYCCDPpX6IKdGAaTu7++HuG9tbe1ONBr9GR7r+Xy+98DsIRuemJiIjI6OJgH+3e7urruzs+OOjIw8SiaTNwRwz8OtQWPpdHoYoKt///ar2/jxaw84k8k8gt5YWVnRqEfi90BrtVph0Uetx0V67d9fqFAo3G6324XZ2VldLK4noK4AVqvVaoh8YZTAxWLxdiwW20CoM70IdceWicfjSpCxfuBEIrGxsLCQZR7QNcQDwFaRRhRmcXCSL9S3kN8CtlP2Oqz2QoWt4Q4NDanHx8cy3HQBMIe6sLS0pF811B7I5uYmhUKh1nmAQWAOteM4xcXFxczMzEzXHp+u9PDwUBHvymWBmVzr6+t6t9tJhtPzEEYuFaoguebm5nTqJOXFoMxEVCO50tMFXBaYcwwbGwAfRagv5bEKthK2igdUr9epG/EDYw//xKGmzoLz/6BQd3t7m5i9dAUJsJoLSPZp5PIGp6amXHjsVSaEirqVALk8jy/axx2hwAcMTlcRH/Ad5LfA24kEZ4JzudbySSJzyqDnomq37pH14utH/iUrCA5HCeRwHYXc8dzNNs5jfXp6uoD+e/Pz8zzfDYIqq6urihg4NyTaK2/Rw8fNo0/euWvBWI3TwGAiHW2RnjY7LRVjX+7t7d3nSWL8FFSKIj46I0r2ZXr4R/PoQT5f1TTtU3Q5OAbbbAxtV4BwXx07wUI5raJdTaVS5vLysmYYhlyMDJBHJBoeHpbFwQ0CfmuP04P8V1VVVb9AVwXGy/xE6SyHw2FuW9Aa2jYAHVx1HAZh78bGxs44wYkm0zS9PPrC1QE4+8HcPwD8HONPYNzEkAU1UX+raFcYmPswzhu9ISLmShIdHBx0lFfVH2s+SyWR/IBofgYvnmCIPTQjkYiBk8mARwYWU4aW8F5uNpslXHkstBncxjcOeyqJ6vfUO9oQd2avlyeKJj3A9z/8yAOE7uHKUgGoiRQYMFZCdEq2bZfgpYFnmd9xzprlcrnCOdV13cbWaWKezGVnAUBOmVBpkOAlPH/AxuYJu/DoPQDcxfubeB/ncZCDL+IpaDKgiVwul8AzDo1BI3RC1HPLIg+mYPQmvPke+hdY+S68ehuevIHQvYpV5/i2KIxKg5pUUew1AaL6wM4cl4oPFJjxFMJ0H6BbIIgBwAbeLSzABLBVKpVszGvSCf27r5dCNE7h1tYWX1U0ECHUaDT+REhryKENrTFbwdLj+skRxIAeM+ka4rGV2QWv2vCIjVoAryC0Jk6MCk6fGvoY0OkFoF80UDsG8AG8j/BtD78YWRSMNNoJQbSe/1Zw0tmwBB6kE0ZG+wXI4v1ECYAIdbKzf/+povypEui6t/jnwvIf5FVJ1Cj/1+UAAAAASUVORK5CYII=" /* Asset.Pointer */, ") no-repeat left center; width: ").concat(pointerWidth, "px; height: ").concat(pointerHeight, "px; }") +
                        ".".concat("clarity-click" /* Constant.ClickLayer */, ", .").concat("clarity-click-ring" /* Constant.ClickRing */, ", .").concat("clarity-touch" /* Constant.TouchLayer */, ", .").concat("clarity-touch-ring" /* Constant.TouchRing */, " { position: absolute; z-index: ").concat(2147483647 /* Setting.ZIndex */, "; border-radius: 50%; background: radial-gradient(rgba(0,90,158,0.8), transparent); width: ").concat(22 /* Setting.ClickRadius */, "px; height: ").concat(22 /* Setting.ClickRadius */, "px;}") +
                        ".".concat("clarity-click-ring" /* Constant.ClickRing */, " { background: transparent; border: 1px solid rgba(0,90,158,0.8); }") +
                        ".".concat("clarity-touch" /* Constant.TouchLayer */, " { background: radial-gradient(rgba(242,97,12,1), transparent); }") +
                        ".".concat("clarity-touch-ring" /* Constant.TouchRing */, " { background: transparent; border: 1px solid rgba(242,97,12,0.8); }") +
                        ".".concat("clarity-pointer-click" /* Constant.PointerClickLayer */, " { background-image: url(").concat("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAmCAYAAAA4LpBhAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAVoSURBVHgB7VdNTCRFGP2qe6aBGRhA5mfJ7kZcV0XQTQx68MYabl44yMWbetAY3IMX12gWMCZeSLwSEi/GiAHF1SjqMAhoshuTJbg/GkM0xMQIBMj8D/Nfvq+6enZmEtFdhsSDRT66q6qnXr33varqJvoPFUHHWIw6IK6/2tbWdg8dMzBJKQXHwMCAG9UPhBDXW1tbA2gz6BhKZVAAGTs7Oy5um5+fP9fU1LQExv6xsbHGAzNDHrivr88KhUJegH+0ubkp19fXZVdX1w2v13tCAzdcbhPR3N7e3gnQuY0ry3L7nRcUcCAQuIE4MTs7a1IDi9CgXuQxCNBPNq6uyF+HWuTO5IvVjEP6uSMXlk1qYCOVSnFOgYvRLUtmVmbp9HfvUSQSebS5uXkRwIFGSF2zZFpaWoTtWEHCcgvDclPm+4/p3qvvK2CPx7M4MTERZB/QEYoCxVJxBhHsYvwn0+2WKiyLslc+pfuufSjD4fAjyG+Y03AUVyupsDRkR0eHcXBwYMuNKQi3BaYIt5uYce6Hz8XZ63MMzFKHp6am/HcrtQJZWVkhl8tVIju/KqkmgBxAdQXr3LUv6exPl5XUxWIxMjk5GRgZGbljxpWZ7u3tCX3PPCuALDEYk2Ytij9+RQ9ufFEx18LCgv9Ol5PjXsUQg9hSsXubLA3IwC7JoVgjSjfD9PDm1xVzjY6O+qnWlIeDshOxGzkzVRNgeW2mdl6FfXVkxiQsKv/8LfX9sUScY4yxCPAQpP5XjA0GwFJRTLPZrG5mUFcln6Ytc+Uq0CdcLgAvyf4/lxUw1vA3LDVVpexQedfW1ojdW2m1N4cKM8PllqLKUMI0SRhCsuVKtyLUv7XsuJo3kOA/mUt1Dg4OsqRqZ4JUPJZtIttAaqMAMzQarH8NCzwqSzcjghlrcynGh63jGinwA5VP9efIaBr2vqgBnGeltH+nJonCjPts4HPIb5iXE2nP1IPyXssniZNTBhVq0RhC3p6QTd/oHxLpk4/t356yelQawijrecnek6fKOI/9w8PDYQw1ND4+zs/LelAxNzcndIdRLRwzs5kIYT7wJL17q7D/2tPn0+jIcDunRDMt6/SUmbQT6Htra2vrAj+k+yugFRT9I6qVEGxCZwCY3784dillmubr6CqWSqUyD4a61CDclsVKSGM7TaGe8vl8yenpaTMajTqTqeSUjUSdnZ3O5iCrYUXwDM1ke+ni2NspwzAuoTGBweN8xdYZd7vdXE8jMqjnAFjEq06RQZhdT08P1RdONCWTSaEFdeSyqQfvFzO5XnrupdHfAfgm+rcxeBJdaUQS+28K9QQDcxv6eaHntWLSMdHu7q6zxWorVGnNZ6nQVmVJmSEDovoGWGyjixkmLcuK4mSKglEUk4kjYriPFwqFGF550qgzeA6/KTJTx6jVTNXRBt3ZvSpP1OSlmYNeev7lVxQgYqtcLicAmkQKohgsBnViuVwuBpZRXON8j3M2GY/HE5xTv9+fw9Ip4DknlzXAnFM2VDtMcBrXz7Cw+YFNMHoWAOdx/wTue7kf5uAXcR/CWxee7u5uD64tiGaERbZR/3Zb5E4fBj0FNpcRv8GVz4DVU2DyOKR7CLPu5rdFPagzoOmE3uxNDWJUgYl6UFEFCswWH2S6ANBVGCQKwDzu05hAEsDpWCyWw3MFsu0v6S6LySlcXV3lVxUTRnDl8/lfIGkGOcwhMuxWuPQgax9BDKicSUcoyq3sLrAqgxEPmgZ4AtImcWIkcPpk0MaAxUYAVhcT1m4GeCvuu/htD58YQWwY7ah7tNEa/lnBSeeBHeA2sh3ZdFyAXNRHlAawqNadx/edqrc/wwE66lv8/4XLX3gjac6XP/Y1AAAAAElFTkSuQmCC" /* Asset.Click */, "); }") +
                        ".".concat("clarity-pointer-none" /* Constant.PointerNone */, " { background: none; }") +
                        ".".concat("clarity-pointer-move" /* Constant.PointerMove */, " { background-image: url(").concat("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAmCAYAAAA4LpBhAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAASDSURBVHgB7VdPTCNlFH8z0/+FFmRatnFNiDGR4O4mBk08smZvXjjIxRueNME9eHGNxoLxSNwr4WyigYToQRJLjXDzQtDNmnhR4kWWAJm20ymddtrx94bvI9NBWAptsod9ycvM92fe73vv/b73fUP0DIlCfRQ1AMTtjwcHB1+gPgOT67oK6+TkZBjNbxRF+X1gYCCDPpX6IKdGAaTu7++HuG9tbe1ONBr9GR7r+Xy+98DsIRuemJiIjI6OJgH+3e7urruzs+OOjIw8SiaTNwRwz8OtQWPpdHoYoKt///ar2/jxaw84k8k8gt5YWVnRqEfi90BrtVph0Uetx0V67d9fqFAo3G6324XZ2VldLK4noK4AVqvVaoh8YZTAxWLxdiwW20CoM70IdceWicfjSpCxfuBEIrGxsLCQZR7QNcQDwFaRRhRmcXCSL9S3kN8CtlP2Oqz2QoWt4Q4NDanHx8cy3HQBMIe6sLS0pF811B7I5uYmhUKh1nmAQWAOteM4xcXFxczMzEzXHp+u9PDwUBHvymWBmVzr6+t6t9tJhtPzEEYuFaoguebm5nTqJOXFoMxEVCO50tMFXBaYcwwbGwAfRagv5bEKthK2igdUr9epG/EDYw//xKGmzoLz/6BQd3t7m5i9dAUJsJoLSPZp5PIGp6amXHjsVSaEirqVALk8jy/axx2hwAcMTlcRH/Ad5LfA24kEZ4JzudbySSJzyqDnomq37pH14utH/iUrCA5HCeRwHYXc8dzNNs5jfXp6uoD+e/Pz8zzfDYIqq6urihg4NyTaK2/Rw8fNo0/euWvBWI3TwGAiHW2RnjY7LRVjX+7t7d3nSWL8FFSKIj46I0r2ZXr4R/PoQT5f1TTtU3Q5OAbbbAxtV4BwXx07wUI5raJdTaVS5vLysmYYhlyMDJBHJBoeHpbFwQ0CfmuP04P8V1VVVb9AVwXGy/xE6SyHw2FuW9Aa2jYAHVx1HAZh78bGxs44wYkm0zS9PPrC1QE4+8HcPwD8HONPYNzEkAU1UX+raFcYmPswzhu9ISLmShIdHBx0lFfVH2s+SyWR/IBofgYvnmCIPTQjkYiBk8mARwYWU4aW8F5uNpslXHkstBncxjcOeyqJ6vfUO9oQd2avlyeKJj3A9z/8yAOE7uHKUgGoiRQYMFZCdEq2bZfgpYFnmd9xzprlcrnCOdV13cbWaWKezGVnAUBOmVBpkOAlPH/AxuYJu/DoPQDcxfubeB/ncZCDL+IpaDKgiVwul8AzDo1BI3RC1HPLIg+mYPQmvPke+hdY+S68ehuevIHQvYpV5/i2KIxKg5pUUew1AaL6wM4cl4oPFJjxFMJ0H6BbIIgBwAbeLSzABLBVKpVszGvSCf27r5dCNE7h1tYWX1U0ECHUaDT+REhryKENrTFbwdLj+skRxIAeM+ka4rGV2QWv2vCIjVoAryC0Jk6MCk6fGvoY0OkFoF80UDsG8AG8j/BtD78YWRSMNNoJQbSe/1Zw0tmwBB6kE0ZG+wXI4v1ECYAIdbKzf/+povypEui6t/jnwvIf5FVJ1Cj/1+UAAAAASUVORK5CYII=" /* Asset.Pointer */, "); }");
                p.appendChild(style);
            }
            p.style.left = (data.x - 4 /* Setting.PointerOffset */) + "px" /* Constant.Pixel */;
            p.style.top = (data.y - 4 /* Setting.PointerOffset */) + "px" /* Constant.Pixel */;
            var title = "Pointer";
            switch (type) {
                case 9 /* Data.Event.Click */:
                    title = "Click";
                    _this.drawClick(doc, data.x, data.y, title);
                    p.className = "clarity-pointer-none" /* Constant.PointerNone */;
                    break;
                case 16 /* Data.Event.DoubleClick */:
                    title = "Click";
                    _this.drawClick(doc, data.x, data.y, title);
                    p.className = "clarity-pointer-none" /* Constant.PointerNone */;
                    break;
                case 17 /* Data.Event.TouchStart */:
                case 18 /* Data.Event.TouchEnd */:
                case 20 /* Data.Event.TouchCancel */:
                    title = "Touch";
                    _this.drawTouch(doc, data.x, data.y, title);
                    p.className = "clarity-pointer-none" /* Constant.PointerNone */;
                    break;
                case 19 /* Data.Event.TouchMove */:
                    title = "Touch Move";
                    p.className = "clarity-pointer-none" /* Constant.PointerNone */;
                    break;
                case 12 /* Data.Event.MouseMove */:
                    title = "Mouse Move";
                    p.className = "clarity-pointer-move" /* Constant.PointerMove */;
                    _this.addPoint({ time: event.time, x: data.x, y: data.y });
                    _this.targetId = data.target;
                    break;
                default:
                    p.className = "clarity-pointer-move" /* Constant.PointerMove */;
                    break;
            }
            p.setAttribute("title" /* Constant.Title */, "".concat(title, " (").concat(data.x).concat("px" /* Constant.Pixel */, ", ").concat(data.y).concat("px" /* Constant.Pixel */, ")"));
        };
        this.hover = function () {
            if (_this.targetId && _this.targetId !== _this.hoverId) {
                var depth = 0;
                // First, remove any previous hover class assignments
                var hoverNode = _this.hoverId ? _this.layout.element(_this.hoverId) : null;
                while (hoverNode && depth < 7 /* Setting.HoverDepth */) {
                    if ("removeAttribute" in hoverNode) {
                        hoverNode.removeAttribute("clarity-hover" /* Constant.HoverAttribute */);
                    }
                    hoverNode = hoverNode.parentElement;
                    depth++;
                }
                // Then, add hover class on elements that are below the pointer
                depth = 0;
                var targetNode = _this.targetId ? _this.layout.element(_this.targetId) : null;
                while (targetNode && depth < 7 /* Setting.HoverDepth */) {
                    if ("setAttribute" in targetNode) {
                        targetNode.setAttribute("clarity-hover" /* Constant.HoverAttribute */, "" /* Layout.Constant.Empty */);
                    }
                    targetNode = targetNode.parentElement;
                    depth++;
                }
                // Finally, update hoverId to reflect the new node
                _this.hoverId = _this.targetId;
            }
        };
        this.addPoint = function (point) {
            var last = _this.points.length > 0 ? _this.points[_this.points.length - 1] : null;
            if (last && point.x === last.x && point.y === last.y) {
                last.time = point.time;
            }
            else {
                _this.points.push(point);
            }
        };
        this.drawTouch = function (doc, x, y, title) {
            var de = doc.documentElement;
            var touch = doc.createElement("DIV");
            touch.className = "clarity-touch" /* Constant.TouchLayer */;
            touch.setAttribute("title" /* Constant.Title */, "".concat(title, " (").concat(x).concat("px" /* Constant.Pixel */, ", ").concat(y).concat("px" /* Constant.Pixel */, ")"));
            touch.style.left = (x - 22 /* Setting.ClickRadius */ / 2) + "px" /* Constant.Pixel */;
            touch.style.top = (y - 22 /* Setting.ClickRadius */ / 2) + "px" /* Constant.Pixel */;
            touch.style.animation = "disappear 1 1s";
            touch.style.animationFillMode = "forwards";
            de.appendChild(touch);
            // First pulsating ring
            var ringOne = touch.cloneNode();
            ringOne.className = "clarity-touch-ring" /* Constant.TouchRing */;
            ringOne.style.left = "-0.5" + "px" /* Constant.Pixel */;
            ringOne.style.top = "-0.5" + "px" /* Constant.Pixel */;
            ringOne.style.animation = "pulsate-touch 1 1s";
            ringOne.style.animationFillMode = "forwards";
            touch.appendChild(ringOne);
        };
        this.drawClick = function (doc, x, y, title) {
            var de = doc.documentElement;
            var click = doc.createElement("DIV");
            click.className = "clarity-click" /* Constant.ClickLayer */;
            click.setAttribute("title" /* Constant.Title */, "".concat(title, " (").concat(x).concat("px" /* Constant.Pixel */, ", ").concat(y).concat("px" /* Constant.Pixel */, ")"));
            click.style.left = (x - 22 /* Setting.ClickRadius */ / 2) + "px" /* Constant.Pixel */;
            click.style.top = (y - 22 /* Setting.ClickRadius */ / 2) + "px" /* Constant.Pixel */;
            de.appendChild(click);
            // First pulsating ring
            var ringOne = click.cloneNode();
            ringOne.className = "clarity-click-ring" /* Constant.ClickRing */;
            ringOne.style.left = "-0.5" + "px" /* Constant.Pixel */;
            ringOne.style.top = "-0.5" + "px" /* Constant.Pixel */;
            ringOne.style.animation = "pulsate-one 1 1s";
            ringOne.style.animationFillMode = "forwards";
            click.appendChild(ringOne);
            // Second pulsating ring
            var ringTwo = ringOne.cloneNode();
            ringTwo.style.animation = "pulsate-two 1 1s";
            click.appendChild(ringTwo);
            // Play sound
            if (typeof Audio !== "undefined" /* Constant.Undefined */) {
                if (_this.clickAudio === null) {
                    _this.clickAudio = new Audio("data:video/webm;base64,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" /* Asset.Sound */);
                    click.appendChild(_this.clickAudio);
                }
                _this.clickAudio.play();
            }
        };
        this.overlay = function () {
            // Create canvas for visualizing interactions
            var doc = _this.state.window.document;
            var de = doc.documentElement;
            var canvas = doc.getElementById("clarity-interaction-canvas" /* Constant.InteractionCanvas */);
            if (canvas === null) {
                canvas = doc.createElement("canvas");
                canvas.id = "clarity-interaction-canvas" /* Constant.InteractionCanvas */;
                canvas.width = 0;
                canvas.height = 0;
                de.appendChild(canvas);
            }
            if (canvas.width !== de.clientWidth || canvas.height !== de.clientHeight) {
                canvas.width = de.clientWidth;
                canvas.height = de.clientHeight;
            }
            return canvas;
        };
        this.match = function (time) {
            var p = [];
            for (var i = _this.points.length - 1; i > 0; i--) {
                // Each pixel in the trail has a pixel life of 3s. The only exception to this is if the user scrolled.
                // We reset the trail after every scroll event to avoid drawing weird looking trail.
                if (i >= _this.scrollPointIndex && time - _this.points[i].time < 3000 /* Setting.PixelLife */) {
                    p.push(_this.points[i]);
                }
                else {
                    break;
                }
            }
            return p.slice(0, 75 /* Setting.MaxTrailPoints */);
        };
        this.trail = function (now) {
            var canvas = _this.overlay();
            if (_this.state.options.canvas && canvas) {
                var ctx = canvas.getContext('2d');
                var path = _this.state.options.keyframes ? _this.curve(_this.points.reverse()) : _this.curve(_this.match(now));
                // Update hovered elements
                _this.hover();
                // We need at least two points to create a line
                if (path.length > 1) {
                    var last = path[0];
                    // Start off by clearing whatever was on the canvas before
                    // The current implementation is inefficient. We have to redraw canvas all over again for every point.
                    // In future we should batch pointer events and minimize the number of times we have to redraw canvas.
                    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                    var count = path.length;
                    var offsetX = canvas.offsetLeft;
                    var offsetY = canvas.offsetTop;
                    for (var i = 1; i < count; i++) {
                        var current = path[i];
                        // Compute percentage position of these points compared to all points in the path
                        var lastFactor = 1 - ((i - 1) / count);
                        var currentFactor = 1 - (i / count);
                        // Generate a color gradient that goes from red -> yellow -> green -> light blue -> blue
                        var gradient = ctx.createLinearGradient(last.x, last.y, current.x, current.y);
                        gradient.addColorStop(1, _this.color(currentFactor));
                        gradient.addColorStop(0, _this.color(lastFactor));
                        // Line width of the trail shrinks as the position of the point goes farther away.
                        ctx.lineWidth = 6 /* Setting.TrailWidth */ * currentFactor;
                        ctx.lineCap = "round" /* Constant.Round */;
                        ctx.lineJoin = "round" /* Constant.Round */;
                        ctx.strokeStyle = gradient;
                        ctx.beginPath();
                        // The coordinates need to be relative to where canvas is rendered.
                        // In case of scrolling on the page, canvas may be relative to viewport
                        // while trail points are relative to screen origin (0, 0). We make the adjustment so trail looks right.
                        ctx.moveTo(last.x - offsetX, last.y - offsetY);
                        ctx.lineTo(current.x - offsetX, current.y - offsetY);
                        ctx.stroke();
                        ctx.closePath();
                        last = current;
                    }
                }
                // If we are only rendering key frames, clear points array after each key frame
                if (_this.state.options.keyframes) {
                    _this.points = [];
                }
            }
        };
        this.color = function (factor) {
            var s = InteractionHelper.TRAIL_START_COLOR;
            var e = InteractionHelper.TRAIL_END_COLOR;
            var c = [];
            for (var i = 0; i < 3; i++) {
                c[i] = Math.round(e[i] + factor * (s[i] - e[i]));
            }
            return "rgba(".concat(c[0], ", ").concat(c[1], ", ").concat(c[2], ", ").concat(factor, ")");
        };
        // Reference: https://en.wikipedia.org/wiki/Cubic_Hermite_spline#Cardinal_spline
        this.curve = function (path) {
            var tension = 0.5;
            var p = [];
            var output = [];
            // Make a copy of the input points so we don't make any side effects
            p = path.slice(0);
            // The algorithm require a valid previous and next point for each point in the original input
            // Duplicate first and last point in the path to the beginning and the end of the array respectively
            // E.g. [{x:37,y:45}, {x:54,y:34}] => [{x:37,y:45}, {x:37,y:45}, {x:54,y:34}, {x:54,y:34}]
            p.unshift(path[0]);
            p.push(path[path.length - 1]);
            // Loop through the points, and generate intermediate points to make a smooth trail
            for (var i = 1; i < p.length - 2; i++) {
                var time = p[i].time;
                var segments = Math.max(Math.min(Math.round(_this.distance(p[i], p[i - 1])), 10), 1);
                for (var t = 0; t <= segments; t++) {
                    // Compute tension vectors
                    var t1 = { time: time, x: (p[i + 1].x - p[i - 1].x) * tension, y: (p[i + 1].y - p[i - 1].y) * tension };
                    var t2 = { time: time, x: (p[i + 2].x - p[i].x) * tension, y: (p[i + 2].y - p[i].y) * tension };
                    var step = t / segments;
                    // Compute cardinals
                    var c1 = 2 * Math.pow(step, 3) - 3 * Math.pow(step, 2) + 1;
                    var c2 = -(2 * Math.pow(step, 3)) + 3 * Math.pow(step, 2);
                    var c3 = Math.pow(step, 3) - 2 * Math.pow(step, 2) + step;
                    var c4 = Math.pow(step, 3) - Math.pow(step, 2);
                    // Compute new point with common control vectors
                    var x = c1 * p[i].x + c2 * p[i + 1].x + c3 * t1.x + c4 * t2.x;
                    var y = c1 * p[i].y + c2 * p[i + 1].y + c3 * t1.y + c4 * t2.y;
                    output.push({ time: time, x: x, y: y });
                }
            }
            return output;
        };
        this.distance = function (a, b) {
            var dx = a.x - b.x;
            var dy = a.y - b.y;
            return Math.sqrt(dx * dx + dy * dy);
        };
        this.state = state;
        this.layout = layout;
    }
    InteractionHelper.TRAIL_START_COLOR = [242, 97, 12]; // rgb(242,97,12)
    InteractionHelper.TRAIL_END_COLOR = [249, 220, 209]; // rgb(249,220,209)
    return InteractionHelper;
}());

var LayoutHelper = /** @class */ (function () {
    function LayoutHelper(state, isMobile) {
        if (isMobile === void 0) { isMobile = false; }
        var _this = this;
        this.stylesheets = [];
        this.fonts = [];
        this.nodes = {};
        this.events = {};
        this.hashMapAlpha = {};
        this.hashMapBeta = {};
        this.adoptedStyleSheets = {};
        this.animations = {};
        this.state = null;
        this.stylesToApply = {};
        this.reset = function () {
            _this.nodes = {};
            _this.stylesheets = [];
            _this.fonts = [];
            _this.events = {};
            _this.hashMapAlpha = {};
            _this.hashMapBeta = {};
        };
        this.get = function (hash) {
            if (hash in _this.hashMapBeta && _this.hashMapBeta[hash].isConnected) {
                return _this.hashMapBeta[hash];
            }
            else if (hash in _this.hashMapAlpha && _this.hashMapAlpha[hash].isConnected) {
                return _this.hashMapAlpha[hash];
            }
            return null;
        };
        this.addToHashMap = function (data, parent) {
            // In case of selector collision, prefer the first inserted node
            _this.hashMapAlpha[data.hashAlpha] = _this.get(data.hashAlpha) || parent;
            _this.hashMapBeta[data.hashBeta] = _this.get(data.hashBeta) || parent;
        };
        this.resize = function (el, width, height) {
            if (el && el.nodeType === 1 /* NodeType.ELEMENT_NODE */ && width && height) {
                el.style.width = width + "px" /* Layout.Constant.Pixel */;
                el.style.height = height + "px" /* Layout.Constant.Pixel */;
                el.style.boxSizing = "border-box" /* Layout.Constant.BorderBox */; // Reference: https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing
            }
        };
        this.element = function (nodeId) {
            return nodeId !== null && nodeId > 0 && nodeId in _this.nodes ? _this.nodes[nodeId] : null;
        };
        this.animateChange = function (event) {
            var animation = _this.animations[event.data.id];
            if (!animation && event.data.operation !== 0 /* AnimationOperation.Create */) {
                // We didn't have a reference to this animation. This shouldn't happen, but returning here
                // to ensure we don't throw any errors.
                return;
            }
            switch (event.data.operation) {
                case 0 /* AnimationOperation.Create */:
                    var target = _this.element(event.data.targetId);
                    // only create the animation if we successfully found the target, an animation without a target will throw an error
                    if (target) {
                        _this.animations[event.data.id] = target.animate(JSON.parse(event.data.keyFrames), JSON.parse(event.data.timing));
                    }
                    break;
                case 3 /* AnimationOperation.Cancel */:
                    animation.cancel();
                    break;
                case 4 /* AnimationOperation.Finish */:
                    animation.finish();
                    break;
                case 2 /* AnimationOperation.Pause */:
                    animation.pause();
                    break;
                case 1 /* AnimationOperation.Play */:
                    animation.play();
                    break;
            }
        };
        this.dom = function (event, useproxy) { return __awaiter(_this, void 0, void 0, function () {
            var doc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!event) return [3 /*break*/, 2];
                        doc = this.state.window.document;
                        if (!(doc && doc.documentElement)) return [3 /*break*/, 2];
                        doc.documentElement.style.visibility = "hidden" /* Constant.Hidden */;
                        // Render all DOM events to reconstruct the page
                        this.markup(event, useproxy);
                        // Wait on all stylesheets and fonts to finish loading
                        return [4 /*yield*/, Promise.all(this.stylesheets.concat(this.fonts))];
                    case 1:
                        // Wait on all stylesheets and fonts to finish loading
                        _a.sent();
                        // Toggle back the visibility of target window
                        doc.documentElement.style.visibility = "visible" /* Constant.Visible */;
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); };
        this.styleChange = function (event) {
            switch (event.event) {
                case 46 /* Data.Event.StyleSheetUpdate */:
                    var styleSheet = _this.adoptedStyleSheets[event.data.id];
                    if (!styleSheet && event.data.operation !== 0 /* StyleSheetOperation.Create */) {
                        return;
                    }
                    switch (event.data.operation) {
                        case 0 /* StyleSheetOperation.Create */:
                            _this.adoptedStyleSheets[event.data.id] = new _this.state.window.CSSStyleSheet();
                            break;
                        case 1 /* StyleSheetOperation.Replace */:
                            styleSheet.replace(event.data.cssRules);
                            break;
                        case 2 /* StyleSheetOperation.ReplaceSync */:
                            styleSheet.replaceSync(event.data.cssRules);
                            break;
                    }
                    break;
                case 45 /* Data.Event.StyleSheetAdoption */:
                    _this.setDocumentStyles(event.data.id, event.data.newIds);
                    break;
            }
        };
        this.exists = function (hash) {
            if (hash) {
                var match = _this.get(hash);
                if (match) {
                    var rectangle = match.getBoundingClientRect();
                    return rectangle && rectangle.width > 0 && rectangle.height > 0;
                }
            }
            return false;
        };
        this.markup = function (event, useproxy) {
            var _a, _b, _c, _d, _e;
            var data = event.data;
            var type = event.event;
            var doc = _this.state.window.document;
            var retryEvent = {
                data: [],
                time: event.time,
                event: event.event
            };
            var _loop_1 = function (node) {
                var parent_1 = _this.element(node.parent);
                var pivot = _this.element(node.previous);
                var insert = _this.insertAfter;
                var tag = node.tag;
                if (tag && tag.indexOf("iframe:" /* Layout.Constant.IFramePrefix */) === 0) {
                    tag = node.tag.substr("iframe:" /* Layout.Constant.IFramePrefix */.length);
                }
                if (parent_1 === null && node.parent !== null && node.parent > -1 && tag !== "HTML") {
                    // We are referencing a parent for this node that hasn't been created yet. Push it to a list of nodes to 
                    // try once we are finished with other nodes within this event. Though we don't require HTML tags to
                    // have a parent as they are typically the root.
                    retryEvent.data.push(node);
                    return "continue";
                }
                switch (tag) {
                    case "*D" /* Layout.Constant.DocumentTag */:
                        var tagDoc = tag !== node.tag ? (parent_1 ? parent_1.contentDocument : null) : doc;
                        if (tagDoc && tagDoc === doc && type === 5 /* Data.Event.Discover */) {
                            _this.reset();
                        }
                        if (typeof XMLSerializer !== "undefined" && tagDoc) {
                            tagDoc.open();
                            tagDoc.write(new XMLSerializer().serializeToString(tagDoc.implementation.createDocumentType(node.attributes["name"], node.attributes["publicId"], node.attributes["systemId"])));
                            tagDoc.close();
                        }
                        break;
                    case "*P" /* Layout.Constant.PolyfillShadowDomTag */:
                        // In case of polyfill, map shadow dom to it's parent for rendering purposes
                        // All its children should be inserted as regular children to the parent node.
                        _this.nodes[node.id] = parent_1;
                        _this.addToHashMap(node, parent_1);
                        break;
                    case "*S" /* Layout.Constant.ShadowDomTag */:
                        if (parent_1) {
                            var shadowRoot = _this.element(node.id);
                            shadowRoot = shadowRoot ? shadowRoot : parent_1.attachShadow({ mode: "open" });
                            _this.nodes[node.id] = shadowRoot;
                            _this.addToHashMap(node, shadowRoot);
                            _this.addStyles(node.id);
                        }
                        break;
                    case "*T" /* Layout.Constant.TextTag */:
                        var textElement = _this.element(node.id);
                        textElement = textElement ? textElement : doc.createTextNode(null);
                        textElement.nodeValue = node.value;
                        insert(node, parent_1, textElement, pivot);
                        break;
                    case "*M" /* Layout.Constant.SuspendMutationTag */:
                        var suspendedElement = _this.element(node.id);
                        if (suspendedElement && suspendedElement.nodeType === Node.ELEMENT_NODE) {
                            suspendedElement.setAttribute("data-clarity-suspend" /* Constant.Suspend */, "" /* Layout.Constant.Empty */);
                        }
                        break;
                    case "HTML":
                        var htmlDoc = tag !== node.tag ? (parent_1 ? parent_1.contentDocument : null) : doc;
                        if (htmlDoc !== null) {
                            var docElement = _this.element(node.id);
                            if (docElement === null) {
                                var newDoc = htmlDoc.implementation.createHTMLDocument("" /* Layout.Constant.Empty */);
                                docElement = newDoc.documentElement;
                                var p = htmlDoc.importNode(docElement, true);
                                htmlDoc.replaceChild(p, htmlDoc.documentElement);
                                if (htmlDoc.head) {
                                    htmlDoc.head.parentNode.removeChild(htmlDoc.head);
                                }
                                if (htmlDoc.body) {
                                    htmlDoc.body.parentNode.removeChild(htmlDoc.body);
                                }
                            }
                            _this.setAttributes(htmlDoc.documentElement, node);
                            // If we are still processing discover events, keep the markup hidden until we are done
                            if (type === 5 /* Data.Event.Discover */ && !parent_1) {
                                htmlDoc.documentElement.style.visibility = "hidden" /* Constant.Hidden */;
                            }
                            _this.nodes[node.id] = htmlDoc.documentElement;
                            _this.addToHashMap(node, htmlDoc.documentElement);
                        }
                        break;
                    case "HEAD":
                        var headElement = _this.element(node.id);
                        if (headElement === null) {
                            headElement = doc.createElement(node.tag);
                            if (node.attributes && "*B" /* Layout.Constant.Base */ in node.attributes) {
                                var base = doc.createElement("base");
                                base.href = node.attributes["*B" /* Layout.Constant.Base */];
                                headElement.appendChild(base);
                            }
                            // Add custom styles to assist with visualization
                            var custom = doc.createElement("style");
                            custom.setAttribute("clarity-custom-styles" /* Constant.CustomStyleTag */, "true");
                            custom.innerText = _this.getCustomStyle();
                            headElement.appendChild(custom);
                        }
                        _this.setAttributes(headElement, node);
                        insert(node, parent_1, headElement, pivot);
                        break;
                    case "LINK":
                        var linkElement_1 = _this.element(node.id);
                        linkElement_1 = linkElement_1 ? linkElement_1 : _this.createElement(doc, node.tag);
                        if (!node.attributes) {
                            node.attributes = {};
                        }
                        _this.setAttributes(linkElement_1, node);
                        if ("rel" in node.attributes) {
                            if (node.attributes["rel"] === "stylesheet" /* Constant.StyleSheet */) {
                                _this.stylesheets.push(new Promise(function (resolve) {
                                    var proxy = useproxy !== null && useproxy !== void 0 ? useproxy : _this.state.options.useproxy;
                                    if (proxy) {
                                        if (linkElement_1.integrity) {
                                            linkElement_1.removeAttribute('integrity');
                                        }
                                        linkElement_1.href = proxy(linkElement_1.href, linkElement_1.id, "stylesheet" /* Constant.StyleSheet */);
                                    }
                                    linkElement_1.onload = linkElement_1.onerror = _this.style.bind(_this, linkElement_1, resolve);
                                    setTimeout(resolve, LayoutHelper.TIMEOUT);
                                }));
                            }
                            else if ((node.attributes["rel"].includes("preload") || node.attributes["rel"].includes("preconnect"))
                                && (((_a = node.attributes) === null || _a === void 0 ? void 0 : _a.as) === "style" || ((_b = node.attributes) === null || _b === void 0 ? void 0 : _b.as) === "font")) {
                                _this.fonts.push(new Promise(function (resolve) {
                                    var proxy = useproxy !== null && useproxy !== void 0 ? useproxy : _this.state.options.useproxy;
                                    linkElement_1.href = proxy ? proxy(linkElement_1.href, linkElement_1.id, node.attributes.as) : linkElement_1.href;
                                    linkElement_1.onload = linkElement_1.onerror = _this.style.bind(_this, linkElement_1, resolve);
                                    setTimeout(resolve, LayoutHelper.TIMEOUT);
                                }));
                            }
                        }
                        insert(node, parent_1, linkElement_1, pivot);
                        break;
                    case "IMG" /* Layout.Constant.ImageTag */:
                        var imgElement = (_c = _this.element(node.id)) !== null && _c !== void 0 ? _c : _this.createElement(doc, node.tag);
                        var proxy = useproxy !== null && useproxy !== void 0 ? useproxy : _this.state.options.useproxy;
                        if (proxy && !!((_d = node.attributes) === null || _d === void 0 ? void 0 : _d.src)) {
                            node.attributes.src = proxy(node.attributes.src, node.attributes.id, "IMG" /* Layout.Constant.ImageTag */);
                        }
                        _this.setAttributes(imgElement, node);
                        _this.resize(imgElement, node.width, node.height);
                        insert(node, parent_1, imgElement, pivot);
                        break;
                    case "STYLE":
                        var styleElement = (_e = _this.element(node.id)) !== null && _e !== void 0 ? _e : doc.createElement(node.tag);
                        _this.setAttributes(styleElement, node);
                        styleElement.textContent = node.value;
                        insert(node, parent_1, styleElement, pivot);
                        _this.style(styleElement);
                        break;
                    case "IFRAME":
                        var iframeElement = _this.element(node.id);
                        iframeElement = iframeElement ? iframeElement : _this.createElement(doc, node.tag);
                        if (!node.attributes) {
                            node.attributes = {};
                        }
                        _this.setAttributes(iframeElement, node);
                        insert(node, parent_1, iframeElement, pivot);
                        break;
                    default:
                        var domElement = _this.element(node.id);
                        domElement = domElement ? domElement : _this.createElement(doc, node.tag);
                        _this.setAttributes(domElement, node);
                        _this.resize(domElement, node.width, node.height);
                        insert(node, parent_1, domElement, pivot);
                        break;
                }
                // Track state for this node
                if (node.id) {
                    _this.events[node.id] = node;
                }
            };
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var node = data_1[_i];
                _loop_1(node);
            }
            // only retry failed nodes if we are still making positive progress. If we have the same number of
            // nodes we started with, then we would just be spinning on an orphaned subtree.
            if (retryEvent.data.length > 0 && retryEvent.data.length !== event.data.length) {
                _this.markup(retryEvent, useproxy);
            }
        };
        this.style = function (node, resolve) {
            if (resolve === void 0) { resolve = null; }
            // Firefox throws a SecurityError when trying to access cssRules of a stylesheet from a different domain
            try {
                var sheet = node.sheet;
                var cssRules = sheet ? sheet.cssRules : [];
                for (var i = 0; i < cssRules.length; i++) {
                    if (cssRules[i].cssText.indexOf(":hover" /* Constant.Hover */) >= 0) {
                        var css = cssRules[i].cssText.replace(/:hover/g, "[".concat("clarity-hover" /* Constant.CustomHover */, "]"));
                        sheet.removeRule(i);
                        sheet.insertRule(css, i);
                    }
                }
            }
            catch (e) {
                if (_this.state.options.logerror) {
                    _this.state.options.logerror(e);
                }
            }
            if (resolve) {
                resolve();
            }
        };
        this.addStyles = function (id) {
            var adoptedStylesToAdd = _this.stylesToApply[id];
            if (adoptedStylesToAdd && adoptedStylesToAdd.length > 0) {
                _this.setDocumentStyles(id, _this.stylesToApply[id]);
                delete _this.stylesToApply[id];
            }
        };
        this.createElement = function (doc, tag) {
            if (tag && tag.indexOf("svg:" /* Layout.Constant.SvgPrefix */) === 0) {
                return doc.createElementNS("http://www.w3.org/2000/svg" /* Layout.Constant.SvgNamespace */, tag.substr("svg:" /* Layout.Constant.SvgPrefix */.length));
            }
            try {
                return doc.createElement(tag);
            }
            catch (ex) {
                // We log the warning on non-standard markup but continue with the visualization
                console.warn("Exception encountered while creating element ".concat(tag, ": ").concat(ex));
                return doc.createElement("clarity-unknown" /* Constant.UnknownTag */);
            }
        };
        this.insertAfter = function (data, parent, node, previous) {
            // Skip over no-op changes where parent and previous element is still the same
            // In case of IFRAME, re-adding DOM at the exact same place will lead to loss of state and the markup inside will be destroyed
            if (_this.events[data.id] && _this.events[data.id].parent === data.parent && _this.events[data.id].previous === data.previous) {
                return;
            }
            // In case parent is a Shadow DOM, previous.parentElement will return null but previous.parentNode will return a valid node
            var next = previous && (previous.parentElement === parent || previous.parentNode === parent) ? previous.nextSibling : null;
            next = previous === null && parent ? _this.firstChild(parent) : next;
            _this.insertBefore(data, parent, node, next);
        };
        this.firstChild = function (node) {
            var _a;
            var child = node.firstChild;
            // BASE tag should always be the first child to ensure resources with relative URLs are loaded correctly
            if (child && child.nodeType === 1 /* NodeType.ELEMENT_NODE */ && child.tagName === "BASE" /* Layout.Constant.BaseTag */) {
                if ((_a = child.nextSibling) === null || _a === void 0 ? void 0 : _a.hasAttribute('clarity-custom-styles')) {
                    // Keep the custom style tag on top of the head to let client tags override its values.
                    return child.nextSibling.nextSibling;
                }
                return child.nextSibling;
            }
            return child;
        };
        this.insertBefore = function (data, parent, node, next) {
            if (parent !== null) {
                // Compare against both parentNode and parentElement to ensure visualization works correctly for shadow DOMs
                next = next && (next.parentElement !== parent && next.parentNode !== parent) ? null : next;
                try {
                    parent.insertBefore(node, next);
                }
                catch (ex) {
                    console.warn("Node: " + node + " | Parent: " + parent + " | Data: " + JSON.stringify(data));
                    console.warn("Exception encountered while inserting node: " + ex);
                }
            }
            else if (parent === null && node.parentElement !== null) {
                node.parentElement.removeChild(node);
            }
            else if (parent === null && node.parentNode !== null) {
                node.parentNode.removeChild(node);
            }
            _this.nodes[data.id] = node;
            _this.addToHashMap(data, node);
        };
        this.setAttributes = function (node, data) {
            var attributes = data.attributes || {};
            var sameorigin = false;
            // Clarity attributes
            attributes["data-clarity-id" /* Constant.Id */] = "".concat(data.id);
            attributes["data-clarity-hashalpha" /* Constant.HashAlpha */] = "".concat(data.hashAlpha);
            attributes["data-clarity-hashbeta" /* Constant.HashBeta */] = "".concat(data.hashBeta);
            var tag = node.nodeType === 1 /* NodeType.ELEMENT_NODE */ ? node.tagName.toLowerCase() : null;
            // First remove all its existing attributes
            if (node.attributes) {
                var length_1 = node.attributes.length;
                while (node.attributes && length_1 > 0) {
                    // Do not remove "clarity-hover" attribute and let it be managed by interaction module
                    // This helps avoid flickers during visualization
                    if (node.attributes[0].name !== "clarity-hover" /* Constant.HoverAttribute */) {
                        node.removeAttribute(node.attributes[0].name);
                    }
                    length_1--;
                }
            }
            // Add new attributes
            for (var attribute in attributes) {
                if (attributes[attribute] !== undefined) {
                    try {
                        var v = attributes[attribute];
                        if (attribute.indexOf("xlink:") === 0) {
                            node.setAttributeNS("http://www.w3.org/1999/xlink", attribute, v);
                        }
                        else if (attribute.indexOf("*O" /* Layout.Constant.SameOrigin */) === 0) {
                            sameorigin = true;
                        }
                        else if (attribute.indexOf("*") === 0) {
                            // Do nothing if we encounter internal Clarity attributes
                        }
                        else if (tag === "iframe" /* Constant.IFrameTag */ && (attribute.indexOf("src") === 0 || attribute.indexOf("allow") === 0) || attribute === "sandbox") {
                            node.setAttribute("data-clarity-".concat(attribute), v);
                        }
                        else if (tag === "img" /* Constant.ImageTag */ && attribute.indexOf("src") === 0 && (v === null || v.length === 0)) {
                            node.setAttribute(attribute, "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" /* Asset.Transparent */);
                            var size = "l" /* Constant.Large */;
                            if (data.width) {
                                size = data.width <= 200 /* Setting.Medium */ ? "m" /* Constant.Medium */ : (data.width <= 75 /* Setting.Small */ ? "s" /* Constant.Small */ : size);
                            }
                            node.setAttribute("data-clarity-hide" /* Constant.Hide */, size);
                        }
                        else {
                            node.setAttribute(attribute, v);
                        }
                    }
                    catch (ex) {
                        console.warn("Node: " + node + " | " + JSON.stringify(attributes));
                        console.warn("Exception encountered while adding attributes: " + ex);
                    }
                }
            }
            if (sameorigin === false && tag === "iframe" /* Constant.IFrameTag */ && typeof node.setAttribute === "function" /* Constant.Function */) {
                node.setAttribute("data-clarity-unavailable" /* Constant.Unavailable */, "" /* Layout.Constant.Empty */);
            }
            // Add an empty ALT tag on all IMG elements
            if (tag === "img" /* Constant.ImageTag */ && !node.hasAttribute("alt" /* Constant.AltAttribute */)) {
                node.setAttribute("alt" /* Constant.AltAttribute */, "" /* Constant.Empty */);
            }
            // During visualization This will prevent the browser from auto filling form fields with saved details of user who is seeing the visualization
            if (tag === "form" /* Constant.FormTag */ || tag === "input" /* Constant.InputTag */) {
                if (node.hasAttribute("autocomplete" /* Constant.AutoComplete */)) {
                    node.removeAttribute("autocomplete" /* Constant.AutoComplete */);
                }
                node.setAttribute("autocomplete" /* Constant.AutoComplete */, "new-password" /* Constant.NewPassword */);
            }
        };
        this.getMobileCustomStyle = function () {
            if (_this.isMobile) {
                return "*{scrollbar-width: none; scrollbar-gutter: unset;};";
            }
            return '';
        };
        this.getCustomStyle = function () {
            // tslint:disable-next-line: max-line-length
            return "".concat("img" /* Constant.ImageTag */, "[").concat("data-clarity-hide" /* Constant.Hide */, "] { background-color: #CCC; background-image: url(").concat("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAANvSURBVHgB7Ve9VhpREJ5dU6BNVqt0wS6dpEuX9QmiTyA+gfgE4BOgZSrJE4hlKvEJxDKVa2caoaSSfB87F4Z7dtmFhFTMOfcMe52Z+935u6PIhjb0dxTIihRFUQ2M6z0/dXuI9ay8PwTJklQaEADw0JMgCI4USFSkMx6Pe2BdrFtgS6QEFQICjirYGYDUc0AMcXCCvw8XAVVwHQD7IasAokfCMGzB0NmCA1o44N7T+wpwlwouT+80z2NbOWAaMHqDn7FuJcorapRATkej0bOvyz2s7zs7O2L0GbYXrCrscjUqlUoAuZ6vH3hAIr3diW4xHC3wW+w/KZhLgDmXEgRzbR6udvbBD/DdITB3UewfWm+FRpnIHwyYLo1A+Aq/vzkDWFdSni4krTjm1RnDOxgM9nFOS//OM++0YmeAFMydQw4gDSgeu7LVyprE3489je3u7t5waQFMifrQ6ehn7PZfX18v6BkFOwcq9MDQQKxeseRu0PXARJprBHxED2t7sPSol6p5YHs467OkXo8cqBA/rmXmmVO/atzZzk4G0Kond+DJJJLmStc3Sm+rpxLVbYcEoRu8xbWNp9U1B1rqyzzIRNQj5tAe84ZVKVmGZ6BoK5Vh2JADT1hjLny3rBL27nS/7RtUXZdDmb1H5Ug1rDgjrFMKrGGb2CzPt7e3C95gb2+vqeU/1Mor/UZpg21og50CsfYzATllsLY+E6TE60OTPoUqOV8EQNKKmuTTgifHAmO4GOokyDFah2BTTAOTNFcmIQFI3qyVoxurp+dIL3ZF72bYdzL1zKcDLb2P1n4rqUfcg/nB3Cre3t6uQeY3ZBOri72q87B7ULHY035CdmTs85H9BVlR23yWumVf+6YJo0/MK7qcI8al9RCqq9R4w4ICq9JDYZEwk44ly2TWFtGT+VKnF2PwB6cis8sUzkw+vSsrqNXQ0eUmxo+S5gEPfvQBSTpNLjU1rjzCLiKEYAAWMQRFA5m2GzdJxIUhW5H6yutFguhRToapcb8WQGwL5MwtDnt5cvQOZJuq0yHfkjUQWwHbAn5+AqgvKHGW/IsPRquR+ZdgcQIdrStkYh5tN1ocZYCpSto2Dqezl6yRMga/yQSpXToyYFzOrReQAcUhzp8E+E4eWzD/lTgxuPFGR5Wlm+Y/J3qL/7fJhja0RvoDR4Tn4Lo/zi8AAAAASUVORK5CYII=" /* Asset.Hide */, "); background-repeat:no-repeat; background-position: center; }") +
                "".concat("img" /* Constant.ImageTag */, "[").concat("data-clarity-hide" /* Constant.Hide */, "=").concat("s" /* Constant.Small */, "] { background-size: 18px 18px; }") +
                "".concat("img" /* Constant.ImageTag */, "[").concat("data-clarity-hide" /* Constant.Hide */, "=").concat("m" /* Constant.Medium */, "] { background-size: 24px 24px; }") +
                "".concat("img" /* Constant.ImageTag */, "[").concat("data-clarity-hide" /* Constant.Hide */, "=").concat("l" /* Constant.Large */, "] { background-size: 36px 36px; }") +
                "".concat("iframe" /* Constant.IFrameTag */, "[").concat("data-clarity-unavailable" /* Constant.Unavailable */, "] { background: url(").concat("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAiCAYAAAAge+tMAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAU6SURBVHgBzVg7TyNJEG6bh5AIjpOQeCXj7LL18pDIdpztRYuzy7CjCzG/ADu8CO8vwEQXrgkvws6QeNiEFzEk4GznIFnxvO/zVntrhx6/kLxb0mh6uqurvq6urqqehHklra+ve3d3dx8SiUT6+fk5ja4ZtGf4tjzoD9AXoBmiXUsmk+cnJyc18wpKmCFodXXVx8t/enraBCDPDEchniqeg9PT06oZkAYCTsCw2A6afjc+8IQCjGR3oBtxR/bHx8crR0dHgemD+gIugPfQ9OJ4BGwF72qj0ajrsTQI7rEFcDnTndoLeHh4KDebzdAMC5z+e39/T8B+Nz6AbcJtslAWdOMDfg8LONTuJf7vRVgDPEW40H6crLG4AVi58Pj4+Deav0WUFIjBfDt8NYD+HaBbpge1Wq1wbm5uH+DXjewe5IXQ85buxAMurJS9sbi46IG/jnlforKS0Q7f92dWVlYOAXLXgqMb4CmcnZ2l8E5YpVwIlGZ7basm8nIO50qXNzY29g6y8+hP0RCKPYexBne+K3Ay3N7eNoxyDViziicFwR+la8uOwULFQUBr8LB6XgOU/gDukcGittUY3bUBY25oGR0fX1tbSwPgoVFWxquoAFufv5DxgDvgAsZdu7m52WR7cnLyIC5SAMxnqw+6PRzqSzvmOg9coPX7ZAzoAN9vNWgSQKfVpzP2yq5dQGGZD61F+S5e6KnYNkD6eozWBwZav6m6K1hs2yBJB2hGiIwrQmDsjfp8MS6L2zMqa7INebvGTedKthcdtODN90Yi+I2kCO0owsq3e4U1EqOBq98FwNWnxgKCgd66a5znAe6RjYDfGsdJzmtfgqBPWFE+Jg2HSmFcNuS8QqSv5mLkwQewiumDBKcn87JJ5UuB8BDQJ8TxYnQyFnep2ukYMCXzvXUY57ddvIOGUeIUNw47UQWneEYsrwFVJiYmSjYqkAdx9bOMMR6n4pSTF7J+0ZHCRVKwfaA7SXUZ0g3xNJn+j4+Pm655L1L+8vLyrmRHS4FR6ZfJyUichyKGy5IZgvot2EA1GC8fDanOWgXgCwBPodqPqxCwjQKIljmUPiaSTJxVuoAuCui+CXhKqOGLne84xpgEQKqoSwMpwIIy/ZajUdBytspSVV6KblaT79AsaP0afM+yFtbP4bXT48LAWqYEtymbHrIgZy/SnYurAsV4O7ocRjvD21Nf9bgIYMbK9VgAq8f2rYYHbHp6OqjVau3DK+UCXcw1P9ethI2cO9YzqYFuQLIA3/TegTYxpbPqE+UdazM7o82suWn6AC8Rr2F10upjZgBiPX19fd3E83F+fr5mviakKQiad/FDWfHq6upftlFbM0N7AvwP1kHoY5Fmzwrr7wCyzx16vywsLBDwe9s31GU5ShKz30gOmLGWQZwv2fIBYfRZ2JnCf7Vz0V8xyvIsaV1nReeQ9oXGjIDoYlB6IZ811tx6PAo+Gvoswd0urFGS5icgLCSHV8e/GS5dJYemUQHXxZnnYugFXtzRzg1HApz1jC3iqFzqkxfUDTxcTc9pDhRVXkOICrSYb78RPQ5cfOivRqKNv7S0lMAi/lTRqziSw0mSqMADauufbLdfb45ir032rjsyi0ssnlJWfw/Ltlxxm4T+fyR2+7qfi+GckQEXMHWA9c3XRDRl5KcPXOE/JKrA8vEvwezsLH8a5YwqEWDtMqz9F9sjcxVL4jJM/RuRoVB+iZjob2qSgO7cpEYO3BJrfry2etU8XAx4XtyBfxhwki3aAGyT9b39HS3/KJsoGSr4rLuuh/8DlPszm7LNbUUAAAAASUVORK5CYII=" /* Asset.Unavailable */, ") no-repeat center center, url('").concat("data:image/svg+xml,<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"100%\" height=\"100%\"><rect width=\"100%\" height=\"100%\" style=\"fill:rgb(204,204,204)\"/><line stroke-dasharray=\"5, 5\"  x1=\"0\" y1=\"100%\" x2=\"100%\" y2=\"0\" style=\"stroke:rgb(119,119,119);stroke-width:1\"/><line stroke-dasharray=\"5, 5\"  x1=\"0\" y1=\"0\" x2=\"100%\" y2=\"100%\" style=\"stroke:rgb(119,119,119);stroke-width:1\"/><circle cx=\"50%\" cy=\"50%\" r=\"40\" fill=\"rgb(204,204,204)\"/></svg>" /* Asset.Cross */, "'); }") +
                "*[".concat("data-clarity-suspend" /* Constant.Suspend */, "] { filter: grayscale(100%); }") +
                "body { font-size: initial; }\n            ".concat(_this.getMobileCustomStyle());
        };
        this.state = state;
        this.isMobile = isMobile;
    }
    LayoutHelper.prototype.setDocumentStyles = function (documentId, styleIds) {
        var targetDocument = documentId === -1 ? this.state.window.document : this.element(documentId);
        if (!targetDocument) {
            if (!this.stylesToApply[documentId]) {
                this.stylesToApply[documentId] = [];
            }
            this.stylesToApply[documentId] = styleIds;
            return;
        }
        var newSheets = [];
        for (var _i = 0, styleIds_1 = styleIds; _i < styleIds_1.length; _i++) {
            var styleId = styleIds_1[_i];
            var styleSheet = this.adoptedStyleSheets[styleId];
            if (styleSheet) {
                newSheets.push(styleSheet);
            }
        }
        targetDocument.adoptedStyleSheets = newSheets;
    };
    LayoutHelper.TIMEOUT = 3000;
    return LayoutHelper;
}());

var Visualizer = /** @class */ (function () {
    function Visualizer() {
        var _this = this;
        this._state = null;
        this.renderTime = 0;
        this.dom = function (event) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.layout.dom(event)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.get = function (hash) {
            var _a;
            return (_a = _this.layout) === null || _a === void 0 ? void 0 : _a.get(hash);
        };
        this.html = function (decoded, target, hash, time, useproxy, logerror) {
            if (hash === void 0) { hash = null; }
            return __awaiter(_this, void 0, void 0, function () {
                var merged, entry, _a, domEvent, e_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!(decoded && decoded.length > 0 && target)) return [3 /*break*/, 10];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 9, , 10]);
                            merged = this.merge(decoded);
                            return [4 /*yield*/, this.setup(target, { version: decoded[0].envelope.version, dom: merged.dom, useproxy: useproxy })];
                        case 2:
                            _b.sent();
                            _b.label = 3;
                        case 3:
                            if (!(merged.events.length > 0 && this.layout.exists(hash) === false)) return [3 /*break*/, 8];
                            entry = merged.events.shift();
                            _a = entry.event;
                            switch (_a) {
                                case 45 /* Data.Event.StyleSheetAdoption */: return [3 /*break*/, 4];
                                case 46 /* Data.Event.StyleSheetUpdate */: return [3 /*break*/, 4];
                                case 6 /* Data.Event.Mutation */: return [3 /*break*/, 5];
                            }
                            return [3 /*break*/, 7];
                        case 4:
                            this.layout.styleChange(entry);
                            return [3 /*break*/, 7];
                        case 5:
                            domEvent = entry;
                            this.renderTime = domEvent.time;
                            if (time && this.renderTime > time) {
                                return [3 /*break*/, 7];
                            }
                            return [4 /*yield*/, this.layout.markup(domEvent, useproxy)];
                        case 6:
                            _b.sent();
                            return [3 /*break*/, 7];
                        case 7: return [3 /*break*/, 3];
                        case 8: return [3 /*break*/, 10];
                        case 9:
                            e_1 = _b.sent();
                            if (logerror) {
                                logerror(e_1);
                            }
                            return [3 /*break*/, 10];
                        case 10: return [2 /*return*/, this];
                    }
                });
            });
        };
        this.time = function () {
            return _this.renderTime;
        };
        this.clickmap = function (activity) {
            if (_this.state === null) {
                throw new Error("Initialize heatmap by calling \"html\" or \"setup\" prior to making this call.");
            }
            _this.heatmap.click(activity);
        };
        this.clearmap = function () {
            if (_this.state === null) {
                throw new Error("Initialize heatmap by calling \"html\" or \"setup\" prior to making this call.");
            }
            _this.heatmap.clear();
        };
        this.scrollmap = function (scrollData, avgFold, addMarkers) {
            if (_this.state === null) {
                throw new Error("Initialize heatmap by calling \"html\" or \"setup\" prior to making this call.");
            }
            _this.heatmap.scroll(scrollData, avgFold, addMarkers);
        };
        this.merge = function (decoded) {
            var merged = { timestamp: null, envelope: null, dom: null, events: [] };
            // Re-arrange decoded payloads in the order of their start time
            decoded = decoded.sort(_this.sortPayloads);
            // Re-initialize enrich class if someone ends up calling merge function directly
            _this.enrich = _this.enrich || new EnrichHelper();
            _this.enrich.reset();
            // Walk through payloads and generate merged payload from an array of decoded payloads
            for (var _i = 0, decoded_1 = decoded; _i < decoded_1.length; _i++) {
                var payload = decoded_1[_i];
                merged.timestamp = merged.timestamp ? merged.timestamp : payload.timestamp;
                merged.envelope = payload.envelope;
                for (var _a = 0, _b = Object.keys(payload); _a < _b.length; _a++) {
                    var key = _b[_a];
                    var p = payload[key];
                    if (Array.isArray(p)) {
                        for (var _c = 0, p_1 = p; _c < p_1.length; _c++) {
                            var entry = p_1[_c];
                            switch (key) {
                                case "dom" /* Constant.Dom */:
                                    var dom = _this.enrich.selectors(entry);
                                    if (entry.event === 5 /* Data.Event.Discover */) {
                                        merged.dom = dom;
                                    }
                                    else {
                                        merged.events.push(entry);
                                    }
                                    break;
                                default:
                                    merged.events.push(entry);
                                    break;
                            }
                        }
                    }
                }
            }
            merged.events = merged.events.sort(_this.sortEvents);
            return merged;
        };
        this.setup = function (target, options) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.reset();
                        // Infer options
                        options.canvas = "canvas" in options ? options.canvas : true;
                        options.keyframes = "keyframes" in options ? options.keyframes : false;
                        // Set visualization state
                        this._state = { window: target, options: options };
                        // Initialize helpers
                        this.enrich = new EnrichHelper();
                        this.data = new DataHelper(this.state);
                        this.layout = new LayoutHelper(this.state, options.mobile);
                        this.heatmap = new HeatmapHelper(this.state, this.layout);
                        this.interaction = new InteractionHelper(this.state, this.layout);
                        if (!options.dom) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.layout.dom(options.dom, options.useproxy)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, this];
                }
            });
        }); };
        this.render = function (events) { return __awaiter(_this, void 0, void 0, function () {
            var time, _i, events_1, entry, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.state === null) {
                            throw new Error("Initialize visualization by calling \"setup\" prior to making this call.");
                        }
                        time = 0;
                        _i = 0, events_1 = events;
                        _b.label = 1;
                    case 1:
                        if (!(_i < events_1.length)) return [3 /*break*/, 15];
                        entry = events_1[_i];
                        time = entry.time;
                        _a = entry.event;
                        switch (_a) {
                            case 0 /* Data.Event.Metric */: return [3 /*break*/, 2];
                            case 7 /* Data.Event.Region */: return [3 /*break*/, 3];
                            case 6 /* Data.Event.Mutation */: return [3 /*break*/, 4];
                            case 43 /* Data.Event.Snapshot */: return [3 /*break*/, 4];
                            case 13 /* Data.Event.MouseDown */: return [3 /*break*/, 6];
                            case 14 /* Data.Event.MouseUp */: return [3 /*break*/, 6];
                            case 12 /* Data.Event.MouseMove */: return [3 /*break*/, 6];
                            case 15 /* Data.Event.MouseWheel */: return [3 /*break*/, 6];
                            case 9 /* Data.Event.Click */: return [3 /*break*/, 6];
                            case 16 /* Data.Event.DoubleClick */: return [3 /*break*/, 6];
                            case 17 /* Data.Event.TouchStart */: return [3 /*break*/, 6];
                            case 20 /* Data.Event.TouchCancel */: return [3 /*break*/, 6];
                            case 18 /* Data.Event.TouchEnd */: return [3 /*break*/, 6];
                            case 19 /* Data.Event.TouchMove */: return [3 /*break*/, 6];
                            case 28 /* Data.Event.Visibility */: return [3 /*break*/, 7];
                            case 27 /* Data.Event.Input */: return [3 /*break*/, 8];
                            case 21 /* Data.Event.Selection */: return [3 /*break*/, 9];
                            case 11 /* Data.Event.Resize */: return [3 /*break*/, 10];
                            case 10 /* Data.Event.Scroll */: return [3 /*break*/, 11];
                            case 45 /* Data.Event.StyleSheetAdoption */: return [3 /*break*/, 12];
                            case 46 /* Data.Event.StyleSheetUpdate */: return [3 /*break*/, 12];
                            case 44 /* Data.Event.Animation */: return [3 /*break*/, 13];
                        }
                        return [3 /*break*/, 14];
                    case 2:
                        this.data.metric(entry);
                        return [3 /*break*/, 14];
                    case 3:
                        this.data.region(entry);
                        return [3 /*break*/, 14];
                    case 4: return [4 /*yield*/, this.layout.markup(entry)];
                    case 5:
                        _b.sent();
                        return [3 /*break*/, 14];
                    case 6:
                        this.interaction.pointer(entry);
                        return [3 /*break*/, 14];
                    case 7:
                        this.interaction.visibility(entry);
                        return [3 /*break*/, 14];
                    case 8:
                        this.interaction.input(entry);
                        return [3 /*break*/, 14];
                    case 9:
                        this.interaction.selection(entry);
                        return [3 /*break*/, 14];
                    case 10:
                        this.interaction.resize(entry);
                        return [3 /*break*/, 14];
                    case 11:
                        this.interaction.scroll(entry);
                        return [3 /*break*/, 14];
                    case 12:
                        this.layout.styleChange(entry);
                        return [3 /*break*/, 14];
                    case 13:
                        this.layout.animateChange(entry);
                        return [3 /*break*/, 14];
                    case 14:
                        _i++;
                        return [3 /*break*/, 1];
                    case 15:
                        if (events.length > 0) {
                            // Update pointer trail at the end of every frame
                            this.interaction.trail(time);
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        this.reset = function () {
            var _a, _b, _c, _d, _e;
            (_a = _this.data) === null || _a === void 0 ? void 0 : _a.reset();
            (_b = _this.interaction) === null || _b === void 0 ? void 0 : _b.reset();
            (_c = _this.layout) === null || _c === void 0 ? void 0 : _c.reset();
            (_d = _this.heatmap) === null || _d === void 0 ? void 0 : _d.reset();
            (_e = _this.enrich) === null || _e === void 0 ? void 0 : _e.reset();
            _this._state = null;
            _this.renderTime = 0;
        };
        this.sortEvents = function (a, b) {
            return a.time - b.time;
        };
        this.sortPayloads = function (a, b) {
            return a.envelope.sequence - b.envelope.sequence;
        };
    }
    Object.defineProperty(Visualizer.prototype, "state", {
        get: function () {
            return this._state;
        },
        enumerable: false,
        configurable: true
    });
    return Visualizer;
}());

var _a;
var state = (_a = new Visualizer(), _a.state), dom = _a.dom, get = _a.get, html = _a.html, time = _a.time, clickmap = _a.clickmap, clearmap = _a.clearmap, scrollmap = _a.scrollmap, merge = _a.merge, setup = _a.setup, render = _a.render;

var clarity = /*#__PURE__*/Object.freeze({
    __proto__: null,
    clearmap: clearmap,
    clickmap: clickmap,
    dom: dom,
    get: get,
    html: html,
    merge: merge,
    render: render,
    scrollmap: scrollmap,
    setup: setup,
    state: state,
    time: time
});

export { Visualizer, clarity as visualize };
