const users = []

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
  // clean the data
  username = username.trim().toLowerCase()
  room = room.trim().toLowerCase()

  // validate the data - is the string empty?
  if(!username || !room) {
    return {
      error: 'User name and room are required!'
    }
  }

  // check for existing user
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username
  })

  // validate username
  if(existingUser) {
    return {
      error: 'User name is in use!'
    }
  }

  // store user in array
  const user = { id, username, room }
  users.push(user)
  return { user }
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id )
  if(index != -1) {
    return users.splice(index, 1)[0]
  }
}

const getUser = (id) => {
  return users.find((user) => user.id === id)
}

const getUsersInRoom = (inRoom) => {
  inRoom = inRoom.trim().toLowerCase()
  return users.filter((user) => user.room === inRoom)
}

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
}