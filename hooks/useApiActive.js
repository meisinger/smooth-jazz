import { useState, useEffect } from 'react'
import { ApiContext } from '../logic'

export default (context) => {
  const [active, makingCall] = useState(false)

  useEffect(() => {
    const stream$ = ApiContext.waiting(context)
      .subscribe(call_active => {
        makingCall(call_active)
      })

    return () => stream$.unsubscribe()
  }, [])

  return active
}
