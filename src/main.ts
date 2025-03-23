import * as Phaser from "phaser";
import { UIScene } from './Scenes/UIScene';
import { Chapter1Scene } from './Scenes/Chapter1/Scene';
import { PermissionScene } from "./Scenes/PermissionScene";
import { MainMenuScene } from "./Scenes/MainMenu/Scene";
import { Chapter3Scene } from "./Scenes/Chapter3/Scene";
import { Chapter2Scene } from "./Scenes/Chapter2/Scene";
import { Chapter4Scene } from "./Scenes/Chapter4/Scene";


const MAX_SIZE_WIDTH_SCREEN = 1920;
const MAX_SIZE_HEIGHT_SCREEN = 1080;
const MIN_SIZE_WIDTH_SCREEN = 640;
const MIN_SIZE_HEIGHT_SCREEN = 480;
const SIZE_WIDTH_SCREEN = 1280;
const SIZE_HEIGHT_SCREEN = 832;

// console.log(window.devicePixelRatio);

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: "focus-but-where",
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.RESIZE,
    parent: "game",
    width: SIZE_WIDTH_SCREEN,
    height: SIZE_HEIGHT_SCREEN,
    min: {
      width: MIN_SIZE_WIDTH_SCREEN,
      height: MIN_SIZE_HEIGHT_SCREEN,
    },
    max: {
      width: MAX_SIZE_WIDTH_SCREEN,
      height: MAX_SIZE_HEIGHT_SCREEN,
    },
  },
  physics: {
    default: "arcade",
    arcade: { debug: true },
  },
  dom: { createContainer: true },
  backgroundColor: "#000000",
  scene: [
    UIScene,
    PermissionScene,
    MainMenuScene,
    Chapter1Scene,
    Chapter2Scene,
    Chapter3Scene,
    Chapter4Scene
  ],
};

export const game = new Phaser.Game(gameConfig);
game.input.globalTopOnly = false;
