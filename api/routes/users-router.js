

const userController = require('../controller/userController.js')

const authenticate = require('../middleware/authenticate');

const Assignment = require('../models/assignment');

const router = require('express').Router()

const client = require('../../metrics/index'); 
const logger = require('../../logger/index'); 




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

        // Since authenticated, user will be on the req object
        const assignment = await Assignment.create({
            name,
            points,
            num_of_attempts,
            deadline,

            userId: req.user.id  // Assign the assignment to the authenticated user
        });

        logger.info(`Assignment created successfully for ec2 ${hostname}`);
        client.increment('assignments.create.success.http.post');

        res.status(201).json(assignment);
    } catch (error) {
        // console.log(error)
        logger.error(`Assignment creation failed: ${error.message} for ec2 ${hostname}`);
        client.increment('assignments.create.failure.http.post');
        res.status(503).send('Service Unavailaible');
    }
});

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
            logger.error(`Delete Error: Assignment with ID ${req.params.id} not found for user ${req.user.id} for ec2 ${hostname}.`);
            client.increment('assignments.delete.notFound.http.delete');
            return res.status(404).send('Not Found');
        }

        await assignment.destroy();
        logger.info(`Assignment with ID ${req.params.id} deleted successfully for user ${req.user.id} for ec2 ${hostname}.`);
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
         
        logger.info(`Assignments retrieved for user ${req.user.id} for ec2 ${hostname}.`);
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
            logger.info(`Assignment with ID ${req.params.id} not found for ec2 ${hostname}.`);
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