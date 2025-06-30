const rideodel = require('../models/ride.model');
const mapService = require('./map.service');

async function getFare(pickup, destination) {
    if (!pickup || !destination) {
        throw new Error('Pick and destination are required');
    }
    const distanceData = await mapService.getDistanceTime(pickup, destination);
    // distanceData = { distance: { text: '10.0 km', value: 10000 }, duration: { text: '24 mins', value: 1464 }, status: 'OK' }
    if (!distanceData || distanceData.status !== 'OK') {
        throw new Error('Unable to get distance and time');
    }
    // Convert meters to kilometers and seconds to minutes
    const km = distanceData.distance.value / 1000;
    const minutes = distanceData.duration.value / 60;

    const baseFare = {
        auto: 30,
        car: 50,
        motorcycle: 20
    };
    const perKmRate = {
        auto: 10,
        car: 15,
        motorcycle: 8
    };
    const perMinuteRate = {
        auto: 2,
        car: 3,
        motorcycle: 1.5
    };

    const fares = {
        auto: baseFare.auto + (km * perKmRate.auto) + (minutes * perMinuteRate.auto),
        car: baseFare.car + (km * perKmRate.car) + (minutes * perMinuteRate.car),
        motorcycle: baseFare.motorcycle + (km * perKmRate.motorcycle) + (minutes * perMinuteRate.motorcycle)
    };
    return fares;
}
module.exports.createRide = async ({ 
    user, pickup, destination, vehicleType
}) => { 
    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error('user, pickup, destination, and vehicleType are required');
    }
    // Calculate fare
    const fares = await getFare(pickup, destination);
    const fare = fares[vehicleType];
    if (fare === undefined) {
        throw new Error('Invalid vehicleType');
    }
    // Create ride
    const ride = await rideodel.create({
        user,
        pickup,
        destination,
        vehicleType,
        fare,
        status: 'requested',
    });
    return ride;
}

