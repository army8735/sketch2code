const Buffer = require('buffer').Buffer;

const jszip = require('jszip');

class Sketch2Code {
  constructor() {}

  async parse(data) {
    if(Buffer.isBuffer(data)) {
      return this.parseBuffer(data);
    }
    else {
      return this.parseFile(data);
    }
  }

  async parseFile(file) {
    let buffer = fs.readFileSync(file);
    return this.parseBuffer(buffer);
  }

  async parseBuffer(buffer) {
    let zip = await jszip.loadAsync(buffer);
    let list = [];
    let query = [];
    Object.keys(zip.files).forEach((key) => {
      let value = zip.files[key];
      let name = value.name;
      if(name.endsWith('.json')) {
        list.push(name.replace(/\.json$/, ''));
        query.push(zip.file(name).async('string'));
      }
      else if(name.startsWith('images/')) {
        list.push(name);
        query.push(zip.file(name).async('base64'));
      }
    });
    let res = await Promise.all(query);
    let json = {};
    list.forEach(function(key, i) {
      if(key.startsWith('images')) {
        json['images'] = json['images'] || {};
        json['images'][key.slice(7)] = res[i];
      }
      else if(key.startsWith('pages')) {
        json['pages'] = json['pages'] || {};
        json['pages'][key.slice(6)] = JSON.parse(res[i]);
      }
      else {
        json[key] = JSON.parse(res[i]);
      }
    });
    return json;
  }

  static async parse(data) {
    return new Sketch2Code().parse(data);
  }
  static async parseFile(file) {
    return new Sketch2Code().parseFile(file);
  }
  static async parseBuffer(buffer) {
    return new Sketch2Code().parseBuffer(buffer);
  }
}

module.exports = Sketch2Code;
