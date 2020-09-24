const express = require('express');

const NoteController = require('../controllers/note');
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

const router = express.Router();



router.post("", checkAuth, extractFile, NoteController.createNote);

router.put("/:id", checkAuth, extractFile, NoteController.updateNote);

router.get("", checkAuth, NoteController.getAllNotes);

router.get("/:id", checkAuth , NoteController.getANote);

router.delete("/:id", checkAuth, NoteController.deleteNote);

module.exports = router;