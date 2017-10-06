// test
const assert = require('chai').assert;
const Pencil = require('../pencil_durability');
const fs = require('fs')
var path = require("path");

get_file_text = function(file_name) {
    return new Promise(function (resolve, reject) {
        fs.readFile('./files/' + file_name, 'utf8', 
                function (err,data) {
            if (err) {
                reject(console.log(err));
            }
            resolve(data);
        });
    });
}

clear_file = function(file_name) {
    return new Promise(function (resolve, reject) {
        fs.writeFile('./files/'+file_name, '', function(){
            resolve('done');
        })
    }).catch((err) => {
        reject(err);
    });
}



describe("Pencil Durability", function(){
	
	describe("Pencil writing", function(){	
		beforeEach(function() {
			return clear_file('blank_paper.txt');
		});

		it("should be able to write to a piece of paper", function(){
			let path_to_file = path.resolve('files/blank_paper.txt');
			let pencil = new Pencil()
			pencil.write(path_to_file, "a");
			return get_file_text("blank_paper.txt")
				.then((result) => {
					assert.equal(result.trim(), "a");
				})
		});

	});

});
