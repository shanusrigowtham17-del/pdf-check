export default function handler(request, response) {
  // Pulls the keys securely from your Vercel Dashboard Environment Variables
  response.status(200).json({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  });
}
