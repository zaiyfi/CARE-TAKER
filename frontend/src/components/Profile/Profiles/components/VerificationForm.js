import { useState } from "react";

const VerificationForm = ({ token, onClose }) => {
  const [caregiverType, setCaregiverType] = useState("");
  const [cnicFront, setCnicFront] = useState(null);
  const [cnicBack, setCnicBack] = useState(null);
  const [selfieWithCnic, setSelfieWithCnic] = useState(null);
  const [certificate, setCertificate] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("caregiverType", caregiverType);
    formData.append("cnicFront", cnicFront);
    formData.append("cnicBack", cnicBack);
    formData.append("selfieWithCnic", selfieWithCnic);
    if (certificate) formData.append("certificate", certificate);

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert("Verification submitted!");
        onClose();
      } else {
        alert(data.error || "Submission failed");
      }
    } catch (err) {
      console.error("Verification error", err);
      alert("Error occurred");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg p-6 w-[90%] md:w-[500px] shadow-xl"
      >
        <h2 className="text-lg font-semibold mb-4">Caregiver Verification</h2>

        <label className="block text-sm mb-1">Caregiver Type</label>
        <select
          value={caregiverType}
          onChange={(e) => setCaregiverType(e.target.value)}
          required
          className="w-full border px-3 py-2 mb-3"
        >
          <option value="">Select</option>
          <option value="Child">Child</option>
          <option value="Elderly">Elderly</option>
          <option value="Pet">Pet</option>
          <option value="Other">Other</option>
        </select>

        <label className="block text-sm mb-1">CNIC Front</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCnicFront(e.target.files[0])}
          required
          className="mb-3"
        />

        <label className="block text-sm mb-1">CNIC Back</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCnicBack(e.target.files[0])}
          required
          className="mb-3"
        />

        <label className="block text-sm mb-1">Selfie With CNIC</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelfieWithCnic(e.target.files[0])}
          required
          className="mb-3"
        />

        <label className="block text-sm mb-1">Certificate (optional)</label>
        <input
          type="file"
          onChange={(e) => setCertificate(e.target.files[0])}
          className="mb-4"
        />

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-secondary text-white rounded hover:bg-lightPrimary"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default VerificationForm;
