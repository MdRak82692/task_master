"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const vendor_routes_1 = __importDefault(require("./vendor.routes"));
const certification_routes_1 = __importDefault(require("./certification.routes"));
const product_routes_1 = __importDefault(require("./product.routes"));
const rentalSpace_routes_1 = __importDefault(require("./rentalSpace.routes"));
const booking_routes_1 = __importDefault(require("./booking.routes"));
const order_routes_1 = __importDefault(require("./order.routes"));
const plantTrack_routes_1 = __importDefault(require("./plantTrack.routes"));
const communityPost_routes_1 = __importDefault(require("./communityPost.routes"));
const admin_routes_1 = __importDefault(require("./admin.routes"));
const router = (0, express_1.Router)();
const moduleRoutes = [
    { path: '/auth', route: auth_routes_1.default },
    { path: '/users', route: user_routes_1.default },
    { path: '/vendors', route: vendor_routes_1.default },
    { path: '/certifications', route: certification_routes_1.default },
    { path: '/products', route: product_routes_1.default },
    { path: '/rental-spaces', route: rentalSpace_routes_1.default },
    { path: '/bookings', route: booking_routes_1.default },
    { path: '/orders', route: order_routes_1.default },
    { path: '/plant-tracks', route: plantTrack_routes_1.default },
    { path: '/community-posts', route: communityPost_routes_1.default },
    { path: '/admin', route: admin_routes_1.default },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
