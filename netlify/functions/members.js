export async function handler() {
  const response = await fetch(
    "https://api.airtable.com/v0/appk4Yy6SfLsTzxiU/Members",
    {
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`
      }
    }
  );

  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
}
