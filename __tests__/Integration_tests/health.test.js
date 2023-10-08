const app = require('../../api/app')
 const supertest = require('supertest')
const { INET } = require('sequelize')

 describe('when heath endpoint is called',()=>{

    describe('and when database is coonected', ()=>{
        it('should check if the healthz endpoint responds with status 200', async ()=> {
            const response = await supertest(app).get('/healthz').send({});  // Sending an empty body
        
            expect(response.status).toBe(204);
            // done();
          });
    })


 })
