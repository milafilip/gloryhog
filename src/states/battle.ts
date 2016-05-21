import { Player } from '../player';

export class Battle extends Phaser.State {
    text: Phaser.Text;

    player: Player;
    player2: Player;

    players;

    platforms;

    preload() {
      this.game.stage.backgroundColor = '#85b5e1';
      this.game.load.baseURL = 'http://examples.phaser.io/assets/';
      this.game.load.crossOrigin = 'anonymous';
      this.game.load.image('player', 'sprites/phaser-dude.png');
      this.game.load.image('platform', 'sprites/platform.png');
    }

    // pairwise(list) {
    //   if (list.length < 2) { return []; }
    //   var first = list[0],
    //       rest  = list.slice(1),
    //       pairs = rest.map(function (x) { return [first, x]; });
    //   return pairs.concat(this.pairwise(rest));
    // }

    create() {
      let cursors = this.game.input.keyboard.createCursorKeys();

      this.players = [
        new Player(this.game,100,200,this.game.input.activePointer.leftButton, this.game.input.activePointer.rightButton),
        new Player(this.game,300,200,this.game.input.keyboard.addKey(Phaser.Keyboard.A), this.game.input.keyboard.addKey(Phaser.Keyboard.D))
      ];

      this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
      this.game.physics.arcade.gravity.y = 800;
      this.platforms = this.game.add.physicsGroup(Phaser.Physics.ARCADE);

      this.platforms.create(500, 150, 'platform');
      this.platforms.create(-200, 300, 'platform');
      this.platforms.create(400, 450, 'platform');

      this.platforms.setAll('body.immovable', true);
      this.platforms.setAll('body.allowGravity', false);
    }

    update() {
      for (var i = 0; i < this.players.length; i++) {
        this.game.physics.arcade.collide(this.players[i], this.platforms);
      }
      this.game.physics.arcade.collide(this.players[0], this.players[1]);
    }

    render() {
    }


}
