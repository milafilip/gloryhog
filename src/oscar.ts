export class Oscar extends Phaser.Sprite {

  constructor(game: Phaser.Game, x: number, y: number) {
    super(game, x, y, 'oscar', 0);
    game.add.existing(this);
    game.physics.arcade.enableBody(this);
  }

  create() {
  }

}
