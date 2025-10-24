import { User, Appointment, Handout } from "../models/index.js";
import { Op } from 'sequelize';

export const staffDashboard = async (req, res) => {
  try {
    const role = req.session?.userRole;
    if (!['admin', 'staff'].includes(role)) return res.status(403).render('home', { error: 'Access denied' });

    let currentUser = null;
    if (req.session?.userId) {
      const u = await User.findByPk(req.session.userId);
      if (u) currentUser = { id: u.id, name: u.name, role: u.role };
    }

    const patientCount = await User.count({ where: { role: 'user' } });
    const apptCount = await Appointment.count();
    res.render('staff/dashboard', { title: 'Staff Dashboard', currentUser, stats: { patientCount, apptCount } });
  } catch (err) {
    console.error('staffDashboard error', err);
    res.status(500).render('home', { error: 'Server error' });
  }
};

export default { staffDashboard };

export const staffPatients = async (req, res) => {
  if (!['admin','staff'].includes(req.session?.userRole)) return res.status(403).render('home', { error: 'Access denied' });
  const patients = await User.findAll({ where: { role: 'user' }, order: [['name','ASC']] });
  let currentUser = null;
  if (req.session?.userId) {
    const u = await User.findByPk(req.session.userId);
    if (u) currentUser = { id: u.id, name: u.name, role: u.role };
  }
  res.render('staff/patients', { title: 'Patients', patients, currentUser });
};

export const staffAppointments = async (req, res) => {
  if (!['admin','staff'].includes(req.session?.userRole)) return res.status(403).render('home', { error: 'Access denied' });
  const appts = await Appointment.findAll({ include: [User], order: [['date','DESC']] });
  let currentUser = null;
  if (req.session?.userId) {
    const u = await User.findByPk(req.session.userId);
    if (u) currentUser = { id: u.id, name: u.name, role: u.role };
  }
  res.render('staff/appointments', { title: 'Appointments', appts, currentUser });
};

export const staffNotes = async (req, res) => {
  if (!['admin','staff'].includes(req.session?.userRole)) return res.status(403).render('home', { error: 'Access denied' });
  const notes = await Handout.findAll({ include: [User], where: { notes: { [Op.ne]: null } }, order: [['createdAt','DESC']] }).catch(()=>[]);
  let currentUser = null;
  if (req.session?.userId) {
    const u = await User.findByPk(req.session.userId);
    if (u) currentUser = { id: u.id, name: u.name, role: u.role };
  }
  res.render('staff/notes', { title: 'Notes', notes, currentUser });
};
