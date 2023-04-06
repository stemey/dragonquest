import Phaser from "phaser";

export const getComplimentary = (
    input: number,
    sat: number = 1,
    light: number = 1
) => {
    return getColor(input, 0.5, sat, light);
};

export const getColor = (
    input: number,
    wheelSection: number,
    sat: number = 1,
    light: number = 1
) => {
    const rgba = Phaser.Display.Color.ColorToRGBA(input);
    const hsv = Phaser.Display.Color.RGBToHSV(rgba.r, rgba.g, rgba.b);
    const targetH = (hsv.h + (wheelSection % 1)) % 1;

    const targetRgba = Phaser.Display.Color.HSVToRGB(
        targetH,
        sat,
        light
    ) as Phaser.Types.Display.ColorObject;
    return convertColorToNumber(targetRgba);
};

export const getTriad = (input: number, sat: number = 1, light: number = 1) => {
    return [getColor(input, 0.4, sat, light), getColor(input, 0.6, sat, light)];
};

export const convertColorToNumber = (
    color: Phaser.Types.Display.ColorObject
) => {
    return color.r * 0x10000 + color.g * 0x100 + color.b * 0x1;
};

export const convertColorValueToNumber = (color: Phaser.Display.Color) => {
    return color.red * 0x10000 + color.green * 0x100 + color.blue * 0x1;
};
