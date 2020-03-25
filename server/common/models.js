import uuidv4 from 'uuid/v4';
import ExtendableError from 'es6-error';


import db from '../config/db';

const type = db.type;
const r = db.r;
const Errors = db.Errors;

export class MultiRecordFound extends ExtendableError {}

export class NoRecordFound extends ExtendableError {}

export class BaseModel {
  static schema = {
    id: type.string().uuid('4').required().default(() => uuidv4()),
    createdAt: type.date().default(r.now()),
    updatedAt: type.date()
  }

  preSave() {
    this.updatedAt = new Date();
  }

  static create = function create(props) {
    const obj = new this(props);
    return obj.save();
  }

  static createOrUpdate = async function createorUpdate(identKey, props) {
    const uniqFilter = { [identKey]: props[identKey] };
    const exists = await this.filter(uniqFilter)
      .count().gt(0).branch(true, false)
      .execute();

    let obj;

    if (exists) {
      obj = await this.filter(uniqFilter).run().then(
        objList => objList[0].merge(props).save());
    }
    obj = await this.create(props);
    return {
      obj,
      created: !exists
    };
  }

  static async getOrNull(id) {
    return this.get(id).catch(Errors.DocumentNotFound, () => null);
  }

  static async filterOne(filter) {
    const objs = await this.filter(filter).run();
    if (objs.length === 1) {
      return objs[0];
    } else if (objs.length > 1) {
      throw new MultiRecordFound('More than 1 matching record found');
    } else {
      throw new NoRecordFound('No matching record found');
    }
  }

  update(values) {
    Object.keys(values).forEach(key => {
      this[key] = values[key];
    });
    this.save();
  }

}
