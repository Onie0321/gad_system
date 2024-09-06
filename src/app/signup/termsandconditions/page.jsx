"use client";
import React from "react";
import { useRouter } from "next/navigation";

const TermsAndConditions = () => {
  const router = useRouter();

  const handleAcceptAll = () => {
    localStorage.setItem("termsAccepted", "true");
    router.push("/signup"); // Navigate to the Sign-Up page
  };

  const handleDecline = () => {
    localStorage.setItem("termsAccepted", "false");
    router.push("/signup"); // Navigate to the Sign-Up page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="w-full max-w-4xl bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-extrabold mb-6">
          Terms and Conditions for the Gender and Development (GAD) Office
        </h1>
        <p className="text-lg mb-4">
          Welcome to the Gender and Development (GAD) Office. By accessing or
          using our services, you agree to comply with and be bound by the
          following Terms and Conditions. Please read them carefully. If you do
          not agree with these terms, please refrain from using our services.
        </p>
        <p className="text-lg mb-4">
          The GAD Office aims to promote gender equality and support the
          empowerment of all genders within our organization and community. Our
          services include policy development, training, support programs, and
          advocacy to address and reduce gender disparities.
        </p>
        <p className="text-lg mb-4">
          The GAD Office provides the following services:
          <ul className="list-disc ml-6 mb-4">
            <li>
              Development and implementation of gender-sensitive policies and
              programs.
            </li>
            <li>
              Conducting training sessions and workshops on gender issues.
            </li>
            <li>
              Providing support and resources for gender-related concerns.
            </li>
            <li>Engaging in advocacy and awareness campaigns.</li>
          </ul>
        </p>
        <p className="text-lg mb-4">
          By using our services, you agree to:
          <ul className="list-disc ml-6 mb-4">
            <li>
              Engage with our programs and resources in a respectful and
              constructive manner.
            </li>
            <li>
              Provide accurate and truthful information when participating in
              GAD Office activities.
            </li>
            <li>
              Respect the confidentiality of other participants and the
              sensitive nature of gender-related issues.
            </li>
            <li>
              Abide by the codes of conduct set forth by the GAD Office during
              all interactions and activities.
            </li>
          </ul>
        </p>
        <p className="text-lg mb-4">
          The GAD Office is committed to protecting the confidentiality of all
          participants. Information shared in our programs or services will be
          handled with the utmost care and used only for the intended purposes.
          However, in cases where there is a risk of harm or legal obligations,
          we may be required to disclose information to appropriate authorities.
        </p>
        <p className="text-lg mb-4">
          All materials, content, and resources provided by the GAD Office are
          the intellectual property of the GAD Office or its licensors. You may
          not reproduce, distribute, or use these materials for commercial
          purposes without prior written consent.
        </p>
        <p className="text-lg mb-4">
          Participants are expected to adhere to the following code of conduct:
          <ul className="list-disc ml-6 mb-4">
            <li>Treat all individuals with respect and dignity.</li>
            <li>
              Engage in discussions and activities with an open mind and a
              willingness to understand different perspectives.
            </li>
            <li>
              Avoid any form of harassment, discrimination, or offensive
              behavior.
            </li>
            <li>
              Report any inappropriate behavior or concerns to the GAD Office
              promptly.
            </li>
          </ul>
        </p>
        <p className="text-lg mb-4">
          The GAD Office reserves the right to terminate or suspend access to
          our services for any individual who violates these Terms and
          Conditions or engages in behavior that is harmful to the mission and
          values of the GAD Office.
        </p>
        <p className="text-lg mb-4">
          The GAD Office shall not be liable for any indirect, incidental,
          special, or consequential damages arising from the use of our
          services. We make no guarantees regarding the accuracy, reliability,
          or completeness of the information provided.
        </p>
        <p className="text-lg mb-4">
          We reserve the right to modify these Terms and Conditions at any time.
          Any changes will be effective immediately upon posting. Your continued
          use of our services after any modifications constitutes acceptance of
          the new terms.
        </p>
        <p className="text-lg mb-4">
          For any questions or concerns regarding these Terms and Conditions,
          please contact the GAD Office at:
          <br />
          [Insert Contact Information]
        </p>
        <p className="text-lg mb-4">
          These Terms and Conditions are governed by and construed in accordance
          with the laws of [Insert Jurisdiction]. Any disputes arising under or
          in connection with these Terms shall be subject to the exclusive
          jurisdiction of the courts of [Insert Jurisdiction].
        </p>
        <div className="flex gap-4 mt-8">
          <button
            onClick={handleAcceptAll}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Accept All
          </button>
          <button
            onClick={handleDecline}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
