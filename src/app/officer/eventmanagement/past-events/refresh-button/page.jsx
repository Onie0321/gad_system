import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";

function RefreshButton({
  onClick,
  isRefreshing,
  className = "bg-blue-600 hover:bg-blue-700 text-white",
  icon = <RefreshCw className="w-4 h-4" />,
  text = "Refresh",
  refreshingText = "Refreshing...",
}) {
  const handleClick = async () => {
    if (!isRefreshing) {
      await onClick();
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isRefreshing}
      className={className}
    >
      <motion.div
        animate={{ rotate: isRefreshing ? 360 : 0 }}
        transition={{ duration: 1, ease: "linear", repeat: isRefreshing ? Infinity : 0 }}
        className="mr-2"
      >
        {icon}
      </motion.div>
      {isRefreshing ? refreshingText : text}
    </Button>
  );
}

export default RefreshButton;
