"use strict";
exports.__esModule = true;
exports.computeSortList = exports.sort = void 0;
/**
 * @param c criteria
 * @param a element a (on the left side of the equation)
 * @param d direction (greater = > or lower = < )
 * @param b element b (on the right side of the equation)
 * @returns
 */
var sBY = function (c, a, d, b) {
    // a and b are set to the target subject of comparison
    a = a[c];
    b = b[c];
    if (typeof a === "string" || typeof b === "string") {
        a = normalizeWhenDiacritics(a);
        b = normalizeWhenDiacritics(b);
    }
    return d === ">" ? (a < b ? 1 : -1) : d === "<" ? (a > b ? 1 : -1) : 1;
};
var normalizeWhenDiacritics = function (str) {
    if (hasDiacritics(str)) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
    return str;
};
var hasDiacritics = function (str) {
    // transform the string into a char arraay;
    var chars = str.split("");
    // record a list of charcodes sorted from the greatest
    var reversed = chars.map(function (c) { return c.charCodeAt(0); }).sort(function (a, b) { return b - a; });
    /**
     * if charcode of first is greater than 122 (='z') then
     * it has a great chanche to be a diacritics or an accent
     */
    return reversed[0] > 122;
};
var errorOnWrongSortString = function (criterias) {
    var criteriaChoises = criterias.sort().join(" or ");
    var format = "by < key > of < a > < greater| lower |< | > > than < b >'s [then]";
    var critsProposition = "\nIn your case, the \"key\" string should be eater: \n>" + criteriaChoises + "<";
    var suite = "You may have given a wrong \"key\" (a field) to focus on. \n" + critsProposition;
    var exemple = "Write your sort string like this:\n\n`\nby " + criterias[0] + " of a greater than b's then \nby otherField of a > than b's ...\n`";
    var message = "\nSORTSTRING_MATCH_ERROR\nYou have to precise a sortString formated like this :\n\"" + format + "\n" + suite + "\n\n" + exemple + "\n";
    return message;
};
var computeSortList = function (sortString, criterias) {
    var sortList = [];
    var cpt = 0;
    var criteriaChoises = criterias.join("|");
    var expr = new RegExp("by (" + criteriaChoises + ") of (a|b) ([><]|(?:lower|greater)) than (b|a)'s(?: (then))?", "gm");
    var m;
    var hasThen = false;
    do {
        if ((m = expr.exec(sortString)) && (hasThen || !cpt++)) {
            var direction = m[3].replace("greater", ">").replace("lower", "<");
            var entry = {
                by: m[1],
                left: m[2],
                direction: direction,
                right: m[4]
            };
            sortList.push(entry);
            hasThen = m[5] !== undefined;
        }
    } while (m && cpt < 999);
    return sortList;
};
exports.computeSortList = computeSortList;
/**
 * Initiate the sorting of the passed list objectArray
 * @param objectArray : any[] array to sort
 * @param sortString : string string used to define how to sort
 * @returns sorted objectArray
 */
var sort = function (objectArray, sortString, crashOnError, logfn) {
    if (sortString === void 0) { sortString = ""; }
    if (crashOnError === void 0) { crashOnError = false; }
    if (logfn === void 0) { logfn = console.error; }
    var criterias = [];
    if (objectArray.length)
        criterias = Object.keys(objectArray[0]);
    var sortList = computeSortList(sortString, criterias);
    if (sortString.length && !sortList.length) {
        var errorMessage = errorOnWrongSortString(criterias);
        if (crashOnError) {
            throw errorMessage;
        }
        else {
            logfn(errorMessage);
        }
    }
    // call the sort core function
    return sortCore(objectArray, sortList, 0);
};
exports.sort = sort;
var sortCore = function (objectArray, sortList, i) {
    if (sortList === void 0) { sortList = []; }
    if (i === void 0) { i = 0; }
    if (!sortList[i]) {
        return objectArray;
    }
    var _a = sortList[i], by = _a.by, left = _a.left, direction = _a.direction, right = _a.right;
    var result = objectArray.sort(function (a, b) {
        // its no use to compare a to a or b to b
        if (left === right)
            return 1;
        if (left === "a") {
            return sBY(by, a, direction, b);
        }
        else {
            return sBY(by, b, direction, a);
        }
    });
    return sortCore(result, sortList, i + 1);
};
