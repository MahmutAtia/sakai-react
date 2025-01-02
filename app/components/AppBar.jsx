'use client';
import { useSession } from 'next-auth/react';
import { Avatar } from 'primereact/avatar';
import { motion } from 'framer-motion';

const AppBar = () => {
    const { data: session } = useSession();

    return (
        <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="w-full surface-card shadow-2 py-2 px-5 flex align-items-center justify-content-between fixed top-0 z-5"
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-900 text-xl font-medium"
            >
                My Professional Dashboard
            </motion.div>

            {session?.user && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex align-items-center gap-2"
                >
                    <span className="text-900 font-medium">{session.user.name}</span>
                    <Avatar
                        image={session.user.image}
                        shape="circle"
                        className="border-2 border-primary-50"
                    />
                </motion.div>
            )}
        </motion.div>
    );
};

export default AppBar;
