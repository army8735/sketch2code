const Buffer = require('buffer').Buffer;

const jszip = require('jszip');

class YellowDiamond {
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
        list.push(name.replace(/\.json$/, '').replace(/\/.*/, ''));
        query.push(zip.file(name).async('string'));
      }
      else if(name.startsWith('images/')) {
        list.push('images');
        query.push(zip.file(name).async('base64'));
      }
    });
    let res = await Promise.all(query);
    let json = {};
    list.forEach(function(key, i) {
      json[key] = res[i];
    });
    return json;
  }

  static async parse(data) {
    return new YellowDiamond().parse(data);
  }
  static async parseFile(file) {
    return new YellowDiamond().parseFile(file);
  }
  static async parseBuffer(buffer) {
    return new YellowDiamond().parseBuffer(buffer);
  }
}

module.exports = YellowDiamond;
