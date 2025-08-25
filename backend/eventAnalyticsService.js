const Event = require('../models/event');
const { EventAnalytics, EventEngagement, EventFeedback, EventPerformanceSummary, ConversionFunnel } = require('../models/eventAnalytics');
const Application = require('../models/application');
const mongoose = require('mongoose');

// Calculate comprehensive event summary
const calculateEventSummary = async (eventId, analyticsData, engagementData, feedbackData) => {
    try {
        // Calculate totals from analytics data
        const totals = analyticsData.reduce((acc, day) => {
            acc.views += day.metrics.views;
            acc.registrations += day.metrics.registrations;
            acc.revenue += day.metrics.revenue;
            acc.uniqueVisitors += day.metrics.uniqueVisitors;
            acc.pageViews += day.metrics.pageViews;
            return acc;
        }, { views: 0, registrations: 0, revenue: 0, uniqueVisitors: 0, pageViews: 0 });

        // Calculate engagement metrics
        const engagementCounts = engagementData.reduce((acc, engagement) => {
            acc[engagement.engagementType] = (acc[engagement.engagementType] || 0) + 1;
            return acc;
        }, {});

        // Calculate feedback metrics
        const feedbackMetrics = calculateFeedbackMetrics(feedbackData);

        // Get attendance data from applications
        const attendanceData = await Application.aggregate([
            { $match: { event: new mongoose.Types.ObjectId(eventId) } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const attendanceCounts = attendanceData.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {});

        // Calculate rates
        const conversionRate = totals.views > 0 ? (totals.registrations / totals.views * 100).toFixed(2) : 0;
        const attendanceRate = attendanceCounts.registered > 0 ? 
            (attendanceCounts.attended / attendanceCounts.registered * 100).toFixed(2) : 0;

        return {
            totals,
            engagementCounts,
            attendanceCounts,
            feedbackMetrics,
            rates: {
                conversionRate: parseFloat(conversionRate),
                attendanceRate: parseFloat(attendanceRate)
            }
        };
    } catch (error) {
        console.error('Error calculating event summary:', error);
        throw error;
    }
};

// Calculate feedback metrics
const calculateFeedbackMetrics = (feedbackData) => {
    if (feedbackData.length === 0) {
        return {
            averageRating: 0,
            totalFeedbacks: 0,
            ratingDistribution: {},
            sentimentAnalysis: { positive: 0, neutral: 0, negative: 0 },
            netPromoterScore: 0
        };
    }

    // Calculate average ratings
    const ratingTotals = feedbackData.reduce((acc, feedback) => {
        acc.overall += feedback.rating.overall;
        acc.content += feedback.rating.content || 0;
        acc.organization += feedback.rating.organization || 0;
        acc.venue += feedback.rating.venue || 0;
        acc.networking += feedback.rating.networking || 0;
        return acc;
    }, { overall: 0, content: 0, organization: 0, venue: 0, networking: 0 });

    const count = feedbackData.length;
    const averageRating = {
        overall: (ratingTotals.overall / count).toFixed(2),
        content: (ratingTotals.content / count).toFixed(2),
        organization: (ratingTotals.organization / count).toFixed(2),
        venue: (ratingTotals.venue / count).toFixed(2),
        networking: (ratingTotals.networking / count).toFixed(2)
    };

    // Calculate rating distribution
    const ratingDistribution = feedbackData.reduce((acc, feedback) => {
        const rating = Math.floor(feedback.rating.overall);
        acc[rating] = (acc[rating] || 0) + 1;
        return acc;
    }, {});

    // Calculate Net Promoter Score (9-10 = Promoters, 7-8 = Passives, 0-6 = Detractors)
    const promoters = feedbackData.filter(f => f.rating.overall >= 4.5).length;
    const detractors = feedbackData.filter(f => f.rating.overall <= 2.5).length;
    const netPromoterScore = ((promoters - detractors) / count * 100).toFixed(2);

    // Simple sentiment analysis based on ratings
    const positive = feedbackData.filter(f => f.rating.overall >= 4).length;
    const negative = feedbackData.filter(f => f.rating.overall <= 2).length;
    const neutral = count - positive - negative;

    return {
        averageRating,
        totalFeedbacks: count,
        ratingDistribution,
        sentimentAnalysis: { positive, neutral, negative },
        netPromoterScore: parseFloat(netPromoterScore)
    };
};

// Generate trends based on granularity
const generateTrends = (analyticsData, granularity = 'daily') => {
    if (analyticsData.length === 0) return [];

    switch (granularity) {
        case 'hourly':
            return generateHourlyTrends(analyticsData);
        case 'daily':
            return generateDailyTrends(analyticsData);
        case 'weekly':
            return generateWeeklyTrends(analyticsData);
        case 'monthly':
            return generateMonthlyTrends(analyticsData);
        default:
            return generateDailyTrends(analyticsData);
    }
};

// Generate daily trends
const generateDailyTrends = (analyticsData) => {
    return analyticsData.map(day => ({
        date: day.date,
        views: day.metrics.views,
        registrations: day.metrics.registrations,
        revenue: day.metrics.revenue,
        conversionRate: day.metrics.conversionRate,
        uniqueVisitors: day.metrics.uniqueVisitors
    }));
};

// Generate weekly trends
const generateWeeklyTrends = (analyticsData) => {
    const weeklyData = {};
    
    analyticsData.forEach(day => {
        const weekStart = getWeekStart(day.date);
        const weekKey = weekStart.toISOString().split('T')[0];
        
        if (!weeklyData[weekKey]) {
            weeklyData[weekKey] = {
                date: weekStart,
                views: 0,
                registrations: 0,
                revenue: 0,
                uniqueVisitors: 0,
                days: 0
            };
        }
        
        weeklyData[weekKey].views += day.metrics.views;
        weeklyData[weekKey].registrations += day.metrics.registrations;
        weeklyData[weekKey].revenue += day.metrics.revenue;
        weeklyData[weekKey].uniqueVisitors += day.metrics.uniqueVisitors;
        weeklyData[weekKey].days += 1;
    });
    
    return Object.values(weeklyData).map(week => ({
        ...week,
        conversionRate: week.views > 0 ? (week.registrations / week.views * 100).toFixed(2) : 0
    }));
};

// Generate monthly trends
const generateMonthlyTrends = (analyticsData) => {
    const monthlyData = {};
    
    analyticsData.forEach(day => {
        const monthKey = `${day.date.getFullYear()}-${String(day.date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = {
                date: new Date(day.date.getFullYear(), day.date.getMonth(), 1),
                views: 0,
                registrations: 0,
                revenue: 0,
                uniqueVisitors: 0,
                days: 0
            };
        }
        
        monthlyData[monthKey].views += day.metrics.views;
        monthlyData[monthKey].registrations += day.metrics.registrations;
        monthlyData[monthKey].revenue += day.metrics.revenue;
        monthlyData[monthKey].uniqueVisitors += day.metrics.uniqueVisitors;
        monthlyData[monthKey].days += 1;
    });
    
    return Object.values(monthlyData).map(month => ({
        ...month,
        conversionRate: month.views > 0 ? (month.registrations / month.views * 100).toFixed(2) : 0
    }));
};

// Helper function to get week start date
const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
};

// Update daily analytics
const updateDailyAnalytics = async (eventId, engagementType, metadata = {}) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let analytics = await EventAnalytics.findOne({
            event: eventId,
            date: today
        });

        if (!analytics) {
            analytics = new EventAnalytics({
                event: eventId,
                date: today,
                metrics: {}
            });
        }

        // Update metrics based on engagement type
        switch (engagementType) {
            case 'view':
                analytics.metrics.views += 1;
                analytics.metrics.pageViews += 1;
                if (metadata.isUniqueVisitor) {
                    analytics.metrics.uniqueVisitors += 1;
                }
                break;
            case 'registration':
                analytics.metrics.registrations += 1;
                if (metadata.revenue) {
                    analytics.metrics.revenue += metadata.revenue;
                }
                break;
            case 'cancellation':
                analytics.metrics.cancellations += 1;
                if (metadata.refund) {
                    analytics.metrics.revenue -= metadata.refund;
                }
                break;
        }

        // Update conversion rate
        if (analytics.metrics.views > 0) {
            analytics.metrics.conversionRate = (analytics.metrics.registrations / analytics.metrics.views * 100);
        }

        await analytics.save();
        return analytics;
    } catch (error) {
        console.error('Error updating daily analytics:', error);
        throw error;
    }
};

// Update event rating
const updateEventRating = async (eventId) => {
    try {
        const feedbacks = await EventFeedback.find({ event: eventId });
        
        if (feedbacks.length === 0) return;

        const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating.overall, 0);
        const averageRating = totalRating / feedbacks.length;

        await Event.findByIdAndUpdate(eventId, {
            'metrics.averageRating': averageRating,
            'metrics.totalRatings': feedbacks.length
        });

        return averageRating;
    } catch (error) {
        console.error('Error updating event rating:', error);
        throw error;
    }
};

// Generate performance summary
const generatePerformanceSummary = async (eventId) => {
    try {
        // Get all analytics data for the event
        const analyticsData = await EventAnalytics.find({ event: eventId });
        const engagementData = await EventEngagement.find({ event: eventId });
        const feedbackData = await EventFeedback.find({ event: eventId });

        // Calculate summary metrics
        const summary = await calculateEventSummary(eventId, analyticsData, engagementData, feedbackData);

        // Create or update performance summary
        const performanceSummary = await EventPerformanceSummary.findOneAndUpdate(
            { event: eventId },
            {
                event: eventId,
                summary: {
                    totalViews: summary.totals.views,
                    totalRegistrations: summary.totals.registrations,
                    totalAttendees: summary.attendanceCounts.attended || 0,
                    totalRevenue: summary.totals.revenue,
                    averageRating: summary.feedbackMetrics.averageRating.overall || 0,
                    totalFeedbacks: summary.feedbackMetrics.totalFeedbacks,
                    conversionRate: summary.rates.conversionRate,
                    attendanceRate: summary.rates.attendanceRate,
                    netPromoterScore: summary.feedbackMetrics.netPromoterScore
                },
                lastUpdated: new Date()
            },
            { upsert: true, new: true }
        );

        return performanceSummary;
    } catch (error) {
        console.error('Error generating performance summary:', error);
        throw error;
    }
};

// Calculate conversion funnel metrics
const calculateFunnelMetrics = async (eventId, funnelData) => {
    try {
        // Group by user and stage to get unique users per stage
        const userStages = {};

        funnelData.forEach(entry => {
            const userId = entry.user._id.toString();
            if (!userStages[userId]) {
                userStages[userId] = new Set();
            }
            userStages[userId].add(entry.funnelStage);
        });

        // Count unique users at each stage
        const stageCounts = {
            registered: 0,
            started: 0,
            completed: 0
        };

        Object.values(userStages).forEach(stages => {
            if (stages.has('registered')) stageCounts.registered++;
            if (stages.has('started')) stageCounts.started++;
            if (stages.has('completed')) stageCounts.completed++;
        });

        // Calculate conversion rates
        const registeredToStartedRate = stageCounts.registered > 0 ?
            (stageCounts.started / stageCounts.registered * 100).toFixed(2) : 0;
        const startedToCompletedRate = stageCounts.started > 0 ?
            (stageCounts.completed / stageCounts.started * 100).toFixed(2) : 0;
        const overallCompletionRate = stageCounts.registered > 0 ?
            (stageCounts.completed / stageCounts.registered * 100).toFixed(2) : 0;

        // Calculate dropoff rates
        const registeredDropoff = stageCounts.registered - stageCounts.started;
        const startedDropoff = stageCounts.started - stageCounts.completed;

        return {
            stageCounts,
            conversionRates: {
                registeredToStarted: parseFloat(registeredToStartedRate),
                startedToCompleted: parseFloat(startedToCompletedRate),
                overallCompletion: parseFloat(overallCompletionRate)
            },
            dropoffCounts: {
                afterRegistration: registeredDropoff,
                afterStarted: startedDropoff
            },
            dropoffRates: {
                afterRegistration: stageCounts.registered > 0 ?
                    (registeredDropoff / stageCounts.registered * 100).toFixed(2) : 0,
                afterStarted: stageCounts.started > 0 ?
                    (startedDropoff / stageCounts.started * 100).toFixed(2) : 0
            }
        };
    } catch (error) {
        console.error('Error calculating funnel metrics:', error);
        throw error;
    }
};

// Get funnel trends over time
const getFunnelTrends = async (eventId, dateFilter = {}) => {
    try {
        const pipeline = [
            {
                $match: {
                    event: new mongoose.Types.ObjectId(eventId),
                    ...(Object.keys(dateFilter).length > 0 && { timestamp: dateFilter })
                }
            },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                        stage: "$funnelStage"
                    },
                    count: { $sum: 1 },
                    uniqueUsers: { $addToSet: "$user" }
                }
            },
            {
                $group: {
                    _id: "$_id.date",
                    stages: {
                        $push: {
                            stage: "$_id.stage",
                            count: "$count",
                            uniqueUsers: { $size: "$uniqueUsers" }
                        }
                    }
                }
            },
            { $sort: { _id: 1 } }
        ];

        const trends = await ConversionFunnel.aggregate(pipeline);

        return trends.map(day => {
            const stageData = day.stages.reduce((acc, stage) => {
                acc[stage.stage] = {
                    count: stage.count,
                    uniqueUsers: stage.uniqueUsers
                };
                return acc;
            }, {});

            return {
                date: day._id,
                registered: stageData.registered?.uniqueUsers || 0,
                started: stageData.started?.uniqueUsers || 0,
                completed: stageData.completed?.uniqueUsers || 0
            };
        });
    } catch (error) {
        console.error('Error getting funnel trends:', error);
        throw error;
    }
};

// Get dropoff analysis
const getDropoffAnalysis = async (eventId, funnelData) => {
    try {
        // Analyze where users drop off in the funnel
        const userJourneys = {};

        funnelData.forEach(entry => {
            const userId = entry.user._id.toString();
            if (!userJourneys[userId]) {
                userJourneys[userId] = {
                    stages: [],
                    user: entry.user,
                    timestamps: {}
                };
            }
            userJourneys[userId].stages.push(entry.funnelStage);
            userJourneys[userId].timestamps[entry.funnelStage] = entry.timestamp;
        });

        // Categorize user journeys
        const journeyTypes = {
            'registered_only': 0,
            'registered_started': 0,
            'registered_started_completed': 0
        };

        const dropoffReasons = {};
        const averageTimeBetweenStages = {
            registrationToStart: [],
            startToCompletion: []
        };

        Object.values(userJourneys).forEach(journey => {
            const stages = new Set(journey.stages);

            if (stages.has('registered') && stages.has('started') && stages.has('completed')) {
                journeyTypes.registered_started_completed++;

                // Calculate time between stages
                const regTime = new Date(journey.timestamps.registered);
                const startTime = new Date(journey.timestamps.started);
                const completeTime = new Date(journey.timestamps.completed);

                averageTimeBetweenStages.registrationToStart.push(
                    (startTime - regTime) / (1000 * 60 * 60) // hours
                );
                averageTimeBetweenStages.startToCompletion.push(
                    (completeTime - startTime) / (1000 * 60 * 60) // hours
                );
            } else if (stages.has('registered') && stages.has('started')) {
                journeyTypes.registered_started++;
            } else if (stages.has('registered')) {
                journeyTypes.registered_only++;
            }
        });

        // Calculate average times
        const avgRegToStart = averageTimeBetweenStages.registrationToStart.length > 0 ?
            averageTimeBetweenStages.registrationToStart.reduce((a, b) => a + b, 0) /
            averageTimeBetweenStages.registrationToStart.length : 0;

        const avgStartToComplete = averageTimeBetweenStages.startToCompletion.length > 0 ?
            averageTimeBetweenStages.startToCompletion.reduce((a, b) => a + b, 0) /
            averageTimeBetweenStages.startToCompletion.length : 0;

        return {
            journeyTypes,
            dropoffPoints: [
                {
                    stage: 'after_registration',
                    count: journeyTypes.registered_only,
                    percentage: Object.values(journeyTypes).reduce((a, b) => a + b, 0) > 0 ?
                        (journeyTypes.registered_only / Object.values(journeyTypes).reduce((a, b) => a + b, 0) * 100).toFixed(2) : 0
                },
                {
                    stage: 'after_started',
                    count: journeyTypes.registered_started,
                    percentage: Object.values(journeyTypes).reduce((a, b) => a + b, 0) > 0 ?
                        (journeyTypes.registered_started / Object.values(journeyTypes).reduce((a, b) => a + b, 0) * 100).toFixed(2) : 0
                }
            ],
            averageTimes: {
                registrationToStart: avgRegToStart.toFixed(2),
                startToCompletion: avgStartToComplete.toFixed(2)
            }
        };
    } catch (error) {
        console.error('Error analyzing dropoffs:', error);
        throw error;
    }
};

// Calculate average conversion times
const calculateAverageConversionTimes = async (eventId) => {
    try {
        const pipeline = [
            { $match: { event: new mongoose.Types.ObjectId(eventId) } },
            {
                $group: {
                    _id: '$user',
                    stages: {
                        $push: {
                            stage: '$funnelStage',
                            timestamp: '$timestamp'
                        }
                    }
                }
            }
        ];

        const userJourneys = await ConversionFunnel.aggregate(pipeline);

        const times = {
            registrationToStart: [],
            startToCompletion: []
        };

        userJourneys.forEach(journey => {
            const stageMap = {};
            journey.stages.forEach(stage => {
                stageMap[stage.stage] = new Date(stage.timestamp);
            });

            if (stageMap.registered && stageMap.started) {
                times.registrationToStart.push(
                    (stageMap.started - stageMap.registered) / (1000 * 60 * 60)
                );
            }

            if (stageMap.started && stageMap.completed) {
                times.startToCompletion.push(
                    (stageMap.completed - stageMap.started) / (1000 * 60 * 60)
                );
            }
        });

        return {
            averageTimeToStart: times.registrationToStart.length > 0 ?
                times.registrationToStart.reduce((a, b) => a + b, 0) / times.registrationToStart.length : 0,
            averageTimeToComplete: times.startToCompletion.length > 0 ?
                times.startToCompletion.reduce((a, b) => a + b, 0) / times.startToCompletion.length : 0
        };
    } catch (error) {
        console.error('Error calculating average conversion times:', error);
        return { averageTimeToStart: 0, averageTimeToComplete: 0 };
    }
};

module.exports = {
    calculateEventSummary,
    calculateFeedbackMetrics,
    generateTrends,
    updateDailyAnalytics,
    updateEventRating,
    generatePerformanceSummary,
    calculateFunnelMetrics,
    getFunnelTrends,
    getDropoffAnalysis,
    calculateAverageConversionTimes
};
