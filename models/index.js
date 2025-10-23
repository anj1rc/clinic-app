import { Medicine } from './medicineModel.js';
import { Handout } from './handoutModel.js';
import User from './userModel.js';

// Setup associations centrally
Medicine.hasMany(Handout, { foreignKey: 'medicineId' });
Handout.belongsTo(Medicine, { foreignKey: 'medicineId' });
Handout.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Handout, { foreignKey: 'userId' });

export { Medicine, Handout, User };
export default { Medicine, Handout, User };
