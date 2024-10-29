import { Application, Container } from "pixi.js";

export type Screen = {
  enter(): Promise<void>;
  pause?(): void;
  exit?(): Promise<void>;
  get view(): Container;
};

export type ScreenController = {
  replace(screen: Screen): Promise<void>;
  popup(screen: Screen): Promise<void>;
  dismiss(): Promise<void>;
};

export function controller(application: Application): ScreenController {
  let current: Screen | undefined = undefined;
  let currentPopup: Screen | undefined = undefined;

  const replace = async (screen: Screen) => {
    if (current) {
      await current.exit?.();
      application.stage.removeChild(current.view);
    }
    current = screen;
    application.stage.addChild(current.view);
    await current.enter();
  };

  const dismiss = async () => {
    if (!currentPopup) {
      return;
    }
    application.stage.removeChild(currentPopup.view);
    await currentPopup.exit?.();
    currentPopup = undefined;
  };

  const popup = async (screen: Screen) => {
    if (currentPopup) {
      await dismiss();
    }
    currentPopup = screen;
    application.stage.addChild(currentPopup.view);
    await currentPopup.enter();
    currentPopup?.pause?.();
  };

  return {
    replace,
    popup,
    dismiss,
  };
}
