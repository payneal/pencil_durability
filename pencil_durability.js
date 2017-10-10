var fs = require('fs')
function Pencil(durability=100, length=100) {
    // private vars
    var self = this

    //public vars
    this.durability = durability;
    this.original_durability = durability;
    this.length = length;
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
        if (this.length > 0) { 
            this.durability = this.original_durability;
            length -= 1;
        }
    }

    this.erase = function(word_to_erase) {
		return Promise.resolve()
		.then(() => all_filetext_to_array_of_chars(self))
		.then(array_of_chars => {
			for (i=0; i<array_of_chars.length; i++){
				if (array_of_chars[i] === word_to_erase[0]){
					var response = verify_match(
						self, array_of_chars, i, word_to_erase)
					if (response !== false) {
						return response;
					}
				}
			}
		})
		.then(result => rewrite_to_paper(self, result))
		.then( ahh => {
			return ahh;
		})
		.catch((err) => {
			console.log(err);
		});
	}

	function verify_match(self, array_of_chars, i, word_to_erase) {
		
		var erase_spaces = [];

		for (var index = 0; index < word_to_erase.length; index++) {
			if ( i - index < 0 ||  array_of_chars[i - index] !== word_to_erase[index]) {
				erase_spaces = [];
				return false;
			} else {
				erase_spaces.push(i - index)
			}
			
		}
		for(var i =0; i < erase_spaces.length; i++) {
			array_of_chars[erase_spaces[i]] = " "
		}
		return array_of_chars.reverse().toString().replace(/\,/g, "");
	}

   	function rewrite_to_paper(self, array_of_chars) { 	
		return new Promise(function (resolve, reject) { 
	
			fs.writeFile(self.file_location , array_of_chars, function(err) {
    			if(err) {
					throw err;
					reject(err);
    			}
				resolve(true);
			});
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
			}); 
		});	
    }

}

module.exports = Pencil
