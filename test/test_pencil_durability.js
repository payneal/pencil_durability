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
	beforeEach(function() {
		return clear_file('blank_paper.txt');
	});

	describe("Pencil writing", function(){	
		it("should be able to write to a piece of paper", function(){
            let pencil = new Pencil();
			pencil.write( path.resolve('files/blank_paper.txt'), "a");
			return get_file_text("blank_paper.txt")
				.then((result) => {
					assert.equal(result.trim(), "a");
				})
		});

        it("pencil should be able to append to paper", function(){
            let pencil = new Pencil();
            path_to_file = path.resolve('files/blank_paper.txt'),
            Promise.resolve()
                .then(() => { 
                    pencil.write(path_to_file, "She sells sea shells")})
                .then(() => {
                    pencil.write(path_to_file, " down by the sea shore")
                })
            
            return get_file_text("blank_paper.txt")
                .then((result) => {
                    assert.equal(
                        result.trim(),
                        "She sells sea shells down by the sea shore"
                    )
                })
        });
    });

    describe("Pencil point degradation", function(){
        it("point durability of four writing 'text' should write 'text'", function(){
            let pencil = new Pencil(4);
            pencil.write(path.resolve('files/blank_paper.txt'), 'text');
            return get_file_text("blank_paper.txt")
                .then((result) => {
                    assert.equal(result.trim(), 'text');
                })
         });
    });

});
