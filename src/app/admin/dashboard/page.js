// Admin dashboard
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { query } from "@/lib/db"; 

import DashboardView from "@/components/admin/DashboardView";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return redirect('/');
  }


  const result = await query(`
    SELECT COUNT(*) FROM messages
    JOIN users ON messages.user_id = users.id
    WHERE messages.is_read = FALSE
    AND users.role = 'customer'
  `);

  const unreadCount = parseInt(result.rows[0].count, 10) || 0;

  return (
    <DashboardView
      admin={{ name: "Admin" }}
      initialItems={[]}
      totalPages={1}
      initialPage={1}
      chatNotifications={unreadCount} 
    />
  );
}
