const MeetingHistory = require('../../model/schema/meeting')
const mongoose = require('mongoose');

const add = async (req, res) => {
    try {
        const meeting = new MeetingHistory(req.body);
        await meeting.save();
        res.status(201).json(meeting);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    return date.toLocaleString('en-US', options);
};

const index = async (req, res) => {
    try {
        const meetings = await MeetingHistory.find().populate('createBy', 'firstName lastName');
        const formattedMeetings = meetings.map(meeting => {
            return {
                ...meeting.toObject(),
                createdByName: `${meeting.createBy.firstName} ${meeting.createBy.lastName}`,
                dateTime: formatDateTime(meeting.dateTime)
            };
        });
        res.status(200).json(formattedMeetings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const view = async (req, res) => {
    try {
        const meeting = await MeetingHistory.findById(req.params.id).populate('createBy', 'firstName lastName');
        if (!meeting) return res.status(404).json({ error: 'Meeting not found' });

        const formattedMeeting = {
            ...meeting.toObject(),
            createdByName: `${meeting.createBy.firstName} ${meeting.createBy.lastName}`,
            // dateTime: formatDateTime(meeting.dateTime)
        };

        res.status(200).json(formattedMeeting);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteData = async (req, res) => {
    try {
        const meeting = await MeetingHistory.findByIdAndDelete(req.params.id);
        if (!meeting) return res.status(404).json({ error: 'Meeting not found' });
        res.status(200).json({ message: 'Meeting deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteMany = async (req, res) => {
    try {
        
        const ids = req.body?.ids;
        if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({ error: 'Invalid request: ids must be an array' });
        }

        const result = await MeetingHistory.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ message: `${result.deletedCount} meetings deleted successfully` });
    } catch (error) {
        console.error('Error deleting meetings:', error); // Log the error for debugging
        res.status(500).json({ error: error.message });
    }
}

module.exports = { add, index, view, deleteData, deleteMany }