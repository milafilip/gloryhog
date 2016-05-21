import { Player } from './player';

export class Spotlight extends Phaser.Graphics {

  game: Phaser.Game;
  player: Player;

  constructor(game: Phaser.Game, player: Player) {
    super(game,player.body.x,player.body.y);
    this.player = player;
    // super(game, player.body.x, player.body.y, 'player', 0);
    // this.game = game;
    // this.player = player;
    game.add.existing(this);
  }

  update() {
    // this.clear();
    // this.game.physics.arcade.moveToPointer(this, 60, this.player.body, 500);
    this.clear();
    this.beginFill(0xFFFFFF, 0.3);
    this.drawCircle(this.player.body.x + this.player.body.width/2 - 100, this.player.body.y + this.player.body.height/2, 100);
    // this.x = this.player.body.x;
    // this.y = this.player.body.y;
  }
      // this.spotlight = new Spotlightthis.game.add.graphics(0, 0);
      // this.spotlight.clear();
}
//
//
//     if (this.local && this.body.touching.down && this.leftButton.isUp && this.rightButton.isUp) {
//
//       this.spotlight.beginFill(0xFFFFFF, 0.4);
//       this.spotlight.drawCircle(this.body.x + this.body.width/2, this.body.y + this.body.height/2, 200);
//     }
//
// game.physics.arcade.moveToPointer(sprite, 60, game.input.activePointer, 500);
