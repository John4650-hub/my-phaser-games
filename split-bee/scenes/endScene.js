class EndScene extends Phaser.Scene {
  constructor() {
    super({ key: 'end' })
  }
  preload() {
this.load.audio('win','../assets/victory.mp3')
  }
  create() {
    this.sound.play('win')
    const beeWords  = `
    Buzz buzz,The bee says 
    thanks for bringing it 
    back home in time or 
    else it could have 
    frozen to death or eaten 
    by frogs`
    let config = {
      fontFamily: "Time New Roman",
      fontSize: "30px",
      fontSyle: "bold",
      color: "#ff00ff"
    }
    
    this.add.text(this.scale.width / 4, 300, beeWords, config).setOrigin(0);
    this.time.addEvent({
      delay: 2000,
      callback: () => {
        this.add.text(this.scale.width / 3.5, this.scale.height - (this.scale.height - 200), 'CLICK TO RESTART', {
          color: '#0ff0ff',
          fontSize: '60px',
          fontFamily: 'Times New Roman'
        })
      }
    })
    this.input.on('pointerdown', () => {
      this.sound.stopAll();
      this.scene.start('start') })
  }
}