// components/PasswordStrengthMeter.js
import React from "react";

const getPasswordStrength = (password) => {
  let strength = 0;
  if (password.length > 6) strength += 1;
  if (password.length > 10) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  return strength;
};

export const PasswordStrengthMeter = ({ password }) => {
  const strength = getPasswordStrength(password);

  const getStrengthColor = (strength) => {
    switch (strength) {
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-orange-500";
      case 3:
        return "bg-yellow-500";
      case 4:
        return "bg-green-500";
      case 5:
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="mt-2">
      <div className="h-2 w-full bg-gray-300 rounded">
        <div
          className={`h-2 ${getStrengthColor(strength)} rounded transition-all`}
          style={{ width: `${(strength / 5) * 100}%` }}
        />
      </div>
      <p className="mt-1 text-sm text-gray-400">
        {strength === 1 && "Very Weak"}
        {strength === 2 && "Weak"}
        {strength === 3 && "Moderate"}
        {strength === 4 && "Strong"}
        {strength === 5 && "Very Strong"}
      </p>
    </div>
  );
};
