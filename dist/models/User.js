"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserById = exports.deleteUserById = exports.createUser = exports.getUserById = exports.getUserBySessionToken = exports.getUserByEmail = exports.getUsers = exports.UserModel = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var UserSchema = new mongoose_1.default.Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    // auth obj/document
    authentication: {
        password: {
            type: String,
            required: true,
            // by default this will not be selected each time we query the model
            select: false,
            salt: {
                type: String,
                select: false,
            },
            sessionToken: {
                type: String,
                select: false,
            }
        },
    }
});
exports.UserModel = mongoose_1.default.model('User', UserSchema);
// actions
var getUsers = function () { return exports.UserModel.find(); };
exports.getUsers = getUsers;
var getUserByEmail = function (email) {
    return exports.UserModel.findOne({ email: email });
};
exports.getUserByEmail = getUserByEmail;
var getUserBySessionToken = function (sessionToken) {
    return exports.UserModel.findOne({
        'authentication.sessionToken': sessionToken,
    });
};
exports.getUserBySessionToken = getUserBySessionToken;
var getUserById = function (id) { return exports.UserModel.findById(id); };
exports.getUserById = getUserById;
// create user
var createUser = function (values) {
    return new exports.UserModel(values)
        .save()
        // convert model to object
        .then(function (user) { return user.toObject(); });
};
exports.createUser = createUser;
// delete user
var deleteUserById = function (id) { return exports.UserModel.findOneAndDelete({
    _id: id,
}); };
exports.deleteUserById = deleteUserById;
// update user
var updateUserById = function (id, values) {
    return exports.UserModel.findByIdAndUpdate(id, values);
};
exports.updateUserById = updateUserById;
