/// <reference path="../node_modules/phaser/typescript/phaser.d.ts"/>

import { Boot } from './states/boot';
import { Loading } from './states/loading';
import { Menu } from './states/menu';
import { Battle } from './states/battle';
// Import additional states here

export class MyGame extends Phaser.Game {
    constructor() {
        super(1280, 960, Phaser.CANVAS);

        this.state.add('Boot', Boot);
        this.state.add('Loading', Loading);
        this.state.add('Menu', Menu);
        this.state.add('Battle', Battle);
        // Add additional states here

        this.state.start('Battle');
    }
}

let game = new MyGame(); // This kicks everything off
