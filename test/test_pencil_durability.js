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
			return Promise.resolve()
				.then(() => pencil.write( path.resolve('files/blank_paper.txt'), "a"))
				.then(() => get_file_text("blank_paper.txt"))
				.then((result) => {
					assert.equal(result.trim(), "a");
				})
		});

        it("pencil should be able to append to paper", function(){
            let pencil = new Pencil();
        	path_to_file = path.resolve('files/blank_paper.txt')
			return Promise.resolve()
				.then(() => pencil.write( path_to_file, "She sells sea shells"))
				.then(() => pencil.write( path_to_file, " down by the sea shore"))
            	.then(() => get_file_text("blank_paper.txt"))
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
            let pencil = new Pencil(durability=4);
            return Promise.resolve()
			.then(() => pencil.write(path.resolve('files/blank_paper.txt'), 'text'))
			.then(() => get_file_text("blank_paper.txt"))
                .then((result) => {
                    assert.equal(result.trim(), 'text');
                })
         });
    
        it("point durability of 4 writing 'Text' should write 'Tex '", function(){
            let pencil = new Pencil(durability=4);
            pencil.write(path.resolve('files/blank_paper.txt'), "Text");
            return get_file_text("blank_paper.txt")
                .then((result) => {
                    assert.equal(result.trim(), "Tex");
                })
        });
    });

    describe("Pencil Sharpen", function(){
        it("if pencil is sharpened, it regains its initial point durability", function(){
            let  pencil = new Pencil(durability=4);
            return Promise.resolve()
				.then(() => pencil.write(path.resolve('files/blank_paper.txt'), "Text"))
				.then(() => pencil.sharpen())
            	.then(() => pencil.write(path.resolve('files/blank_paper.txt'), "t Me"))
           		.then(() => get_file_text("blank_paper.txt"))
            	.then((result) => {
            		assert.equal(result.trim(), "Text Me");
            	})
        });

        it("pencil should have length value. More lengths => more sharpens till 0.", function(){
            let  pencil = new Pencil(durability=4, length=0);
            return Promise.resolve()
				.then(() => pencil.write(path.resolve('files/blank_paper.txt'), "Text"))
            	.then(() => pencil.sharpen())
            	.then(() => pencil.write(path.resolve('files/blank_paper.txt'), "t Me"))
            	.then(() => get_file_text("blank_paper.txt"))
            	.then( result => {
            		assert.equal(result.trim(), "Tex");
           		});
    	});
	});

    describe("Pencil Erase", function(){
        it("pencil can erase last occurrence of certain text on the paper", function(){
            let pencil = new Pencil();
			return Promise.resolve()
				.then(() => pencil.write( path.resolve('files/blank_paper.txt'),
  	        		"How much wood would a woodchuck chuck if a woodchuck could chuck wood?"))
				.then(() => pencil.erase('chuck'))
				.then(() => get_file_text("blank_paper.txt"))
            	.then((result) => {
					assert.equal(
               			result, 
                    	"How much wood would a woodchuck chuck if a woodchuck could       wood?");
                })
        });

        it("pencli double erase", function(){
            let pencil = new Pencil();
            return Promise.resolve()
                .then(() => pencil.write( path.resolve('files/blank_paper.txt'),
  	        		"How much wood would a woodchuck chuck if a woodchuck could chuck wood?"))
				.then(() => pencil.erase('chuck'))
                .then(() => pencil.erase('chuck'))
                .then(() => get_file_text("blank_paper.txt"))
            	.then((result) => {
					assert.equal(
               			result, 
                    	"How much wood would a woodchuck chuck if a wood      could       wood?");
                })
        });
    });

    describe("Pencil erase degeneration", function(){
        it("pencil is created, it can be provided with a value for eraser durability", function(){
            let pencil = new Pencil(eraser_durability=3);
            return Promise.resolve()
                .then(() => pencil.write( path.resolve('files/blank_paper.txt'), "Buffalo Bill"))
                .then(() => pencil.erase('Bill'))
                .then(() => get_file_text("blank_paper.txt"))
                .then((result) => assert.equal(result,"Buffalo B   "))
        });
    });
});
