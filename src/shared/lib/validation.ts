export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const re = /^(05)[0-9][0-9][1-9]([0-9]){6}$/;
  return re.test(phone);
};

export const validatePassword = (password: string): boolean => {
  // En az 8 karakter, 1 büyük harf, 1 küçük harf ve 1 rakam
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return re.test(password);
};

export const getPasswordStrength = (password: string): {
  score: number;
  feedback: string;
} => {
  let score = 0;
  let feedback = '';

  if (password.length >= 8) score++;
  if (password.match(/[A-Z]/)) score++;
  if (password.match(/[a-z]/)) score++;
  if (password.match(/[0-9]/)) score++;
  if (password.match(/[^A-Za-z0-9]/)) score++;

  switch (score) {
    case 0:
    case 1:
      feedback = 'Çok zayıf';
      break;
    case 2:
      feedback = 'Zayıf';
      break;
    case 3:
      feedback = 'Orta';
      break;
    case 4:
      feedback = 'Güçlü';
      break;
    case 5:
      feedback = 'Çok güçlü';
      break;
  }

  return { score, feedback };
};