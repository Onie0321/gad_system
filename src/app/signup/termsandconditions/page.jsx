"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PreviousPage = () => {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    // Check local storage for 'acceptedTerms' value
    const acceptedTerms = localStorage.getItem("acceptedTerms");
    if (acceptedTerms === "true") {
      setIsChecked(true); // Automatically check the checkbox if terms were accepted
    } else {
      setIsChecked(false); // Keep the checkbox unchecked if terms were declined or not accepted
    }
  }, []);

  return (
    <div>
      <TermsAndConditions />
    </div>
  );
};

const TermsAndConditions = () => {
  const router = useRouter();

  const handleAccept = () => {
    // Store acceptance in local storage
    localStorage.setItem("acceptedTerms", "true");
    // Redirect to signup page with query parameter for accepted terms
    router.push("/signup?acceptedTerms=true");
  };

  const handleDecline = () => {
    // Ensure 'acceptedTerms' is not set in localStorage
    localStorage.removeItem("acceptedTerms");
    // Redirect to signup page WITHOUT the acceptedTerms query param
    router.push("/signup");
  };

  return (
    <Card className="max-w-3xl mx-auto shadow-lg rounded-lg overflow-hidden bg-white">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
        <CardTitle className="text-3xl font-extrabold text-white">
          Terms and Conditions
        </CardTitle>
        <CardDescription className="text-lg text-gray-200">
          Gender and Development (GAD) Website
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <Section title="Welcome">
          Welcome to our Gender and Development (GAD) website. By using our
          services, you agree to the following terms and conditions. This
          website is created to provide information and services related to GAD
          activities and objectives.
        </Section>
        <Section title="Use of Website">
          Any unauthorized use of the website, including the dissemination of
          false information, hacking, or spamming, is strictly prohibited and
          may result in the loss of access to our services.
        </Section>

        <Section title="Data Collection and Privacy">
          We collect certain personal information such as your name, age,
          gender, and address to enhance the effectiveness of our programs and
          GAD objectives. All data collected is carefully processed and stored
          in compliance with privacy laws. We will not share your information
          with third parties without your consent.
        </Section>

        <Section title="User Responsibilities">
          As a user, it is your responsibility to provide accurate information
          and use the website in a manner consistent with GADs goals. Any misuse
          may result in suspension or cancellation of your access.
        </Section>

        <Section title="Intellectual Property">
          All content on the website, including documents, images, and other
          materials, is owned by the website and is protected by intellectual
          property rights. These materials cannot be used or reproduced without
          written permission from us.
        </Section>

        <Section title="Liability">
          We are not liable for any technical issues or data loss that may occur
          while using this website.
        </Section>

        <Section title="Changes to Terms">
          We reserve the right to change these terms and conditions at any time,
          with changes becoming effective upon posting on the website.
        </Section>

        <Section title="Contact">
          If you have any questions or concerns regarding these terms and
          conditions, you can contact us through our email or contact form.
        </Section>
        {/* Other sections */}

        <p className="font-semibold text-center">
          By using this website, you agree to all the terms and conditions
          outlined here.
        </p>
        <div style={styles.buttonContainer}>
          <button style={styles.acceptButton} onClick={handleAccept}>
            Accept All
          </button>
          <button style={styles.declineButton} onClick={handleDecline}>
            Decline
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

function Section({ title, children }) {
  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold text-purple-700 mb-2">{title}</h2>
      <p className="text-gray-700">{children}</p>
    </section>
  );
}

const styles = {
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
  },
  acceptButton: {
    backgroundColor: "#4CAF50", // Green color
    color: "#fff",
    padding: "12px 24px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
  },
  declineButton: {
    backgroundColor: "#F44336", // Red color
    color: "#fff",
    padding: "12px 24px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
    marginLeft: "10px",
  },
};

export default PreviousPage;
