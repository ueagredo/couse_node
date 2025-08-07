function isValidEmail(email) {
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return emailRegex.test(email);
}

function isValidName(name) {
  return typeof name === 'string' && name.length >= 3;
}

function isUniqueNumericId(id, users) {
  return typeof id === 'number' && !users.some(user => user.id === id);
}

function isValidUser(user) {
   const { name, email} = user;
   console.log('isValidUser', name, email);
  if (!isValidName(name)) {
    return {
      isValid: false,
      error: 'El nombre debe tener al menos 3 caracteres.'
    };
  }
  if (!isValidEmail(email)) {
    return { isValid: false, error: 'El correo electrÃ³nico no es vÃ¡lido.' };
  }
}

function validateUser(user, users) {
  const { name, email, id} = user;
  isValidUser(user)
  if (!isUniqueNumericId(id, users)) {
    return { isValid: false, error: 'El ID debe ser numÃ©rico y Ãºnico.' };
  }
  return { isValid: true };
}

module.exports = {
  isValidUser,
  isValidEmail,
  isValidName,
  isUniqueNumericId,
  validateUser
};