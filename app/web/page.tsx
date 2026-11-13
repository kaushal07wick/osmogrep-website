import { redirect } from 'next/navigation';
import { consoleUrl } from '../../lib/console';

export default function WebConsolePage() {
  redirect(consoleUrl);
}
