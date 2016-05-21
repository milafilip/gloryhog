export class Player extends Phaser.Sprite {

  private _health: number = 100;
  private healthText: Phaser.Text;

  private jumpCount:number = 0;

  private leftDownAt: number = 0;
  private rightDownAt: number = 0;

  private jumpHeight: number = 400;

  private ms: number = 0;

  private leftButton;
  private rightButton;

  private canJump;
  public direction;

  public state;

  constructor(game: Phaser.Game, x: number, y: number, leftButton, rightButton) {
    super(game, x, y, 'player', 0);
    this.anchor.setTo(0.5, 0);
    this.rightButton = rightButton;
    this.leftButton = leftButton;

    game.add.existing(this);
    game.physics.arcade.enableBody(this);
  }

  create() {
    // this.mouseY = 0;
    // this.jumpDelay = 1000;
    this.canJump = true;
    // this.game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    // this.body.gravity.y = 500;
  }

  update() {
    this.ms = new Date().getTime();
    this.direction = "";

    // this.healthText.x = this.body.x + this.body.width/2;
    // this.healthText.y = this.body.y - 10;

    if (this.leftButton.isDown)
    {
      if (this.rightButton.isUp) {
          this.leftDownAt = this.ms;
      }
    } else {
      this.leftDownAt = 0;
      this.canJump = true;
    }

    if (this.rightButton.isDown)
    {
      if (this.leftButton.isUp) {
          this.rightDownAt = this.ms;
      }
    } else {
      this.rightDownAt = 0;
      this.canJump = true;
    }

    if (this.rightButton.isUp && this.leftButton.isUp) {
      this.direction = "";
    }

    if (this.leftDownAt > 0) {
      this.direction = "L";
    }
    if (this.rightDownAt > 0) {
      this.direction = "R";
    }

    if (this.direction === "R") {
      this.body.velocity.x = 400;
    } else if (this.direction === "L") {
      this.body.velocity.x = -400;
    } else if (this.direction === "") {
      this.body.velocity.x = 0;
    }




    if (
      ( this.rightButton.isDown &&
        this.leftButton.isDown) &&
        this.jumpCount < 1 &&
        this.canJump //(player.body.touching.down)
      )
    {
      this.canJump = false;
      this.jumpCount++;
      this.body.velocity.y = -this.jumpHeight;
    }

if (this.body.touching.down) {
  this.jumpCount = 0;
}

    if (
        (this.rightButton.isUp &&
          this.leftButton.isUp) &&
        !(this.body.touching.down)
    ) {
        this.body.velocity.y = 1500;
    }

  }

  public get health():number {
    return this._health;
  }

  public set health(val:number) {
    if(this._health > 0) {
      this._health = val;
      this.healthText.text = this._health.toString();
    }
  }

}
