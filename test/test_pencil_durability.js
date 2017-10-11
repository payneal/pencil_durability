#!/usr/bin/env node
// test
const assert = require('chai').assert;
const expect = require('chai').expect;
const Pencil = require('../pencil_durability');
const fs = require('fs')
var path = require("path");

get_file_text = function(file_name) {
    return new Promise(function (resolve, reject) {
        fs.readFile('./files/' + file_name, 'utf8', function (err,data) {
            if (err) reject(console.log(err));
            resolve(data);
        });
    });
}

clear_file = function(file_name) {
    return new Promise(function (resolve, reject) {
        fs.writeFile('./files/'+file_name, '', function(){
            resolve();
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
                }).catch( err => {
                    throw err;
                });
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
                }).catch( err => {
                    throw err;
                });
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
                }).catch( err => {
                    throw err;
                });
         });
    
        it("point durability of 4 writing 'Text' should write 'Tex '", function(){
            let pencil = new Pencil(durability=4);
            return Promise.resolve()
                .then(() =>  pencil.write(path.resolve('files/blank_paper.txt'), "Text"))
                .then(() => get_file_text("blank_paper.txt"))
                .then((result) => {
                    assert.equal(result.trim(), "Tex");
                }).catch( err => {
                    throw err;
                });
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
                }).catch( err => {
                    throw err;
                });
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
                }).catch( err => {
                    throw err;
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
                }).catch( err => {
                    throw err;
                });
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
                }).catch( err => {
                    throw err;
                }); 
        });
    });

    describe("Pencil erase degeneration", function(){
        it("pencil is created, it can be provided with a value for eraser durability", function(){
            let pencil = new Pencil(durability=100, length=100, eraser_durability=3);
            return Promise.resolve()
                .then(() => pencil.write( path.resolve('files/blank_paper.txt'),
                    "Buffalo Bill"))
                .then(() => pencil.erase('Bill'))
                .then(() => get_file_text("blank_paper.txt"))
                .then((result) => {
                    assert.equal(result,"Buffalo B   ");
                }).catch( err => {
                    throw err;
                });
        });
    });

    describe("Pencil editing", function(){
        it("edit text with word of same length", function() {
            let pencil = new Pencil(durability=100, length=100, eraser_durability=10);
            return Promise.resolve()
                .then(() => pencil.write( path.resolve('files/blank_paper.txt'),
                    "An apple a day keeps the doctor away"))
                .then(() => pencil.erase('apple'))
                .then(() => pencil.edit('onion'))
                .then(() => get_file_text("blank_paper.txt"))
                .then((result) => {
                    assert.equal(result, "An onion a day keeps the doctor away");
                }).catch( err => {
                    throw err;
                }); 
        });

        it("Existing text on the page cannot 'shift' to make room for new text.", function(){
            let pencil = new Pencil(durability=100, length=100, eraser_durability=10);
            return Promise.resolve()
                .then(() => pencil.write(path.resolve('files/blank_paper.txt'),
                    "An apple a day keeps the doctor away"))
                .then(() => pencil.erase('apple'))
                .then(() => pencil.edit("artichoke"))
                .then(() => get_file_text("blank_paper.txt"))
                .then((result) => {
                    assert.equal(result, "An artich@k@ay keeps the doctor away");
                }).catch( err => {
                    throw err;
                });            
        });

        it("should throw exception if one tries to edit when nothings been erased", function(){
            let pencil = new Pencil(durability=100, length=100, eraser_durability=10);
            return Promise.resolve()
                .then(() => pencil.write(path.resolve('files/blank_paper.txt'),
                    "An apple a day keeps the doctor away"))
                .then(() => {
                    expect(() => pencil.edit("artichoke")).to.throw("must erase before you can edit");     
                }).catch( err => {
                    throw err;
                });            
        });

    });

});
