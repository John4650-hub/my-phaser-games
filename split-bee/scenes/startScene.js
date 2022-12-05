class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: 'start' })
  }
  preload() {

  }
  create() {
    const about = `
    This bee has has got split 
    from the swam and it needs 
    your help to find it's way 
    to the hive. \n\n
    The journey is not going to
    be easy and it will be also 
    hard for the bee to survive 
    long in this freezing weather.
    `
    let config = {
      fontFamily: "Time New Roman",
      fontSize: "30px",
      fontSyle: "bold",
      color: "#ff00ff"
    }

    this.add.text(this.scale.width / 4, 300, about, config).setOrigin(0);
    this.time.addEvent({
      delay: 2000,
      callback: () => {
        this.add.text(this.scale.width / 3.5, this.scale.height - (this.scale.height - 200), 'CLICK TO START', {
          color: '#0ff0ff',
          fontSize: '60px',
          fontFamily: 'Times New Roman'
        })
      }
    })
    this.input.on('pointerdown', () => {
      this.sound.stopAll();
      this.scene.start('main')
    })
  }
}