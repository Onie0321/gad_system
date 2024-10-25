git
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PrivacyPolicy = () => {
  const router = useRouter();

  useEffect(() => {
    // Check local storage for 'acceptedTerms' value
    const acceptedTerms = localStorage.getItem("acceptedTerms");
    if (acceptedTerms === "true") {
      // Automatically redirect if terms were already accepted
      router.push("/signup?acceptedPrivacy=true");
    }
  }, [router]);

  const handleAccept = () => {
    // Set 'acceptedTerms' in local storage
    localStorage.setItem("acceptedTerms", "true");
    // Redirect to signup with query parameter for accepted terms
    router.push("/signup?acceptedPrivacy=true");
  };

  const handleDecline = () => {
    // Ensure 'acceptedTerms' is not set in localStorage
    localStorage.removeItem("acceptedTerms");
    // Go back to the previous page
    router.back();
  };

  return (
    <Card className="max-w-3xl mx-auto shadow-lg rounded-lg overflow-hidden bg-white">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-teal-500 p-6">
        <CardTitle className="text-3xl font-extrabold text-white">
          Privacy and Policy Statement
        </CardTitle>
        <CardDescription className="text-lg text-gray-200">
          Gender and Development (GAD) Website
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <Section title="Welcome">
          Welcome to our Gender and Development web-based system. We are
          committed to protecting your privacy and ensuring a secure and
          respectful experience.
        </Section>

        <Section title="1. Information We Collect">
          We collect personal identification information such as your name, age,
          gender, and address when you provide it to us. Additionally, we
          collect usage data through cookies, including your IP address, browser
          type, and website interaction details.
        </Section>

        <Section title="2. How We Use Your Information">
          The information we collect is used to enhance the effectiveness of our
          GAD programs, communicate with you, and provide access to our
          services, including policy development and support programs.
        </Section>

        <Section title="3. Data Storage and Security">
          We store your personal information securely in compliance with privacy
          laws. While we take measures to protect your data, no system is
          completely secure, and we cannot guarantee absolute protection.
        </Section>

        <Section title="4. Sharing of Information">
          We will not share your personal information with third parties unless
          we have your consent, are required by law, or need to do so for
          operational reasons in accordance with GAD objectives.
        </Section>

        <Section title="5. Cookies and Tracking Technologies">
          We use cookies and similar tracking technologies to improve your
          experience. You can disable cookies through your browser settings, but
          this may limit certain features of our website.
        </Section>

        <Section title="6. Your Rights">
          You have the right to access, correct, or request deletion of your
          data. You can also opt-out of receiving communications. To exercise
          these rights, contact us at [Insert Contact Information].
        </Section>

        <Section title="7. Data Retention">
          We retain your data for as long as necessary to fulfill the purposes
          described in this policy. When it is no longer needed, we securely
          dispose of your information.
        </Section>

        <Section title="8. Third-Party Links">
          Our website may contain links to third-party websites. We are not
          responsible for the privacy practices of these external sites. Please
          review their privacy policies before providing any personal
          information.
        </Section>

        <Section title="9. Changes to This Privacy Policy">
          We may update this Privacy Policy from time to time. Any changes will
          be effective immediately upon posting. Continued use of our website
          after any changes constitutes acceptance of the updated policy.
        </Section>

        <Section title="10. Contact Us">
          If you have any questions or concerns about this Privacy Policy,
          please contact us at [Insert Contact Information].
        </Section>

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
      <h2 className="text-xl font-semibold text-blue-700 mb-2">{title}</h2>
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

export default PrivacyPolicy;
