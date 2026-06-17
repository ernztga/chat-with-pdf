export default async function ChatToFilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <div>ChatToFilepage: {id}</div>;
}
