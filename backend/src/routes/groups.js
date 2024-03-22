const express = require('express');
const router = express.Router();


const {
    getAllGroups,
    newGroup,
    deleteAllGroups,
    getGroup,
    updateGroup,
    deleteGroup
} = require('../controllers/groups');

router.route('/').get(getAllGroups).post(newGroup).delete(deleteAllGroups);
router.route('/:id').get(getGroup).put(updateGroup).delete(deleteGroup);