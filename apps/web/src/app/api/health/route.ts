export async function GET() {
  return Response.json(
    {
      success: true,
      message: "Everything is Fine Here",
      time: Date.now().toString(),
    },
    { status: 200 }
  );
}
