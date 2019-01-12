import models from '../models/index';

export const getUsers= async () => {
  return models.User.find()
}