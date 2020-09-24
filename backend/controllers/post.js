const Post = require('../models/post');

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January = 0
var yyyy = today.getFullYear();

today = dd + '/' + mm + '/' + yyyy;

exports.createPost = (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId,
        creationDate: today
    });
    post.save().then(createdPost => {
        res.status(201).json({
            message: "Post added successfully",
            post: {
                ...createdPost,
                id: createdPost._id
            }
        });
    }).catch(error => {
        res.status(500).json({
            message: 'Creating a post failed!',
            error
        })
    });
}

exports.updatePost = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + "/images/" + req.file.filename
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath,
        creator: req.userData.userId,
        creationDate: today
    });
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
        if (result.n > 0) {
            res.status(200).json({ message: "Updated successfully!" });
        } else {
            res.status(401).json({ message: "Update failed, not authorized!" });
        }
    })
    .catch(error => {
        res.status(500).json({
            message: "Couldn't update post!",
            error
        })
    })
}

exports.getAllPosts = (req, res, next) => {
    Post.find().then(documents => {       
            res.status(200).json({
            message: 'Post fetched successfully',
            posts: documents
        });
    })
    .catch(error => {
        res.status(500).json({
            message: "Couldn't fetch the posts!",
            error
        })
    });
}

exports.getAPost = (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({message: "post not found!"});
        }
    })
    .catch(error => {
        res.status(500).json({
            message: "Couldn't get the post!",
            error
        })
    })
}

exports.deletePost = (req, res, next) => {
    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
        if (result.n > 0) {
            res.status(200).json({message: "Post deleted!" });
        } else {
            res.status(401).json({ message: "Delete failed, not authorized!" });
        }
    })
    .catch(error => {
        res.status(500).json({
            message: "Couldn't delete the post",
            error
        })
    });
}