import { motion } from "framer-motion";

export default function DeployingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12">
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
        className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-red-500"
      />
      <p className="text-gray-300 text-lg">Deploying your Presale Contract...</p>
    </div>
  );
}