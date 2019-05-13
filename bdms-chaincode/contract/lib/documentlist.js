/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';
 
// Utility class for collections of ledger states --  a state list
const DocStateList = require('./../ledger-api/doc_statelist.js');

const Document = require('./document.js');

class DocList extends DocStateList {

    constructor(ctx) {
        super(ctx, 'org.papernet.commercialpaperlist');                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 ernet.commercialpaperlist');
        this.use(Document);
    }

    async addPaper(paper) {
        return this.addState(paper);
    } 

    async getPaper(paperKey) {
        return this.getState(paperKey);
    }

    async updatePaper(paper) {
        return this.updateState(paper);
    }
}

module.exports = DocList;