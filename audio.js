//Each sound effect, such as background music, enemy shooting, explosions, 
//and game over, is represented by a separate Howl instance in the audio object.

//When certain events occur in the game, 
//such as the player shooting or an enemy exploding, 
//the corresponding sound effect can be triggered by calling its play method. 

Howler.volume(0.5)
const audio = {
  backgroundMusic: new Howl({
    src: './audio/backgroundMusic.wav',
    loop: true
  }),
  bomb: new Howl({
    src: './audio/bomb.mp3'
  }),
  bonus: new Howl({
    src: './audio/bonus.mp3',
    volume: 0.8
  }),
  enemyShoot: new Howl({
    src: './audio/enemyShoot.wav'
  }),
  explode: new Howl({
    src: './audio/explode.wav'
  }),
  gameOver: new Howl({
    src: './audio/gameOver.mp3'
  }),
  select: new Howl({
    src: './audio/select.mp3'
  }),
  shoot: new Howl({
    src: './audio/shoot.wav'
  }),
  start: new Howl({
    src: './audio/start.mp3'
  })
}
