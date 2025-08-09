import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 my-10 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Privacy Policy</h1>
      <p className="text-gray-600 mb-6">
        This Privacy Policy explains how we collect, use, disclose, and
        safeguard your information when you use our platform. Please read this
        policy carefully. By using our services, you consent to the terms of
        this Privacy Policy.
      </p>

      {/* 1. Information We Collect */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">
          1. Information We Collect
        </h2>
        <p className="text-gray-600 mb-2">
          We may collect personal information that you provide directly,
          including:
        </p>
        <ul className="list-disc ml-6 text-gray-600">
          <li>Name, email address, phone number</li>
          <li>Profile picture and account details</li>
          <li>Payment information for purchases</li>
          <li>Messages sent via our platform</li>
        </ul>
        <p className="text-gray-600 mt-2">
          We also automatically collect certain information such as:
        </p>
        <ul className="list-disc ml-6 text-gray-600">
          <li>IP address, browser type, and operating system</li>
          <li>Pages you visit and actions you take</li>
          <li>Date and time of access</li>
        </ul>
      </section>

      {/* 2. How We Use Your Information */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">
          2. How We Use Your Information
        </h2>
        <ul className="list-disc ml-6 text-gray-600">
          <li>To provide, operate, and maintain our platform</li>
          <li>To process payments and send invoices</li>
          <li>To respond to your inquiries and provide customer support</li>
          <li>To personalize user experience and improve our services</li>
          <li>To send updates, promotions, and important notifications</li>
        </ul>
      </section>

      {/* 3. Sharing Your Information */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">
          3. Sharing Your Information
        </h2>
        <p className="text-gray-600">
          We do not sell your personal data. However, we may share your
          information with:
        </p>
        <ul className="list-disc ml-6 text-gray-600">
          <li>Service providers and vendors who assist in our operations</li>
          <li>Law enforcement when required by applicable laws</li>
          <li>Other parties with your explicit consent</li>
        </ul>
      </section>

      {/* 4. Data Security */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">
          4. Data Security
        </h2>
        <p className="text-gray-600">
          We implement industry-standard security measures to protect your
          information. However, no method of transmission over the Internet is
          100% secure, and we cannot guarantee absolute security.
        </p>
      </section>

      {/* 5. Your Rights */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">
          5. Your Rights
        </h2>
        <p className="text-gray-600">
          You have the right to access, update, or delete your personal
          information. You may also opt out of marketing communications at any
          time by following the unsubscribe link in our emails.
        </p>
      </section>

      {/* 6. Changes to This Policy */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">
          6. Changes to This Policy
        </h2>
        <p className="text-gray-600">
          We may update this Privacy Policy from time to time. We will notify
          you of any significant changes by posting the updated policy on this
          page with a revised date.
        </p>
      </section>

      {/* 7. Contact Us */}
      <section>
        <h2 className="text-xl font-semibold mb-2 text-gray-700">
          7. Contact Us
        </h2>
        <p className="text-gray-600">
          If you have questions about this Privacy Policy or our practices, you
          can contact us at:
        </p>
        <p className="text-gray-800 font-medium mt-2">
          Email: cconnect@2025gmail.com
        </p>
        <p className="text-gray-800 font-medium">Phone: +1 234 567 890</p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
