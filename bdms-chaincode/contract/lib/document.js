 /*
SPDX-License-Identifier: Apache-2.0
*/
 
'use strict';

// Utility class for ledger state
const DocState = require('./../ledger-api/doc_state.js');

// Enumerate commercial paper state values
const docState = {
    ENROLLED: 1,
    MODIFY: 2
};

/**
 * Document class extends State class
 * Class will be used by application and smart contract to define a paper
 */
class Document extends DocState {

    constructor(obj) {
        super(Document.getClass(), [obj.user, obj.docNumber], title, type, content, address);
        Object.assign(this, obj);
    }

    /**
     * Basic getters and setters
    */
    getUser() {
        return this.user;
    }
    setUser(user) {
        this.user = user;
    }
    getTitle() {
        return this.title;
    }
    setTitle(newtitle) {
        this.title = newtitle;
    }
    getType() {
        return this.type;
    }
    setType(newtype) {
        this.type = newtype;
    }
    getContent() {
        return this.content;
    }
    setContent(newcontent) {
        this.content = newcontent;
    }
    getAddress() {
        return this.address;
    }
    setAddress(newaddress) {
        this.address = newaddress;
    }

    /**
     * Useful methods to encapsulate commercial paper states
     */
    setENROLLED() {
        this.currentState = docState.ENROLLED;
    }

    setMODIFY() {
        this.currentState = docState.MODIFY;
    }

    isENROLLED() {
        return this.currentState === docState.ENROLLED;
    }

    isMODIFY() {
        return this.currentState === docState.MODIFY;
    }

    static fromBuffer(buffer) {
        return Document.deserialize(Buffer.from(JSON.parse(buffer)));
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return DocState.deserializeClass(data, Document);
    }

    /**
     * Factory method to create a commercial paper object
     */
    // 6개의 인자(ID, 문서번호, 파일제목, 파일확장자, 파일hash, IPFS주소)
    static createInstance(user, docNumber, title, type, content, address) {
        return new Document({ user, docNumber, title, type, content, address });
    }

    static getClass() {
        return 'org.papernet.Document';
    }
}

module.exports = Document;
