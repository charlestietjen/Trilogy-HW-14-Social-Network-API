const { User, Thought } = require('../models');

const userController = {
    // Get all users
    getAllUsers(req, res){
        User.find({})
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },
    // Get user by id
    getUserById({ params }, res){
        User.findOne({ _id: params.id })
        .populate({
            path: 'thoughts',
        })
        .populate({
            path: 'friends',
        })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },
    // Add user
    addUser({ body }, res){
        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.json(err));
    },
    // update user
    updateUser({ params, body }, res){
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(dbUserData => {
            if (!dbUserData){
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },
    // delete user - remove a users posted thoughts on delete
    deleteUser({ params }, res){
        User.findOneAndDelete({ _id: params.id })
        .then(dbUserData => {
            console.log(dbUserData)
            dbUserData.thoughts.forEach(arr => {
                console.log(`============Delete Thought ${arr}=========`)
                Thought.findOneAndDelete({ _id: arr })
                .then(dbThoughtData => console.log(dbThoughtData))
                .catch(err => {
                    console.log(err);
                })
            })
            res.json(dbUserData)
        })
        .catch(err => res.json(err));
    },
    // add friend
    addFriend({ params }, res){
        User.findOneAndUpdate({ _id: params.id }, { $push: { friends: params.friendId }}, { new: true })
        .then(dbUserData => {
            if (!dbUserData){
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        });
    },
    // remove friend
    removeFriend({ params }, res){
        User.findOneAndUpdate({ _id: params.id }, { $pull: { friends: params.friendId }}, { new: true })
        .then(dbUserData => {
            if (!dbUserData){
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        });
    }
};

module.exports = userController;