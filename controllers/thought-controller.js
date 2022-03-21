const { Thought, User } = require('../models');

const thoughtController = {
    // get all thoughts
    getThoughts(req, res){
        Thought.find({})
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },
    // get thought by id
    getThoughtById({ params }, res){
        Thought.findOne({ _id: params.id })
        .populate({
            path: 'reactions',
            select: '__v'
        })
        .sort({ _id: -1 })
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },
    // create thought
    addThought({ params, body }, res){
        Thought.create(body)
        .then(({ _id, userId }) => {
            return User.findOneAndUpdate(
                { _id: userId },
                { $push: { thoughts: _id }},
                {new: true}
            );
        })
        .then(dbUserData => {
            if (!dbUserData){
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },
    // update thought
    updateThought({ params, body }, res){
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(dbThoughtData => {
            if(!dbThoughtData){
                res.status(404).json({ message: 'Thought not found' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    },
    // remove thought
    deleteThought({ params }, res){
        Thought.findOneAndDelete({ params }, res)
        .then(({ _id, userId }) => {
            if (!_id){
                res.status(404).json({ message: 'Thought not found' });
                return;
            }
            return User.findOneAndUpdate(
                { _id: userId },
                { $pull: { thoughts: _id }},
                { new: true }
            );
        })
        .then(dbUserData => {
            if(!dbUserData){
                res.status(404).json({ message: 'Not found' });
                return;
            }
            res.json(dbUserData);
        })
        // .then(dbThoughtData => {
        //     if (!dbThoughtData){
        //         res.status(404).json({ message: 'Thought not found' });
        //         return;
        //     }
        //     // res.json(dbThoughtData);
        // })
        .catch(err => res.json(err));
    },
    // add reaction
    addReaction({ body, params }, res){
        Thought.findOneAndUpdate({ _id: params.id }, { $push: { reactions: body }}, {new: true, runValidators: true })
        .then(dbThoughtData => {
            if (!dbThoughtData){
                res.status(404).json({ message: 'Thought not found' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    },
    // remove reaction
    deleteReaction({ params }, res){
        Thought.findOneAndUpdate({ _id: params.id }, { $pull: { reactions: { reactionId: params.reactionId } }}, { new: true })
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => res.json(err));
    }
};

module.exports = thoughtController;