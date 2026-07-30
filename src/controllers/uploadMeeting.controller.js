const fs = require('fs');
const Meeting = require('../models/meeting.model');
const cloudinary = require('../config/cloudinary');
const groq = require('../config/groq');

exports.uploadMeeting = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No audio file uploaded"
            });
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "video",
            folder: "minutemind"
        });

        const transcription = await groq.audio.transcriptions.create({
            file: fs.createReadStream(req.file.path),
            model: "whisper-large-v3-turbo"
        });

        const summaryResponse = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            response_format : {
                type: "json_object"
            },
            messages: [
                {
                    role: "system",
                    content: "You summarize meeting transcripts. Always respond ONLY with valid JSON in this exact shape: { \"summary\": string, \"actionItems\": [{ \"task\": string, \"owner\": string or null }] }. Keep the summary to 3-5 sentences. Extract only concrete commitments as action items, not general discussion points"
                },
                {
                    role: "user",
                    content: transcription.text
                }
            ]
        })

        const {summary, actionItems}= JSON.parse(summaryResponse.choices[0].message.content);

        const meeting = await Meeting.create({
            owner: req.user._id,
            audioUrl: result.secure_url,
            title: req.body.title || "Untitled Meeting",
            transcript: transcription.text,
            summary,
            actionItems,
            status: "completed"
        });

        return res.status(201).json({
            success: true,
            message: "Meeting uploaded and transcribed successfully",
            data: meeting
        });

    } catch (error) {
        console.error("Upload error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    } finally {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
    }
};

exports.getMeetings = async (req, res) => {
    try {
        const meetings = await Meeting.find({ owner: req.user._id })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: meetings.length,
            data: meetings
        });
    } catch (error) {
        console.error("Get meetings error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

exports.getMeetingById = async (req, res) => {
    try {
        const meeting = await Meeting.findOne({
            _id: req.params.id,
            owner: req.user._id
        });

        if (!meeting) {
            return res.status(404).json({
                success: false,
                message: "Meeting not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: meeting
        });
    } catch (error) {
        console.error("Get meeting error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

exports.deleteMeeting = async (req, res) => {
    try {
        const meeting = await Meeting.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id
        });

        if (!meeting) {
            return res.status(404).json({
                success: false,
                message: "Meeting not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Meeting deleted successfully"
        });
    } catch (error) {
        console.error("Delete meeting error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};