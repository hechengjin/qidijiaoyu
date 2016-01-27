require("should");
var fs = require("fs");
describe("readFile", function() {
    it("The file content should be firemail", function(done) {
        fs.readFile("text.txt", "utf8", function(err, data) {
						data.should.eql("firemail");
            done();
        });
    });
});