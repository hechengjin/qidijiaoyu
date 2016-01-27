require("should");

var name = "firemail";

describe("Name", function() {
    it("The name should be firemail", function() {
        name.should.eql("firemail");
    });
});

var Product = function(name) {
    this.name = name;
};
var firemail = new Product(name);

describe("InstanceOf", function() {
    it("Firemail should be an instance of Product", function() {
        firemail.should.be.an.instanceof(Product);
    });

    it("Firemail should be an instance of Object", function() {
        firemail.should.be.an.instanceof(Object);
    });
});
describe("Property", function() {
    it("Firemail should have property name", function() {
        firemail.should.have.property("name");
    });
});