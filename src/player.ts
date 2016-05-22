export class Player extends Phaser.Sprite {

  private jumpCount:number = 0;
  private leftDownAt: number = 0;
  private rightDownAt: number = 0;
  private jumpHeight: number = 400;
  private ms: number = 0;

  secondsRemaining: number = 15.0;
  // private timerEvent;
  // private timer;
  private countdownText: Phaser.Text;

  private leftButton;
  private rightButton;
  private jumpButton;

  private canJump;
  public direction;
  private _state;

  constructor(game: Phaser.Game, x: number, y: number, leftButton, rightButton, local = false, jumpButton = null) {
    super(game, x, y, 'player', 0);
    this.rightButton = rightButton;
    this.leftButton = leftButton;
    game.physics.arcade.enableBody(this);
    game.add.existing(this);
    this.body.setSize(30, 60, 16, 28);
    this.respawn();
    this.jumpButton = jumpButton;//game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.jumpButton.onDown.add(this.jumpCheck, this);

    let fontStyle = {
    font: '14px Arial',
    fill: 'red'
    };
    this.countdownText = this.game.add.text(0, 0, 'stuff', fontStyle);
    this.countdownText.anchor.setTo(0.5, 0);
    // this.timer = game.time.create();
    // this.timerEvent = this.timer.add(Phaser.Timer.SECOND * this.secondsRemaining, this.endTimer, this);
    // this.timer.start();
  }

  // endTimer() {
  //   this.timer.stop();
  // }

  jumpCheck() {
    if (this.jumpCount < 2) {
      this.jumpCount++;
      this.body.velocity.y = (this.jumpCount == 2) ? -600 : -450;
    }
  }

  checkOverlap(spriteA, spriteB) {
    let boundsA = spriteA.getBounds();
    let boundsB = spriteB.getBounds();
    return Phaser.Rectangle.intersects(boundsA, boundsB);
  }

  respawn(x=this.game.rnd.integerInRange(90, 1150)) {
    console.log("RESPAWN");
    this.state = "SEEKING";
    this.body.y = 200;
    this.body.x = x;
  }

  create() {
    console.log("A");
    this.canJump = true;
    this.body.fixedRotation = true;
    this.body.collideWorldBounds = true;
    this.body.maxVelocity.y = 800;
    this.anchor.set(0.5);
  }

  update() {

    this.ms = new Date().getTime();

    // if (this.timer.running) {
    //   this.countdownText.text = Math.round((this.timerEvent.delay - this.timer.ms) / 1000).toString();
    // } else {
    //   this.countdownText.text = "";
    // }
    // this.countdownText.x = this.body.x + this.body.width/2;
    // this.countdownText.y = this.body.y - 10;

    if (this.state == "HOLDING") {
      this.frame = 2;
    } else {
      this.frame = 1;
    }

    if (this.leftButton.isDown) {
      this.direction = "L";
    } else if (this.rightButton.isDown) {
      this.direction = "R";
    } else {
      this.direction = "";
    }

    if (this.direction === "R") {
      this.body.velocity.x = 500;
    } else if (this.direction === "L") {
      this.body.velocity.x = -500;
    } else if (this.direction === "") {
      this.body.velocity.x = 0;
    }

    if (this.body.blocked.down || this.body.touching.down) {
      this.jumpCount = 0;
    }
    //
    // if (this.body.blocked.down || this.body.touching.down) {
    //   if (this.jumpButton && this.jumpButton.isDown) {
    //     this.jumpCount = 1;
    //     this.body.velocity.y = -800;
    //   } else {
    //     this.jumpCount = 0;
    //   }
    // } else {
    //   if (this.jumpButton && this.jumpButton.isDown) {
    //     if (this.jumpCount == 1) {
    //       this.jumpCount = 2;
    //       this.body.velocity.y = -500;
    //     }
    //   }
    // }
  }


  public get state():String {
    return this._state;
  }

  public set state(val:String) {
    this._state = val;
    // 
    // if (val === "HOLDING") {
    //   this.timer.start();
    // } else {
    //   if (this.timer && this.timer.running) this.timer.stop();
    // }

  }

}
