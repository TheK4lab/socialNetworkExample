const Note = require('../models/note');

exports.createNote = (req, res, next) => {
    const note = new Note({
        title: req.body.title,
        content: req.body.content,
        creator: req.userData.userId
    });
    note.save().then(createdNote => {
        res.status(201).json({
            message: "Note added successfully",
            note: {
                ...createdNote,
                id: createdNote._id
            }
        });
    });
}

exports.updateNote = (req, res, next) => {
    const note = new Note({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        creator: req.userData.userId
    });
    Note.updateOne({ _id: req.params.id, creator: req.userData.userId }, note).then(result => {
        if (result.nModified > 0) {
            res.status(200).json({ message: "Updated successfully!" });
        } else {
            res.status(401).json({ message: "Update failed, not authorized!" });
        }
    })
}

exports.getAllNotes = (req, res, next) => {
    Note.find({ creator: req.userData.userId }).then(documents => {   
            res.status(200).json({
            message: 'Notes fetched successfully',
            notes: documents
        });
    });
}

exports.getANote = (req, res, next) => {
    Note.findById(req.params.id).then(note => {
        if (note) {
            res.status(200).json(note);
        } else {
            res.status(404).json({message: "Note not found!"});
        }
    })
}

exports.deleteNote = (req, res, next) => {
    Note.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
        if (result.n > 0) {
            res.status(200).json({message: "Note deleted!" });
        } else {
            res.status(401).json({ message: "Delete failed, not authorized!" });
        }
    });
}