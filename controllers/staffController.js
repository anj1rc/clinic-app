import { User } from "../models/index.js";

export const staffDashboard = async (req, res) => {
  try {
    const role = req.session?.userRole;
    if (!['admin', 'staff'].includes(role)) return res.status(403).render('home', { error: 'Access denied' });

    let currentUser = null;
    if (req.session?.userId) {
      const u = await User.findByPk(req.session.userId);
      if (u) currentUser = { id: u.id, name: u.name, role: u.role };
    }

    res.render('staff/dashboard', { title: 'Staff Dashboard', currentUser });
  } catch (err) {
    console.error('staffDashboard error', err);
    res.status(500).render('home', { error: 'Server error' });
  }
};

export default { staffDashboard };

export const staffPatients = async (req, res) => {
  if (!['admin','staff'].includes(req.session?.userRole)) return res.status(403).render('home', { error: 'Access denied' });
  res.render('staff/patients', { title: 'Patients' });
};

export const staffAppointments = async (req, res) => {
  if (!['admin','staff'].includes(req.session?.userRole)) return res.status(403).render('home', { error: 'Access denied' });
  res.render('staff/appointments', { title: 'Appointments' });
};

export const staffNotes = async (req, res) => {
  if (!['admin','staff'].includes(req.session?.userRole)) return res.status(403).render('home', { error: 'Access denied' });
  res.render('staff/notes', { title: 'Notes' });
};
