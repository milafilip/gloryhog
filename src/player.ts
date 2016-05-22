export class Player extends Phaser.Sprite {

  private jumpCount:number = 0;
  private leftDownAt: number = 0;
  private rightDownAt: number = 0;
  private jumpHeight: number = 400;
  private ms: number = 0;

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
    // this.body.setSize(50, 60, 10, 48);
    this.body.setSize(30, 60, 16, 28);
    this.jumpButton = jumpButton;//game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.jumpButton.onDown.add(this.jumpCheck, this);
  }

  jumpCheck() {
    if (this.jumpCount < 2) {
      this.jumpCount++;
      this.body.velocity.y = (this.jumpCount == 2) ? -650 : -550;
    }
  }

  checkOverlap(spriteA, spriteB) {
    let boundsA = spriteA.getBounds();
    let boundsB = spriteB.getBounds();
    return Phaser.Rectangle.intersects(boundsA, boundsB);
  }

  respawn(x=this.game.rnd.integerInRange(90, 1150)) {
    this.state = "SEEKING";
    this.body.y = 200;
    this.body.x = x;
  }

  create() {
    this.canJump = true;
    this.body.fixedRotation = true;
    this.body.collideWorldBounds = true;
    this.body.maxVelocity.y = 800;
    this.anchor.set(0.5);
  }

  update() {
    this.ms = new Date().getTime();

    if (this.state == "HOLDING") {
      this.frame = 2;
    } else {
      this.frame = 1;
    }

    if (this.leftButton.isDown) {
      this.direction = "L";
      // this.frame = (this.state == "HOLDING") ? 2 : 4;
    } else if (this.rightButton.isDown) {
      this.direction = "R";
      // this.frame = (this.state == "HOLDING") ? 1 : 3;
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
  }


  public get state():String {
    return this._state;
  }

  public set state(val:String) {
    this._state = val;
  }

}
