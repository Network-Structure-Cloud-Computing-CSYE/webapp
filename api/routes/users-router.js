

const userController = require('../controller/userController.js')

const authenticate = require('../middleware/authenticate');

const Assignment = require('../models/assignment');

const router = require('express').Router()




router.get('/healthz', userController.check)

//router.post('assignment', authenticate, )

router.post('/v1/assignments', authenticate, async (req, res) => {
    try {
        

        const { name, points, num_of_attempts, deadline } = req.body;

        // Validate points
        if (points < 1 || points > 10) {
            return res.status(400).send('Bad Request : Points should be between 1 and 10.');
        }

        // Since authenticated, user will be on the req object
        const assignment = await Assignment.create({
            name,
            points,
            num_of_attempts,
            deadline,

            userId: req.user.id  // Assign the assignment to the authenticated user
        });

        res.status(201).json(assignment);
    } catch (error) {
        console.log(error)
        res.status(503).send('Service Unavailaible');
    }
});

router.put('/v1/assignments/:id', authenticate, async (req, res) => {
    try {
        const { name, points, num_of_attempts, deadline } = req.body;

        // Validate points
        if (points < 1 || points > 10) {
            return res.status(400).send('Points must be between 1 and 10.');
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
        res.status(204).send();
    } catch (error) {
        console.error('ERROR', error);
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
            return res.status(404).send('Not Found');
        }

        await assignment.destroy();
        res.status(204).send();  // No Content response when deletion is successful
    } catch (error) {
        // Handle unexpected errors. You can also log the error for debugging.
        res.status(503).send('Service Unavailaible');
    }
});


router.get('/v1/assignments', authenticate, async (req, res) => {
    try {
       
        if (!req.user) {
            return res.status(401).send('Unauthorized');
        }

        
        const assignments = await Assignment.findAll();

        // If no assignments were found, though technically the list is just empty, you can return a 204 status.
        if (assignments.length === 0) {
            return res.status(204).send();
        }

        return res.status(200).json(assignments);

    } catch (error) {
        console.error("Error fetching assignments:", error);
        
        res.status(503).send('Service Unavailaible');
    }
});

router.get('/v1/assignments/:id', authenticate, async (req, res) => {
    try {
        const assignment = await Assignment.findByPk(req.params.id);

        // If the assignment doesn't exist
        if (!assignment) {
            return res.status(404).send('Not Found');
        }

        // Check if the authenticated user is the creator of the assignment
        if (assignment.userId !== req.user.id) {
            return res.status(403).send('Forbidden');
        }

        // Return the assignment details
        res.status(200).json(assignment);

    } catch (error) {
        console.error(error);
        res.status(401).send('Unauthorized');
    }
});


 

module.exports = router