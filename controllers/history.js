const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const messages = require('../library/message-resources');
const React = require('../models/React');
const Recognize = require('../models/Recognize');
const Recommend = require('../models/Recommend');
const Repair = require('../models/Repair');
const Report = require('../models/Report');

exports.getHistory = asyncHandler(async (req, res, next) => {
    const id = req.params.id;

    const react = await React.find({ user: id });
    const recognize = await Recognize.find({ user: id });
    const recommend = await Recommend.find({ user: id });
    const repair = await Repair.find({ user: id });
    const report = await Report.find({ user: id });

    if (!id) {
        return next(
            new ErrorResponse(messages.P0001.msg.replace(`{Resource}`, `User`).replace(`{id}`, id), 404)
        );
    }

    res.status(200).json({ success: true, data: [react, recognize, recommend, repair, report] });
});
