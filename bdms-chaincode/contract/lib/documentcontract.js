/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');

// PaperNet specifc classes
const Document = require('./document.js');
const DocList = require('./documentlist.js');

/**
 * A custom context provides easy access to list of all commercial papers
 */
class DocContext extends Context {

    constructor() {
        super();
        // All papers are held in a list of papers
        this.docList = new DocList(this);
    }
}

/**
 * Define commercial paper smart contract by extending Fabric Contract class
 *
 */
class DocContract extends Contract {

    constructor() {
        // Unique namespace when multiple contracts per chaincode file
        super('org.papernet.commercialpaper');
    }

    /**
     * Define a custom context for commercial paper
    */
    createContext() {
        return new DocContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the contract');
    }

    /**
     * Fabric_enroll_doc 
     *
     * @param {Context} ctx the transaction context
     * @param {String} user document enroll user
     * @param {Integer} docNumber document number for this user
     * @param {String} title document title
     * @param {String} type document type
     * @param {String} content document file hash
     * @param {String} address document IPFS address
    */
    async fabric_enroll_doc(ctx, user, docNumber, title, type, content, address) {

        // create an instance of the paper
        let document = Document.createInstance(user, docNumber, title, type, content, address);

        // Smart contract, rather than paper, moves paper into ISSUED state
        document.setENROLLED();

        // Newly issued paper is owned by the user
        document.setUser(user);

        // Add the paper to the list of all similar commercial papers in the ledger world state
        await ctx.docList.addPaper(document);

        // Must return a serialized paper to caller of smart contract
        return document.toBuffer();
    }

    /**
     * Fabric_modify_doc 
     *
     * @param {Context} ctx the transaction context
     * @param {String} user document enroll user
     * @param {Integer} docNumber document number for this user
     * @param {String} mod_title document title
     * @param {String} mod_type document type
     * @param {String} mod_content document file hash
     * @param {String} mod_address document IPFS address
    */
    async fabric_modify_doc(ctx, user, docNumber, mod_title, mod_type, mod_content, mod_address) {

        // Retrieve the current paper using key fields provided
        let documentKey = Document.makeKey([user, docNumber]);
        let document = await ctx.docList.getPaper(documentKey);

        // // Validate current owner
        // if (document.getUser() !== user) {
        //     throw new Error('Document ' + user + docNumber + ' is not owned by ' + currentOwner);
        // }

        // First MODIFY or already MODIFY
        if (document.isENROLLED() || document.isMODIFY()) {
            document.setMODIFY();
            document.setTitle(mod_title);
            document.setType(mod_type);
            document.setContent(mod_content);
            document.setAddress(mod_address);
        } else {
            throw new Error('Document ' + user + docNumber + ' is not ENROLLED. Current state = ' +document.getCurrentState());
        }

        // Update the document
        await ctx.docList.updatePaper(document);
        return document.toBuffer();
    }

    /**
     * Fabric_get_all_doc 
     *
     * @param {Context} ctx the transaction context
     * @param {String} user document enroll user
    */
    // 한 user가 가지고 있는 모든 doc를 조회하는 함수(docNumber를 1~100까지 for문 돌리기?!)
   async fabric_get_all_doc(ctx, user) {

    var all_doc = '';
    for(var docNumber = 1; docNumber<=100; docNumber++) {
        // Retrieve the current paper using key fields provided
        let documentKey = Document.makeKey([user, docNumber]);
        let document = await ctx.docList.getPaper(documentKey);

        await ctx.docList.getState(document);
        all_doc += document.toBuffer();
    }
    return all_doc;
   }

    /**
     * Fabric_get_doc 
     *
     * @param {Context} ctx the transaction context
     * @param {String} user document enroll user
     * @param {Integer} docNumber document number for this user
    */
   async fabric_get_doc(ctx, user, docNumber) {

    // Retrieve the current paper using key fields provided
    let documentKey = Document.makeKey([user, docNumber]);
    let document = await ctx.docList.getPaper(documentKey);

    // 이렇게 다 해야하는것인가?
    print('이렇게 다 해야하는것인가?');
    print('User : ' + document.getUser() + '\n\n');
        
    // 이렇게 해도 나오나??
    print('이렇게 해도 나오나??');
    await ctx.docList.getState(document);
    return document.toBuffer();
    }
}

module.exports = DocContract;
