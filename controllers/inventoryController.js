import { Medicine, Handout, User } from "../models/index.js";

export const listMedicines = async (req, res) => {
  if (!['admin','staff'].includes(req.session?.userRole)) return res.status(403).render('home', { error: 'Access denied' });
  const meds = await Medicine.findAll();
  res.render('inventory/medicines', { title: 'Medicines', meds });
};

export const listHandouts = async (req, res) => {
  if (!['admin','staff'].includes(req.session?.userRole)) return res.status(403).render('home', { error: 'Access denied' });
  const handouts = await Handout.findAll({ include: [Medicine, User], order: [['createdAt','DESC']] });
  const meds = await Medicine.findAll({ order: [['name','ASC']] });
  const users = await User.findAll({ order: [['name','ASC']] });
  res.render('inventory/handouts', { title: 'Handouts', handouts, meds, users });
};

// Note: The new handout form is presented as a modal on the Handouts page.

export const createHandout = async (req, res) => {
  try {
    const { medicineId, userId, quantity, notes } = req.body;
    if (!['admin','staff'].includes(req.session?.userRole)) return res.status(403).render('home', { error: 'Access denied' });
    const qty = parseInt(quantity, 10) || 1;
    const med = await Medicine.findByPk(medicineId);
    if (!med) {
      const handouts = await Handout.findAll({ include: [Medicine, User], order: [['createdAt','DESC']] });
      return res.render('inventory/handouts', { error: 'Medicine not found', handouts });
    }
    if (med.stock < qty) {
      const handouts = await Handout.findAll({ include: [Medicine, User], order: [['createdAt','DESC']] });
      return res.render('inventory/handouts', { error: 'Insufficient stock', handouts });
    }

    // create handout and decrement stock in a transaction
    const { sequelize } = Medicine;
    await sequelize.transaction(async (t) => {
      await Handout.create({ medicineId, userId: userId || null, quantity: qty, notes }, { transaction: t });
      med.stock = med.stock - qty;
      await med.save({ transaction: t });
    });
    res.redirect('/inventory/handouts');
  } catch (err) {
    console.error('createHandout error', err);
    const handouts = await Handout.findAll({ include: [Medicine, User], order: [['createdAt','DESC']] });
    res.render('inventory/handouts', { error: 'Server error', handouts });
  }
};

export default { listMedicines, listHandouts, createHandout };
