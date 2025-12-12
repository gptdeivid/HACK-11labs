import { redirect } from 'next/navigation';

// Redirect the root page directly to the Conversational AI demo
export default function Page() {
  redirect('/conversational-ai');
  return null;
}
