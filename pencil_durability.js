var fs = require('fs')
function Pencil(durability=100) {
    // private vars
    var self = this

    //public vars
    this.durability = durability;
    this.original_durability = durability;
    this.file_location = null;
    this.text = ""

    //private functions
    function set_location_and_text(self, file_location, text_to_write) {
        self.file_location = file_location;
        self.text = text_to_write; 
    }

    function write_to_file(self){
        return new Promise(function (resolve, reject) {
            for (var i = 0; i < self.text.length; i++) {
                insert_char_to_file(self, i);
            }        	
			resolve();  
		}).catch((err) => {
			throw err;
		});
    }

    function insert_char_to_file(self, char_idx) { 
        if (check_if_letter_captial(self, char_idx)) {
            make_durability_change(self, 2, char_idx);
        } else {
            make_durability_change(self, 1, char_idx);
        } 
    }

    function check_if_letter_captial(self, char_idx) {
        if (self.text[char_idx] === self.text[char_idx].toUpperCase() &&
                self.text[char_idx] !== self.text[char_idx].toLowerCase()) { 
            return true;
        }
        return false;
    }

    function make_durability_change(self, amount, char_idx) {
        if (self.durability - amount >= 0) {
            fs.appendFileSync(self.file_location, self.text[char_idx]);
            if (self.text[char_idx] !== ' ') self.durability -= amount
        }  
    }

    // public functions
    this.write = function(file_location, text_to_write) {
        set_location_and_text(self, file_location, text_to_write);
		write_to_file(self);
    }

    this.sharpen = function() {
        this.durability = this.original_durability;
    }
}

module.exports = Pencil
