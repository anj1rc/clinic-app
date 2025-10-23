/*
    MIT License
    
    Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
    Mindoro State University - Philippines

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
    */
    
import express from "express";
import { homePage } from "../controllers/homeController.js";
const router = express.Router();
router.get("/", homePage);

import { loginPage, registerPage, forgotPasswordPage, dashboardPage, loginUser, registerUser, logoutUser } from "../controllers/authController.js";
import { adminDashboard, adminUsers, adminSettings, adminReports } from "../controllers/adminController.js";
import { staffDashboard, staffPatients, staffAppointments, staffNotes } from "../controllers/staffController.js";
import { userDashboard, userAppointments, userProfile } from "../controllers/userController.js";
import inventoryController from "../controllers/inventoryController.js";
import inventoryAdminController from "../controllers/inventoryAdminController.js";

router.get("/login", loginPage);
router.post("/login", loginUser);
router.get("/register", registerPage);
router.post("/register", registerUser);
router.get("/forgot-password", forgotPasswordPage);
router.get("/dashboard", dashboardPage);
router.get("/logout", logoutUser);

// Role-specific dashboards
router.get('/admin/dashboard', adminDashboard);
router.get('/admin/users', adminUsers);
router.get('/admin/settings', adminSettings);
router.get('/admin/reports', adminReports);
router.get('/staff/dashboard', staffDashboard);
router.get('/staff/patients', staffPatients);
router.get('/staff/appointments', staffAppointments);
router.get('/staff/notes', staffNotes);
router.get('/user/dashboard', userDashboard);
router.get('/user/appointments', userAppointments);
router.get('/user/profile', userProfile);

// Contact page
router.get('/contact', (req, res) => res.render('contact'));

// Inventory
router.get('/inventory/medicines', inventoryController.listMedicines);
router.get('/inventory/handouts', inventoryController.listHandouts);
router.post('/inventory/new', inventoryController.createHandout);

// Admin medicines CRUD
router.get('/admin/inventory/medicines', (req, res, next) => {
  if (req.session?.userRole !== 'admin') return res.status(403).render('home', { error: 'Access denied' });
  next();
}, inventoryAdminController.adminListMedicines);
router.post('/admin/inventory/medicines/new', inventoryAdminController.adminCreateMedicine);
// Note: Edit/new pages are handled via modals on the manage page
router.post('/admin/inventory/medicines/:id/edit', inventoryAdminController.adminUpdateMedicine);
router.post('/admin/inventory/medicines/:id/delete', inventoryAdminController.adminDeleteMedicine);

export default router;
