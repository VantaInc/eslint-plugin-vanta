/**
 * @fileoverview Ensure that imports from common/ are absolute instead of relative.
 */

import absoluteImportRule from "../absolute-import-rule";

const rule = absoluteImportRule("common");

module.exports = rule;

export default rule;
