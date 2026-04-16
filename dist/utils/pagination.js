"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPagination = void 0;
const extractPagination = (req) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 'asc' : 'desc';
    const skip = (page - 1) * limit;
    return { page, limit, skip, sortBy, sortOrder };
};
exports.extractPagination = extractPagination;
