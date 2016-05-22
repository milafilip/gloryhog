import { Player } from './player';

export class Spotlight extends Phaser.Graphics {

  game: Phaser.Game;
  player: Player;

  constructor(game: Phaser.Game, player: Player) {
    super(game,0,0);
    this.player = player;
    game.add.existing(this);
  }

  followPlayer(player: Player) {
    this.player = player;
    this.visible = true;
  }

  update() {
    this.clear();
    this.beginFill(0xFFFFFF, 0.2);
    this.drawCircle(this.player.body.x + 20, this.player.body.y + 10, 130);
  }
}
