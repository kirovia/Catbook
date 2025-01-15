// GRABBING SOME ELEMENTS FROM THE DOM
//
const characterSelect = document.getElementById('character-select')


// ADDS FUNCTIONALITY FOR THE IMAGE GALLERY
//
const left = document.getElementById('left')
left.addEventListener('click', () => {
    if (catImagesIndex > 0) {
        catImagesIndex--
        characterSelect.src = catImages[catImagesIndex]
        characterSelect.id = catIds[catImagesIndex]
    } 
})
const right = document.getElementById('right')
right.addEventListener('click', () => {
    if (catImagesIndex < 9) {
        catImagesIndex++
        characterSelect.src = catImages[catImagesIndex]
        characterSelect.id = catIds[catImagesIndex]
    }
})


// POPULATES THE IMAGE GALLERY WITH A FETCH
//
const catImages = []
const catIds = []
let catImagesIndex = 0
function fetchImagesForSelection() {
    fetch('https://api.thecatapi.com/v1/images/search?limit=10')
        .then(resp => resp.json())
        .then(data => data.forEach(cat => {
            catImages.push(cat.url)
            catIds.push(cat.id)
            characterSelect.src = catImages[catImagesIndex]
            characterSelect.id = catIds[catImagesIndex]
        }))    
}


// GRABBING MORE ELEMENTS FROM DOM
//
const characterCreation = document.getElementById('character-creation')
const form = document.getElementById('form')
const formName = document.getElementById('name')
const formSubmit = document.getElementById('submit')
const character = document.getElementById('character')
const main = document.querySelector('main')

// ADDS FUNCTIONALITY TO THE FORM
//
form.addEventListener('submit', function(e) {
    e.preventDefault()
    fetchAllAdoptedCats()
    formSubmit.remove()
    characterCreation.style.transform = 'translate(0, -100vh)'
    fetch('http://localhost:3000/cats', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            id: characterSelect.id,
            name: formName.value,
            image: catImages[catImagesIndex],
            likes: 0
        })
    })
    const div = document.createElement('div')
    const img = document.createElement('img')
    img.src = catImages[catImagesIndex]
    img.style.height = '200px'
    img.style.width = '200px'
    const p = document.createElement('p')
    p.textContent = formName.value
    const i = document.createElement('i')
    i.className = 'fa-solid fa-heart'
    i.textContent = '0'
    i.addEventListener('click', handleLike)
    i.id = characterSelect.id
    div.append(img, p, i)
    main.append(div)
})


// POPULATES KITTY PEN WITH ALL ADOPTED CATS
//
function fetchAllAdoptedCats() {
    fetch('http://localhost:3000/cats')
        .then(resp => resp.json())
        .then(data => data.forEach(cat => {
            const div = document.createElement('div')
            const img = document.createElement('img')
            img.src = cat.image
            img.style.height = '200px'
            img.style.width = '200px'
            const p = document.createElement('p')
            p.textContent = cat.name
            const i = document.createElement('i')
            i.className = 'fa-solid fa-heart'
            i.textContent = cat.likes
            i.addEventListener('click', handleLike)
            i.id = cat.id
            div.append(img, p, i)
            main.append(div)
        }))
}


// BUTTON AT BOTTOM OF PAGE
//
const refresh = document.getElementById('refresh')
refresh.addEventListener('click', () => {
    location.reload()
})


// FUNCTION FOR LIKES
//
function handleLike() {
    let oldLikeCount = this.textContent
    let newLikeCount = parseInt(oldLikeCount) + 1
    this.textContent = newLikeCount
    fetch(`http://localhost:3000/cats/${this.id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({likes: newLikeCount})
    })
}

// LISTENS FOR KEYDOWN
//
document.addEventListener('keydown', (e) => {
    const meow = new Audio('./meow.mp3')
    e.key === ' ' ? meow.play() : undefined
})

fetchImagesForSelection() 
