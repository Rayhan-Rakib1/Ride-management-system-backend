"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ride = void 0;
const mongoose_1 = require("mongoose");
const ride_interface_1 = require("./ride.interface");
const rideSchema = new mongoose_1.Schema({
    riderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Rider",
        required: [true, "Rider ID is required"],
    },
    driverId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Driver",
    },
    payment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Payment",
    },
    pickup: {
        lat: {
            type: Number,
            required: [true, "Pickup latitude is required"],
        },
        lng: {
            type: Number,
            required: [true, "Pickup longitude is required"],
        },
        address: {
            type: String,
            required: [true, "Pickup address is required"],
        },
    },
    destination: {
        lat: {
            type: Number,
            required: [true, "Destination latitude is required"],
        },
        lng: {
            type: Number,
            required: [true, "Destination longitude is required"],
        },
        address: {
            type: String,
            required: [true, "Destination address is required"],
        },
    },
    status: {
        type: String,
        enum: {
            values: Object.values(ride_interface_1.RideStatus),
            message: "{VALUE} is not a valid ride status",
        },
        default: ride_interface_1.RideStatus.Requested,
    },
    fare: {
        type: Number,
        min: [0, "Fare cannot be negative"],
    },
    distance: {
        type: Number,
        min: [0, "Distance cannot be negative"],
    },
    duration: {
        type: Number,
        required: [true, "Duration is required"],
        min: [0, "Duration cannot be negative"],
    },
    rating: {
        riderRating: {
            type: Number,
            min: [1, "Rider rating must be between 1 and 5"],
            max: [5, "Rider rating must be between 1 and 5"],
        },
        driverRating: {
            type: Number,
            min: [1, "Driver rating must be between 1 and 5"],
            max: [5, "Driver rating must be between 1 and 5"],
        },
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Index for geospatial queries on pickup and destination
rideSchema.index({ "pickup.lat": 1, "pickup.lng": 1 });
rideSchema.index({ "destination.lat": 1, "destination.lng": 1 });
exports.Ride = (0, mongoose_1.model)("Ride", rideSchema);
