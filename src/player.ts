export class Player extends Phaser.Sprite {

  private _health: number = 100;
  private healthText: Phaser.Text;

  private leftDownAt: number = 0;
  private rightDownAt: number = 0;

  ms;
  canJump;
  direction;
  mouseY;
  jumpedAt;
  jumpDelay;

  constructor(game: Phaser.Game, x: number, y: number) {
    super(game, x, y, 'player', 0);
    this.anchor.setTo(0.5, 0);
    game.add.existing(this);
    game.physics.arcade.enableBody(this);

    let fontStyle = {
      font: '14px Galindo',
      fill: 'red'
    };
    this.healthText = game.add.text(0, 0, this.health.toString(), fontStyle);
    this.healthText.anchor.setTo(0.5, 0);
  }

  create() {
    this.mouseY = 0;
    this.jumpedAt = 0;
    this.jumpDelay = 1000;
    this.canJump = true;
    this.ms = 0;
  }

  update() {

          this.ms = new Date().getTime();
          this.direction = "";

    this.healthText.x = this.body.x + this.body.width/2;
    this.healthText.y = this.body.y - 10;

    if (this.game.input.activePointer.leftButton.isDown)
    {
      if (this.game.input.activePointer.rightButton.isUp) {
          this.leftDownAt = this.ms;
      }
    } else {
      this.leftDownAt = 0;
      this.canJump = true;
    }

    if (this.game.input.activePointer.rightButton.isDown)
    {
      if (this.game.input.activePointer.leftButton.isUp) {
          this.rightDownAt = this.ms;
      }
    } else {
      this.rightDownAt = 0;
      this.canJump = true;
    }

    if (this.game.input.activePointer.rightButton.isUp && this.game.input.activePointer.leftButton.isUp) {
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
      (this.game.input.activePointer.rightButton.isDown &&
        this.game.input.activePointer.leftButton.isDown) &&
        this.canJump //(player.body.touching.down)
      )
    {
      this.canJump = false;
      this.body.velocity.y = -500;
    }

    if (
        (this.game.input.activePointer.rightButton.isUp &&
          this.game.input.activePointer.leftButton.isUp) &&
        !(this.body.touching.down)
    ) {
        this.body.velocity.y = 1800;
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
