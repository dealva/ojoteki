import { NextResponse } from 'next/server';
import { registerValidator } from '@/lib/validators';
import { StatusCodes } from 'http-status-codes';
import { query } from '@/lib/db'; // import the query helper you defined
import bcrypt from 'bcryptjs';
import { verifyRecaptcha } from '@/contexts/recaptcha/server';

const hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

const handleRegistrationError = (error) => {
  if (error.name === 'ValidationError') {
    return NextResponse.json(
      {
        message: 'Validation failed',
        errors: error.errors,
      },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  return NextResponse.json(
    {
      message: 'Something went wrong, please try again later',
    },
    { status: StatusCodes.INTERNAL_SERVER_ERROR }
  );
};

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password = '', address = '', recaptchaToken } = body;

    // reCAPTCHA validation
    const isValidCaptcha = await verifyRecaptcha(recaptchaToken, 'register');
    if (!isValidCaptcha) {
      return NextResponse.json(
        { message: 'reCAPTCHA verification failed' },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    // Input validation
    await registerValidator.validate(body, { abortEarly: false });

    // Check if user already exists
    const { rows: existing } = await query(
      'SELECT 1 FROM users WHERE email = $1',
      [email]
    );
    if (existing.length > 0) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: StatusCodes.CONFLICT }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert user
    await query(
      `INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5)`,
      [name, email, hashedPassword, address, 'customer']
    );

    return NextResponse.json(
      {
        message: 'User registered successfully',
        user: {
          name,
          email,
        },
      },
      { status: StatusCodes.CREATED }
    );
  } catch (error) {
    console.error('Registration Error:', error);
    return handleRegistrationError(error);
  }
}
