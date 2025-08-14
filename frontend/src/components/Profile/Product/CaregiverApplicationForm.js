import { useState } from "react";

const CaregiverApplicationForm = ({
  formData,
  setFormData,
  handleSubmit,
  categories,
  handleFileChange,
  handleChange,
}) => {
  return (
    <div className="w-full md:w-5/6 mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Caregiver Application</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className=" grid md:grid-cols-2 gap-4 gap-y-6">
          <div>
            <input
              type="text"
              name="title"
              placeholder="Title: Specialist for Dog Care"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border rounded outline-primary"
              required
            />
            {formData.title.trim().split(/\s+/).length < 4 && (
              <p className="absolute text-red-500 text-sm">
                Title must have at least 4 words
              </p>
            )}
          </div>

          {/* Categories */}
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className=" border-2 p-2 rounded-md outline-primary"
          >
            <option value="">Select a category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="price"
            placeholder="Hourly Rate (RS)"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border rounded outline-primary"
            required
          />

          <input
            type="text"
            name="experience"
            placeholder="Years of Experience"
            value={formData.experience}
            onChange={handleChange}
            className="w-full p-2 border rounded outline-primary"
            required
          />
        </div>

        <textarea
          name="description"
          placeholder="Describe your skills & experience"
          value={formData.description}
          onChange={handleChange}
          className="w-full min-h-fit max-h-80 p-2 border rounded outline-primary"
          rows="3"
          required
        ></textarea>

        {/* CV Upload */}
        <div>
          <label htmlFor="cv">CV</label>
          <input
            type="file"
            name="cv"
            id="cv"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="w-full p-2 border rounded outline-primary"
            required
          />
          {formData.cv && (
            <p className="mt-2">
              📄{" "}
              <a
                href={formData.cvURL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {formData.cv.name}
              </a>
            </p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="image">Image</label>
          <input
            type="file"
            name="image"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded outline-primary"
            required
          />
          {formData.image && (
            <img
              src={formData.imageURL}
              alt="Uploaded Preview"
              className="mt-2 w-32 h-32 object-cover rounded-lg border"
            />
          )}
        </div>

        {/* Availability */}
        <div className="my-4">
          <h3 className="text-md font-semibold mb-2">Availability</h3>
          {[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].map((day) => {
            const dayData = formData.availability.find((a) => a.day === day);
            const isChecked = !!dayData;
            const isFullDay = dayData?.fullDay || false;

            return (
              <div key={day} className="mb-2 flex gap-2 items-center">
                <input
                  type="checkbox"
                  id={`day-${day}`}
                  checked={isChecked}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setFormData((prev) => {
                      let updated = [...prev.availability];
                      if (checked) {
                        updated.push({
                          day,
                          startTime: "",
                          endTime: "",
                          fullDay: false,
                        });
                      } else {
                        updated = updated.filter((item) => item.day !== day);
                      }
                      return { ...prev, availability: updated };
                    });
                  }}
                />
                <label htmlFor={`day-${day}`} className="w-24">
                  {day}
                </label>

                {isChecked && (
                  <>
                    <select
                      value={isFullDay ? "full" : "custom"}
                      onChange={(e) => {
                        const full = e.target.value === "full";
                        setFormData((prev) => ({
                          ...prev,
                          availability: prev.availability.map((slot) =>
                            slot.day === day
                              ? {
                                  ...slot,
                                  fullDay: full,
                                  startTime: full ? "00:00" : "",
                                  endTime: full ? "23:59" : "",
                                }
                              : slot
                          ),
                        }));
                      }}
                      className="border px-2 py-1 rounded"
                    >
                      <option value="custom">Custom Hours</option>
                      <option value="full">Available 24 Hours</option>
                    </select>

                    <input
                      type="time"
                      value={dayData?.startTime || ""}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          availability: prev.availability.map((slot) =>
                            slot.day === day
                              ? { ...slot, startTime: e.target.value }
                              : slot
                          ),
                        }));
                      }}
                      className="border px-2 py-1 rounded"
                      disabled={isFullDay}
                    />

                    <input
                      type="time"
                      value={dayData?.endTime || ""}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          availability: prev.availability.map((slot) =>
                            slot.day === day
                              ? { ...slot, endTime: e.target.value }
                              : slot
                          ),
                        }));
                      }}
                      className="border px-2 py-1 rounded"
                      disabled={isFullDay}
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white p-2 rounded hover:bg-lightPrimary transition-all"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default CaregiverApplicationForm;
