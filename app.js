const scoreEl = document.querySelector('#scoreEl')
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

//create a player

class Player {
  constructor() {
    this.velocity = {
      x: 0,
      y: 0
    }

    this.rotation = 0
    this.opacity = 1

    const image = new Image()
    image.src = './img/spaceship.png'
    image.onload = () => {
      const scale = 0.15
      this.image = image
      this.width = image.width * scale
      this.height = image.height * scale
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height - 20
      }
    }

    this.particles = []
    this.frames = 0
  }

  draw() {

    c.save()
    c.globalAlpha = this.opacity
    c.translate(
      player.position.x + player.width / 2,
      player.position.y + player.height / 2
    )
    c.rotate(this.rotation)

    c.translate(
      -player.position.x - player.width / 2,
      -player.position.y - player.height / 2
    )

    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    )
    c.restore()
  }

  update() {
    if (!this.image) return

    this.draw()
    this.position.x += this.velocity.x

    if (this.opacity !== 1) return

    this.frames++
    if (this.frames % 2 === 0) {
      this.particles.push(
        new Particle({
          position: {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height
          },
          velocity: {
            x: (Math.random() - 0.5) * 1.5,
            y: 1.4
          },
          radius: Math.random() * 2,
          color: 'yellow',
          fades: true
        })
      )
    }
  }
}

//create projectile from player

class Projectile {
  constructor({ position, velocity, color = 'purple' }) {
    this.position = position
    this.velocity = velocity

    this.radius = 4
    this.color = color
  }

  draw() {
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    c.fillStyle = this.color
    c.fill()
    c.closePath()
  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}

//create invader
class Invader {
  constructor({ position }) {
    this.velocity = {
      x: 0,
      y: 0
    }

    const image = new Image()
    image.src = './img/invader.png'
    image.onload = () => {
      const scale = 1
      this.image = image
      this.width = image.width * scale
      this.height = image.height * scale
      this.position = {
        x: position.x,
        y: position.y
      }
    }
  }

  draw() {
    // c.fillStyle = 'red'
    // c.fillRect(this.position.x, this.position.y, this.width, this.height)

    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    )
  }

  update({ velocity }) {
    if (this.image) {
      this.draw()
      this.position.x += velocity.x
      this.position.y += velocity.y
    }
  }

  shoot(invaderProjectiles) {
    audio.enemyShoot.play()
    invaderProjectiles.push(
      new InvaderProjectile({
        position: {
          x: this.position.x + this.width / 2,
          y: this.position.y + this.height
        },
        velocity: {
          x: 0,
          y: 5
        }
      })
    )
  }
}

// particles when objects get shot

class Particle {
  constructor({ position, velocity, radius, color, fades }) {
    this.position = position
    this.velocity = velocity

    this.radius = radius
    this.color = color
    this.opacity = 1
    this.fades = fades
  }

  draw() {
    c.save()
    c.globalAlpha = this.opacity
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    c.fillStyle = this.color
    c.fill()
    c.closePath()
    c.restore()
  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.fades) this.opacity -= 0.01
  }
}

//create invader projectiles

class InvaderProjectile {
  constructor({ position, velocity }) {
    this.position = position
    this.velocity = velocity

    this.width = 3
    this.height = 10
  }

  draw() {
    c.fillStyle = 'yellow'
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}

// create bombs

class Bomb {
  static radius = 30
  constructor({ position, velocity }) {
    this.position = position
    this.velocity = velocity
    this.radius = 0
    this.color = 'hotpink'
    this.opacity = 1
    this.active = false

    gsap.to(this, {
      radius: 30
    })
  }

  draw() {
    c.save()
    c.globalAlpha = this.opacity
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    c.closePath()
    c.fillStyle = this.color
    c.fill()
    c.restore()
  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (
      this.position.x + this.radius + this.velocity.x >= canvas.width ||
      this.position.x - this.radius + this.velocity.x <= 0
    ) {
      this.velocity.x = -this.velocity.x
    } else if (
      this.position.y + this.radius + this.velocity.y >= canvas.height ||
      this.position.y - this.radius + this.velocity.y <= 0
    )
      this.velocity.y = -this.velocity.y
  }

  explode() {
    audio.bomb.play()
    this.active = true
    this.velocity.x = 0
    this.velocity.y = 0
    gsap.to(this, {
      radius: 300,
      color: 'yellow'
    })

    gsap.to(this, {
      delay: 0.1,
      opacity: 0,
      duration: 0.15
    })
  }
}
//powerup neon balls
class PowerUp {
  constructor({ position, velocity }) {
    this.position = position
    this.velocity = velocity
    this.radius = 15
  }

  draw() {
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    c.fillStyle = '#00FFFF' //neon blue
    c.fill()
    c.closePath()
  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}

//Create and move grids of invaders

class Grid {
  constructor() {
    this.position = {
      x: 0,
      y: 0
    }

    this.velocity = {
      x: 3,
      y: 0
    }
//invaders array stored in invader grid
    this.invaders = []

    const columns = Math.floor(Math.random() * 10 + 5)//minimum of 5 invaders in place
    const rows = Math.floor(Math.random() * 5 + 2)  // 2-7 rows, making rows random so that game stays interesting

    this.width = columns * 30
 // creating multiple rows and columns of invaders next to each other
    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        this.invaders.push(
          new Invader({
            position: {
              x: x * 30,
              y: y * 30
            }
          })
        )
      }
    }
  }

  update() {
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    this.velocity.y = 0

    if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
      this.velocity.x = -this.velocity.x * 1.15
      this.velocity.y = 30
    }
  }
}

//Utilities or added reusable functionalities
//like generating random numbers, checking for collisions, creating particles and score labels.

function randomBetween(min, max) {
  return Math.random() * (max - min) + min
} //returns a random number between two specified values (min and max).

function createScoreLabel({ score = 100, object }) {
  const scoreLabel = document.createElement('label')
  scoreLabel.innerHTML = score  //creates a label element to display the score and adds it to the parentDiv element.
  scoreLabel.style.position = 'absolute'
  scoreLabel.style.color = 'white'
  scoreLabel.style.top = object.position.y + 'px'
  scoreLabel.style.left = object.position.x + 'px'
  scoreLabel.style.userSelect = 'none'
  document.querySelector('#parentDiv').appendChild(scoreLabel)
  gsap.to(scoreLabel, {
    opacity: 0,
    y: -30,
    duration: 0.75,
    onComplete: () => {
      document.querySelector('#parentDiv').removeChild(scoreLabel)
    }
  })
} // The label disappears after a set duration using the GreenSock Animation Platform (gsap) library.

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y &&
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width
  ) 
} //checks for collisions

function createParticles({ object, color, fades }) {
  for (let i = 0; i < 15; i++) {
    particles.push(
      new Particle({
        position: {
          x: object.position.x + object.width / 2,
          y: object.position.y + object.height / 2
        },
        velocity: {
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2
        },
        radius: Math.random() * 3,
        color: color || '#2ACF11',
        fades
      })
    )
  }
} //creates and pushes new particle objects to an array,
// based on an object with specified position, velocity, radius, color, and fade property.


let player = new Player()
let projectiles = []
let grids = []
let invaderProjectiles = []
let particles = []
let bombs = []
let powerUps = []
let lives = 3


// We come to game logic and mechanics. We have keys object to control the player 
// The game logic is implemented using a game object with an "over" and "active" property.
//  The "over" property indicates if the game has ended
//  the "active" property indicates if the game is currently in progress or not.

let keys = {
  ArrowLeft: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  space: {
    pressed: false
  }
}

let frames = 0
let randomInterval = Math.floor(Math.random() * 500 + 500)
let game = {
  over: false,
  active: true
}
let score = 0

let spawnBuffer = 500
let fps = 60
let fpsInterval = 1000 / fps
let msPrev = window.performance.now()

function init() {  //"init" function called to reset the game and initialize the game objects.
  player = new Player()
  projectiles = []
  grids = []
  invaderProjectiles = []
  particles = []
  bombs = []
  powerUps = []

  keys = {
    ArrowLeft: {
      pressed: false
    },
    ArrowRight: {
      pressed: false
    },
    space: {
      pressed: false
    }
  }

  frames = 0
  randomInterval = Math.floor(Math.random() * 500 + 500)
  game = {
    over: false,
    active: true
  }
  score = 0
  document.querySelector('#finalScore').innerHTML = score
  document.querySelector('#scoreEl').innerHTML = score

  for (let i = 0; i < 100; i++) {
    particles.push(
      new Particle({
        position: {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height
        },
        velocity: {
          x: 0,
          y: 0.3
        },
        radius: Math.random() * 2,
        color: 'white'
      })
    )
  }
}

//The "endGame" function is called when the game is over
//sets the "game.over" property to true
//sets the "game.active" property to false to stop the game loop.
// displays the "restartScreen" element and shows the final score.

function endGame() {
 
  console.log('you lose')
  audio.gameOver.play()
  

  // Makes player disappear
  setTimeout(() => {
    player.opacity = 0
    game.over = true
  }, 0)

  // stops game altogether 
  setTimeout(() => {
    game.active = false
    document.querySelector('#restartScreen').style.display = 'flex'
    document.querySelector('#finalScore').innerHTML = score
  }, 2000) 

  createParticles({
    object: player,
    color: 'white',
    fades: true
  })
}

function animate() {
  if (!game.active) return
  requestAnimationFrame(animate)

  const msNow = window.performance.now()
  const elapsed = msNow - msPrev

  if (elapsed < fpsInterval) return

  msPrev = msNow - (elapsed % fpsInterval) // 3.34

  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)

  for (let i = powerUps.length - 1; i >= 0; i--) {
    const powerUp = powerUps[i]

    if (powerUp.position.x - powerUp.radius >= canvas.width)
      powerUps.splice(i, 1)
    else powerUp.update()
  }

  // spawn powerups
  if (frames % 500 === 0) {
    powerUps.push(
      new PowerUp({
        position: {
          x: 0,
          y: Math.random() * 300 + 15
        },
        velocity: {
          x: 5,
          y: 0
        }
      })
    )
  }

  // spawn bombs
  if (frames % 200 === 0 && bombs.length < 3) {
    bombs.push(
      new Bomb({
        position: {
          x: randomBetween(Bomb.radius, canvas.width - Bomb.radius),
          y: randomBetween(Bomb.radius, canvas.height - Bomb.radius)
        },
        velocity: {
          x: (Math.random() - 0.5) * 6,
          y: (Math.random() - 0.5) * 6
        }
      })
    )
  }

  for (let i = bombs.length - 1; i >= 0; i--) {
    const bomb = bombs[i]

    if (bomb.opacity <= 0) {
      bombs.splice(i, 1)
    } else bomb.update()
  }

  player.update()

  for (let i = player.particles.length - 1; i >= 0; i--) {
    const particle = player.particles[i]
    particle.update()

    if (particle.opacity === 0) player.particles[i].splice(i, 1)
  }

  particles.forEach((particle, i) => {
    if (particle.position.y - particle.radius >= canvas.height) {
      particle.position.x = Math.random() * canvas.width
      particle.position.y = -particle.radius
    }

    if (particle.opacity <= 0) {
      setTimeout(() => {
        particles.splice(i, 1)
      }, 0)
    } else {
      particle.update()
    }
  })

  invaderProjectiles.forEach((invaderProjectile, index) => {
    if (
      invaderProjectile.position.y + invaderProjectile.height >=
      canvas.height
    ) {
      setTimeout(() => {
        invaderProjectiles.splice(index, 1)
      }, 0)
    } else invaderProjectile.update()

    // projectile hits player
    if (
      rectangularCollision({
        rectangle1: invaderProjectile,
        rectangle2: player
      })
    ) {
      invaderProjectiles.splice(index, 1)
      endGame()
    }
  })

  for (let i = projectiles.length - 1; i >= 0; i--) {
    const projectile = projectiles[i]

    for (let j = bombs.length - 1; j >= 0; j--) {
      const bomb = bombs[j]

      // if projectile touches bomb, remove projectile
      if (
        Math.hypot(
          projectile.position.x - bomb.position.x,
          projectile.position.y - bomb.position.y
        ) <
          projectile.radius + bomb.radius &&
        !bomb.active
      ) {
        projectiles.splice(i, 1)
        bomb.explode()
      }
    }

    for (let j = powerUps.length - 1; j >= 0; j--) {
      const powerUp = powerUps[j]

      // if projectile touches bomb, remove projectile
      if (
        Math.hypot(
          projectile.position.x - powerUp.position.x,
          projectile.position.y - powerUp.position.y
        ) <
        projectile.radius + powerUp.radius
      ) {
        projectiles.splice(i, 1)
        powerUps.splice(j, 1)
        player.powerUp = 'MachineGun'
        console.log('powerup started')
        audio.bonus.play()

        setTimeout(() => {
          player.powerUp = null
          console.log('powerup ended')
        }, 5000)
      }
    }

    if (projectile.position.y + projectile.radius <= 0) {
      projectiles.splice(i, 1)
    } else {
      projectile.update()
    }
  }

  grids.forEach((grid, gridIndex) => {
    grid.update()

    // spawn projectiles
    if (frames % 100 === 0 && grid.invaders.length > 0) {
      grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(
        invaderProjectiles
      )
    }

    for (let i = grid.invaders.length - 1; i >= 0; i--) {
      const invader = grid.invaders[i]
      invader.update({ velocity: grid.velocity })

      for (let j = bombs.length - 1; j >= 0; j--) {
        const bomb = bombs[j]
        //console.log (bomb, invader)
        const invaderRadius = 15

        // if bomb touches invader, remove invader
        if (
          Math.hypot(
            invader.position.x - bomb.position.x,
            invader.position.y - bomb.position.y
          ) <
            invaderRadius + bomb.radius &&
          bomb.active
        ) {
          score += 50
          scoreEl.innerHTML = score

          grid.invaders.splice(i, 1)
          createScoreLabel({
            object: invader,
            score: 50
          })

          createParticles({
            object: invader,
            fades: true
          })
        }
      }

      // projectiles hit enemy
      projectiles.forEach((projectile, j) => {
        if (
          projectile.position.y - projectile.radius <=
            invader.position.y + invader.height &&
          projectile.position.x + projectile.radius >= invader.position.x &&
          projectile.position.x - projectile.radius <=
            invader.position.x + invader.width &&
          projectile.position.y + projectile.radius >= invader.position.y
        ) {
          setTimeout(() => {
            const invaderFound = grid.invaders.find(
              (invader2) => invader2 === invader
            )
            const projectileFound = projectiles.find(
              (projectile2) => projectile2 === projectile
            )

            // remove invader and projectile
            if (invaderFound && projectileFound) {
              score += 100
              scoreEl.innerHTML = score

              // dynamic score labels
              createScoreLabel({
                object: invader
              })

              createParticles({
                object: invader,
                fades: true
              })

              // singular projectile hits an enemy
              audio.explode.play()
              grid.invaders.splice(i, 1)
              projectiles.splice(j, 1)

              if (grid.invaders.length > 0) {
                const firstInvader = grid.invaders[0]
                const lastInvader = grid.invaders[grid.invaders.length - 1]

                grid.width =
                  lastInvader.position.x -
                  firstInvader.position.x +
                  lastInvader.width
                grid.position.x = firstInvader.position.x
              } else {
                grids.splice(gridIndex, 1)
              }
            }
          }, 0)
        }
      })
      // remove player if invaders touch it
      if (
        rectangularCollision({ rectangle1: invader, rectangle2: player}) &&
        !game.over
      ) 
       // { lives --}
    // if (lives === 0){
     endGame()
  } // end looping over grid.invaders
  }) 
  if (keys.ArrowLeft.pressed && player.position.x >= 0) {
    player.velocity.x = -7
    player.rotation = -0.15
  } else if (
    keys.ArrowRight.pressed &&
    player.position.x + player.width <= canvas.width
  ) {
    player.velocity.x = 7
    player.rotation = 0.15
  } else {
    player.velocity.x = 0
    player.rotation = 0
  }

  // spawning enemies
  if (frames % randomInterval === 0) {
    spawnBuffer = spawnBuffer < 0 ? 100 : spawnBuffer
    grids.push(new Grid())
    randomInterval = Math.floor(Math.random() * 500 + spawnBuffer)
    frames = 0
    spawnBuffer -= 100
  }

  if (
    keys.space.pressed &&
    player.powerUp === 'MachineGun' &&
    frames % 2 === 0 &&
    !game.over
  ) {
    if (frames % 6 === 0) audio.shoot.play()
    projectiles.push(
      new Projectile({
        position: {
          x: player.position.x + player.width / 2,
          y: player.position.y
        },
        velocity: {
          x: 0,
          y: -10
        },
        color: 'yellow'
      })
    )
  }  
  // c.fillStyle = 'red'; // for lives
  // c.font = '20px Arial';
  // var textWidth = c.measureText(`Lives: ${lives}`).width;
  // c.fillText(`Lives: ${lives}`, canvas.width - textWidth - 10, 30);
  
  frames++
}

document.querySelector('#startButton').addEventListener('click', () => {
  audio.backgroundMusic.play()
  audio.start.play()

  document.querySelector('#startScreen').style.display = 'none'
  document.querySelector('#scoreContainer').style.display = 'block'
  init()
  animate()
})

document.querySelector('#restartButton').addEventListener('click', () => {
  audio.select.play()
  document.querySelector('#restartScreen').style.display = 'none'
  init()
  animate()
})

addEventListener('keydown', ({ key }) => {
  if (game.over) return

  switch (key) {
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true
      break
    case 'ArrowRight':
      keys.ArrowRight.pressed = true
      break
    case ' ':
      keys.space.pressed = true

      if (player.powerUp === 'MachineGun') return

      audio.shoot.play()
      projectiles.push(
        new Projectile({
          position: {
            x: player.position.x + player.width / 2,
            y: player.position.y
          },
          velocity: {
            x: 0,
            y: -10
          }
        })
      )

      break
  }
})

addEventListener('keyup', ({ key }) => {
  switch (key) {
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
    case ' ':
      keys.space.pressed = false

      break
  }
})
