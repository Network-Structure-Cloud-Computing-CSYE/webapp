

const userController = require('../controller/userController.js')

const authenticate = require('../middleware/authenticate');

const Assignment = require('../models/assignment');
const AWS = require('aws-sdk');

const router = require('express').Router()

const client = require('../../metrics/index'); 
const logger = require('../../logger/index'); 
const {SubmissionService, getassignmentbyid}  = require('../service/SubmissionService')
// Configure AWS credentials (assuming the EC2 instance has necessary permissions)
AWS.config.update({
    region: process.env['AWS_REGION'],
 });
 // Create SNS service object
 const sns = new AWS.SNS();
  
 // ARN of your SNS topic
 const snsTopicArn = process.env['SNS_TOPIC_ARN'];



router.get('/healthz', userController.check)

//router.post('assignment', authenticate, )

router.post('/v1/assignments', authenticate, async (req, res) => {
    try {
        

        const { name, points, num_of_attempts, deadline } = req.body;

        // Validate points
        if (points < 1 || points > 10) {
            
            res.status(400).send('Bad Request : Points should be between 1 and 10.');
            logger.error(`Validation Error: Points value ${points} is out of range. Must be between 1 and 10.${points}`);
            client.increment('assignments.create.validationError.http.post');
            return;

        }

        if (!Number.isInteger(num_of_attempts)) {
            res.status(400).send('Bad Request: Number of attempts should be an integer.');
            logger.error('Validation Error: Number of attempts should be an integer.');
            client.increment('assignments.create.validationError.http.post');
            return;
        }

        // Since authenticated, user will be on the req object
        const assignment = await Assignment.create({
            name,
            points,
            num_of_attempts,
            deadline,

            userId: req.user.id  // Assign the assignment to the authenticated user
        });

        logger.info(`Assignment created successfully for ec2 `);
        client.increment('assignments.create.success.http.post');

        res.status(201).json(assignment);
    } catch (error) {
        // console.log(error)
        logger.error(`Assignment creation failed: ${error.message}`);
        client.increment('assignments.create.failure.http.post');
        res.status(503).send('Service Unavailaible');
    }
});

router.post('/v1/assignments/:assignmentId/submission', authenticate, async (req, res) => {

    client.increment('endpoints.request.http.post.createSubmission');
    logger.info('POST: ENTERING createSubmission controller method.');
     const userId = req.user.id; // Assuming we have user information from authentication
      const assignmentId = req.params.assignmentId; // get assignmentId from url
      const submissionUrl = req.body.submission_url; // assuming we are doing ajv validation on submission schema
      console.log('userId: ', userId);
      console.log('assignmentId: ', assignmentId);
      console.log('submissionUrl: ', submissionUrl);
      let assignment;
      try{
         assignment = await getassignmentbyid(userId, assignmentId)
      }catch(err){
        //  next(err)
         res.status(err.code).send(err.message)
         return;
      }
    try {
        let createdSubmission;
        let SUBMISSION_ERROR = undefined;
        try{   
            createdSubmission = await  SubmissionService.createSubmission(userId, assignmentId, submissionUrl);
        }catch(err){
         console.log('in created submission err : ', err)
            SUBMISSION_ERROR = err
        }
 
        console.log('createdSubmission :', createdSubmission)
 
        console.log('req.user.email : ', req.user.email)
        console.log('submission_url: ', submissionUrl)
        console.log('userId = ', userId);
        console.log('assignmentId = ', assignmentId);
        console.log('submissionId = ', (!SUBMISSION_ERROR ? createdSubmission.id : 'NA'));
        // Push to sns topic
        const params = {
         Message: JSON.stringify({email: req.user.email,
                                  submission_url: submissionUrl,
                                 userId: userId,
                                 assignmentId: assignmentId,
                                 submissionId: SUBMISSION_ERROR ? 'NA' : createdSubmission.id,
                                 SUBMISSION_ERROR: SUBMISSION_ERROR
                              }),
         TopicArn: snsTopicArn,
       };
     
         sns.publish(params, (err, data) => {
            if (err) {
               logger.error('POST: Error publishing to SNS topic.');
               console.error("Error publishing message to SNS:", err);
            } else {
               console.log("Submission URL published to SNS:", data.MessageId);
               logger.info('POST: Successfully published message to SNS')
            }
         });
 
        if(SUBMISSION_ERROR)
            throw SUBMISSION_ERROR
         
        logger.info('POST: EXITING createSubmission controller method with no errors')
        client.increment('endpoints.response.http.post.success.createSubmission');
    //   const userId = req.user.id; // Assuming we have user information from authentication
    //   const assignmentId = req.params.assignmentId; // get assignmentId from url
    //   const submissionUrl = req.body.submission_url; // assuming we are doing ajv validation on submission schema
    //   console.log('userId: ', userId);
    //   console.log('assignmentId: ', assignmentId);
    //   console.log('submissionUrl: ', submissionUrl);

    //   const createdSubmission = await SubmissionService.createSubmission(userId, assignmentId, submissionUrl);
     
    //   client.increment('endpoints.response.http.post.success.createAssignment');

    //   console.log('req.user.email : ', req.user.email)
    //   console.log('submission_url: ', submissionUrl)


      // Push to sns topic
    //   const params = {
    //    Message: JSON.stringify({email: req.user.email,
    //                             submission_url: submissionUrl}),
    //    TopicArn: snsTopicArn,
    //  };
   
    //    sns.publish(params, (err, data) => {
    //       if (err) {
    //          logger.error('POST: Error publishing to SNS topic.');
    //          console.error("Error publishing message to SNS:", err);
    //       } else {
    //          console.log("Submission URL published to SNS:", data.MessageId);
    //          logger.info('POST: Successfully published message to SNS')
    //          logger.info('POST: EXITING createSubmission controller method with no errors')
    //       }
    //    });

    //   setSuccessResponse(createdSubmission, StatusCodes.CREATED, res)
   
    res.status(201).send(createdSubmission)
    return
 
    } catch (error) {
      client.increment('endpoints.response.http.post.failure.createSubmission');
      logger.error(`POST: EXITING createSubmission controller method with error - `,error);
      if (error.name === "ApiError") {
        res.status(error.code).send(error.message)
        return;
      } 
      res.status(503).send('Service Unavailable');
    //   next(error); // Pass the error to the error handler middleware
    }
 })


router.put('/v1/assignments/:id', authenticate, async (req, res) => {
    try {
        const { name, points, num_of_attempts, deadline } = req.body;

        // Validate points
        if (points < 1 || points > 10) {

            res.status(400).send('Points must be between 1 and 10.');
            logger.error(`Validation Error: Points value ${points} is out of range. Must be between 1 and 10.`);
            client.increment('assignments.update.validationError.http.put');
            return;
        }

        // Validate num_of_attempts as an integer
        if (!Number.isInteger(num_of_attempts)) {
            res.status(400).send('Bad Request: Number of attempts should be an integer.');
            logger.error('Validation Error: Number of attempts should be an integer.');
            client.increment('assignments.create.validationError.http.post');
            return;
        }


        // Check if assignment exists and belongs to the authenticated user
        const assignment = await Assignment.findOne({
            where: {
                assignmentId: req.params.id,
                userId: req.user.id
            }
        });

        // If assignment doesn't exist or doesn't belong to the user, send Forbidden
        if (!assignment) {
            logger.error(`Authorization Error: User ${req.user.id} attempted to update assignment ${req.params.id} without permission.`);
            client.increment('assignments.update.authorizationError');
            return res.status(403).send('Forbidden');
        }

        // Update the assignment
        await assignment.update({
            name,
            points,
            num_of_attempts,
            deadline
        });

        // Respond with No Content
        logger.info(`Assignment ${req.params.id} updated successfully by user ${req.user.id}.`);
        // client.increment('assignments.update.success');
        client.increment('assignments.update.success.http.put');
        res.status(204).send();
    } catch (error) {
        console.error('ERROR', error);
        logger.error(`Assignment updatiom failed: ${error.message}`);
        client.increment('assignments.update.failure.http.put');
        res.status(400).send('Bad Request'); // General error handling for bad input data or other issues
    }
});


router.delete('/v1/assignments/:id', authenticate, async (req, res) => {
    try {
        const assignment = await Assignment.findOne({
            where: {
                assignmentId: req.params.id,
                userId: req.user.id
            }
        });

        // If the assignment doesn't exist or doesn't belong to the authenticated user
        if (!assignment) {
            logger.error(`Delete Error: Assignment with ID ${req.params.id} not found for user ${req.user.id}.`);
            client.increment('assignments.delete.notFound.http.delete');
            return res.status(404).send('Not Found');
        }

        await assignment.destroy();
        logger.info(`Assignment with ID ${req.params.id} deleted successfully for user ${req.user.id}.`);
        client.increment('assignments.delete.success.http.delete');
        res.status(204).send();  // No Content response when deletion is successful
    } catch (error) {
        logger.error(`Delete Error: Failed to delete assignment with ID ${req.params.id} for user ${req.user.id} - ${error.message}`);
        client.increment('assignments.delete.failure.http.delete');
        // Handle unexpected errors. You can also log the error for debugging.
        res.status(503).send('Service Unavailable');
    }
});


router.get('/v1/assignments', authenticate, async (req, res) => {
    try {
       
        if (!req.user) {
            logger.error(`Unauthorized Access Attempt: No user in request.`);
            client.increment('assignments.get.unauthorized');
            return res.status(401).send('Unauthorized');
        }

        
        const assignments = await Assignment.findAll();

        // If no assignments were found, though technically the list is just empty, you can return a 204 status.
        if (assignments.length === 0) {
            logger.info(`No assignments found for user ${req.user.id}.`);
            client.increment('assignments.get.noContent');
            return res.status(204).send();
        }
         
        logger.info(`Assignments retrieved for user ${req.user.id}.`);
        client.increment('assignments.get.success');
        return res.status(200).json(assignments);

    } catch (error) {
        console.error("Error fetching assignments:", error);
        logger.error(`Error fetching assignments for user ${req.user.id}: ${error.message}`);
        client.increment('assignments.get.serviceUnavailable'); 
        res.status(503).send('Service Unavailaible');
    }
});

router.get('/v1/assignments/:id', authenticate, async (req, res) => {
    try {
        const assignment = await Assignment.findByPk(req.params.id);

        // If the assignment doesn't exist
        if (!assignment) {
            logger.info(`Assignment with ID ${req.params.id} not found.`);
            client.increment('assignments.getById.notFound');
            return res.status(404).send('Not Found');
        }

        // Check if the authenticated user is the creator of the assignment
        if (assignment.userId !== req.user.id) {
            logger.error(`User ${req.user.id} forbidden from accessing assignment ${req.params.id}.`);
            client.increment('assignments.getById.forbidden');
            return res.status(403).send('Forbidden');
        }

        // Return the assignment details

        logger.info(`Assignment ${req.params.id} retrieved successfully for user ${req.user.id}.`);
        client.increment('assignments.getById.success');
        res.status(200).json(assignment);

    } catch (error) {
        console.error(error);
        logger.error(`Error retrieving assignment ${req.params.id} for user ${req.user.id}: ${error.message}`);
        client.increment('assignments.getById.unauthorized');
        res.status(401).send('Unauthorized');
    }



});



 

module.exports = router