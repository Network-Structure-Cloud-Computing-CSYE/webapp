

const userController = require('../controller/userController.js')

const authenticate = require('../middleware/authenticate');

const Assignment = require('../models/assignment');

const router = require('express').Router()




router.get('/healthz', userController.check)

//router.post('assignment', authenticate, )

router.post('/v1/assignments', authenticate, async (req, res) => {
    try {
        console.log(req.body)
        // Since authenticated, user will be on the req object
        const assignment = await Assignment.create({
            ...req.body,
            
            // console.log(req.user.id);

            userId: req.user.id  // Assign the assignment to the authenticated user
        });

        res.status(201).json(assignment);
    } catch (error) {
        console.log(error)
        res.status(400).send('Bad Request');
    }
});

router.put('/v1/assignments/:id', authenticate, async (req, res) => {
    try {
        const assignment = await Assignment.findOne({
            where: {
                assignmentId: req.params.id,
                userId: req.user.id  // Ensure that the assignment belongs to the authenticated user
            }
        });

        if (!assignment) {
            throw new Error();
        }

        await assignment.update(req.body);
        res.status(204).send();  // No Content response
    } catch (error) {
        console.log('ERROR',error);
        res.status(403).send('Forbidden');
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

        if (!assignment) {
            throw new Error();
        }

        await assignment.destroy();
        res.status(204).send();  // No Content response
    } catch (error) {
        res.status(403).send('Forbidden');
    }
});

router.get('/v1/assignments', authenticate, async (req, res) => {
    try {
        const assignments = await Assignment.findAll();
        res.status(200).json(assignments);
    } catch (error) {
        res.status(401).send('Unauthorized');
    }
});

router.get('/v1/assignments/:id', authenticate, async (req, res) => {
    try {
        const assignment = await Assignment.findByPk(req.params.id);
        if (!assignment) {
            return res.status(404).send('Not Found');
        }
        res.status(200).json(assignment);
    } catch (error) {
        res.status(401).send('Unauthorized');
    }
});


 

module.exports = router