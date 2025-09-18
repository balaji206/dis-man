import express from 'express';


// Generate checklist page for disaster  
const router = express.Router();

// GET /checklist/:disasterType
router.get('/:disasterType', (req, res) => {
    const disasterType = req.params.disasterType;
    // Example checklist items for different disasters
    const checklists = {
        earthquake: [
            'Secure heavy furniture',
            'Prepare emergency kit',
            'Know safe spots in each room'
        ],
        flood: [
            'Move valuables to higher ground',
            'Prepare sandbags',
            'Have evacuation plan'
        ],
        fire: [
            'Install smoke detectors',
            'Prepare fire extinguisher',
            'Plan escape routes'
        ]
    };
    const checklist = checklists[disasterType] || [];
    res.json({ disasterType, checklist });
});

export default router;  