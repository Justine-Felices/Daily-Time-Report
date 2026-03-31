import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export default async function SupabaseExamplePage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: todos } = await supabase.from("todos").select();

  return (
    <main className="px-4 py-8">
      <h1 className="mb-4 text-xl font-semibold">Supabase Todos Example</h1>
      <ul className="list-disc pl-6">
        {todos?.map((todo) => (
          <li key={todo.id}>{todo.name}</li>
        ))}
      </ul>
    </main>
  );
}
