'use strict';

const fs = require('fs');
const Replay = require('replay');

class EventTest {

  constructor(test) {
    Object.assign(this, test);
  }
}

const toEvent = (path, filename) => {
  const content = Replay.catalog._read(path + '/' + filename);
  // console.log(path + '/' + filename);
  // console.log(content);
  const body = JSON.parse(content.request.body ? content.request.body.split('\\\"').join('\"') : undefined);

  const t = {
    name: filename,
    filename: filename,
    event: {
      Records: body.Records.map((r, i) => ({
        eventSource: 'aws:kinesis',
        kinesis: {
          sequenceNumber: i.toString(),
          data: r.Data,
        }
      }))
    }
  };

  return new EventTest(t);
}

module.exports = (path) => {
  const filenames = fs.readdirSync(path);
  return filenames.map(filename => toEvent(path, filename));
}
