import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabase, mapUserToDatabase, mapUserFromDatabase, testSupabaseConnection } from '@/lib/supabase'
import { devLog } from '@/lib/env'
import { userRegistrationSchema, validateInput, formatValidationErrors } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input data
    const validationResult = validateInput(userRegistrationSchema, body)
    
    if (!validationResult.success) {
      const errors = formatValidationErrors(validationResult.errors)
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: errors,
          message: 'Please check your input and try again'
        },
        { status: 400 }
      )
    }

    const { firstName, lastName, email, password, acceptMarketing } = validationResult.data
    const connectionTest = await testSupabaseConnection()

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create new user
    const userData = mapUserToDatabase({
      email,
      firstName,
      lastName,
      password: hashedPassword,
      department: 'Unassigned',
      team: 'Unassigned',
      role: 'employee',
      hireDate: new Date(),
      isActive: true,
      acceptMarketing,
    })

    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single()

    devLog.info('New user created:', newUser?.id)

    if (createError) {
      devLog.error('Error creating user:', createError)
      return NextResponse.json(
        { error: 'Failed to create user', details: createError.message, connectionTest: connectionTest },
        { status: 500 }
      )
    }

    // Map the user data and remove password from response
    const mappedUser = mapUserFromDatabase(newUser)
    const { password: _, ...userWithoutPassword } = mappedUser

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: userWithoutPassword
      },
      { status: 201 }
    )

  } catch (error) {
    devLog.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 