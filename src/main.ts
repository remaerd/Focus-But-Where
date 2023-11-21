import { Detector } from "./faceLandmarkDetector";
import * as Phaser from "phaser";

import { Chapter1Scene } from "./Scenes/Chapter1Scene";
import { Chapter2Scene } from "./Scenes/Chapter2Scene";
import { Chapter3Scene } from "./Scenes/Chapter3Scene";
import { Chapter4Scene } from "./Scenes/Chapter4Scene";
import { Chapter5Scene } from "./Scenes/Chapter5Scene";
import { MainMenuScene } from "./Scenes/MainMenuScene";
import { UIScene } from "./Scenes/UIScene";
import { FaceDetectorScene } from "./FaceDetectorScene";

const MAX_SIZE_WIDTH_SCREEN = 1920
const MAX_SIZE_HEIGHT_SCREEN = 1080
const MIN_SIZE_WIDTH_SCREEN = 270
const MIN_SIZE_HEIGHT_SCREEN = 480
const SIZE_WIDTH_SCREEN = 540
const SIZE_HEIGHT_SCREEN = 960

const gameConfig: Phaser.Types.Core.GameConfig = 
{
  title: "focus-but-what",
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.RESIZE,
    parent: 'game',
    width: SIZE_WIDTH_SCREEN,
    height: SIZE_HEIGHT_SCREEN,
    min: {
      width: MIN_SIZE_WIDTH_SCREEN,
      height: MIN_SIZE_HEIGHT_SCREEN
    },
    max: {
      width: MAX_SIZE_WIDTH_SCREEN,
      height: MAX_SIZE_HEIGHT_SCREEN
    }
  },
  physics: {
    default: "arcade",
    arcade: { debug: true },
  },
  dom: { createContainer: true },
  backgroundColor: "#000000",
  scene: [UIScene, MainMenuScene, Chapter1Scene, Chapter2Scene, Chapter3Scene, Chapter4Scene, Chapter5Scene],
};

export const game = new Phaser.Game(gameConfig);

async function app() {
  try {
    await Detector.setup();
  } catch (error) {
    console.log(error);
  }
}

app();
