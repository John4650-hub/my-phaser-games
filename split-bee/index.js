var hats;
class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "main" })
    this.player;
    this.cursorKeys;
    this.joyStick;
    this.keyBoardCusa;
  }
  preload() {
    this.load.plugin(
      "rexvirtualjoystickplugin",
      "./plugins/rexvirtualjoystickplugin.min.js",
      true
    );
    this.load.spritesheet("heart", "./assets/hearts.png", { frameWidth: 16, frameHeight: 16 })
    this.load.spritesheet("player", "./assets/bee.png", { frameWidth: 64 / 2, frameHeight: 32 });
    this.load.spritesheet("bgImg", "./assets/Background.png", { frameWidth: 500 / 5, frameHeight: 100 });
    this.load.spritesheet("snowRope", "./assets/snowRope.png", { frameWidth: 48 / 3, frameHeight: 64 });
    this.load.image('tileset', 'assets/tilemap.png')
    this.load.tilemapTiledJSON('map', 'assets/export.json');
    this.load.image('thumb', 'assets/shadedDark11.png')
    this.load.image('base', 'assets/shadedDark07.png')
    this.load.image('bar', 'assets/bar.png')
    this.load.image('fpond', 'assets/fpond.png')
    this.load.image('spond', 'assets/spond.png')
    this.load.image('frog1', 'assets/frog1.png')
    this.load.image('frog2', 'assets/frog2.png')
    this.load.image('frog3', 'assets/frog3.png')
    this.load.image('frog4', 'assets/frog4.png')
    this.load.image('frog5', 'assets/frog5.png')
    this.load.image('mouth', 'assets/mouth.png')
    this.load.image('tongue', 'assets/tongue.png')
    this.load.image('flakes', 'assets/flake.png')
    this.load.image('hive', 'assets/hive1.png')
    this.load.audio('music','assets/music.mp3')
    this.load.audio('fail','assets/fail.mp3')
    
  }

  create() {
    this.sound.play('music')
    this.physics.world.setBounds(0, 100, this.scale.width * 3, this.scale.height / 2);
    this.physics.world.setBoundsCollision();
    this.add.image(0, this.scale.height - 200, 'bar').setOrigin(0)
    this.joyStick = this.plugins.get('rexvirtualjoystickplugin')
      .add(this, {
        x: 200,
        y: this.scale.height - 90,
        radius: 50,
        base: this.add.image(0, 0, 'base').setScale(.8),
        thumb: this.add.image(0, 0, 'thumb').setScale(.5),
        dir: '4dir',
        fixed: true,
      }).on("update", this.dumpJoyStickState, this);
    this.cursorKeys = this.joyStick.createCursorKeys();
    this.dumpJoyStickState();
    let firstPond = this.add.image(this.scale.width / 1.5, this.scale.height / 1.4, 'fpond')
    let secondPond = this.add.image(1570, this.scale.height / 1.4, 'spond')

    var flakes = this.physics.add.group({ runChildUpdate: true, gravityY: 20, velocityY: 10 })
    for (let i = 0; i < 100; i++) {
      let x = Phaser.Math.Between(0, this.scale.width)
      let y = Phaser.Math.Between(0, firstPond.y);
      let obj = flakes.create(x, y, 'flakes').setScrollFactor(0).setScale(.1);
    }
    this.time.addEvent({
      delay: 500,
      callback: function() {
        flakes.getChildren().forEach(function(child) {
          if (child.y > firstPond.y) {
            child.y = Phaser.Math.Between(-100, 100);
            child.setVelocityY(Phaser.Math.Between(20, 30))
          }
        })
      },
      loop: true
    })
    let fgKeys = ['frog1', 'frog2', 'frog3', 'frog4', 'frog5']
    let frogPos = [firstPond.x - 200, firstPond.x, firstPond.x + 200, secondPond.x - 200, secondPond.x + 150]
    let fScale = [0.5, 0.25, 0.5, 0.5, 0.25]
    let frogs = this.physics.add.group({ active: true, runChildUpdate: true, allowGravity: false });
    for (let i = 0; i < 5; i++) {
      let x = frogPos[i]
      let y = firstPond.y;
      let obj = frogs.create(x, y, fgKeys[i]).setScale(fScale[i])
      let mouth = frogs.create(obj.x, obj.y - 10, 'mouth').setScale(.5)
    }

    this.time.addEvent({
      delay: 700,
      callback: function() {
        frogs.getChildren().forEach(function(child) {
          child.y = 660;
        }, this)
      },
      callbackScope: this,
      loop: true
    })

    let tongues = this.physics.add.group({ runChildUpdate: true, allowGravity: false })
    frogs.getChildren().forEach(function(child) {
      let tongue = tongues.create(child.x, child.y - 167, 'tongue').setScale(.5).setVisible(false)
    })
    this.time.addEvent({
      delay: 700,
      callback: function() {
        tongues.getChildren().forEach(function(child) {
          child.setVisible(true)
          child.y = 330;
          child.setScale(0.3, 1.15)
        }, this)
      },
      callbackScope: this,
      loop: true
    })
    this.time.addEvent({
      delay: 500,
      callback: function() {
        tongues.getChildren().forEach(function(child) {
          child.setVisible(false)
          child.y = 760
        })
      },
      loop: true
    });

    const pond = this.add.tilemap('map');
    const tileset = pond.addTilesetImage('tilemap', 'tileset');
    const l1 = pond.createLayer('Pixel Editor', tileset, 0, this.scale.height / 2).setOrigin(0, 0)
    l1.setScale(3, 4)
    this.player = this.physics.add.sprite(50, this.scale.height / 2, 'player').setScale(3)

    this.player.body.setCollideWorldBounds();
    this.player.body.setSize(2)
    this.anims.create({
      key: 'fly',
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 1 }),
      repeat: -1,
      frameRate: 16,
    });
    this.player.play('fly');
    hats = this.add.group({
      active: true,
      maxSize: 2,
      runChildUpdate: true
    });

    for (let i = 0; i < 1; i++) {
      let x = 500 + (100 * i)
      let y = 0;
      let obj = hats.create(x+100, y, 'heart').setScale(4).setOrigin(0).setScrollFactor(0);
      let progBar = this.add.rectangle(obj.x + 100, obj.y+50, 80, 20, 0xff0000).setStrokeStyle(5, 0x000000).setScrollFactor(0)
      hats.add(progBar);
    }


    this.anims.create({
      key: 'beat',
      frames: this.anims.generateFrameNumbers("heart", { start: 0, end: 5 }),
      repeat: -1,
      frameRate: 5,
    });
    hats.playAnimation('beat')
    const cam = this.cameras.main;
    cam.setBounds(0, 0, this.scale.width * 3.01, this.scale.height / 2);
    cam.startFollow(this.player);

    tongues.getChildren().forEach((child) => {
      this.physics.add.overlap(this.player, child, eaten)
    })

    function eaten(x, y) {
      hats.getChildren()[1].width -= 5
    }

    let hive = this.physics.add.image(this.scale.width * 2.7, this.scale.height / 3.15, 'hive').setOrigin(0).setScale(.25)
    this.physics.add.collider(this.player, hive, () => { 
      this.sound.stopAll();
      this.scene.start('end') })
    this.keyBoardCusa = this.input.keyboard.createCursorKeys();
  }
  update() {
    this.player.setVelocity(0);
    if (hats.getChildren()[1].width < 2) {
      this.sound.play('fail')
      this.sound.stopAll();
      this.scene.restart();
    }
    if (this.cursorKeys.up.isDown || this.keyBoardCusa.up.isDown) {
      this.player.setVelocityY(-500);
    } else if (this.cursorKeys.down.isDown || this.keyBoardCusa.down.isDown) {
      this.player.setVelocityY(500);
    } else if (this.cursorKeys.left.isDown || this.keyBoardCusa.left.isDown) {
      this.player.setVelocityX(-500);
    } else if (this.cursorKeys.right.isDown || this.keyBoardCusa.right.isDown) {
      this.player.setVelocityX(400);
    }
  }
  dumpJoyStickState() {
    let joyKeys = this.joyStick.createCursorKeys();
    var s = "Key down: ";
    for (var name in joyKeys) {
      if (joyKeys[name].isDown) {
        s += `${name} `;
      }
    }
  }

}
var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 1000,
  scale: {
    mode: Phaser.Scale.FIT
  },
  physics: {
    default: 'arcade',

  },

  scene: [StartScene, MainScene, EndScene],
  backgroundColor: 0xaaaa
};
var game = new Phaser.Game(config);
