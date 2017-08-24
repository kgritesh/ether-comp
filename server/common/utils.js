import { Enum as BaseEnum } from 'enumify';

export class Enum extends BaseEnum {

  static initEnum(args) {
    super.initEnum(args);
    Object.defineProperty(this, 'names', {
      value: this.enumValues.map(en => en.name),
      configurable: false,
      writable: false,
      enumerable: true,
    });
    Object.freeze(this.names);
    return this;
  }

}
