import { User } from "../models/index.js";

export const adminDashboard = async (req, res) => {
  try {
    const role = req.session?.userRole;
    if (role !== 'admin') return res.status(403).render('home', { error: 'Access denied' });

    let currentUser = null;
    if (req.session?.userId) {
      const u = await User.findByPk(req.session.userId);
      if (u) currentUser = { id: u.id, name: u.name, role: u.role };
    }

    // Render admin dashboard (create views/admin/dashboard.xian)
    res.render('admin/dashboard', { title: 'Admin Dashboard', currentUser });
  } catch (err) {
    console.error('adminDashboard error', err);
    res.status(500).render('home', { error: 'Server error' });
  }
};

export default { adminDashboard };

export const adminUsers = async (req, res) => {
  if (req.session?.userRole !== 'admin') return res.status(403).render('home', { error: 'Access denied' });
  let currentUser = null;
  if (req.session?.userId) {
    const u = await User.findByPk(req.session.userId);
    if (u) currentUser = { id: u.id, name: u.name, role: u.role };
  }
  res.render('admin/users', { title: 'Manage Users', currentUser });
};

export const adminSettings = async (req, res) => {
  if (req.session?.userRole !== 'admin') return res.status(403).render('home', { error: 'Access denied' });
  res.render('admin/settings', { title: 'Site Settings' });
};

export const adminReports = async (req, res) => {
  if (req.session?.userRole !== 'admin') return res.status(403).render('home', { error: 'Access denied' });
  res.render('admin/reports', { title: 'Reports' });
};
