import { User } from "../models/index.js";

export const userDashboard = async (req, res) => {
  try {
    if (!req.session?.userId) return res.redirect('/login');
    const u = await User.findByPk(req.session.userId);
    if (!u) return res.redirect('/login');
    const currentUser = { id: u.id, name: u.name, role: u.role };
    res.render('user/dashboard', { title: 'User Dashboard', currentUser });
  } catch (err) {
    console.error('userDashboard error', err);
    res.status(500).render('home', { error: 'Server error' });
  }
};

export default { userDashboard };

export const userAppointments = async (req, res) => {
  if (!req.session?.userId) return res.redirect('/login');
  res.render('user/appointments', { title: 'My Appointments' });
};

export const userProfile = async (req, res) => {
  if (!req.session?.userId) return res.redirect('/login');
  const u = await User.findByPk(req.session.userId);
  res.render('user/profile', { title: 'Profile', user: u });
};
