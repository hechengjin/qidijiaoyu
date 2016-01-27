"use strict";
let expect = require('expect.js');

describe("generator", function() {
    it("generator with para", function() {
        let a = foo(5);
				
				expect(a.next().value).to.eql(6);  //Object{value:6, done:false}
				//第二次运行next方法的时候不带参数，导致y的值等于2 * undefined（即NaN），除以3以后还是NaN，因此返回对象的value属性也等于NaN。
				expect(isNaN(a.next().value)).to.eql(true);  //Object{value:NaN, done:false}
				//第三次运行Next方法的时候不带参数，所以z等于undefined，返回对象的value属性等于5 + NaN + undefined，即NaN。
				expect(isNaN(a.next().value)).to.eql(true);   // Object{value:NaN, done:false}
				
				
				let b = foo(5);
				expect(b.next().value).to.eql(6); 
				//第二次调用next方法，将 [上一次yield语句的值]设为12，因此y等于24，返回y / 3的值8；
				expect(b.next(12).value).to.eql(8); 
				//第三次调用next方法，将上一次yield语句的值设为13，因此z等于13，这时x等于5，y等于24，所以return语句的值等于42。
				expect(b.next(13).value).to.eql(42); 
    });
});


function* foo(x) {
	var y = 2 * ( yield (x + 1) );
	var z = yield ( y / 3 );
	return ( x + y + z );
}





