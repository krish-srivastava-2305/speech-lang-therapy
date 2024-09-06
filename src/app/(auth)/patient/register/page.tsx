import React from 'react'
import { RegisterForm} from '@/components/Register'

export default function Register() {
  return (
    <div>
      <RegisterForm formFor={"patient"} />
    </div>
  )
}
