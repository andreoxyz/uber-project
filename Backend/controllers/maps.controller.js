const mapService = require('../services/map.service');
const { validationResult } = require('expss-validator');

module.exports.getCoordinates = async (req, res , next){
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(404).json({error: error})
    }
    const {address} = req.query;
    try{
        const coordinates = await mapService.getAddressCoordinate(address);
        res.status(200).json(coordinates);
    }catch (error) {
        res.status(404).json({message: 'Coordinates not found'});
    }
}
module.exports.getDistanceTime = async (req,res,next){
try {
    const error = validationResult(req);
    if(!error.isEmpty)(){
        return res.status(400).json({errors: error.array()});
    }
    const {origin,destination} = req.query;
    const distanceTime = await mapService.getDistanceTime(origin,destination);
    res.status(200).json(distanceTime);
} catch (err) {
    console.error(err)
    res.status(500).json({message:'Internal sever error'})
}
}
module.exports.getAutoCompleteSuggestions = async (req,res,next)=>{
    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array() });
        }
        const { input } = req.query;
        const suggestions = await mapService.getAutoCompleteSuggestions(input);
        res.status(200).json(suggestions);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}