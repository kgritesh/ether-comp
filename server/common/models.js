import uuidv4 from 'uuid/v4';

import db from '../config/db';

const type = db.type;
const r = db.r;


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
    console.log(uniqFilter);
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
}
