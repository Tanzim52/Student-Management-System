import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ErrorPage = () => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const floatingElements = Array(8).fill(0).map((_, i) => {
    const size = Math.random() * 30 + 20;
    return {
      id: i,
      size,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      rotate: Math.random() * 360,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 overflow-hidden relative">
      {/* Floating background elements */}
      {floatingElements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute text-primary opacity-10"
          style={{
            width: `${element.size}px`,
            height: `${element.size}px`,
            left: `${element.x}%`,
            top: `${element.y}%`,
          }}
          animate={{
            rotate: element.rotate + 360,
            y: [0, 50, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      ))}

      {/* Interactive cursor follower */}
      <motion.div
        className="fixed w-64 h-64 rounded-full bg-primary/10 pointer-events-none"
        animate={{
          x: cursorPosition.x - 128,
          y: cursorPosition.y - 128,
          scale: isHovered ? 1.2 : 1,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="inline-block relative">
            <motion.h1 
              className="text-9xl font-bold text-primary mb-4 relative z-10"
              animate={{ 
                scale: [1, 1.05, 1],
                textShadow: [
                  '0 0 0px rgba(0,0,0,0)',
                  '0 0 20px rgba(99,102,241,0.5)',
                  '0 0 0px rgba(0,0,0,0)'
                ]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            >
              404
            </motion.h1>
            <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full -z-10"></div>
          </div>

          <motion.h2 
            className="text-4xl font-bold mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Oops! Page Not Found
          </motion.h2>

          <motion.p 
            className="text-xl mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Link 
              to="/" 
              className="btn btn-primary btn-lg relative overflow-hidden group"
            >
              <span className="relative z-10">Return Home</span>
              <motion.span
                className="absolute inset-0 bg-primary/80 z-0"
                initial={{ x: '-100%' }}
                animate={{ 
                  x: isHovered ? '0%' : '-100%',
                }}
                transition={{ duration: 0.4 }}
              />
            </Link>
          </motion.div>

          <motion.div
            className="mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="inline-block p-4 bg-base-200 rounded-xl shadow-lg border border-base-300">
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>While you're here, enjoy these floating stars</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Animated corner elements */}
      <motion.div 
        className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-primary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      />
      <motion.div 
        className="absolute top-0 right-0 w-32 h-32 border-t-4 border-r-4 border-primary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      />
      <motion.div 
        className="absolute bottom-0 left-0 w-32 h-32 border-b-4 border-l-4 border-primary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
      />
      <motion.div 
        className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-primary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      />
    </div>
  );
};

export default ErrorPage;