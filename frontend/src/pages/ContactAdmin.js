import { useEffect, useState } from "react";

const ContactAdmin = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/auth/admin/details"); // Change API URL
        const data = await res.json();
        setAdmin(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching admin info:", error);
        setLoading(false);
      }
    };

    fetchAdmin();
  }, []);

  if (loading) {
    return <p className="text-center py-6">Loading admin info...</p>;
  }

  if (!admin) {
    return (
      <p className="text-center py-6 text-red-500">
        Failed to load admin info.
      </p>
    );
  }

  return (
    <div className="max-w-3xl my-8 mx-auto p-6 bg-white rounded-lg shadow-lg space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          Contact the Administrator
        </h1>
        <p className="text-gray-600">
          If you have any issues, questions, or suggestions regarding our
          platform, please feel free to reach out to our admin team. We’re here
          to help ensure your experience is smooth.
        </p>
      </div>

      {/* Admin Info */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <p className="mb-2">
          <strong>Name:</strong> {admin.name}
        </p>
        <p className="mb-2">
          <strong>Email:</strong> {admin.email}
        </p>
        <p className="mb-2">
          <strong>Phone:</strong> {admin.phone}
        </p>
        <p className="text-sm text-gray-600 mt-2">
          You can reach out via email or phone during support hours for the
          fastest response.
        </p>
      </div>

      {/* Support Hours */}
      <div className="p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Support Hours</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>Monday – Friday: 9:00 AM to 6:00 PM (GMT)</li>
          <li>Average response time: Within 24 hours</li>
          <li>Closed on weekends & public holidays</li>
        </ul>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-lg font-semibold mb-2">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          <div>
            <p className="font-medium">1. How quickly will I get a reply?</p>
            <p className="text-gray-600">
              Usually within 24 hours during working days.
            </p>
          </div>
          <div>
            <p className="font-medium">
              2. Can I request a feature from the admin?
            </p>
            <p className="text-gray-600">
              Yes! We welcome feedback and feature suggestions from our users.
            </p>
          </div>
          <div>
            <p className="font-medium">
              3. Can I contact admin for account issues?
            </p>
            <p className="text-gray-600">
              Absolutely. Whether it’s password resets or profile edits, we’re
              here to assist.
            </p>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-yellow-700 font-medium">
          Please note: The admin will never ask for your password or sensitive
          personal information.
        </p>
      </div>
    </div>
  );
};

export default ContactAdmin;
