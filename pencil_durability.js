function Pencil(text_file, text_input) {

    this.text_file = text_file;
    this.text_input = text_input;

    this.written_text = function() {
        return this.text_input;
    }
}

module.exports = Pencil
