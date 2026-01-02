/**
 * Validate required environment variables
 */
const validateEnv = () => {
  const required = ['JWT_SECRET'];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error('Missing required environment variables:');
    missing.forEach((key) => console.error(`  - ${key}`));
    throw new Error('Missing required environment variables');
  }

  // Validate JWT_SECRET strength
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.warn(
      'Warning: JWT_SECRET should be at least 32 characters long for security'
    );
  }
};

module.exports = validateEnv;

