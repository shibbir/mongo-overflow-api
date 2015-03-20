module.exports = function(mongoose) {
    "use strict";

    mongoose.Error.messages.general.default = "Validator failed for the field '{PATH}' with value '{VALUE}'";
    mongoose.Error.messages.general.required = "The '{PATH}' field is required.";

    mongoose.Error.messages.Number.min = "The field '{PATH}' ({VALUE}) is less than minimum allowed value ({MIN}).";
    mongoose.Error.messages.Number.max = "The field '{PATH}' ({VALUE}) is more than maximum allowed value ({MAX}).";

    mongoose.Error.messages.String.enum = "'{VALUE}' is not a valid enum value for '{PATH}'.";
    mongoose.Error.messages.String.match = "The field '{PATH}' is invalid ({VALUE}).";
};