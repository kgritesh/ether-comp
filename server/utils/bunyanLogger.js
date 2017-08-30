import Logger from 'bunyan';

export default class BunyanLogger extends Logger {

  _applySerializers(fields, excludeFields) {
    super._applySerializers(fields, excludeFields);
    Object.keys(fields).forEach((name) => {
      if (excludeFields && excludeFields[name]) {
        return;
      }
      const value = fields[name];
      if (value.logSerializer) {
        fields[name] = value.logSerializer();
      } else if (value instanceof Error) {
        fields[name] = Logger.stdSerializers.err(value);
      }
    });
  }
}
