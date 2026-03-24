import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft, ChevronRight, Play, Pause,
    Quote, Star, Heart, Users,
    Award, TrendingUp, ShieldCheck
} from "lucide-react";
import { getAllReviewsThunk } from "../../redux/slices/review.slice";
import { useDispatch, useSelector } from "react-redux";

const Stories = () => {
    // ✅ All hooks must be called unconditionally at the top level
    const [current, setCurrent] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [direction, setDirection] = useState(0);
    const videoRef = useRef(null);
    const dispatch = useDispatch();

    const { reviews } = useSelector(state => state.review);

    // Transform reviews to match the component's expected format
    const transformedReviews = reviews?.reviews?.map((review, index) => ({
        id: review._id,
        name: `Patient ${index + 1}`,
        specialty: review.doctorId ? "Medical Patient" : "Healthcare Recipient",
        rating: review.rating,
        review: review.message,
        video: review.mediaUrl || null,
        avatar: review.avatarUrl || `https://ui-avatars.com/api/?name=Patient+${index + 1}&background=6366f1&color=fff&bold=true`,
        date: new Date(review.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    })) || [];

    useEffect(() => {
        dispatch(getAllReviewsThunk());
    }, [dispatch]);

    // Auto-advance logic
    useEffect(() => {
        let timer;
        if (isPlaying && transformedReviews.length > 0) {
            timer = setTimeout(() => {
                nextSlide();
            }, 8000);
        }
        return () => clearTimeout(timer);
    }, [current, isPlaying, transformedReviews.length]);

    // Handle video playback when slide changes
    useEffect(() => {
        if (videoRef.current && transformedReviews[current]?.video) {
            videoRef.current.load();
            if (isPlaying) {
                videoRef.current.play().catch(error => {
                    console.log("Video autoplay failed:", error);
                });
            }
        }
    }, [current]);

    const nextSlide = () => {
        if (transformedReviews.length === 0) return;
        setCurrent((prev) => (prev + 1) % transformedReviews.length);
    };

    const prevSlide = () => {
        if (transformedReviews.length === 0) return;
        setCurrent((prev) => (prev === 0 ? transformedReviews.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setDirection(1);
        nextSlide();
    };

    const handlePrev = () => {
        setDirection(-1);
        prevSlide();
    };

    // Calculate average rating
    const averageRating = transformedReviews.length > 0
        ? transformedReviews.reduce((sum, review) => sum + review.rating, 0) / transformedReviews.length
        : 0;
    const satisfactionRate = Math.round((averageRating / 5) * 100);

    // Animation variants
    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
            scale: 0.9
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        },
        exit: (direction) => ({
            x: direction > 0 ? -300 : 300,
            opacity: 0,
            scale: 0.9,
            transition: {
                duration: 0.5,
                ease: "easeIn"
            }
        })
    };

    // ✅ Move the loading UI after all hooks, not as an early return
    if (!transformedReviews.length) {
        return (
            <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 py-4 px-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-sm animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading patient stories...</p>
                </div>
            </div>
        );
    }

    const currentReview = transformedReviews[current];

    return (
        <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 py-4 px-6">
            <div className="max-w-5xl mx-auto">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <div className="w-12 h-0.5 bg-linear-to-r from-indigo-600 to-purple-600" />
                        <div className="bg-linear-to-r from-indigo-600 to-purple-600 p-2 rounded-sm">
                            <Heart size={16} className="text-white" />
                        </div>
                        <div className="w-12 h-0.5 bg-linear-to-r from-purple-600 to-indigo-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                        Patient <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Stories</span>
                    </h1>
                    <p className="text-slate-500 max-w-2xl mx-auto">
                        Real experiences from {transformedReviews.length} patients who trusted us with their health journey
                    </p>
                </motion.div>

                {/* Main Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group"
                >
                    {/* Progress Bars */}
                    <div className="flex gap-1 mb-6">
                        {transformedReviews.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setDirection(idx > current ? 1 : -1);
                                    setCurrent(idx);
                                }}
                                className="flex-1"
                            >
                                <div
                                    className={`h-1 rounded-sm transition-all duration-500 ${idx === current
                                        ? 'bg-linear-to-r from-indigo-600 to-purple-600'
                                        : idx < current
                                            ? 'bg-indigo-200'
                                            : 'bg-slate-200'
                                        }`}
                                />
                            </button>
                        ))}
                    </div>

                    {/* Main Content Card */}
                    <div className="bg-white rounded-sm shadow-2xl overflow-hidden border border-indigo-100">
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={current}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className="p-8 md:p-12"
                            >
                                <div className="grid md:grid-cols-2 gap-12 items-center">

                                    {/* Left Side: Testimonial Content */}
                                    <div className="space-y-6">
                                        {/* Quote Icon */}
                                        <div className="relative">
                                            <div className="absolute -top-2 -left-2">
                                                <Quote size={48} className="text-indigo-100" strokeWidth={1} />
                                            </div>
                                            <p className="text-slate-700 text-lg leading-relaxed relative z-10 pl-6">
                                                {currentReview.review}
                                            </p>
                                        </div>

                                        {/* Rating */}
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={20}
                                                    className={i < currentReview.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}
                                                />
                                            ))}
                                        </div>

                                        {/* Patient Info */}
                                        <div className="flex items-center gap-4 pt-4 border-t border-indigo-100">
                                            <div className="relative">
                                                <img
                                                    src={currentReview.avatar}
                                                    alt={currentReview.name}
                                                    className="w-14 h-14 rounded-sm object-cover border-2 border-indigo-200"
                                                    onError={(e) => {
                                                        e.target.src = `https://ui-avatars.com/api/?name=Patient&background=6366f1&color=fff&bold=true`;
                                                    }}
                                                />
                                                <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-sm p-1">
                                                    <ShieldCheck size={10} className="text-white" />
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 text-lg">{currentReview.name}</h3>
                                                <p className="text-sm text-indigo-600 font-medium">{currentReview.specialty}</p>
                                                <p className="text-xs text-slate-400 mt-1">{currentReview.date}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Side: Video/Visual */}
                                    <div className="relative">
                                        {currentReview.video ? (
                                            <div className="relative group/video rounded-sm overflow-hidden bg-slate-900 shadow-xl">
                                                <video
                                                    ref={videoRef}
                                                    src={currentReview.video}
                                                    className="w-full h-auto max-h-80 object-cover"
                                                    controls
                                                    poster={currentReview.avatar || "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop"}
                                                    onPlay={() => setIsPlaying(false)}
                                                    onPause={() => setIsPlaying(true)}
                                                />
                                                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover/video:opacity-100 transition-opacity" />
                                            </div>
                                        ) : (
                                            <div className="relative rounded-sm overflow-hidden bg-linear-to-br from-indigo-50 to-purple-50 p-8 text-center">
                                                <div className="absolute inset-0 opacity-10">
                                                    <Heart size={120} className="text-indigo-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                                </div>
                                                <div className="relative z-10">
                                                    <div className="w-20 h-20 bg-indigo-100 rounded-sm flex items-center justify-center mx-auto mb-4">
                                                        <Users size={32} className="text-indigo-600" />
                                                    </div>
                                                    <p className="text-slate-500 text-sm">
                                                        {currentReview.name} shares their healing journey through words
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Stats Badge */}
                                        <div className="absolute -bottom-4 -right-4 bg-white rounded-sm shadow-lg p-3 border border-indigo-100">
                                            <div className="flex items-center gap-2">
                                                <TrendingUp size={16} className="text-emerald-500" />
                                                <span className="text-xs font-bold text-slate-700">
                                                    Satisfaction Rate: {satisfactionRate}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Controls */}
                        <div className="flex items-center justify-between gap-4 p-8 pt-0 border-t border-indigo-100 bg-indigo-50/30">
                            <button
                                onClick={handlePrev}
                                className="group flex items-center justify-center w-12 h-12 rounded-sm bg-white border border-indigo-200 text-indigo-600 hover:bg-linear-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white hover:border-transparent transition-all duration-300 shadow-md hover:shadow-xl"
                            >
                                <ChevronLeft size={20} />
                            </button>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => {
                                        setIsPlaying(!isPlaying);
                                        if (!isPlaying && videoRef.current && currentReview.video) {
                                            videoRef.current.pause();
                                        }
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 rounded-sm bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-all"
                                >
                                    {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                                    <span className="text-xs font-bold uppercase tracking-wider">
                                        {isPlaying ? "Auto-play" : "Paused"}
                                    </span>
                                </button>

                                <div className="text-sm font-bold text-slate-400">
                                    {String(current + 1).padStart(2, '0')} / {String(transformedReviews.length).padStart(2, '0')}
                                </div>
                            </div>

                            <button
                                onClick={handleNext}
                                className="group flex items-center gap-2 px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-sm hover:shadow-xl transition-all duration-300"
                            >
                                <span className="text-xs uppercase tracking-wider">Next Story</span>
                                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
                >
                    {[
                        { icon: Users, value: `${transformedReviews.length}+`, label: "Patient Stories", color: "indigo" },
                        { icon: Award, value: `${satisfactionRate}%`, label: "Satisfaction Rate", color: "purple" },
                        { icon: Heart, value: `${Math.floor(transformedReviews.length * 0.8)}+`, label: "Success Stories", color: "pink" },
                        { icon: ShieldCheck, value: "24/7", label: "Patient Support", color: "emerald" }
                    ].map((stat, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-sm p-4 text-center border border-indigo-100 shadow-md hover:shadow-xl transition-all"
                        >
                            <stat.icon className={`text-${stat.color}-600 w-6 h-6 mx-auto mb-2`} />
                            <h3 className="text-xl font-bold text-slate-900">{stat.value}</h3>
                            <p className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 text-center"
                >
                    <button className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:gap-3 transition-all group">
                        <span>Share Your Story</span>
                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default Stories;