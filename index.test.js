const supertest = require('supertest');
const expect = require('chai').expect;

const aws = require('aws-sdk');
const relay = require('./'); // baton-request-relay

// const Replay = require('../baton-vcr-replay-for-aws-sdk/');

describe('event-relay', () => {

  // it('record', () => {
  //   aws.config.update({
  //     region: 'us-east-1',
  //   });

  //   const kinesis = new aws.Kinesis({
  //     logger: { log: /* istanbul ignore next */ msg => console.log(msg) },
  //   });

  //   return kinesis.putRecords({
  //     StreamName: 'analytics_stream',
  //     Records: [{
  //       Data: new Buffer(JSON.stringify({})),
  //       PartitionKey: '1',
  //     }]
  //   }).promise()
  //   .then(data => console.log(data))
  //   ;
  // });

  relay(`${__dirname}/fixtures/upstream1`).forEach(test => {
    it(test.name, (done) => {

      ((event, ctx, cb) => {
        console.log(JSON.stringify(event, null, 2));

        cb();
      })(test.event, {}, done);

    });
  });
});
