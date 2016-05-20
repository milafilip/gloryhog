import { Player } from '../player';

export class Battle extends Phaser.State {
    text: Phaser.Text;

    player: Player;
    platforms;
    cursors;
    jumpButton;

    mouseY;
    rightDownAt;

    ms: Number;
    jumpedAt;
    jumpDelay;
    canJump;
    direction: String;

    preload() {
      this.game.stage.backgroundColor = '#85b5e1';
      this.game.load.baseURL = 'http://examples.phaser.io/assets/';
      this.game.load.crossOrigin = 'anonymous';
      this.game.load.image('player', 'sprites/phaser-dude.png');
      this.game.load.image('platform', 'sprites/platform.png');
    }

    create() {
      let fontStyle = {
        font: '18px Walter Turncoat',
        fill: '#7edcfc'
      };
      this.direction = "A";
      this.ms = 0;

      this.text = this.add.text(this.world.centerX, 50,
                              'BATTLE', fontStyle);
      this.text.anchor.setTo(0.5, 0.5);

      this.player = new Player(this.game, 100, 200);

      this.game.physics.arcade.enable(this.player);
      this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
      this.game.physics.arcade.gravity.y = 800;
      this.player.body.collideWorldBounds = true;
      this.player.body.gravity.y = 500;

      this.platforms = this.game.add.physicsGroup(Phaser.Physics.ARCADE);

      this.platforms.create(500, 150, 'platform');
      this.platforms.create(-200, 300, 'platform');
      this.platforms.create(400, 450, 'platform');

      this.platforms.setAll('body.immovable', true);
      this.platforms.setAll('body.allowGravity', false);
    }

    update() {
      this.game.physics.arcade.collide(this.player, this.platforms);
    }

    render() {
      this.game.debug.text("Left Button: " + (this.game.input.activePointer.leftButton.isDown).toString(), 300, 132);
      // this.game.debug.text("Right Button: " + this.player.ms.toString(), 300, 260);
    }


}
