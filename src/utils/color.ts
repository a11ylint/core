export interface ColorAttribute {
  color: string;
  backgroundColor: string;
}

export interface RGB {
  red: number;
  green: number;
  blue: number;
}

/**
 * Color class to handle color contrast and luminance calculations.
 *
 *  for mathematic calculations: https://accessibilite.numerique.gouv.fr/methode/glossaire/#contraste
 */
export class Color {
  private static RED = 0.2126;

  private static GREEN = 0.7152;

  private static BLUE = 0.0722;

  private static GAMMA = 2.4;

  static contrast(rgb1: RGB, rgb2: RGB) {
    const lum1 = Color.luminance(rgb1.red, rgb1.green, rgb1.blue);
    const lum2 = Color.luminance(rgb2.red, rgb2.green, rgb2.blue);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    return (brightest + 0.05) / (darkest + 0.05);
  }

  static getRGBFromCssProperties(colorCss: string) {
    const formatedColor = colorCss.replace('rgb(', '').replace(')', '');
    const colors = formatedColor.split(',');

    const red = colors[0];
    const green = colors[1];
    const blue = colors[2];

    // Return the RGB values in an object
    return {
      red: Number(red),
      green: Number(green),
      blue: Number(blue),
    };
  }

  private static luminance(r: number, g: number, b: number) {
    const a = [r, g, b].map(v => {
      const alpha = v / 255;
      return alpha <= 0.03928 ? alpha / 12.92 : ((alpha + 0.055) / 1.055) ** Color.GAMMA;
    });

    return a[0] * Color.RED + a[1] * Color.GREEN + a[2] * Color.BLUE;
  }
}
