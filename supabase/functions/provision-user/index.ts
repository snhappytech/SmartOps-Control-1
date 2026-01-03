import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.3";

serve(async (req) => {
  try {
    const authHeader = req.headers.get("authorization") ?? "";
    const token = authHeader.replace("Bearer ", "");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { global: { headers: { Authorization: `Bearer ${token}` } } },
    );

    const jwt = await supabase.auth.getUser(token);
    const role = (jwt.data.user?.user_metadata as any)?.role;
    const tenantId = (jwt.data.user?.user_metadata as any)?.tenant_id;
    if (!role || !tenantId || !["admin", "manager"].includes(role)) {
      return new Response(JSON.stringify({ error: "forbidden" }), { status: 403 });
    }

    const { email, password, name, userRole } = await req.json();
    if (!email || !password || !userRole) {
      return new Response(JSON.stringify({ error: "missing fields" }), { status: 400 });
    }

    const { data: newUser, error: createErr } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: userRole, tenant_id: tenantId, name },
    });
    if (createErr) throw createErr;

    await supabase.from("user_profiles").insert({
      id: newUser.user?.id,
      tenant_id: tenantId,
      role: userRole,
      status: "active",
      name,
      email,
    });

    return new Response(JSON.stringify({ user_id: newUser.user?.id }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "provisioning_failed", details: `${error}` }), { status: 500 });
  }
});
