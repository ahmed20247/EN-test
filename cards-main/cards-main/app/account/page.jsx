'use client'

import { useContext } from 'react'
import AccountForm from './account-form'
import { UserContext } from '@/contexts/user-context'

export default function Account() {
    const { client } = useContext(UserContext)
    
    
  return <AccountForm user={client} />
}