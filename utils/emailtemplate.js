export const verifyEmailTemplate = (name, url) => {
    return `
      <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 2rem; border-radius: 0.5rem; max-width: 600px; margin: auto;">
        <h2 style="color: #111827; font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem;">Welcome to Rao's Group!</h2>
        <p style="font-size: 1rem; color: #374151; margin-bottom: 1rem;">Dear <strong>${name}</strong>,</p>
        <p style="font-size: 1rem; color: #374151; margin-bottom: 1.5rem;">
          Thank you for signing up with <strong>Rao's Group</strong>. Please click the button below to verify your email address.
        </p>
        <a href="${url}" style="display: inline-block; background-color: #2563eb; color: white; padding: 0.75rem 1.5rem; border-radius: 0.375rem; text-decoration: none; font-weight: 500;">
          Verify Email
        </a>
        <p style="font-size: 0.875rem; color: #6b7280; margin-top: 2rem;">If you didn’t sign up for Rao's Group, you can safely ignore this email.</p>
      </div>
    `;
  };
  
export const forgotPasswordTemplate = (otp,name) => {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 2rem; border-radius: 0.5rem; max-width: 600px; margin: auto;">
      <h2 style="color: #111827; font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem;">Reset Your Password</h2>
      <p style="font-size: 1rem; color: #374151; margin-bottom: 1rem;">Dear ${name},</p>
      <p style="font-size: 1rem; color: #374151; margin-bottom: 1.5rem;">
        We received a request to reset your password. Your OTP for password reset is:
      </p>
      <h3 style="font-size: 1.5rem; color: #2563eb; font-weight: bold;">${otp}</h3>
      <p style="font-size: 0.875rem; color: #6b7280; margin-top: 2rem;">If you didn't request this, please ignore this email.</p>
    </div>
  `
}