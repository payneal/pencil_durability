// test
const assert = require('chai').assert;
const Pencil = require('../pencil_durability');
const fs = require('fs')


get_file_text = function(file_name) {
    return new Promise(function (resolve, reject) {
        fs.readFile('./files/' + file_name, 'utf8', function (err,data) {
            if (err) {
                reject(console.log(err));
            }
            resolve(data);
        });
    });
}

describe("Pencil Durability", function(){
    it("should be able to write to a piece of paper", function(){
        let pencil = new Pencil('../blank_paper.txt', "a");
        var text_written = pencil.written_text()
        return get_file_text('blank_paper.txt')
            .then((expected_text) => {
                let result = text_written.trim();
                let expected = expected_text.trim();
                assert.equal(result, expected);
            });
    });

});
