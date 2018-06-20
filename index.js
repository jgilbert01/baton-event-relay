'use strict';

const fs = require('fs');
const Replay = require('replay');

class EventTest {

  constructor(test) {
    Object.assign(this, test);
  }
}

const toEvent = (path, filename) => {
  const content = Replay.catalog._read(path);
  // console.log(path);
  // console.log(content);
  const body = JSON.parse(content.request.body ? content.request.body.split('\\\"').join('\"') : undefined);
  // console.log(body);

  const t = {
    name: filename,
    filename: filename,
    event: {
      Records: body.Records ? body.Records.map((r, i) => ({
        eventSource: 'aws:kinesis',
        kinesis: {
          sequenceNumber: i.toString(),
          data: r.Data,
        }
      })) : [{
        eventSource: 'aws:kinesis',
        kinesis: {
          sequenceNumber: '1',
          data: body.Data,
        }
      }]
    }
  };

  return new EventTest(t);
}

module.exports = (path) => {
  const isDirectory = fs.lstatSync(path).isDirectory();
  if (isDirectory) {
    const filenames = fs.readdirSync(path);
    return filenames.map(filename => toEvent(path + '/' + filename, filename));
  } else {
    return toEvent(path);
  }
}
