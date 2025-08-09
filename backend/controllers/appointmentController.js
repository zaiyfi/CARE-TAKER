const User = require("../models/userSchema");
const Appointment = require("../models/appointmentSchema");

const acceptGig = async (req, res) => {
  try {
    const { caregiverId, clientId, date, startTime, endTime, category } =
      req.body;

    const caregiver = await User.findById(caregiverId);
    const client = await User.findById(clientId);

    if (!caregiver || !client) {
      return res.status(404).json({ message: "Caregiver or client not found" });
    }

    // Create the appointment
    const appointment = await Appointment.create({
      caregiver: caregiverId,
      client: clientId,
      date: new Date(date),
      startTime,
      endTime,
      serviceType: category,
      status: "Pending",
    });

    // Dynamic role-based assignment
    if (client.role === "Client") {
      // Assign caregiver to client
      if (
        !client.assignedCaregiver ||
        client.assignedCaregiver.toString() !== caregiverId
      ) {
        client.assignedCaregiver = caregiverId;
        await client.save();
      }

      // Assign client to caregiver's list if not already assigned
      if (!caregiver.assignedClients.includes(clientId)) {
        caregiver.assignedClients.push(clientId);
        await caregiver.save();
      }
    } else if (caregiver.role === "Client") {
      // If roles are flipped
      if (
        !caregiver.assignedCaregiver ||
        caregiver.assignedCaregiver.toString() !== clientId
      ) {
        caregiver.assignedCaregiver = clientId;
        await caregiver.save();
      }

      if (!client.assignedClients.includes(caregiverId)) {
        client.assignedClients.push(caregiverId);
        await client.save();
      }
    }

    res.status(201).json({
      message: "Appointment created successfully",
      appointment,
    });
  } catch (error) {
    console.error("Appointment creation error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const userId = req.user._id; // assuming `requireAuth` sets `req.user`

    const appointments = await Appointment.find({
      $or: [{ caregiver: userId }, { client: userId }],
    })
      .populate("caregiver", "name email pic")
      .populate("client", "name email pic");

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/appointments/:id
const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updated = await Appointment.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updated) return res.status(404).json({ message: "Not found" });

    res.status(200).json(updated);
  } catch (error) {
    console.error("Update appointment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  acceptGig,
  getAllAppointments,
  updateAppointment,
};
