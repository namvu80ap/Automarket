module.exports = function (compound, Car) {
  // define Car here
	Car.hasMany(compound.models.CarPic, { as: 'CarPics',  foreignKey: 'carId' });
};