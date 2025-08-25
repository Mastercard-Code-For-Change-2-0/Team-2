const mongoose = require('mongoose');

// Schema for tracking daily event analytics
const eventAnalyticsSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    metrics: {
        views: { type: Number, default: 0 },
        registrations: { type: Number, default: 0 },
        cancellations: { type: Number, default: 0 },
        revenue: { type: Number, default: 0 },
        uniqueVisitors: { type: Number, default: 0 },
        pageViews: { type: Number, default: 0 },
        averageTimeSpent: { type: Number, default: 0 }, // in seconds
        bounceRate: { type: Number, default: 0 }, // percentage
        conversionRate: { type: Number, default: 0 } // percentage
    },
    demographics: {
        ageGroups: {
            '18-24': { type: Number, default: 0 },
            '25-34': { type: Number, default: 0 },
            '35-44': { type: Number, default: 0 },
            '45-54': { type: Number, default: 0 },
            '55+': { type: Number, default: 0 }
        },
        genderDistribution: {
            male: { type: Number, default: 0 },
            female: { type: Number, default: 0 },
            other: { type: Number, default: 0 }
        },
        collegeDistribution: [{
            college: String,
            count: Number
        }],
        fieldOfStudyDistribution: [{
            field: String,
            count: Number
        }]
    },
    trafficSources: {
        direct: { type: Number, default: 0 },
        social: { type: Number, default: 0 },
        email: { type: Number, default: 0 },
        search: { type: Number, default: 0 },
        referral: { type: Number, default: 0 }
    },
    deviceInfo: {
        desktop: { type: Number, default: 0 },
        mobile: { type: Number, default: 0 },
        tablet: { type: Number, default: 0 }
    }
}, {
    timestamps: true
});

// Schema for tracking user engagement with events
const eventEngagementSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    engagementType: {
        type: String,
        enum: ['view', 'registration', 'cancellation', 'attendance', 'rating', 'share', 'bookmark'],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    metadata: {
        rating: { type: Number, min: 1, max: 5 },
        timeSpent: { type: Number }, // in seconds
        source: String, // where they came from
        device: String,
        userAgent: String,
        ipAddress: String,
        location: {
            city: String,
            state: String,
            country: String
        }
    }
}, {
    timestamps: true
});

// Schema for event feedback and ratings
const eventFeedbackSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    rating: {
        overall: { type: Number, required: true, min: 1, max: 5 },
        content: { type: Number, min: 1, max: 5 },
        organization: { type: Number, min: 1, max: 5 },
        venue: { type: Number, min: 1, max: 5 },
        networking: { type: Number, min: 1, max: 5 }
    },
    feedback: {
        liked: [String],
        disliked: [String],
        suggestions: String,
        wouldRecommend: { type: Boolean, default: false },
        wouldAttendAgain: { type: Boolean, default: false }
    },
    attendanceStatus: {
        type: String,
        enum: ['attended', 'registered_not_attended', 'cancelled'],
        required: true
    }
}, {
    timestamps: true
});

// Schema for event performance summary (aggregated data)
const eventPerformanceSummarySchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
        unique: true
    },
    summary: {
        totalViews: { type: Number, default: 0 },
        totalRegistrations: { type: Number, default: 0 },
        totalAttendees: { type: Number, default: 0 },
        totalRevenue: { type: Number, default: 0 },
        averageRating: { type: Number, default: 0 },
        totalFeedbacks: { type: Number, default: 0 },
        conversionRate: { type: Number, default: 0 },
        attendanceRate: { type: Number, default: 0 },
        capacityUtilization: { type: Number, default: 0 },
        netPromoterScore: { type: Number, default: 0 }
    },
    trends: {
        viewsTrend: [{ date: Date, count: Number }],
        registrationsTrend: [{ date: Date, count: Number }],
        revenueTrend: [{ date: Date, amount: Number }]
    },
    topPerformingAspects: [{
        aspect: String,
        score: Number,
        feedback: [String]
    }],
    areasForImprovement: [{
        aspect: String,
        score: Number,
        suggestions: [String]
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes for better query performance
eventAnalyticsSchema.index({ event: 1, date: 1 }, { unique: true });
eventAnalyticsSchema.index({ date: -1 });

eventEngagementSchema.index({ event: 1, user: 1 });
eventEngagementSchema.index({ event: 1, engagementType: 1 });
eventEngagementSchema.index({ timestamp: -1 });

eventFeedbackSchema.index({ event: 1, user: 1 }, { unique: true });
eventFeedbackSchema.index({ event: 1 });
eventFeedbackSchema.index({ 'rating.overall': -1 });

eventPerformanceSummarySchema.index({ event: 1 });
eventPerformanceSummarySchema.index({ lastUpdated: -1 });

module.exports = {
    EventAnalytics: mongoose.model('EventAnalytics', eventAnalyticsSchema),
    EventEngagement: mongoose.model('EventEngagement', eventEngagementSchema),
    EventFeedback: mongoose.model('EventFeedback', eventFeedbackSchema),
    EventPerformanceSummary: mongoose.model('EventPerformanceSummary', eventPerformanceSummarySchema)
};
