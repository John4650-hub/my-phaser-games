class EndScene extends Phaser.Scene{
  constructor(){
    super({key:"endScene"});
  }
  create(){
    this.add.text(200,250,"CLICK ON THE SCREEN TO RESTART THE GAME",{fontSize:'20px',color:0x00ff00,});
    this.input.on("pointerdown",()=>{
    this.scene.restart("default")
    this.scene.stop(this);
    });
  }
}

var config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 1050
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 400 },
      debug: true
    }
  },
  scene: [{
    preload: preload,
    create: create,
    update: update
  },EndScene]
};

var leftBtn;
var rightBtn;
var upBtn;
var downBtn;
var movel;
var mover;
var movep;
var moved;
var player;
var hats;
var stars;
var beetles;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
var lives = 5;
var playbtn;
var c = false;

var game = new Phaser.Game(config);

function preload()
{
  this.load.image('sky', 'assets/bg.png');
  this.load.image('leftButton', 'assets/left.png');
  this.load.image('rightButton', 'assets/right.png');
  this.load.image('upButton', 'assets/up.png');
  this.load.image('downButton', 'assets/down.png');
  this.load.image('playButton', 'assets/shadedDark16.png')
  this.load.image('ground', 'assets/platform.png');
  this.load.image('star', 'assets/star.png');
  this.load.image('beetle', 'assets/beetle.png');
  this.load.image('gameOvermsg', 'assets/overTxt.png');
  this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
  this.load.spritesheet("heart", "./assets/hearts.png", { frameWidth: 16, frameHeight: 16 });
}

function create()
{
  //  A simple background for our game
  //this.scene.add("endScene")///////{{{{{can we add a scene and render it this way}}}}}}}}
  this.add.image(400, 300, 'sky');
  platforms = this.physics.add.staticGroup();

  //  Here we create the ground.
  //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
  platforms.create(400, 568, 'ground').setScale(2).refreshBody();

  //  Now let's create some ledges
  platforms.create(600, 400, 'ground');
  platforms.create(50, 250, 'ground');
  platforms.create(750, 220, 'ground');

  // The player and its settings
  player = this.physics.add.sprite(100, 450, 'dude')

  //  Player physics properties. Give the little guy a slight bounce.
  player.setBounce(0.5);
  player.setScale(1.5)
  player.body.setSize(30,40,false)
  player.body.offset.y=9
  player.setCollideWorldBounds(true);

  //  Our player animations, turning, walking left and walking right.
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'turn',
    frames: [{ key: 'dude', frame: 4 }],
    frameRate: 20
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });

  //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
  stars = this.physics.add.group({
    key: 'star',
    repeat: 7,
    setXY: { x: 12, y: 0, stepX: 70 }
  });

  stars.children.iterate(function(child) {

    //  Give each star a slightly different bounce
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

  });

  beetles = this.physics.add.group();

  //  The score
  scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

  //  Collide the player and the stars with the platforms
  this.physics.add.collider(player, platforms);
  this.physics.add.collider(stars, platforms);
  this.physics.add.collider(beetles, platforms);

  //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
  this.physics.add.overlap(player, stars, collectStar, null, this);

  this.physics.add.collider(player, beetles, hitbeetle, null, this);

  leftBtn = this.add.image(220, 835, 'leftButton').setInteractive();
  rightBtn = this.add.image(570, 835, 'rightButton').setInteractive();
  upBtn = this.add.image(410, 660, 'upButton').setInteractive();
  downBtn = this.add.image(410, 1000, 'downButton').setInteractive();
  // scaling the buttons
  leftBtn.setScale(1.5);
  rightBtn.setScale(1.5);
  upBtn.setScale(1.5);
  downBtn.setScale(1.5);

  leftBtn.on('pointerover', function() {
    movel = true;
    leftBtn.setTint(0xff0000)
  });
  leftBtn.on('pointerout', function() {
    movel = false;
    leftBtn.setTint()
  });

  rightBtn.on('pointerover', function() {
    mover = true;
    rightBtn.setTint(0xff0000)
  });
  rightBtn.on('pointerout', function() {
    mover = false;
    rightBtn.setTint()
  });
  upBtn.on('pointerover', function() {
    movep = true;
    upBtn.setTint(0xff0000);
  });
  upBtn.on('pointerout', function() {
    movep = false;
    upBtn.setTint();
  });
  downBtn.on('pointerover', function() {
    moved = true;
    downBtn.setTint(0xff0000);

  });
  downBtn.on('pointerout', function() {
    moved = false;
    downBtn.setTint();
  });

  hats = this.add.group({
    active: true,
    maxSize: 7,
    runChildUpdate: true
  });


  for (let i = 0; i < 3; i++) {
    let x = 500 + (100 * i)
    let y = 0;
    let obj = hats.create(x, y, 'heart').setScale(4).setOrigin(0);
    let lifeBar = this.add.rectangle(x + 35, 70, 80, 20, 0x00ff00,3).setStrokeStyle(5, 0x000000,1)
    hats.add(lifeBar);
  }


  this.anims.create({
    key: 'beat',
    frames: this.anims.generateFrameNumbers("heart", { start: 0, end: 5 }),
    repeat: -1,
    frameRate: 5,
  });
  hats.playAnimation('beat');
 let powp = this.add.rectangle(50,50,100,50,0x4dd2ff,1).setOrigin(0)
powp.setStrokeStyle(5,0x00,1);

}

function update()
{
  if (hats.getLength() == 0)
  {
    this.physics.pause();
    gameOver = true
  };
  if (gameOver)
  {
    this.add.image(0,250,'gameOvermsg').setScale(0.3).setOrigin(0)
    this.input.on("pointerdown",()=>{
    this.scene.stop()
    this.scene.start("endScene")});
      
  }

  if (movel == true) {
    player.setVelocityX(-300);
    player.anims.play('left', true);
  }
  else if (mover == true) {
    player.setVelocityX(300);
    player.anims.play('right', true);
  }
  else if (movep == true) {
    player.setVelocityY(-300);
  }
  else if (moved == true) {
    player.setVelocityY(300);
  }
  else {
    player.setVelocityX(0)
    player.anims.play('turn', true);
  }
}

function collectStar(player, star)
{
  star.disableBody(true, true);
  //  Add and update the score
  score += 10;
  scoreText.setText('Score: ' + score);

  if (stars.countActive(true) === 0)
  {
    //  A new batch of stars to collect
    stars.children.iterate(function(child) {

      child.enableBody(true, child.x, 0, true, true);

    });

    var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    var beetle = beetles.create(x, 16, 'beetle');
    beetle.setBounce(1);
    beetle.setCollideWorldBounds(true);
    beetle.setVelocity(Phaser.Math.Between(-200, 200), 20);
    beetle.allowGravity = false;

  }
}

function hitbeetle(player, beetle)
{
  let fst = hats.getFirstAlive();
    hats.getChildren().forEach(function(child) {
      if (child.x == fst.x + 35) {
        if (child.width<30){child.fillColor=0xff0000}
        if (child.width == 0) {
          hats.remove(child, true, true);
          hats.remove(fst, true, true);
        }
        child.width -= 5;
      }
    });
}
