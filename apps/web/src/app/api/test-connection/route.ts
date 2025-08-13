import { NextResponse } from 'next/server'
import { testSupabaseConnection, supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Test basic connection
    const connectionTest = await testSupabaseConnection()
    
    if (!connectionTest) {
      return NextResponse.json(
        { error: 'Failed to connect to Supabase' },
        { status: 500 }
      )
    }

    // Test table access with better error handling
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name')
      .limit(5)

    if (usersError) {
      return NextResponse.json(
        { 
          error: 'Database access error',
          details: usersError.message,
          code: usersError.code,
          hint: usersError.hint
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      usersCount: users?.length || 0,
      connectionTest: true,
      environment: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET',
        key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET'
      }
    })

  } catch (error) {
    console.error('Connection test error:', error)
    return NextResponse.json(
      { 
        error: 'Connection test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 