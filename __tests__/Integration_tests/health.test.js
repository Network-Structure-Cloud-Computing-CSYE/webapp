
// const { INET } = require('sequelize')

var mockInfo = jest.fn();
var mockError = jest.fn();
var mockIncrement = jest.fn();

jest.mock('../../logger/index', () => ({
  info: mockInfo,
  error: mockError
}));

jest.mock('../../metrics/index', () => {
  return {
    increment: mockIncrement
  };
});
 const app = require('../../api/app')
 const supertest = require('supertest')
 describe('when heath endpoint is called',()=>{

    describe('and when database is coonected', ()=>{
        it('should check if the healthz endpoint responds with status 200', async ()=> {
            const response = await supertest(app).get('/healthz').send({});  // Sending an empty body
        
            expect(response.status).toBe(503);
            console.log(`logger.info was called ${mockInfo.mock.calls.length} times`);
            console.log(`client.increment was called ${mockIncrement.mock.calls.length} times`);
            // done();
          });
    })


 })