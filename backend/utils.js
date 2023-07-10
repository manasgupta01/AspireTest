/**
 * Generates a random OTP (One-Time Password) using alphanumeric characters.
 * @returns {string} The generated OTP.
 */
function generateOTP() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let otp = "";
  for (let i = 0; i < 25; i++) {
    otp += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return otp;
}

module.exports = { generateOTP };
