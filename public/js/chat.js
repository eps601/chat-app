const socket = io()

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')


// Templates - grab our templates from the html script using the script id
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })
console.log(username)

const autoscroll = () => {
// get new message element
const $newMessage = $messages.lastElementChild 

// get the height of the new message, standard things including things like its margin
const newMessageStyles = getComputedStyle($newMessage)
const newMessageMargin = parseInt(newMessageStyles.marginBottom)
const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

// visible height - i.e. window height
const visibleHeight = $messages.offsetHeight

// Height of messages container
const containerHeight = $messages.scrollHeight

// how far have I scrolled
const scrollOffset = $messages.scrollTop + visibleHeight

if(containerHeight - newMessageHeight <= scrollOffset) {
  $messages.scrollTop = $messages.scrollHeight
}

}

socket.on('message', (message) => {
  console.log(message)
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format('h:mm a')
  })
  $messages.insertAdjacentHTML('beforeend', html)
  autoscroll()
})

socket.on('locationMessage', (message) => {
  // console.log('url inside locationMessage', message)
  const html = Mustache.render(locationMessageTemplate, {
    username: message.username,
    url: message.url,
    createdAt: moment(message.createAt).format('h:mm a')
  })
  $messages.insertAdjacentHTML('beforeend', html)
  autoscroll()

})

socket.on('roomData', ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users
  })
  document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', (e) => {
  e.preventDefault()
// disable button to prevent double sending
$messageFormButton.setAttribute('disabled', 'disabled')
const message = e.target.elements.message.value

socket.emit('sendMessage', message, (error) => {
      $messageFormButton.removeAttribute('disabled') // enable button
      $messageFormInput.value = '' // clear text field
      $messageFormInput.focus() // position cursor inside text box

      if(error) {
        return console.log(error)
      }
      console.log('Message delivered!')
    })

})


$sendLocationButton.addEventListener('click', () => {
  
  if(!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser!')
  }
  $sendLocationButton.setAttribute('disabled', 'disabled')
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit('sendLocation', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }, () => {
      console.log('Location shared!')
      $sendLocationButton.removeAttribute('disabled')
    })
  })
})

socket.emit('join', { username, room }, (error) => {
  if(error) {
    alert(error)
    location.href = '/'
  }
})


// document.querySelector('#message_btn').addEventListener('click', (e) => {
//   e.preventDefault()
//   // disable form to prevent double sending
//   let data = document.querySelector('#message_content').value 

//   socket.emit('sendMessage', data, (error) => {
//     // enable form
//     if(error) {
//       return console.log(error)
//     }
//     console.log('Message delivered!')
//   })
// })