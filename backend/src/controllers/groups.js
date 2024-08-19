const { Group } = require('../db/models/Group')
const asyncWrapper = require('../middleware/asyncWrapper')
const { createCustomError } = require('../middleware/customError')

// ROUTE -> '/groups'
// GET
const getAllGroups = asyncWrapper(async (req, res) => {
  const groups = await Group.findAll()

  if (!groups) {
    throw createCustomError('Groups could not be retrieved.', 500)
  }

  res.status(200).json(groups)
})

// POST
const newGroup = asyncWrapper(async (req, res) => {
  const groupDetails = req.body

  const group = await Group.create({ groupDetails })

  if (!group) {
    throw createCustomError('Group unable to be created.', 500)
  }

  res.status(200).json(group)
})

// DELETE
const deleteAllGroups = asyncWrapper(async (req, res) => {
  await Group.destroy({
    where: {}
  })

  res.status(200).json({ message: 'All Groups deleted successfully.' })
})

// ROUTE '/games/:id'
// GET
const getGroup = asyncWrapper(async (req, res) => {
  const groupId = req.params.id
  const group = Group.findByPk(groupId)

  if (!group) {
    throw createCustomError(`Group with ID ${groupId} unable to found and deleted.`)
  }
  await group.destroy()
  res.status(200).json({ message: 'Group successfully deleted.' })
})

// PUT
const updateGroup = asyncWrapper(async (req, res) => {
  const groupDetails = req.body
  const groupId = req.params.id
  const group = Group.findByPk(groupId)

  if (!group) {
    throw createCustomError(`Group with ID ${groupId} could not be located and updated.`)
  }

  await group.update({ groupDetails })
  res.status(200).json(group)
})

// DELETE
const deleteGroup = asyncWrapper(async (req, res) => {
  const groupId = req.params.id

  const group = Group.findByPk(groupId)

  if (!group) {
    throw createCustomError(`Unable to find and delete group with ID ${groupId}`)
  }

  await group.destroy()
  res.status(200).json({ message: 'Group deleted successfully.' })
})

module.exports = {
  getAllGroups,
  newGroup,
  deleteAllGroups,
  getGroup,
  updateGroup,
  deleteGroup
}
