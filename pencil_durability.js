var fs = require('fs')
function Pencil(durability=100, length=100, eraser_durability=100) {
    // private vars
    var self = this;

    //public vars
    this.durability = durability;
    this.original_durability = durability;
    this.eraser_durability = eraser_durability;
    this.length = length;
    this.file_location = null;
    this.text = "";

    // public functions
    this.write = function(file_location, text_to_write) {
        set_location_and_text(self, file_location, text_to_write);
		write_to_file(self);
    }

    this.sharpen = function() {
        if (this.length > 0) { 
            this.durability = this.original_durability;
            length -= 1;
        }
    }

    this.erase = function(word_to_erase) {
		return Promise.resolve()
		    .then(() => all_filetext_to_array_of_chars(self))
            .then(array_of_chars => 
                find_string_in_text(self, array_of_chars, word_to_erase))
            .then(([result, array_of_chars]) => { 
                if (result) erase_found_word(self, result, array_of_chars);
            })       
            .catch(err => {
                throw err;
		    });
	}

    //private functions
    function set_location_and_text(self, file_location, text_to_write) {
        self.file_location = file_location;
        self.text = text_to_write; 
    }

    function write_to_file(self){
        for (var i = 0; i < self.text.length; i++) {
            insert_char_to_file(self, i);
        }        	
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
            if (self.text[char_idx] !== ' ') self.durability -= amount;
        }  
    }

    function find_string_in_text(self, array_of_chars, word_looking_for) {
        for (letter =0; letter<array_of_chars.length; letter++){
            if (array_of_chars[letter] === word_looking_for[0]){
                var location = find_word(self, array_of_chars, letter, word_looking_for)
                if (location) return [location, array_of_chars];
            }
        }
        return [null, null];
    }

    function find_word(self, array_of_chars, i, word_looking_for) {
        location = []
        for (var index = 0; index < word_looking_for.length; index++) {
			if ( i - index < 0 ||  array_of_chars[i - index] !== word_looking_for[index]) {
                return false;
			} else {
				location.push(i - index);
			}	
        }
        return location.reverse();
    }

    function erase_found_word(self, location, array_of_chars) { 
        for(var i =0; i < location.length; i++) {
            if (self.eraser_durability > 0) {
                array_of_chars[location[i]] = " ";
                self.eraser_durability -= 1;
            }
		}
		rewrite_to_paper(self, array_of_chars.reverse().toString().replace(/\,/g, ""));
	}

   	function rewrite_to_paper(self, array_of_chars) { 	
		return new Promise(function (resolve, reject) { 
			fs.writeFile(self.file_location , array_of_chars, function(err) {
    			if(err) throw err;
				resolve();
			})
		});
	}

	function all_filetext_to_array_of_chars(self){ 
    	return new Promise(function (resolve, reject) { 
			fs.readFile(self.file_location, function(err, data) {
				if(err)  {
					throw err;
					reject(err);
				}
				resolve(data.toString().split("").reverse());
			}) 
		});	
    }
}

module.exports = Pencil
