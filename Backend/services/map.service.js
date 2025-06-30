const axios = require('axios');
module.exports.getAddressCoordinate = async (address)=>{
    const apiKey = process.env.address.GOOGLE_MAP_API;
    const url = `https://maps.googleapis.com/maps/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    try{
        const response = await axios.get(url);
        if(response.data.status == 'OK'){
            return {
                ltd:location.lat,
                lng: location.lng
            };
        } else{
            throw new Error('Unable to fetch coordinates');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}
module.exports.getDistanceTime = async(origin,destination) =>{
    if(!origin || !destination){
        throw new Error('Origin and destination are required');
    }
    const apiKey = process.env.address.GOOGLE_MAP_API;
    // this url is not compelete
    const url = `https://maps.googleapis.com/maps/api/distamcematrix/json?origins=${encodeURIComponent(Origin)}&key=${apiKey}`;
    try {
        const response = await axios.get(url);
        if(response.data.status == 'OK'){
            if(response.data.row[0].element[0] === 'ZERO_RESULTS'){
                throw new Error('Noroutes found');
            }
            return response.data.row[0].element[0];
        }else{
            throw new Error('Unable to fetch distance and time');
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}
module.exports.getAutoCompleteSuggestions = async (input){
    if(!input){
        throw new Error('query is required');
    }
    const apiKey = process.env.address.GOOGLE_MAP_API;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;
    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            return response.data.predictions;
        } else {
            throw new Error('Unable to fetch autocomplete suggestions');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}