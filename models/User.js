const { Schema, model } = require('mongoose');
const { isEmailValid } = require('../utils/isEmailValid');

const UserSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            validate: {
                validator: function(v) {
                    return isEmailValid(v);
                },
                message: error => `${error.value} is not a valid email address`
            }
        },
        thoughts: [{
            type: Schema.Types.ObjectId,
            ref: 'Thought'
        }],
        friends: [],
    },
    {
        toJSON: {
            virtuals: true,
            getters: true 
        },
        id: false
    }
);

UserSchema.virtual('friendscount').get(function() {
    return this.friends.length;
});

const User = model('User', UserSchema);

module.exports = User;