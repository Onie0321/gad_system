import React from 'react'

export const MaleIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="10" cy="14" r="5" />
    <line x1="19" y1="5" x2="13.6" y2="10.4" />
    <line x1="19" y1="5" x2="14" y2="5" />
    <line x1="19" y1="5" x2="19" y2="10" />
  </svg>
)

export const FemaleIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="8" r="5" />
    <line x1="12" y1="13" x2="12" y2="21" />
    <line x1="9" y1="18" x2="15" y2="18" />
  </svg>
)