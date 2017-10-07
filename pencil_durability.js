var fs = require('fs')
function Pencil(durability=100) {
    // private vars
    var self = this

    //public vars
    this.durability = durability;
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
				if (self.text[i] === self.text[i].toUpperCase() &&
					 	self.text[i] !== self.text[i].toLowerCase()) { 
					// its upper case
					if (self.durability - 2 >= 0) { 
						fs.appendFileSync(self.file_location, self.text[i]);
						self.durability -= 2;
 					} else { 
						fs.appendFileSync(self.file_location, " ");
					}
				} else {
					// its lower case
					if (self.durability - 1 >= 0) {
						fs.appendFileSync(self.file_location, self.text[i])
						self.durability -= 1;
					} else {
						fs.appendFileSync(self.file_location, " ");
					}	 					
            	}
			}        
			
			resolve();
        
		}).catch((err) => {
			throw err;
		});
    }

    // public functions
    this.write = function(file_location, text_to_write) {
        set_location_and_text(self, file_location, text_to_write);
		write_to_file(self);
	}
}

module.exports = Pencil
