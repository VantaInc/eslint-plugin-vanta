/**
 * @fileoverview Ensure that imports from server-common/ are absolute instead of relative.
 */

import absoluteImportRule from "../absolute-import-rule";

const rule = absoluteImportRule("server-common");

module.exports = rule;

export default rule;
