// const {submissionModel, userSubmissionModel} = require('../models/index')
const Submission = require('../models/submisson')
const UserSubmission = require('../models/UserSubmissions')
// const {AssignmentService} = require('./index')
// const ApiError = require('../error/api-error');
// const logger = require('../utils/logger');
const { Op } = require('sequelize');
const Assignment = require('../models/assignment')
const logger = require('../../logger/index'); 
const client = require('../../metrics/index'); 



const getassignmentbyid = async (userId, assignmentId)=> {

    try {
        // const assignment = await Assignment.findByPk(userId);
        const assignment = await Assignment.findByPk(assignmentId);

        // If the assignment doesn't exist
        if (!assignment) {
            logger.info(`Assignment with ID ${assignmentId} not found.`);
            client.increment('assignments.getById.notFound');
            // return res.status(404).send('Not Found');
            const err = {name: "ApiError", message: "not found", code: "404"}
            throw err
        }

        // // Check if the authenticated user is the creator of the assignment
        // if (assignment.userId !== userId {
        //     logger.error(`User ${userId} forbidden from accessing assignment ${req.params.id}.`);
        //     client.increment('assignments.getById.forbidden');
        //     return res.status(403).send('Forbidden');
        // }

        // Return the assignment details

        logger.info(`Assignment ${assignmentId} retrieved successfully for user ${userId}.`);
        client.increment('assignments.getById.success');
        // res.status(200).json(assignment);
        return assignment

    } catch (error) {
        if(error.name === "ApiError"){
         throw error 
        }
        console.error(error);
        logger.error(`Error retrieving assignment ${assignmentId} for user ${userId}: ${error.message}`);
        
        // res.status(401).send('Unauthorized');
      //   const err = {name: "ApiError", message: "unauthorized", code: "401"}
      const err = {name: "ApiError", message: "Service Unavaiaible", code: "503"}
      throw err

    }



}


 
class SubmissionService{
 
   static async createSubmission(userId, assignmentId, submissionUrl) {
      logger.info('POST: ENTERING createSubmission service method.');
      try {
         // Check and get assignment resource
         const assignment = await getassignmentbyid(userId, assignmentId);
 
         // Step 1: Get submissionIds for the given assignmentId
         const submissionIds = await Submission.findAll({
            attributes: ['id'],
            where: { assignment_id: assignmentId }
         });
         
         // Extract an array of submissionIds from the result
         const submissionIdsArray = submissionIds.map(submission => submission.id);
         
         // Step 2: Get UserSubmissions that match the userId and submissionIds
         const userSubmissions = await UserSubmission.findAll({
            where: {
            userId: userId,
            submissionId: {
               [Op.in]: submissionIdsArray
            }
            }
         });
         
         // Count the number of userSubmissions
         const existingSubmissionsCount = userSubmissions.length;
 
         console.log('existing submissions count : ', existingSubmissionsCount);
 
         // Check if submission limit reached
         if (existingSubmissionsCount >= assignment.num_of_attempts) {
            // throw ApiError.badRequest("Maximum submission limit reached for this assignment");
            const err = {name: "ApiError", message: "Maximum submission limit reached for this assignment", code: 400}
            throw err
         }
 
         // Check if deadline has passed
         const currentDate = new Date();
         if (assignment.deadline <= currentDate) {
            // throw ApiError.badRequest("Assignment submission deadline has passed");
            const err = {name: "ApiError", message: "Assignment submission deadline has passed", code: 400}
            throw err
         }
 
         // Create the submission
         const createdSubmission = await Submission.create({
               assignment_id: assignmentId,
               submission_url: submissionUrl
         });
 
         // Create entry in User_Submissions linking the user to the submission
         await UserSubmission.create({
            userId: userId,
            submissionId: createdSubmission.id
         });
 
         logger.info('POST: EXITING createSubmission service method with no errors.');
         return createdSubmission;
      } catch (error) {
         logger.error(`POST: EXITING createSubmission service method with error -`,error);
 
         console.error('Error creating submission:', error);
         if(error.name === "ApiError")
            throw error
         else {
            const err = {name: "ApiError", message: "Service Unavailaible", code: "503"}
            throw err

         }
            // throw ApiError.serviceUnavailable("service unavailable")
      }
   }
}
 
module.exports = {
   SubmissionService, 
   getassignmentbyid
} 