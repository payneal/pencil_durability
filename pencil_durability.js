var fs = require('fs')
function Pencil() {
    // private vars
    var self = this

    //public vars
    this.file_location = null;
    this.text = ""

    //private functions
    function set_location_and_text(self, file_location, text_to_write) {
        self.file_location = file_location;
        self.text = text_to_write; 
    }

    function write_to_file(self){
        return new Promise(function (resolve, reject) {
            var logger = fs.createWriteStream(
                self.file_location, {flags: 'a' })
            logger.write(self.text);
            resolve();
        }).catch((err) => {
            reject();
        });
    }

    // public functions
    this.write = function(file_location, text_to_write) {
        set_location_and_text(self, file_location, text_to_write);
        write_to_file(self)
    }
}

module.exports = Pencil
