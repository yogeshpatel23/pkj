'use client'
import { useActionState } from 'react'
import { Button } from '../ui/button'
import { HourglassIcon, Trash2Icon } from 'lucide-react'
import { deletePosition } from '@/app/actions'

const initialState = {
    error : ''
}

const DeletePositionForm = ({id}:{id:string}) => {
    const [formState, formAction,pending] = useActionState(deletePosition,initialState)
  return (
    <form action={formAction}>
        <input type="hidden" name="id" value={id} />
        <Button variant="ghost" disabled={pending} size="icon">
            {pending ? 
            <HourglassIcon className='animate-spin' />
            :
            <Trash2Icon />
        }
        </Button>
    </form>
  )
}

export default DeletePositionForm