const User = require("../models/User");
const Appointment = require("../models/Appointment");

const acceptGig = async (req, res) => {
  try {
    const { caregiverId, clientId, date, time, duration, serviceType } =
      req.body;

    // 1. Check if caregiver and client exist
    const caregiver = await User.findById(caregiverId);
    const client = await User.findById(clientId);

    if (!caregiver || !client) {
      return res.status(404).json({ message: "Caregiver or client not found" });
    }

    // 2. Create appointment
    const appointment = await Appointment.create({
      caregiver: caregiverId,
      client: clientId,
      date,
      time,
      duration,
      serviceType,
      status: "Assigned", // optional: Pending, Completed, etc.
    });

    // 3. Update caregiver's assigned clients
    if (!caregiver.assignedClients.includes(clientId)) {
      caregiver.assignedClients.push(clientId);
      await caregiver.save();
    }

    // 4. Update client's assigned caregiver
    client.assignedCaregiver = caregiverId;
    await client.save();

    res.status(201).json({
      message: "Appointment created and users updated",
      appointment,
    });
  } catch (error) {
    console.error("Error accepting gig:", error);
    res.status(500).json({ message: "Server error" });
  }
};
