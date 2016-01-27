"use strict";
let expect = require('expect.js');
let name = "firemail";

describe("Name", function() {
    it("The name should be firemail", function() {
        expect(name).to.eql("firemail");
    });
});
