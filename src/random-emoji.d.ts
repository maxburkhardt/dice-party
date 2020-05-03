declare module "random-emoji" {
  interface Options {
    count?: number;
    height?: number;
    host?: string;
  }

  interface EmojiResponse {
    character: string;
    name: string;
    image: string;
    imageSrc: string;
  }

  function random(options: Options): EmojiResponse[];
}
