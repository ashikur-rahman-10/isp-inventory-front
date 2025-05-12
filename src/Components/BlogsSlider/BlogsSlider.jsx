import React, { useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// import required modules
import { Navigation } from 'swiper/modules';
import UseBlogs from '../../Hooks/UseBlogs';

const BlogsSlider = () => {
    const { blogs } = UseBlogs();
    const [activeSlide, setActiveSlide] = useState(0);

    return (
        <div className='max-w-6xl mx-auto mb-20 px-4'>
            <h1 className='text-success text-2xl text-center mb-10'>ব্লগ</h1>
            <Swiper
                rewind={true}
                navigation={true}
                modules={[Navigation]}
                onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
                className="mySwiper border rounded-md border-green-400"
            >
                {blogs && blogs.map((b, index) => (
                    <SwiperSlide key={b._id} className='w-fit'>
                        <BlogSlide blog={b} isActive={index === activeSlide} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

const BlogSlide = ({ blog, isActive }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Reset the expanded state when the slide is no longer active
    React.useEffect(() => {
        if (!isActive) {
            setIsExpanded(false);
        }
    }, [isActive]);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className='text-start px-8 md:px-12 py-10 w-full'>
            <h2 className="font-bold text-lg">{blog.title}</h2>
            <div className="mb-4 text-sm text-gray-500 w-full flex justify-between items-center lg:pr-20">
                <p>Author {blog.authorName}</p>
                <p>Published in: {new Date(blog.postedIn).toLocaleDateString()}</p>
            </div>
            <div className={`relative ${isExpanded ? 'h-auto' : 'h-72 overflow-hidden'}`}>
                <pre className="whitespace-pre-wrap text-base">{blog.body}</pre>
                {!isExpanded && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white to-transparent h-20"></div>
                )}
            </div>
            <button onClick={toggleExpand} className="mt-4 text-warning text-xs font-medium hover:text-yellow-600">
                {isExpanded ? 'Read Less' : 'Read More'}
            </button>
        </div>
    );
};

export default BlogsSlider;