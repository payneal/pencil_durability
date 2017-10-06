var fs = require('fs')
function Pencil(text_file, text_input) {
    var self = this
    this.text_file = text_file;
    this.text_input = text_input;
    write_to_paper(self)

    function write_to_paper(self){
        var logger = fs.createWriteStream(
            self.text_file, {flags: 'w' })
        logger.write(self.text_input);
        logger.end();
    }

    this.written_text = function() {
        return this.text_input;
    }
}

module.exports = Pencil
