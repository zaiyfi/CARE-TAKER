import { useEffect, useRef, useState } from "react";
import ImageCropperModal from "../../../Others/ImageCropperModal";
import {
  setUpdatedVerification,
  setVerificationInfo,
} from "../../../../redux/authSlice";

const VerificationForm = ({
  token,
  onClose,
  isEdit,
  existingData = {},
  dispatch,
}) => {
  const formDataRef = useRef(new FormData()); // stays persistent
  const [caregiverType, setCaregiverType] = useState("");
  const [cropModal, setCropModal] = useState({
    open: false,
    field: "",
    imageSrc: null,
  });
  const requestOptions = {
    api: isEdit ? "api/verify/edit" : "/api/verify",
    method: isEdit ? "PATCH" : "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const [preview, setPreview] = useState({
    cnicFront: null,
    cnicBack: null,
    selfie: null,
    certificate: null,
  });

  useEffect(() => {
    if (isEdit && existingData) {
      setCaregiverType(existingData.caregiverType || "");
      if (existingData.cnicFront)
        setPreview((prev) => ({ ...prev, cnicFront: existingData.cnicFront }));
      if (existingData.cnicBack)
        setPreview((prev) => ({ ...prev, cnicBack: existingData.cnicBack }));
      if (existingData.selfieWithCnic)
        setPreview((prev) => ({
          ...prev,
          selfieWithCnic: existingData.selfieWithCnic,
        }));
      if (existingData.certificate)
        setPreview((prev) => ({
          ...prev,
          certificate: existingData.certificate,
        }));
    }
  }, [isEdit, existingData]);

  const handleFileChange = (e, name) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () =>
        setCropModal({ open: true, imageSrc: reader.result, field: name });
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedBlob) => {
    const field = cropModal.field;
    formDataRef.current.set(field, croppedBlob);
    const previewUrl = URL.createObjectURL(croppedBlob);
    setPreview((prev) => ({ ...prev, [field]: previewUrl }));
  };

  const handleCaregiverTypeChange = (e) => {
    const value = e.target.value;
    setCaregiverType(value);
    formDataRef.current.set("caregiverType", value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(requestOptions.api, {
        method: requestOptions.method,
        headers: requestOptions.headers,
        body: formDataRef.current,
      });

      const data = await res.json();
      if (res.ok) {
        alert(isEdit ? "Verification updated!" : "Verification submitted!");
        dispatch(
          isEdit ? setUpdatedVerification(data) : setVerificationInfo(data)
        );
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-10 overflow-y-auto z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg p-6 w-[90%] md:w-[500px] shadow-xl max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-lg font-semibold mb-4">
          Caregiver Verification{isEdit ? "(Editing)" : "(Submitting)"}
        </h2>

        <label className="block text-sm mb-1">Caregiver Type</label>
        <select
          value={caregiverType}
          onChange={handleCaregiverTypeChange}
          required={!isEdit}
          className="w-full border px-3 py-2 mb-4"
        >
          <option value="">Select</option>
          <option value="Child">Child</option>
          <option value="Elderly">Elderly</option>
          <option value="Pet">Pet</option>
          <option value="Other">Other</option>
        </select>

        {/* CNIC Front */}
        <label className="block text-sm mb-1">CNIC Front</label>
        <input
          type="file"
          accept="image/*"
          required={!isEdit}
          onChange={(e) => handleFileChange(e, "cnicFront")}
          className="mb-2"
        />
        {preview.cnicFront && (
          <img
            src={preview.cnicFront}
            className="w-28 h-20 object-cover rounded mb-4"
            alt="CNIC Front"
          />
        )}

        {/* CNIC Back */}
        <label className="block text-sm mb-1">CNIC Back</label>
        <input
          type="file"
          accept="image/*"
          required={!isEdit}
          onChange={(e) => handleFileChange(e, "cnicBack")}
          className="mb-2"
        />
        {preview.cnicBack && (
          <img
            src={preview.cnicBack}
            className="w-28 h-20 object-cover rounded mb-4"
            alt="CNIC Back"
          />
        )}

        {/* Selfie */}
        <label className="block text-sm mb-1">Selfie With CNIC</label>
        <input
          type="file"
          accept="image/*"
          required={!isEdit}
          onChange={(e) => handleFileChange(e, "selfieWithCnic")}
          className="mb-2"
        />
        {preview.selfieWithCnic && (
          <img
            src={preview.selfieWithCnic}
            className="w-28 h-20 object-cover rounded mb-4"
            alt="Selfie With CNIC"
          />
        )}

        {/* Certificate (optional) */}
        <label className="block text-sm mb-1">Certificate (optional)</label>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => handleFileChange(e, "certificate")}
          className="mb-2"
        />
        {preview.certificate && (
          <>
            {formDataRef.current.get("certificate")?.type.includes("image") ? (
              <img
                src={preview.certificate}
                className="w-28 h-20 object-cover rounded mb-4"
                alt="Certificate"
              />
            ) : (
              <a
                href={preview.certificate}
                className="text-blue-600 underline block mb-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Certificate (PDF)
              </a>
            )}
          </>
        )}

        {/* Submit/Cancel */}
        <div className="flex justify-end gap-3 mt-4">
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
      <ImageCropperModal
        open={cropModal.open}
        imageSrc={cropModal.imageSrc}
        onClose={() => setCropModal({ open: false, imageSrc: null, field: "" })}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
};

export default VerificationForm;
