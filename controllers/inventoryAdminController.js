import { Medicine } from "../models/index.js";

export const adminListMedicines = async (req, res) => {
  if (req.session?.userRole !== 'admin') return res.status(403).render('home', { error: 'Access denied' });
  const meds = await Medicine.findAll({ order: [['name','ASC']] });
  res.render('inventory/manageMedicines', { title: 'Manage Medicines', meds });
};

// Note: Add/Edit pages are now handled via modals on the manageMedicines page.

export const adminCreateMedicine = async (req, res) => {
  try {
    if (req.session?.userRole !== 'admin') return res.status(403).render('home', { error: 'Access denied' });
    const { name, sku, stock, unit } = req.body;
    if (!name) {
      const meds = await Medicine.findAll({ order: [['name','ASC']] });
      return res.render('inventory/manageMedicines', { error: 'Name is required', meds });
    }
    const parsedStock = parseInt(stock, 10) || 0;
    await Medicine.create({ name, sku: sku || null, stock: parsedStock, unit: unit || null });
    res.redirect('/admin/inventory/medicines');
  } catch (err) {
    console.error('adminCreateMedicine error', err);
    const meds = await Medicine.findAll({ order: [['name','ASC']] });
    res.render('inventory/manageMedicines', { error: 'Server error', meds });
  }
};

// Edit page is handled via modal on the manage page. POST handler below updates.

export const adminUpdateMedicine = async (req, res) => {
  try {
    if (req.session?.userRole !== 'admin') return res.status(403).render('home', { error: 'Access denied' });
    const med = await Medicine.findByPk(req.params.id);
    if (!med) return res.redirect('/admin/inventory/medicines');
    const { name, sku, stock, unit } = req.body;
    med.name = name || med.name;
    med.sku = sku || med.sku;
    med.stock = parseInt(stock, 10) || 0;
    med.unit = unit || med.unit;
    await med.save();
    res.redirect('/admin/inventory/medicines');
  } catch (err) {
    console.error('adminUpdateMedicine error', err);
    const meds = await Medicine.findAll({ order: [['name','ASC']] });
    res.render('inventory/manageMedicines', { error: 'Server error', meds });
  }
};

export const adminDeleteMedicine = async (req, res) => {
  try {
    if (req.session?.userRole !== 'admin') return res.status(403).render('home', { error: 'Access denied' });
    const med = await Medicine.findByPk(req.params.id);
    if (!med) return res.redirect('/admin/inventory/medicines');
    await med.destroy();
    res.redirect('/admin/inventory/medicines');
  } catch (err) {
    console.error('adminDeleteMedicine error', err);
    res.redirect('/admin/inventory/medicines');
  }
};

export default {
  adminListMedicines,
  adminCreateMedicine,
  adminUpdateMedicine,
  adminDeleteMedicine
};
