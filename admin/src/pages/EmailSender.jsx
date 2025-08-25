import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Users, Send, Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import emailjs from "emailjs-com";
import toast from 'react-hot-toast';
import { eventAPI } from '../services/api';

const EmailSender = () => {
    const navigate = useNavigate();
    const [emailList, setEmailList] = useState([
        "roshanshelke167@gmail.com",
    ]);
    const [newEmail, setNewEmail] = useState("");
    const [subject, setSubject] = useState("Event Notification");
    const [message, setMessage] = useState("Hello! We have an exciting event update for you.");
    const [senderName, setSenderName] = useState("Event Team");
    const [loading, setLoading] = useState(false);
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState("");
    const [emailStatus, setEmailStatus] = useState({});

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await eventAPI.getAll();
            if (response.data.success) {
                setEvents(response.data.events || []);
            }
        } catch (error) {
            console.error('Failed to fetch events:', error);
        }
    };

    const addEmail = () => {
        if (newEmail && !emailList.includes(newEmail)) {
            setEmailList([...emailList, newEmail]);
            setNewEmail("");
        }
    };

    const removeEmail = (emailToRemove) => {
        setEmailList(emailList.filter(email => email !== emailToRemove));
    };

    const handleSend = async (e) => {
        e.preventDefault();
        setLoading(true);
        setEmailStatus({});

        const selectedEventData = events.find(event => event._id === selectedEvent);
        const eventInfo = selectedEventData ?
            `\n\nEvent Details:\n- Title: ${selectedEventData.title}\n- Date: ${new Date(selectedEventData.date).toLocaleDateString()}\n- Location: ${selectedEventData.location}` : '';

        const promises = emailList.map(async (email, index) => {
            const templateParams = {
                to_email: email,
                to_name: `Participant ${index + 1}`,
                from_name: senderName,
                subject: subject,
                message: message + eventInfo,
            };

            try {
                await emailjs.send(
                    "service_2xa9ne7",
                    "template_p9yg4z8",
                    templateParams,
                    "43kNclRsXhWyuRHvv"
                );
                setEmailStatus(prev => ({ ...prev, [email]: 'success' }));
                return { email, status: 'success' };
            } catch (err) {
                console.error(`❌ FAILED for ${email}`, err);
                setEmailStatus(prev => ({ ...prev, [email]: 'failed' }));
                return { email, status: 'failed' };
            }
        });

        try {
            const results = await Promise.all(promises);
            const successCount = results.filter(r => r.status === 'success').length;
            const failedCount = results.filter(r => r.status === 'failed').length;

            if (successCount > 0) {
                toast.success(`Successfully sent ${successCount} emails!`);
            }
            if (failedCount > 0) {
                toast.error(`Failed to send ${failedCount} emails`);
            }
        } catch (error) {
            toast.error('Error sending emails');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Dashboard
                </button>
                <div className="flex items-center gap-2">
                    <Mail className="w-6 h-6 text-blue-600" />
                    <h1 className="text-3xl font-bold text-gray-900">Email Sender</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Email Composition */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Send className="w-5 h-5" />
                        Compose Email
                    </h2>

                    <form onSubmit={handleSend} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sender Name
                            </label>
                            <input
                                type="text"
                                value={senderName}
                                onChange={(e) => setSenderName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Your name or organization"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Subject
                            </label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Email subject"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Event (Optional)
                            </label>
                            <select
                                value={selectedEvent}
                                onChange={(e) => setSelectedEvent(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">No specific event</option>
                                {events.map((event) => (
                                    <option key={event._id} value={event._id}>
                                        {event.title} - {new Date(event.date).toLocaleDateString()}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Message
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={6}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                placeholder="Your email message..."
                            />
                            {selectedEvent && (
                                <p className="text-sm text-gray-500 mt-1">
                                    Event details will be automatically appended to the message.
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || emailList.length === 0}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Send to {emailList.length} Recipients
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Email List Management */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Recipients ({emailList.length})
                    </h2>

                    {/* Add Email */}
                    <div className="flex gap-2 mb-4">
                        <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addEmail()}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Add email address"
                        />
                        <button
                            onClick={addEmail}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add
                        </button>
                    </div>

                    {/* Email List */}
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {emailList.map((email, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Mail className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <span className="text-sm font-medium">{email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {emailStatus[email] === 'success' && (
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                    )}
                                    {emailStatus[email] === 'failed' && (
                                        <AlertCircle className="w-4 h-4 text-red-600" />
                                    )}
                                    <button
                                        onClick={() => removeEmail(email)}
                                        className="text-red-600 hover:text-red-800 p-1"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {emailList.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <Mail className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                            <p>No recipients added yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Email Status Summary */}
            {Object.keys(emailStatus).length > 0 && (
                <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold mb-4">Sending Status</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span className="font-medium text-green-800">Successful</span>
                            </div>
                            <div className="text-2xl font-bold text-green-600">
                                {Object.values(emailStatus).filter(status => status === 'success').length}
                            </div>
                        </div>
                        <div className="p-4 bg-red-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertCircle className="w-5 h-5 text-red-600" />
                                <span className="font-medium text-red-800">Failed</span>
                            </div>
                            <div className="text-2xl font-bold text-red-600">
                                {Object.values(emailStatus).filter(status => status === 'failed').length}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmailSender;